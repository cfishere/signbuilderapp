<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'company_name',
        'customer_name',
        'address_line1',
        'address_line2',
        'city',
        'region',
        'postal_code',
        'country',
        'nonprofit',
    ];

    protected $casts = [
        'nonprofit' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
