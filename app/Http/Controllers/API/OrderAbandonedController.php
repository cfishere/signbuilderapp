<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Mail\OrderAbandonedMail;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;

class OrderAbandonedController extends Controller
{
    public function store(Request $request, Order $order)
    {
        $this->authorize('update', $order);

        $validated = $request->validate([
            'reason' => 'nullable|string|max:255',
        ]);

        if (!$order->user) {
            return response()->json(['message' => 'Order has no user.'], 422);
        }

        $cooldownKey = 'order_abandoned_email_sent:' . $order->id;
        if (Cache::has($cooldownKey)) {
            return response()->json(['message' => 'Abandoned email already sent recently.']);
        }

        $design = $order->designs()->latest()->first();
        $product = $order->metadata['sign_type'] ?? $design?->sign_type ?? 'Custom Sign';
        $dimensions = '-';
        if ($design?->sign_width && $design?->sign_height) {
            $dimensions = $design->sign_width . ' x ' . $design->sign_height . ' in';
        }
        $price = $order->total_amount != null
            ? '$' . number_format((float) $order->total_amount, 2)
            : '$0.00';

        $orderUrl = url('/orders/' . $order->id);

        Mail::to($order->user->email)->send(new OrderAbandonedMail([
            'order_number' => $order->order_number ?? $order->id,
            'product' => $product,
            'price' => $price,
            'status' => $order->status ?? 'unpaid',
            'dimensions' => $dimensions,
            'addons' => 'None',
            'order_url' => $orderUrl,
            'reason' => $validated['reason'] ?? null,
        ]));

        Cache::put($cooldownKey, true, now()->addHours(6));

        return response()->json(['message' => 'Abandoned email sent.']);
    }
}
