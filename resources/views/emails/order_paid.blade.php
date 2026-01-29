<!doctype html>
<html>
  <body style="font-family: Arial, sans-serif; color: #111;">
    <p>Thanks for placing your recent order (Order #{{ $order_number }}).</p>

    <p>
      <strong>Product:</strong> {{ $product }}<br>
      <strong>Price:</strong> {{ $price }}<br>
      <strong>Status:</strong> {{ $status }}<br>
      <strong>Sign Dimensions:</strong> {{ $dimensions }}<br>
      <strong>Add-Ons:</strong> {{ $addons }}
    </p>

    <p>You can view your order here:</p>
    <p><a href="{{ $order_url }}">{{ $order_url }}</a></p>

    <p>Questions? 614-279-4267 | sales@customsigncenter.com</p>
  </body>
</html>
