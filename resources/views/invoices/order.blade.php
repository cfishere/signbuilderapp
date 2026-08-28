<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice {{ $invoice_number }}</title>
    <style>
        body { font-family: Arial, sans-serif; color: #111; margin: 24px; }
        .row { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
        .muted { color: #555; font-size: 12px; }
        .status { padding: 6px 10px; border-radius: 4px; font-weight: 700; font-size: 12px; }
        .paid { background: #dcfce7; color: #166534; }
        .unpaid { background: #fef3c7; color: #92400e; }
        h1, h2, h3 { margin: 0 0 8px; }
        h1 { font-size: 22px; }
        h2 { font-size: 16px; margin-top: 24px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th, td { border: 1px solid #ddd; padding: 8px; font-size: 13px; }
        th { background: #f8fafc; text-align: left; }
        .right { text-align: right; }
    </style>
</head>
<body>
    <div class="row">
        <div>
            <h1>{{ $company['name'] }}</h1>
            <div>{{ $company['address_1'] }}</div>
            <div>{{ $company['address_2'] }}</div>
            <div>{{ $company['phone'] }}</div>
            <div>{{ $company['email'] }}</div>
        </div>
        <div>
            <div><strong>Invoice #:</strong> {{ $invoice_number }}</div>
            <div><strong>Order #:</strong> {{ $order->order_number ?: $order->id }}</div>
            <div><strong>Date:</strong> {{ optional($issued_at)->toDateString() }}</div>
            <div style="margin-top: 8px;">
                <span class="status {{ strtolower($invoice_status) === 'paid' ? 'paid' : 'unpaid' }}">{{ $invoice_status }}</span>
            </div>
        </div>
    </div>

    <h2>Bill To</h2>
    <div>{{ $bill_to['name'] ?: '-' }}</div>
    <div>{{ $bill_to['address_line1'] ?: '-' }}</div>
    @if(!empty($bill_to['address_line2']))
        <div>{{ $bill_to['address_line2'] }}</div>
    @endif
    <div>{{ trim(($bill_to['city'] ?: '') . ', ' . ($bill_to['region'] ?: '') . ' ' . ($bill_to['postal_code'] ?: '')) }}</div>
    <div>{{ $bill_to['country'] ?: 'US' }}</div>

    <h2>Charges</h2>
    <table>
        <tbody>
            <tr>
                <td>Base Sign</td>
                <td class="right">{{ number_format((float) $amounts['base'], 2) }} {{ $amounts['currency'] }}</td>
            </tr>
            <tr>
                <td>Add-Ons</td>
                <td class="right">{{ number_format((float) $amounts['add_ons'], 2) }} {{ $amounts['currency'] }}</td>
            </tr>
            <tr>
                <td>Delivery</td>
                <td class="right">{{ number_format((float) $amounts['delivery'], 2) }} {{ $amounts['currency'] }}</td>
            </tr>
            <tr>
                <td>Tax</td>
                <td class="right">{{ number_format((float) $amounts['tax'], 2) }} {{ $amounts['currency'] }}</td>
            </tr>
            <tr>
                <td><strong>Total</strong></td>
                <td class="right"><strong>{{ number_format((float) $amounts['total'], 2) }} {{ $amounts['currency'] }}</strong></td>
            </tr>
        </tbody>
    </table>

    @if(is_array($add_ons) && count($add_ons) > 0)
        <h2>Add-On Details</h2>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th class="right">Qty</th>
                    <th class="right">Unit Price</th>
                    <th class="right">Line Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($add_ons as $line)
                    <tr>
                        <td>{{ $line['name'] ?? '-' }}</td>
                        <td class="right">{{ $line['quantity'] ?? 1 }}</td>
                        <td class="right">{{ number_format((float) ($line['unit_price'] ?? 0), 2) }}</td>
                        <td class="right">{{ number_format((float) ($line['line_total'] ?? ($line['unit_price'] ?? 0)), 2) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <p class="muted" style="margin-top: 20px;">
        Generated from order data at {{ optional($issued_at)->toDayDateTimeString() }}.
    </p>
</body>
</html>
