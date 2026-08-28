<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class InvoiceController extends Controller
{
    private const OH_SALES_TAX_RATE = 0.08;

    private const DELIVERY_RATES = [
        'UPS' => 200,
        'Freight' => 370,
        'FedEx' => 190,
        'USPS' => 350,
        'Local Pickup' => 0,
    ];

    public function generate(Request $request, Order $order)
    {
        $this->authorize('view', $order);

        $invoice = $this->buildInvoice($order);

        return response()->json([
            'ok' => true,
            'invoice' => [
                'id' => $invoice->id,
                'invoice_number' => $invoice->invoice_number,
                'status' => $invoice->status,
                'issued_at' => optional($invoice->issued_at)->toDateTimeString(),
                'download_url' => route('orders.invoice.download', $order),
            ],
        ]);
    }

    public function download(Request $request, Order $order)
    {
        $this->authorize('view', $order);

        $invoice = $order->invoice;
        if (!$invoice || !$invoice->file_path || !Storage::disk('public')->exists($invoice->file_path)) {
            $invoice = $this->buildInvoice($order);
        }

        $absolutePath = Storage::disk('public')->path($invoice->file_path);
        $filename = 'invoice-' . $invoice->invoice_number . '.html';

        return response()->download($absolutePath, $filename, [
            'Content-Type' => 'text/html; charset=UTF-8',
        ]);
    }

    private function buildInvoice(Order $order): Invoice
    {
        $metadata = is_array($order->metadata) ? $order->metadata : [];
        $base = isset($metadata['base_total_amount']) ? (float) $metadata['base_total_amount'] : (float) ($order->total_amount ?? 0);
        $addOns = isset($metadata['add_on_total_amount']) ? (float) $metadata['add_on_total_amount'] : 0.0;
        $delivery = self::DELIVERY_RATES[$order->delivery_method ?? ''] ?? 0.0;
        $subtotal = round($base + $addOns + $delivery, 2);

        $region = strtoupper(trim((string) $order->region));
        $isOhio = in_array($region, ['OH', 'OHIO'], true);
        $isNonprofit = (bool) optional($order->user?->customer)->nonprofit;
        $tax = ($isOhio && !$isNonprofit) ? round($subtotal * self::OH_SALES_TAX_RATE, 2) : 0.0;

        $fallbackTotal = round($subtotal + $tax, 2);
        $total = $order->total_amount !== null ? round((float) $order->total_amount, 2) : $fallbackTotal;
        $currency = strtoupper((string) ($order->currency ?: 'USD'));
        $invoiceStatus = in_array(strtolower((string) $order->status), ['paid', 'completed'], true) ? 'PAID' : 'UNPAID';
        $invoiceNumber = (string) ($order->order_number ?: $order->id);
        $customer = $order->user?->customer;
        $billTo = [
            'name' => $order->customer_name ?: ($customer?->customer_name ?: ''),
            'address_line1' => $order->address_line1 ?: ($customer?->address_line1 ?: ''),
            'address_line2' => $order->address_line2 ?: ($customer?->address_line2 ?: ''),
            'city' => $order->city ?: ($customer?->city ?: ''),
            'region' => $order->region ?: ($customer?->region ?: ''),
            'postal_code' => $order->postal_code ?: ($customer?->postal_code ?: ''),
            'country' => $order->country ?: ($customer?->country ?: 'US'),
        ];

        $data = [
            'invoice_number' => $invoiceNumber,
            'invoice_status' => $invoiceStatus,
            'issued_at' => now(),
            'company' => [
                'name' => 'Custom Sign Center, Inc.',
                'address_1' => '3200 Valleyview Drive',
                'address_2' => 'Columbus, OH 43204',
                'phone' => '614-279-6700',
                'email' => 'sales@customsigncenter.com',
            ],
            'order' => $order,
            'bill_to' => $billTo,
            'amounts' => [
                'base' => $base,
                'add_ons' => $addOns,
                'delivery' => $delivery,
                'tax' => $tax,
                'subtotal' => $subtotal,
                'total' => $total,
                'currency' => $currency,
            ],
            'add_ons' => $metadata['add_ons'] ?? [],
        ];

        $html = view('invoices.order', $data)->render();
        $relativePath = 'invoices/' . $order->id . '/invoice-' . $invoiceNumber . '.html';
        Storage::disk('public')->put($relativePath, $html);

        return Invoice::updateOrCreate(
            ['order_id' => $order->id],
            [
                'invoice_number' => $invoiceNumber,
                'status' => strtolower($invoiceStatus),
                'subtotal_amount' => $subtotal,
                'tax_amount' => $tax,
                'total_amount' => $total,
                'currency' => $currency,
                'issued_at' => now(),
                'file_path' => $relativePath,
            ]
        );
    }
}
