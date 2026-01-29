<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AddOnProduct extends Model
{
    protected $fillable = [
        'name',
        'description',
        'id_category',
        'price',
        'unit_type',
        'length_unit',
        'length_min',
        'length_max',
        'length_step',
        'options',
        'pricing',
        'shipping_profile',
        'is_active',
    ];

    protected $casts = [
        'options' => 'array',
        'pricing' => 'array',
        'shipping_profile' => 'array',
        'is_active' => 'boolean',
    ];

    public function signTypes(): HasMany
    {
        return $this->hasMany(AddOnProductSignType::class);
    }
}
