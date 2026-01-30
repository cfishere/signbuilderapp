<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PriceRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'sign_type',
        'pricing_method',
        'base_rate',
        'per_sq_in_rate',
        'channel_letter_rate',
        'min_price',
        'max_price',
    ];
}
