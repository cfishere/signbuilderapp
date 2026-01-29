<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Design;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class OrderShowController extends Controller
{
    public function show(Order $order): Response
    {
        $this->authorize('view', $order);

        $design = Design::where('order_id', $order->id)->latest()->first();
        $job = $order->job;

        return Inertia::render('Orders/Show', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'total_amount' => $order->total_amount,
                'currency' => $order->currency,
                'customer_name' => $order->customer_name,
                'address_line1' => $order->address_line1,
                'address_line2' => $order->address_line2,
                'city' => $order->city,
                'region' => $order->region,
                'postal_code' => $order->postal_code,
                'country' => $order->country,
                'delivery_method' => $order->delivery_method,
                'paypal_order_id' => $order->paypal_order_id,
                'paypal_capture_id' => $order->paypal_capture_id,
                'paypal_status' => $order->paypal_status,
                'paid_at' => optional($order->paid_at)->toDateTimeString(),
                'metadata' => $order->metadata,
                'notes' => $order->notes,
                'preview_image_url' => $order->preview_image_path
                    ? Storage::disk('public')->url($order->preview_image_path)
                    : null,
                'design_id' => $design?->id,
                'submitted_at' => optional($order->submitted_at)->toDateTimeString(),
                'updated_at' => optional($order->updated_at)->toDateTimeString(),
            ],
            'job' => $job ? [
                'id' => $job->id,
                'job_number' => $job->job_number,
                'job_board_status' => $job->job_board_status,
                'print_image_url' => $job->print_image_path
                    ? Storage::disk('public')->url($job->print_image_path)
                    : null,
                'print_image_ppi' => $job->print_image_ppi,
                'print_image_width' => $job->print_image_width,
                'print_image_height' => $job->print_image_height,
            ] : null,
            'paypal_client_id' => config('services.paypal.client_id'),
            'paypal_mode' => config('services.paypal.mode', 'sandbox'),
        ]);
    }
}
