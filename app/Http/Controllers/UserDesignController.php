<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserDesign;
use Illuminate\Support\Facades\Auth;

class UserDesignController extends Controller
{
    public function index()
    {
        return Auth::user()->designs()->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'canvas_data' => 'required|array',
            'width' => 'required|integer|min:1',
            'height' => 'required|integer|min:1',
            'snap_to_grid' => 'required|boolean',
        ]);

        $design = Auth::user()->designs()->create($validated);

        return response()->json($design, 201);
    }

    public function show($id)
    {
        $design = Auth::user()->designs()->findOrFail($id);
        return response()->json($design);
    }

    public function update(Request $request, $id)
    {
        $design = Auth::user()->designs()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'canvas_data' => 'sometimes|array',
            'width' => 'sometimes|integer|min:1',
            'height' => 'sometimes|integer|min:1',
            'snap_to_grid' => 'sometimes|boolean',
        ]);

        $design->update($validated);

        return response()->json($design);
    }

    public function destroy($id)
    {
        $design = Auth::user()->designs()->findOrFail($id);
        $design->delete();

        return response()->json(['message' => 'Deleted']);
    }
}