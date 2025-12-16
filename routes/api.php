<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\CanvasController;

Route::middleware('auth:sanctum')->get('/user/canvases', [CanvasController::class, 'index']);
Route::middleware('auth:sanctum')->get('/user/canvas/{id}', [CanvasController::class, 'show']);

/*Route::middleware('auth:sanctum')->group(function () {
    Route::get('/designs', [DesignController::class, 'index'])->name('designs.index');
    Route::post('/designs', [DesignController::class, 'store'])->name('designs.store');
    Route::get('/designs/{design}', [DesignController::class, 'show'])->name('designs.show');
    Route::put('/designs/{design}', [DesignController::class, 'update'])->name('designs.update');
    Route::delete('/designs/{design}', [DesignController::class, 'destroy'])->name('designs.destroy');
});*/