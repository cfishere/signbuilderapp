<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Design;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDesignIndexController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = (int) $request->query('per_page', 25);
        if (!in_array($perPage, [25, 100], true)) {
            $perPage = 25;
        }

        $owner = trim((string) $request->query('owner', ''));
        $signType = trim((string) $request->query('sign_type', ''));
        $adminOnly = filter_var($request->query('admin_only', false), FILTER_VALIDATE_BOOLEAN);

        $designsQuery = Design::with('user')
            ->latest();

        if ($signType !== '') {
            $designsQuery->where('sign_type', $signType);
        }

        if ($owner !== '') {
            $designsQuery->whereHas('user', function ($query) use ($owner) {
                $query->where('name', 'like', '%' . $owner . '%')
                    ->orWhere('email', 'like', '%' . $owner . '%');
            });
        }

        if ($adminOnly) {
            $designsQuery->whereHas('user', function ($query) {
                $query->where('is_admin', true);
            });
        }

        $designs = $designsQuery
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn ($design) => [
                'id' => $design->id,
                'name' => $design->name,
                'sign_type' => $design->sign_type,
                'sign_width' => $design->sign_width,
                'sign_height' => $design->sign_height,
                'status' => $design->status,
                'updated_at' => optional($design->updated_at)->toDateTimeString(),
                'owner' => [
                    'name' => $design->user?->name,
                    'email' => $design->user?->email,
                    'is_admin' => (bool) ($design->user?->is_admin ?? false),
                ],
            ]);

        $signTypes = Design::query()
            ->whereNotNull('sign_type')
            ->select('sign_type')
            ->distinct()
            ->orderBy('sign_type')
            ->pluck('sign_type')
            ->values();

        return Inertia::render('Admin/Designs/Index', [
            'designs' => $designs,
            'perPage' => $perPage,
            'filters' => [
                'owner' => $owner,
                'sign_type' => $signType,
                'admin_only' => $adminOnly,
            ],
            'signTypes' => $signTypes,
        ]);
    }
}
