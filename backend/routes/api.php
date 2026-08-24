<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ChapterController;
use App\Http\Controllers\Api\V1\GenreController;
use App\Http\Controllers\Api\V1\NovelController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::pattern('chapter', '[0-9]+');

Route::prefix('v1')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register'])->middleware('throttle:register');
    Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:login');

    Route::get('/genres', [GenreController::class, 'index']);
    Route::get('/novels', [NovelController::class, 'index']);
    Route::get('/novels/{slug}', [NovelController::class, 'show']);
    Route::get('/novels/{slug}/chapters', [ChapterController::class, 'currentBranch'])->name('chapters.current-branch');
    Route::get('/novels/{slug}/chapters/{chapter}', [ChapterController::class, 'reading'])->name('chapters.reading');
    Route::get('/novels/{slug}/tree', [ChapterController::class, 'tree'])->name('chapters.tree');
    Route::get('/chapters/{chapter}', [ChapterController::class, 'show'])->name('chapters.show');
    Route::get('/chapters/{chapter}/children', [ChapterController::class, 'children'])->name('chapters.children');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        Route::post('/novels', [NovelController::class, 'store'])->name('novels.store');
        Route::put('/novels/{slug}', [NovelController::class, 'update'])->name('novels.update');
        Route::post('/novels/{slug}/chapters', [ChapterController::class, 'store'])->name('chapters.store');
        Route::put('/chapters/{chapter}', [ChapterController::class, 'update'])->name('chapters.update');
        Route::post('/chapters/{chapter}/publish', [ChapterController::class, 'publish'])->name('chapters.publish');
        Route::delete('/chapters/{chapter}', [ChapterController::class, 'destroy'])->name('chapters.destroy');
        Route::get('/me/drafts', [ChapterController::class, 'drafts'])->name('chapters.drafts');
    });
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
