<?php

use App\Http\Controllers\Api\V1\GenreController;
use App\Http\Controllers\Api\V1\NovelController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/genres', [GenreController::class, 'index']);
    Route::get('/novels', [NovelController::class, 'index']);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
