<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\GenreController;
use App\Http\Controllers\Api\V1\NovelController;
use App\Http\Controllers\Api\V1\WorkController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public routes
    Route::post('/auth/register', [AuthController::class, 'register'])->middleware('throttle:register');
    Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:login');

    Route::get('/genres', [GenreController::class, 'index']);
    Route::get('/novels', [NovelController::class, 'index']);
    Route::get('/novels/{slug}', [NovelController::class, 'show']);
    Route::get('/works', [WorkController::class, 'index']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);
    });
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
