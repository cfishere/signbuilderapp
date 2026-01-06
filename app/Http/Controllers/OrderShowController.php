<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class OrderShowController extends Controller
{
    public function show(Order $order): Response
    {
        $this->authorize('view', $order);

        return Inertia::render('Orders/Show', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'customer_name' => $order->customer_name,
                'address_line1' => $order->address_line1,
                'address_line2' => $order->address_line2,
                'city' => $order->city,
                'region' => $order->region,
                'postal_code' => $order->postal_code,
                'country' => $order->country,
                'notes' => $order->notes,
                'preview_image_url' => $order->preview_image_path
                    ? Storage::disk('public')->url($order->preview_image_path)
                    : null,
                'submitted_at' => optional($order->submitted_at)->toDateTimeString(),
                'updated_at' => optional($order->updated_at)->toDateTimeString(),
            ],
        ]);
    }
}
