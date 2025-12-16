<?php

namespace App\Http\Controllers;

use App\Models\Design;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DesignIndexController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        if (method_exists($user, 'isAdmin') && $user->isAdmin()) {
            $designs = Design::with('user')
                ->latest()
                ->paginate(20)
                ->through(fn ($design) => [
                    'id'          => $design->id,
                    'name'        => $design->name,
                    'sign_type'   => $design->sign_type,
                    'sign_width'  => $design->sign_width,
                    'sign_height' => $design->sign_height,
                    'status'      => $design->status,
                    'owner_name'  => $design->user?->name,
                    'updated_at'  => optional($design->updated_at)->toDateTimeString(),
                ]);
        } else {
            $designs = $user->designs()
                ->latest()
                ->paginate(20)
                ->through(fn ($design) => [
                    'id'          => $design->id,
                    'name'        => $design->name,
                    'sign_type'   => $design->sign_type,
                    'sign_width'  => $design->sign_width,
                    'sign_height' => $design->sign_height,
                    'status'      => $design->status,
                    'updated_at'  => optional($design->updated_at)->toDateTimeString(),
                ]);
        }

        return Inertia::render('Designs/Index', [
            'designs' => $designs,
        ]);
    }
}
