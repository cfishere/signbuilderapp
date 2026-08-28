<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AdminOrderIndexController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = (int) $request->query('per_page', 25);
        if (!in_array($perPage, [25, 100], true)) {
            $perPage = 25;
        }

        $orderNumber = trim((string) $request->query('order_number', ''));
        $owner = trim((string) $request->query('owner', ''));
        $dateFrom = $request->query('date_from');
        $dateTo = $request->query('date_to');

        $ordersQuery = Order::with(['user', 'designs', 'job', 'invoice'])
            ->latest();

        if ($orderNumber !== '') {
            $ordersQuery->where('order_number', 'like', '%' . $orderNumber . '%');
        }

        if ($owner !== '') {
            $ordersQuery->whereHas('user', function ($query) use ($owner) {
                $query->where('name', 'like', '%' . $owner . '%')
                    ->orWhere('email', 'like', '%' . $owner . '%');
            });
        }

        if ($dateFrom) {
            $from = Carbon::parse($dateFrom)->startOfDay();
            $ordersQuery->where('created_at', '>=', $from);
        }

        if ($dateTo) {
            $to = Carbon::parse($dateTo)->endOfDay();
            $ordersQuery->where('created_at', '<=', $to);
        }

        $orders = $ordersQuery
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn ($order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'delivery_method' => $order->delivery_method,
                'status' => $order->status,
                'owner' => [
                    'name' => $order->user?->name,
                    'email' => $order->user?->email,
                    'is_admin' => (bool) ($order->user?->is_admin ?? false),
                ],
                'design_id' => $order->designs?->sortByDesc('id')->first()?->id,
                'preview_image_url' => $order->preview_image_path
                    ? Storage::disk('public')->url($order->preview_image_path)
                    : null,
                'print_image_url' => $order->job?->print_image_path
                    ? Storage::disk('public')->url($order->job->print_image_path)
                    : null,
                'updated_at' => optional($order->updated_at)->toDateTimeString(),
                'invoice' => $order->invoice ? [
                    'id' => $order->invoice->id,
                    'invoice_number' => $order->invoice->invoice_number,
                    'status' => $order->invoice->status,
                    'issued_at' => optional($order->invoice->issued_at)->toDateTimeString(),
                    'download_url' => route('orders.invoice.download', $order),
                ] : null,
            ]);

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'perPage' => $perPage,
            'filters' => [
                'order_number' => $orderNumber,
                'owner' => $owner,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }
}
