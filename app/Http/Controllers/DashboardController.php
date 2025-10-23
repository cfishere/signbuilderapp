<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

public function index()
{
    return Inertia::render('Dashboard', [
        'user' => auth()->user()
    ]);
}