<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserDesign extends Model
{
    use HasFactory;

    protected $table = 'user_designs';

    protected $fillable = [
        'user_id',
        'name',
        'canvas_data',
        'width',
        'height',
        'snap_to_grid',
    ];

    protected $casts = [
        'canvas_data' => 'array',
        'snap_to_grid' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
