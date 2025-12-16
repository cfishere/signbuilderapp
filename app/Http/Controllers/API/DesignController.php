<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Design;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DesignController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Design::class);

        $user = Auth::user();

        if ($user->isAdmin()) {
            // Admin can see all designs
            return Design::latest()->get();
        }

        // Regular user: only their own
        return $user->designs()->latest()->get();
    }

    public function store(Request $request)
    {
        $this->authorize('create', Design::class);

        $validated = $request->validate([
            'name'          => 'nullable|string|max:255',
            'slug'          => 'nullable|string|max:255',

            'sign_type'     => 'required|string|max:100',
            'sign_category' => 'nullable|string|max:100',

            'sign_width'    => 'nullable|integer|min:1',
            'sign_height'   => 'nullable|integer|min:1',
            'sign_depth'    => 'nullable|integer|min:1',

            'canvas_width'  => 'required|integer|min:1',
            'canvas_height' => 'required|integer|min:1',
            'grid_size'     => 'nullable|integer|min:1',
            'grid_enabled'  => 'boolean',
            'snap_to_grid'  => 'boolean',
            'background_color' => 'nullable|string|max:20',

            'canvas_state'  => 'required|array',
            'settings'      => 'nullable|array',

            'order_id'      => 'nullable|integer',
            'status'        => 'nullable|string|in:draft,final,ordered',
        ]);

        $validated['grid_size']     = $validated['grid_size']     ?? 24;
        $validated['grid_enabled']  = $validated['grid_enabled']  ?? true;
        $validated['snap_to_grid']  = $validated['snap_to_grid']  ?? true;
        $validated['status']        = $validated['status']        ?? 'draft';

        $design = Auth::user()->designs()->create($validated);

        return response()->json($design, 201);
    }

    public function show(Design $design)
    {
        $this->authorize('view', $design);

        return response()->json($design);
    }

    public function update(Request $request, Design $design)
    {
        $this->authorize('update', $design);

        $validated = $request->validate([
            'name'          => 'sometimes|nullable|string|max:255',
            'slug'          => 'sometimes|nullable|string|max:255',

            'sign_type'     => 'sometimes|string|max:100',
            'sign_category' => 'sometimes|nullable|string|max:100',

            'sign_width'    => 'sometimes|nullable|integer|min:1',
            'sign_height'   => 'sometimes|nullable|integer|min:1',
            'sign_depth'    => 'sometimes|nullable|integer|min:1',

            'canvas_width'  => 'sometimes|integer|min:1',
            'canvas_height' => 'sometimes|integer|min:1',
            'grid_size'     => 'sometimes|nullable|integer|min:1',
            'grid_enabled'  => 'sometimes|boolean',
            'snap_to_grid'  => 'sometimes|boolean',
            'background_color' => 'sometimes|nullable|string|max:20',

            'canvas_state'  => 'sometimes|array',
            'settings'      => 'sometimes|nullable|array',

            'order_id'      => 'sometimes|nullable|integer',
            'status'        => 'sometimes|string|in:draft,final,ordered',
        ]);

        $design->update($validated);

        return response()->json($design);
    }

    public function destroy(Design $design)
    {
        $this->authorize('delete', $design);

        $design->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
