<?php

namespace App\Http\Controllers;

use App\Models\AddOnProduct;
use App\Models\Design;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class OrderAddOnController extends Controller
{
    public function show(Order $order): Response
    {
        $this->authorize('view', $order);

        [$signType, $baseTotal] = $this->resolveSignTypeAndBaseTotal($order);
        $products = $this->getApplicableProducts($signType);

        $selectedIds = collect($order->metadata['add_on_product_ids'] ?? [])
            ->map(fn ($id) => (int) $id)
            ->filter()
            ->values()
            ->all();

        return Inertia::render('Orders/AddOns', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'currency' => $order->currency ?? 'USD',
            ],
            'signType' => $signType,
            'baseTotal' => $baseTotal,
            'products' => $products,
            'selectedProductIds' => $selectedIds, // legacy support
            'selectedQuantities' => $this->resolveSelectedQuantities($order, $selectedIds),
            'selectedMountTypes' => $this->resolveSelectedMountTypes($order),
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $this->authorize('update', $order);

        [$signType, $baseTotal] = $this->resolveSignTypeAndBaseTotal($order);
        $products = $this->getApplicableProducts($signType);
        $allowedIds = collect($products)->pluck('id')->map(fn ($id) => (int) $id)->all();

        $validated = $request->validate([
            'selected_product_ids' => ['nullable', 'array'], // legacy support
            'selected_product_ids.*' => ['integer'],
            'quantities' => ['nullable', 'array'],
            'quantities.*' => ['integer', 'min:0'],
            'mount_types' => ['nullable', 'array'],
            'mount_types.*' => ['nullable', 'string', 'in:ground_bolted,subgrade_footer'],
        ]);

        $quantities = collect($validated['quantities'] ?? [])
            ->mapWithKeys(fn ($qty, $id) => [(int) $id => (int) $qty])
            ->filter(fn ($qty, $id) => in_array((int) $id, $allowedIds, true))
            ->filter(fn ($qty) => $qty > 0);

        // Backward compatibility for old checkbox payloads.
        if ($quantities->isEmpty() && !empty($validated['selected_product_ids'])) {
            $quantities = collect($validated['selected_product_ids'])
                ->map(fn ($id) => (int) $id)
                ->filter(fn ($id) => in_array($id, $allowedIds, true))
                ->mapWithKeys(fn ($id) => [$id => 1]);
        }

        $byId = collect($products)->keyBy('id');
        $mountTypes = collect($validated['mount_types'] ?? [])
            ->mapWithKeys(fn ($type, $id) => [(int) $id => (string) $type]);

        $errors = [];
        foreach ($quantities as $productId => $qty) {
            $item = $byId->get((int) $productId);
            if (!$item) {
                continue;
            }

            $name = (string) ($item['name'] ?? '');
            if ($this->isPoleProductName($name) && !$this->isPoleMountingKitName($name)) {
                if ($qty < 4) {
                    $errors["quantities.$productId"] = ['Pole quantity must be at least 4 linear feet.'];
                }
                $mountType = $mountTypes->get((int) $productId);
                if (!in_array($mountType, ['ground_bolted', 'subgrade_footer'], true)) {
                    $errors["mount_types.$productId"] = ['Select a pole mount type.'];
                }
            }
        }

        if ($errors) {
            throw ValidationException::withMessages($errors);
        }

        $hasBoltMountedPoleSelection = $quantities->keys()->contains(function ($productId) use ($byId, $mountTypes) {
            $item = $byId->get((int) $productId);
            if (!$item) {
                return false;
            }

            if (!$this->isPoleProductName((string) ($item['name'] ?? '')) || $this->isPoleMountingKitName((string) ($item['name'] ?? ''))) {
                return false;
            }

            return ($mountTypes->get((int) $productId) === 'ground_bolted');
        });

        // Mounting kit is only valid when at least one pole/post is bolt-mounted.
        if (!$hasBoltMountedPoleSelection) {
            $quantities = $quantities->reject(function ($qty, $productId) use ($byId) {
                $item = $byId->get((int) $productId);
                if (!$item) {
                    return false;
                }

                return $this->isPoleMountingKitName((string) ($item['name'] ?? ''));
            });
        }

        $selectedItems = $quantities
            ->map(function (int $qty, int $id) use ($byId, $mountTypes) {
                $item = $byId->get((int) $id);
                if (!$item) {
                    return null;
                }

                $unitPrice = (float) $item['unit_price'];
                $mountType = $mountTypes->get((int) $id);
                $billableQty = $qty;
                $name = (string) ($item['name'] ?? '');
                if ($this->isPoleProductName($name) && !$this->isPoleMountingKitName($name) && $mountType === 'subgrade_footer') {
                    $billableQty += 3;
                }
                $lineTotal = round($unitPrice * $billableQty, 2);

                return [
                    'id' => $item['id'],
                    'name' => $item['name'],
                    'unit_price' => $unitPrice,
                    'quantity' => $qty,
                    'mount_type' => $mountType,
                    'billable_quantity' => $billableQty,
                    'line_total' => $lineTotal,
                ];
            })
            ->filter()
            ->values();

        $addOnTotal = (float) $selectedItems->sum('line_total');
        $newTotal = round($baseTotal + $addOnTotal, 2);

        $metadata = $order->metadata ?? [];
        $metadata['sign_type'] = $signType;
        $metadata['base_total_amount'] = $baseTotal;
        $metadata['add_on_total_amount'] = $addOnTotal;
        $metadata['add_on_product_ids'] = $selectedItems->pluck('id')->values()->all();
        $metadata['add_on_quantities'] = $quantities->toArray();
        $metadata['add_on_mount_types'] = $mountTypes
            ->filter(fn ($type, $id) => $quantities->has((int) $id))
            ->all();
        $metadata['add_ons'] = $selectedItems->all();

        $order->update([
            'total_amount' => $newTotal,
            'metadata' => $metadata,
        ]);

        return response()->json([
            'ok' => true,
            'order_id' => $order->id,
            'total_amount' => $newTotal,
            'next_url' => route('orders.show', $order),
        ]);
    }

    private function resolveSelectedQuantities(Order $order, array $selectedIds): array
    {
        $metadata = $order->metadata ?? [];
        $quantities = $metadata['add_on_quantities'] ?? null;
        if (is_array($quantities)) {
            return collect($quantities)
                ->mapWithKeys(fn ($qty, $id) => [(int) $id => max(0, (int) $qty)])
                ->all();
        }

        // Backfill legacy records that only stored selected product ids.
        return collect($selectedIds)->mapWithKeys(fn ($id) => [(int) $id => 1])->all();
    }

    private function resolveSelectedMountTypes(Order $order): array
    {
        $metadata = $order->metadata ?? [];
        $mountTypes = $metadata['add_on_mount_types'] ?? [];
        if (!is_array($mountTypes)) {
            return [];
        }

        return collect($mountTypes)
            ->mapWithKeys(fn ($type, $id) => [(int) $id => (string) $type])
            ->all();
    }

    private function isPoleProductName(string $name): bool
    {
        return (bool) preg_match('/\b(pole|post)\b/i', $name);
    }

    private function isPoleMountingKitName(string $name): bool
    {
        return (bool) preg_match('/pole mounting kit/i', $name);
    }

    private function resolveSignTypeAndBaseTotal(Order $order): array
    {
        $metadata = $order->metadata ?? [];
        $signType = $metadata['sign_type'] ?? null;

        if (!$signType) {
            $signType = Design::where('order_id', $order->id)->latest()->value('sign_type');
        }

        $baseTotal = isset($metadata['base_total_amount'])
            ? (float) $metadata['base_total_amount']
            : (float) ($order->total_amount ?? 0);

        return [$signType, $baseTotal];
    }

    private function getApplicableProducts(?string $signType): array
    {
        if (!$signType) {
            return [];
        }

        return AddOnProduct::query()
            ->where('is_active', true)
            ->whereHas('signTypes', fn ($q) => $q->where('sign_type', $signType))
            ->orderBy('name')
            ->get()
            ->map(function (AddOnProduct $product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'unit_price' => $this->resolveUnitPrice($product),
                ];
            })
            ->values()
            ->all();
    }

    private function resolveUnitPrice(AddOnProduct $product): float
    {
        if ($product->price !== null) {
            return round((float) $product->price, 2);
        }

        $pricing = $product->pricing ?? [];
        if (!is_array($pricing)) {
            return 0.0;
        }

        $type = $pricing['type'] ?? null;

        if ($type === 'fixed_by_option' && is_array($pricing['options'] ?? null) && count($pricing['options']) > 0) {
            return round((float) min($pricing['options']), 2);
        }

        if ($type === 'linear_rate') {
            return round((float) ($pricing['rate_per_ft'] ?? 0), 2);
        }

        if ($type === 'tiered_linear') {
            return round((float) ($pricing['base_rate_per_ft'] ?? 0), 2);
        }

        return 0.0;
    }
}
