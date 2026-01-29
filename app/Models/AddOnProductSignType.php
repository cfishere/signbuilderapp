<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AddOnProductSignType extends Model
{
    protected $fillable = [
        'add_on_product_id',
        'sign_type',
    ];

    public function addOnProduct(): BelongsTo
    {
        return $this->belongsTo(AddOnProduct::class);
    }
}
