<?php

namespace Database\Seeders;

use App\Models\AddOnProduct;
use App\Models\AddOnProductSignType;
use Illuminate\Database\Seeder;

class AddOnProductSeeder extends Seeder
{
    public function run(): void
    {
        AddOnProductSignType::query()->delete();
        AddOnProduct::query()->delete();

        $signTypes = [
            'Wall Sign Illuminated',
            'Wall Sign Exterior',
            'Wall Sign Interior',
            'Pylon Illuminated Cabinet',
            'Pylon Non-Illuminated',
            'Monument Illuminated',
            'Monument',
            'Channel Letters',
            'Cut Letters Interior',
            'Cut Letters Exterior',
            'Face Replacement',
            'Face Replacement Illuminated',
        ];

        $postSignTypes = [
            'Pylon Illuminated Cabinet',
            'Pylon Non-Illuminated',
            'Monument Illuminated',
            'Monument',
        ];

        $wallMountedTypes = [
            'Wall Sign Illuminated',
            'Wall Sign Exterior',
            'Wall Sign Interior',
        ];

        $illuminatedTypes = [
            'Wall Sign Illuminated',
            'Pylon Illuminated Cabinet',
            'Monument Illuminated',
            'Channel Letters',
            'Face Replacement Illuminated',
        ];

        $faceRetainerTypes = array_values(array_diff($signTypes, [
            'Cut Letters Interior',
            'Cut Letters Exterior',
        ]));

        $post = AddOnProduct::create([
            'name' => 'Post',
            'description' => 'Steel round tube construction post, painted finish.',
            'id_category' => 'Posts',
            'unit_type' => 'linear_ft',
            'length_unit' => 'ft',
            'length_min' => 6,
            'length_max' => 30,
            'length_step' => 1,
            'options' => [
                'colors' => ['Black', 'White', 'Bronze'],
                'diameters_in' => [4, 5, 6],
                'standard_lengths_ft' => [6, 8, 10, 12, 15, 18, 20, 24, 30],
            ],
            'pricing' => [
                'type' => 'tiered_linear',
                'unit' => 'ft',
                'base_rate_per_ft' => 18,
                'base_diameter_in' => 4,
                'diameter_in_surcharge_per_in' => 1,
                'tier_threshold_ft' => 12,
                'tier_discount' => 0.25,
                'rounding' => 'nearest_ft',
            ],
            'shipping_profile' => [
                'methods' => ['freight', 'pickup'],
            ],
        ]);

        $poleKit = AddOnProduct::create([
            'name' => 'Pole Mounting Kit',
            'description' => 'Includes mounting bolts; can be purchased separately.',
            'id_category' => 'Mounting Kits',
            'unit_type' => 'each',
            'options' => [
                'sizes' => ['Small', 'Large'],
                'included_with' => ['Post'],
            ],
            'pricing' => [
                'type' => 'fixed_by_option',
                'options' => [
                    'Small' => 99,
                    'Large' => 280,
                ],
            ],
            'shipping_profile' => [
                'methods' => ['ground', 'pickup'],
            ],
        ]);

        $faceRetainers = AddOnProduct::create([
            'name' => 'Face Retainers',
            'description' => 'Cabinet face retainer hardware.',
            'id_category' => 'Cabinet Hardware',
            'unit_type' => 'each',
            'options' => [
                'styles' => ['A', 'B', 'C', 'D'],
            ],
            'pricing' => [
                'type' => 'fixed_by_option',
                'options' => [
                    'A' => 20,
                    'B' => 19,
                    'C' => 27,
                    'D' => 22.5,
                ],
            ],
        ]);

        $lamps = AddOnProduct::create([
            'name' => 'Lamps (LED Strands)',
            'description' => 'LED strands for illuminated signs.',
            'id_category' => 'Lighting',
            'unit_type' => 'linear_ft',
            'length_unit' => 'ft',
            'length_min' => 1,
            'length_max' => 50,
            'length_step' => 1,
            'options' => [
                'colors' => ['Red', 'Blue', 'Green', 'Yellow', 'White', 'Orange', 'Violet', 'Pink', 'Sky Blue'],
            ],
            'pricing' => [
                'type' => 'linear_rate',
                'unit' => 'ft',
                'rate_per_ft' => 12,
                'rounding' => 'nearest_ft',
            ],
        ]);

        $standOff = AddOnProduct::create([
            'name' => 'Stand-Off Brackets',
            'description' => 'Stand-off bracket set for wall-mounted signs.',
            'id_category' => 'Brackets: Stand-Off',
            'unit_type' => 'each',
            'options' => [
                'styles' => ['A', 'B', 'C'],
                'colors' => ['Silver', 'Brass', 'Black', 'White', 'Brown'],
            ],
            'pricing' => [
                'type' => 'fixed_by_option',
                'options' => [
                    'A' => 35,
                    'B' => 46,
                    'C' => 44,
                ],
            ],
        ]);

        $flushMount = AddOnProduct::create([
            'name' => 'Flush-Mount Brackets',
            'description' => 'Flush wall bracket set for wall-mounted signs.',
            'id_category' => 'Brackets: Flush-Wall',
            'unit_type' => 'each',
            'options' => [
                'styles' => ['A', 'B', 'C'],
                'colors' => ['Silver', 'Brass', 'Black', 'White', 'Brown'],
            ],
            'pricing' => [
                'type' => 'fixed_by_option',
                'options' => [
                    'A' => 16,
                    'B' => 20,
                    'C' => 12,
                ],
            ],
        ]);

        $this->attachSignTypes($post, $postSignTypes);
        $this->attachSignTypes($poleKit, $postSignTypes);
        $this->attachSignTypes($faceRetainers, $faceRetainerTypes);
        $this->attachSignTypes($lamps, $illuminatedTypes);
        $this->attachSignTypes($standOff, $wallMountedTypes);
        $this->attachSignTypes($flushMount, $wallMountedTypes);
    }

    private function attachSignTypes(AddOnProduct $product, array $types): void
    {
        foreach ($types as $type) {
            AddOnProductSignType::create([
                'add_on_product_id' => $product->id,
                'sign_type' => $type,
            ]);
        }
    }
}
