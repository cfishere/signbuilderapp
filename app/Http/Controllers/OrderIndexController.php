<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class OrderIndexController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        if (method_exists($user, 'isAdmin') && $user->isAdmin()) {
            $orders = Order::with('user')
                ->latest()
                ->paginate(20)
                ->through(fn ($order) => [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $order->status,
                    'owner_name' => $order->user?->name,
                    'preview_image_url' => $order->preview_image_path
                        ? Storage::disk('public')->url($order->preview_image_path)
                        : null,
                    'updated_at' => optional($order->updated_at)->toDateTimeString(),
                ]);
        } else {
            $orders = $user->orders()
                ->latest()
                ->paginate(20)
                ->through(fn ($order) => [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $order->status,
                    'preview_image_url' => $order->preview_image_path
                        ? Storage::disk('public')->url($order->preview_image_path)
                        : null,
                    'updated_at' => optional($order->updated_at)->toDateTimeString(),
                ]);
        }

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }
}
