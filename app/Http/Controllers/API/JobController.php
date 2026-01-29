<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\OrderJob;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class JobController extends Controller
{
    public function storePrintImage(Request $request, Order $order)
    {
        $this->authorize('update', $order);

        if (!$request->user()?->isAdmin()) {
            abort(403);
        }

        $validated = $request->validate([
            'print_image_data' => 'required|string',
            'print_image_ppi' => 'required|integer|min:1',
            'print_image_width' => 'required|integer|min:1',
            'print_image_height' => 'required|integer|min:1',
        ]);

        $path = $this->storePrintImageFile($validated['print_image_data'], $order->id);
        if (!$path) {
            return response()->json([
                'message' => 'Invalid print image data.',
            ], 422);
        }

        $job = OrderJob::firstOrCreate(
            ['order_id' => $order->id],
            [
                'job_board_status' => $order->status === 'paid' ? 'open' : null,
            ]
        );

        $job->print_image_path = $path;
        $job->print_image_ppi = $validated['print_image_ppi'];
        $job->print_image_width = $validated['print_image_width'];
        $job->print_image_height = $validated['print_image_height'];
        if (!$job->job_board_status && $order->status === 'paid') {
            $job->job_board_status = 'open';
        }
        $job->save();

        return response()->json([
            'job' => $job,
            'print_image_url' => Storage::disk('public')->url($path),
        ]);
    }

    private function storePrintImageFile(string $dataUrl, int $orderId): ?string
    {
        if (!preg_match('/^data:image\\/png;base64,/', $dataUrl)) {
            return null;
        }

        $base64 = preg_replace('/^data:image\\/png;base64,/', '', $dataUrl);
        $binary = base64_decode($base64, true);

        if ($binary === false) {
            return null;
        }

        $filename = 'jobs/' . $orderId . '/' . Str::uuid() . '.png';
        Storage::disk('public')->put($filename, $binary);

        return $filename;
    }
}
