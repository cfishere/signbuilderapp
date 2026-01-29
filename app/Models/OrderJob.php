<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderJob extends Model
{
    use HasFactory;

    protected $table = 'order_jobs';

    protected $fillable = [
        'order_id',
        'job_number',
        'job_board_status',
        'print_image_path',
        'print_image_ppi',
        'print_image_width',
        'print_image_height',
    ];

    protected static function booted(): void
    {
        static::creating(function (OrderJob $job) {
            if (!$job->job_number) {
                $current = (int) (OrderJob::max('job_number') ?? 0);
                $job->job_number = min($current + 1, 999999);
            }
        });
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
