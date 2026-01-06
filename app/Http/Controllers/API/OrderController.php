<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Design;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Order::class);

        $user = Auth::user();

        if ($user->isAdmin()) {
            return Order::latest()->get();
        }

        return $user->orders()->latest()->get();
    }

    public function store(Request $request)
    {
        $this->authorize('create', Order::class);

        $validated = $request->validate([
            'order_number' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:draft,submitted,paid,in_production,completed,canceled',
            'total_amount' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|size:3',
            'customer_name' => 'nullable|string|max:255',
            'address_line1' => 'nullable|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'region' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:2',
            'notes' => 'nullable|string|max:2000',
            'metadata' => 'nullable|array',
            'design_id' => 'nullable|integer|exists:designs,id',
            'preview_image_data' => 'nullable|string',
            'submitted_at' => 'nullable|date',
        ]);

        $validated['status'] = $validated['status'] ?? 'draft';
        $this->assertCustomerFieldsPresent($validated, $validated['status'], null);

        $order = Auth::user()->orders()->create([
            'order_number' => $validated['order_number'] ?? null,
            'status' => $validated['status'],
            'total_amount' => $validated['total_amount'] ?? null,
            'currency' => $validated['currency'] ?? 'USD',
            'customer_name' => $validated['customer_name'] ?? '',
            'address_line1' => $validated['address_line1'] ?? '',
            'address_line2' => $validated['address_line2'] ?? null,
            'city' => $validated['city'] ?? '',
            'region' => $validated['region'] ?? '',
            'postal_code' => $validated['postal_code'] ?? '',
            'country' => $validated['country'] ?? 'US',
            'notes' => $validated['notes'] ?? null,
            'metadata' => $validated['metadata'] ?? null,
            'submitted_at' => $validated['submitted_at'] ?? null,
        ]);

        if (!empty($validated['design_id'])) {
            $design = Design::find($validated['design_id']);
            if ($design && $design->user_id === $order->user_id) {
                $design->order_id = $order->id;
                $design->save();
            }
        }

        if (!empty($validated['preview_image_data'])) {
            $previewPath = $this->storePreviewImage($validated['preview_image_data'], $order->id);
            if ($previewPath) {
                $order->preview_image_path = $previewPath;
                $order->save();
            }
        }

        return response()->json($order, 201);
    }

    public function show(Order $order)
    {
        $this->authorize('view', $order);

        return response()->json($order);
    }

    public function update(Request $request, Order $order)
    {
        $this->authorize('update', $order);

        $validated = $request->validate([
            'order_number' => 'sometimes|nullable|string|max:255',
            'status' => 'sometimes|string|in:draft,submitted,paid,in_production,completed,canceled',
            'total_amount' => 'sometimes|nullable|numeric|min:0',
            'currency' => 'sometimes|nullable|string|size:3',
            'customer_name' => 'sometimes|nullable|string|max:255',
            'address_line1' => 'sometimes|nullable|string|max:255',
            'address_line2' => 'sometimes|nullable|string|max:255',
            'city' => 'sometimes|nullable|string|max:255',
            'region' => 'sometimes|nullable|string|max:255',
            'postal_code' => 'sometimes|nullable|string|max:20',
            'country' => 'sometimes|nullable|string|max:2',
            'notes' => 'sometimes|nullable|string|max:2000',
            'metadata' => 'sometimes|nullable|array',
            'preview_image_data' => 'sometimes|nullable|string',
            'submitted_at' => 'sometimes|nullable|date',
        ]);

        $status = $validated['status'] ?? $order->status ?? 'draft';
        $this->assertCustomerFieldsPresent($validated, $status, $order);

        $order->update($validated);

        if (!empty($validated['preview_image_data'])) {
            $previewPath = $this->storePreviewImage($validated['preview_image_data'], $order->id);
            if ($previewPath) {
                $order->preview_image_path = $previewPath;
                $order->save();
            }
        }

        return response()->json($order);
    }

    public function destroy(Order $order)
    {
        $this->authorize('delete', $order);

        $order->delete();

        return response()->json(['message' => 'Deleted']);
    }

    private function storePreviewImage(string $dataUrl, int $orderId): ?string
    {
        if (!preg_match('/^data:image\\/jpeg;base64,/', $dataUrl)) {
            return null;
        }

        $base64 = preg_replace('/^data:image\\/jpeg;base64,/', '', $dataUrl);
        $binary = base64_decode($base64, true);

        if ($binary === false) {
            return null;
        }

        $filename = 'orders/' . $orderId . '/' . Str::uuid() . '.jpg';
        Storage::disk('public')->put($filename, $binary);

        return $filename;
    }

    private function assertCustomerFieldsPresent(array $validated, string $status, ?Order $order): void
    {
        if ($status === 'draft') {
            return;
        }

        $requiredFields = [
            'customer_name',
            'address_line1',
            'city',
            'region',
            'postal_code',
        ];

        $missing = [];
        foreach ($requiredFields as $field) {
            $value = $validated[$field] ?? ($order ? $order->{$field} : null);
            if (!$value) {
                $missing[$field] = ['This field is required before submitting the order.'];
            }
        }

        if ($missing) {
            throw ValidationException::withMessages($missing);
        }
    }
}
