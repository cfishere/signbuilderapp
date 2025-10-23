<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\UserDesignController;
use App\Http\Controllers\CanvasController;

Route::middleware('auth:sanctum')->get('/user/canvases', [CanvasController::class, 'index']);
Route::middleware('auth:sanctum')->get('/user/canvas/{id}', [CanvasController::class, 'show']);


// UserDesigns routes:
Route::middleware('auth:sanctum')->prefix('user')->group(function () {
    Route::get('/canvases', [UserDesignController::class, 'index']);
    Route::post('/canvases', [UserDesignController::class, 'store']);
    Route::get('/canvases/{id}', [UserDesignController::class, 'show']);
    Route::put('/canvases/{id}', [UserDesignController::class, 'update']);
    Route::delete('/canvases/{id}', [UserDesignController::class, 'destroy']);
});

