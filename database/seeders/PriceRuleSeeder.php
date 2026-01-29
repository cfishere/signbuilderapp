<?php

namespace Database\Seeders;

use App\Models\PriceRule;
use Illuminate\Database\Seeder;

class PriceRuleSeeder extends Seeder
{
    public function run(): void
    {
        $perSqInPlaceholder = 0.35;
        $channelLetterPlaceholder = 8.50;

        $rules = [
            ['sign_type' => 'Wall Sign Exterior', 'pricing_method' => 'flat', 'base_rate' => 350, 'per_sq_in_rate' => $perSqInPlaceholder],
            ['sign_type' => 'Wall Sign Interior', 'pricing_method' => 'flat', 'base_rate' => 375, 'per_sq_in_rate' => $perSqInPlaceholder],
            ['sign_type' => 'Wall Sign Illuminated', 'pricing_method' => 'flat', 'base_rate' => 650, 'per_sq_in_rate' => $perSqInPlaceholder],
            ['sign_type' => 'Pylon Non-Illuminated', 'pricing_method' => 'flat', 'base_rate' => 1200, 'per_sq_in_rate' => $perSqInPlaceholder],
            ['sign_type' => 'Pylon Illuminated Cabinet', 'pricing_method' => 'flat', 'base_rate' => 1800, 'per_sq_in_rate' => $perSqInPlaceholder],
            ['sign_type' => 'Monument', 'pricing_method' => 'flat', 'base_rate' => 950, 'per_sq_in_rate' => $perSqInPlaceholder],
            ['sign_type' => 'Monument Illuminated', 'pricing_method' => 'flat', 'base_rate' => 1400, 'per_sq_in_rate' => $perSqInPlaceholder],
            ['sign_type' => 'Channel Letters', 'pricing_method' => 'flat', 'base_rate' => 2200, 'channel_letter_rate' => $channelLetterPlaceholder],
            ['sign_type' => 'Cut Letters Interior', 'pricing_method' => 'flat', 'base_rate' => 500, 'per_sq_in_rate' => $perSqInPlaceholder],
            ['sign_type' => 'Cut Letters Exterior', 'pricing_method' => 'flat', 'base_rate' => 650, 'per_sq_in_rate' => $perSqInPlaceholder],
            ['sign_type' => 'Face Replacement', 'pricing_method' => 'flat', 'base_rate' => 400, 'per_sq_in_rate' => $perSqInPlaceholder],
            ['sign_type' => 'Face Replacement Illuminated', 'pricing_method' => 'flat', 'base_rate' => 600, 'per_sq_in_rate' => $perSqInPlaceholder],
        ];

        foreach ($rules as $rule) {
            PriceRule::updateOrCreate(
                ['sign_type' => $rule['sign_type']],
                $rule
            );
        }
    }
}
