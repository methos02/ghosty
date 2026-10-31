<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ChapterController;
use App\Http\Controllers\Api\V1\ChapterReadController;
use App\Http\Controllers\Api\V1\FollowController;
use App\Http\Controllers\Api\V1\GenreController;
use App\Http\Controllers\Api\V1\LikeController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\NovelController;
use App\Http\Controllers\Api\V1\ReadingProgressController;
use App\Http\Controllers\Api\V1\ReportController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::pattern('chapter', '[0-9]+');
Route::pattern('notification', '[0-9a-fA-F-]{36}');

Route::prefix('v1')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register'])->middleware('throttle:register');
    Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:login');

    Route::get('/genres', [GenreController::class, 'index']);
    Route::get('/novels', [NovelController::class, 'index']);
    Route::get('/novels/{slug}', [NovelController::class, 'show']);
    Route::get('/novels/{slug}/chapters', [ChapterController::class, 'mainBranch'])->name('chapters.main-branch');
    Route::get('/novels/{slug}/chapters/{chapter}', [ChapterController::class, 'reading'])->name('chapters.reading');
    Route::get('/novels/{slug}/tree', [ChapterController::class, 'tree'])->name('chapters.tree');
    Route::get('/chapters/{chapter}', [ChapterController::class, 'show'])->name('chapters.show');
    Route::get('/chapters/{chapter}/children', [ChapterController::class, 'children'])->name('chapters.children');
    Route::post('/chapters/{chapter}/read', [ChapterReadController::class, 'store'])->middleware('throttle:chapter-read')->name('chapters.read');

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
        Route::get('/me/chapters', [ChapterController::class, 'published'])->name('chapters.published');

        Route::post('/chapters/{chapter}/like', [LikeController::class, 'store'])->middleware('throttle:like')->name('chapters.like');
        Route::delete('/chapters/{chapter}/like', [LikeController::class, 'destroy'])->middleware('throttle:like')->name('chapters.unlike');
        Route::post('/chapters/{chapter}/report', [ReportController::class, 'storeForChapter'])->name('chapters.report');
        Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');

        Route::get('/me/notifications', [NotificationController::class, 'index'])->name('notifications.index');
        Route::post('/me/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
        Route::patch('/me/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');

        Route::post('/chapters/{chapter}/follow', [FollowController::class, 'store'])->name('chapters.follow');
        Route::delete('/chapters/{chapter}/follow', [FollowController::class, 'destroy'])->name('chapters.unfollow');
        Route::get('/me/follows', [FollowController::class, 'index'])->name('follows.index');

        Route::get('/me/reading-progress', [ReadingProgressController::class, 'index'])->name('reading-progress.index');
        Route::get('/me/reading-history', [ChapterReadController::class, 'index'])->name('reading-history.index');
    });
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
