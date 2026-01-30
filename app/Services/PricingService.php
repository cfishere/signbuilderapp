<?php

namespace App\Services;

use App\Models\PriceRule;

class PricingService
{
    public function estimate(?string $signType, ?float $widthIn, ?float $heightIn, ?int $letterCount = null): ?float
    {
        if (!$signType) {
            return null;
        }

        $rule = PriceRule::where('sign_type', $signType)->first();
        if (!$rule) {
            return null;
        }

        $estimate = null;
        if ($rule->pricing_method === 'per_sq_in' && $widthIn && $heightIn && $rule->per_sq_in_rate) {
            $estimate = $widthIn * $heightIn * (float) $rule->per_sq_in_rate;
        } elseif ($rule->pricing_method === 'channel_letters' && $heightIn && $letterCount && $rule->channel_letter_rate) {
            $estimate = $heightIn * $letterCount * (float) $rule->channel_letter_rate;
        } else {
            $estimate = $rule->base_rate != null ? (float) $rule->base_rate : null;
        }

        if ($estimate != null) {
            if ($rule->min_price != null) {
                $estimate = max($estimate, (float) $rule->min_price);
            }
            if ($rule->max_price != null) {
                $estimate = min($estimate, (float) $rule->max_price);
            }
        }

        return $estimate;
    }
}
