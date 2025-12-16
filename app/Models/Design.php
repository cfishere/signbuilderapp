<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Design extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_id',
        'name',
        'slug',
        'sign_type',
        'sign_category',
        'sign_width',
        'sign_height',
        'sign_depth',
        'canvas_width',
        'canvas_height',
        'grid_size',
        'grid_enabled',
        'snap_to_grid',
        'background_color',
        'canvas_state',
        'settings',
        'thumbnail_path',
        'status',
    ];

    protected $casts = [
        'canvas_state'   => 'array',
        'settings'       => 'array',
        'grid_enabled'   => 'boolean',
        'snap_to_grid'   => 'boolean',
        'sign_width'     => 'integer',
        'sign_height'    => 'integer',
        'sign_depth'     => 'integer',
        'canvas_width'   => 'integer',
        'canvas_height'  => 'integer',
        'grid_size'      => 'integer',
    ];

    /* Relationships */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Optional; you can wire this up once you have an Order model
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}