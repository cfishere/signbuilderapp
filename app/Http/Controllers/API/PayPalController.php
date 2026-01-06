<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PayPalController extends Controller
{
    public function create(Request $request, Order $order)
    {
        $this->authorize('update', $order);

        $missing = $this->missingCustomerFields($order);
        if ($missing) {
            return response()->json([
                'message' => 'Customer details are required before checkout.',
                'errors' => $missing,
            ], 422);
        }

        if (!$order->total_amount || $order->total_amount <= 0) {
            return response()->json([
                'message' => 'Order total is required before checkout.',
            ], 422);
        }

        $currency = $order->currency ?: 'USD';
        $amount = number_format((float) $order->total_amount, 2, '.', '');

        $accessToken = $this->getAccessToken();
        if (!$accessToken) {
            return response()->json(['message' => 'PayPal auth failed.'], 502);
        }

        $payload = [
            'intent' => 'CAPTURE',
            'purchase_units' => [[
                'reference_id' => (string) $order->id,
                'custom_id' => (string) $order->id,
                'amount' => [
                    'currency_code' => $currency,
                    'value' => $amount,
                ],
            ]],
            'application_context' => [
                'shipping_preference' => 'NO_SHIPPING',
                'user_action' => 'PAY_NOW',
            ],
        ];

        $response = Http::withToken($accessToken)
            ->post($this->baseUrl() . '/v2/checkout/orders', $payload);

        if (!$response->successful()) {
            return response()->json([
                'message' => 'PayPal order creation failed.',
                'details' => $response->json(),
            ], 502);
        }

        $data = $response->json();
        $order->paypal_order_id = $data['id'] ?? $order->paypal_order_id;
        $order->paypal_status = $data['status'] ?? $order->paypal_status;
        $order->paypal_amount = $amount;
        $order->paypal_currency = $currency;
        $order->metadata = array_merge($order->metadata ?? [], [
            'paypal_create' => $data,
        ]);
        $order->save();

        return response()->json([
            'paypal_order_id' => $order->paypal_order_id,
            'status' => $order->paypal_status,
        ]);
    }

    public function capture(Request $request, Order $order)
    {
        $this->authorize('update', $order);

        $missing = $this->missingCustomerFields($order);
        if ($missing) {
            return response()->json([
                'message' => 'Customer details are required before capture.',
                'errors' => $missing,
            ], 422);
        }

        $paypalOrderId = $request->input('paypal_order_id') ?? $order->paypal_order_id;
        if (!$paypalOrderId) {
            return response()->json(['message' => 'Missing PayPal order ID.'], 422);
        }

        $accessToken = $this->getAccessToken();
        if (!$accessToken) {
            return response()->json(['message' => 'PayPal auth failed.'], 502);
        }

        $response = Http::withToken($accessToken)
            ->post($this->baseUrl() . "/v2/checkout/orders/{$paypalOrderId}/capture");

        if (!$response->successful()) {
            return response()->json([
                'message' => 'PayPal capture failed.',
                'details' => $response->json(),
            ], 502);
        }

        $data = $response->json();
        $capture = $data['purchase_units'][0]['payments']['captures'][0] ?? [];

        $order->paypal_order_id = $paypalOrderId;
        $order->paypal_capture_id = $capture['id'] ?? $order->paypal_capture_id;
        $order->paypal_payer_id = $data['payer']['payer_id'] ?? $order->paypal_payer_id;
        $order->paypal_status = $capture['status'] ?? $data['status'] ?? $order->paypal_status;
        $order->paid_at = now();
        $order->status = 'paid';
        $order->metadata = array_merge($order->metadata ?? [], [
            'paypal_capture' => $data,
        ]);
        $order->save();

        return response()->json($order);
    }

    private function getAccessToken(): ?string
    {
        $clientId = config('services.paypal.client_id');
        $clientSecret = config('services.paypal.client_secret');

        if (!$clientId || !$clientSecret) {
            return null;
        }

        $response = Http::asForm()
            ->withBasicAuth($clientId, $clientSecret)
            ->post($this->baseUrl() . '/v1/oauth2/token', [
                'grant_type' => 'client_credentials',
            ]);

        if (!$response->successful()) {
            return null;
        }

        return $response->json('access_token');
    }

    private function baseUrl(): string
    {
        $mode = strtolower((string) config('services.paypal.mode'));
        return $mode === 'live'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';
    }

    private function missingCustomerFields(Order $order): array
    {
        $required = [
            'customer_name' => $order->customer_name,
            'address_line1' => $order->address_line1,
            'city' => $order->city,
            'region' => $order->region,
            'postal_code' => $order->postal_code,
        ];

        $missing = [];
        foreach ($required as $field => $value) {
            if (!$value) {
                $missing[$field] = ['This field is required before checkout.'];
            }
        }

        return $missing;
    }
}
