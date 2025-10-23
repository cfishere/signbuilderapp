<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserCanvas extends Model
{
    protected $fillable = ['title', 'sign_type', 'width', 'height', 'postal_code', 'canvas_json'];
}
