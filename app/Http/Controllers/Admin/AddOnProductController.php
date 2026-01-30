<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AddOnProduct;
use Inertia\Inertia;
use Inertia\Response;

class AddOnProductController extends Controller
{
    public function index(): Response
    {
        $products = AddOnProduct::query()
            ->with(['signTypes'])
            ->orderBy('name')
            ->get()
            ->map(fn (AddOnProduct $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'category' => $product->id_category,
                'price' => $product->price,
                'unit_type' => $product->unit_type,
                'length_unit' => $product->length_unit,
                'length_min' => $product->length_min,
                'length_max' => $product->length_max,
                'length_step' => $product->length_step,
                'options' => $product->options,
                'pricing' => $product->pricing,
                'shipping_profile' => $product->shipping_profile,
                'is_active' => $product->is_active,
                'sign_types' => $product->signTypes->pluck('sign_type')->values(),
            ]);

        return Inertia::render('Admin/AddOns/Index', [
            'products' => $products,
        ]);
    }
}
