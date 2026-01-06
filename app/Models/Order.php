<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_number',
        'status',
        'customer_name',
        'address_line1',
        'address_line2',
        'city',
        'region',
        'postal_code',
        'country',
        'preview_image_path',
        'metadata',
        'notes',
        'submitted_at',
    ];

    protected $casts = [
        'metadata'     => 'array',
        'submitted_at' => 'datetime',
    ];

    /* Relationships */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function designs()
    {
        return $this->hasMany(Design::class);
    }
}
