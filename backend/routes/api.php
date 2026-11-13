<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ChapterController;
use App\Http\Controllers\Api\V1\ChapterReadController;
use App\Http\Controllers\Api\V1\CommentController;
use App\Http\Controllers\Api\V1\CoverController;
use App\Http\Controllers\Api\V1\FollowController;
use App\Http\Controllers\Api\V1\GenreController;
use App\Http\Controllers\Api\V1\LikeController;
use App\Http\Controllers\Api\V1\ModerationController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\NovelController;
use App\Http\Controllers\Api\V1\ReadingProgressController;
use App\Http\Controllers\Api\V1\ReportController;
use App\Models\Comment;
use App\Models\NovelCover;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::pattern('chapter', '[0-9]+');
Route::pattern('comment', '[0-9]+');
Route::pattern('cover', '[0-9]+');
Route::pattern('notification', '[0-9a-fA-F-]{36}');

Route::prefix('v1')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register'])->middleware('throttle:register');
    Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:login');

    Route::get('/genres', [GenreController::class, 'index']);
    Route::get('/novels', [NovelController::class, 'index']);
    Route::get('/novels/{novel}', [NovelController::class, 'show']);
    Route::get('/novels/{novel}/chapters', [ChapterController::class, 'mainBranch'])->name('chapters.main-branch');
    Route::get('/novels/{novel}/chapters/{chapter}', [ChapterController::class, 'reading'])->can('view', 'chapter')->name('chapters.reading');
    Route::get('/novels/{novel}/tree', [ChapterController::class, 'tree'])->name('chapters.tree');
    Route::get('/chapters/{chapter}', [ChapterController::class, 'show'])->can('view', 'chapter')->name('chapters.show');
    Route::get('/chapters/{chapter}/children', [ChapterController::class, 'children'])->name('chapters.children');
    Route::post('/chapters/{chapter}/read', [ChapterReadController::class, 'store'])->middleware('throttle:chapter-read')->can('view', 'chapter')->name('chapters.read');
    Route::get('/chapters/{chapter}/comments', [CommentController::class, 'indexForChapter'])->can('view', 'chapter')->name('chapters.comments.index');
    Route::get('/novels/{novel}/comments', [CommentController::class, 'indexForNovel'])->name('novels.comments.index');
    Route::get('/novels/{novel}/covers', [CoverController::class, 'index'])->name('novels.covers.index');
    Route::get('/covers/{cover}/comments', [CommentController::class, 'indexForCover'])->can('view', 'cover')->name('covers.comments.index');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        Route::post('/novels', [NovelController::class, 'store'])->name('novels.store');
        Route::put('/novels/{novel}', [NovelController::class, 'update'])->can('update', 'novel')->name('novels.update');
        Route::post('/novels/{novel}/chapters', [ChapterController::class, 'store'])->name('chapters.store');
        Route::put('/chapters/{chapter}', [ChapterController::class, 'update'])->can('update', 'chapter')->name('chapters.update');
        Route::post('/chapters/{chapter}/publish', [ChapterController::class, 'publish'])->can('publish', 'chapter')->name('chapters.publish');
        Route::delete('/chapters/{chapter}', [ChapterController::class, 'destroy'])->can('delete', 'chapter')->name('chapters.destroy');
        Route::get('/me/drafts', [ChapterController::class, 'drafts'])->name('chapters.drafts');
        Route::get('/me/chapters', [ChapterController::class, 'published'])->name('chapters.published');

        Route::post('/chapters/{chapter}/like', [LikeController::class, 'storeForChapter'])->middleware('throttle:like')->name('chapters.like');
        Route::delete('/chapters/{chapter}/like', [LikeController::class, 'destroyForChapter'])->middleware('throttle:like')->name('chapters.unlike');
        Route::post('/chapters/{chapter}/report', [ReportController::class, 'storeForChapter'])->name('chapters.report');

        Route::get('/me/notifications', [NotificationController::class, 'index'])->name('notifications.index');
        Route::post('/me/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
        Route::patch('/me/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');

        Route::post('/chapters/{chapter}/follow', [FollowController::class, 'store'])->can('follow', 'chapter')->name('chapters.follow');
        Route::delete('/chapters/{chapter}/follow', [FollowController::class, 'destroy'])->name('chapters.unfollow');
        Route::get('/me/follows', [FollowController::class, 'index'])->name('follows.index');

        Route::get('/me/reading-progress', [ReadingProgressController::class, 'index'])->name('reading-progress.index');
        Route::get('/me/reading-history', [ChapterReadController::class, 'index'])->name('reading-history.index');

        Route::post('/chapters/{chapter}/comments', [CommentController::class, 'storeForChapter'])->middleware('throttle:comment')->can('create', [Comment::class, 'chapter'])->name('chapters.comments.store');
        Route::post('/novels/{novel}/comments', [CommentController::class, 'storeForNovel'])->middleware('throttle:comment')->can('create', [Comment::class, 'novel'])->name('novels.comments.store');
        Route::post('/comments/{comment}/replies', [CommentController::class, 'storeReply'])->middleware('throttle:comment')->can('reply', 'comment')->name('comments.replies.store');
        Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->can('delete', 'comment')->name('comments.destroy');
        Route::post('/comments/{comment}/report', [ReportController::class, 'storeForComment'])->name('comments.report');

        Route::post('/novels/{novel}/covers', [CoverController::class, 'store'])->can('create', [NovelCover::class, 'novel'])->name('novels.covers.store');
        Route::post('/covers/{cover}/image', [CoverController::class, 'replaceImage'])->can('update', 'cover')->name('covers.image');
        Route::post('/covers/{cover}/like', [LikeController::class, 'storeForCover'])->middleware('throttle:like')->name('covers.like');
        Route::delete('/covers/{cover}/like', [LikeController::class, 'destroyForCover'])->middleware('throttle:like')->name('covers.unlike');
        Route::post('/covers/{cover}/report', [ReportController::class, 'storeForCover'])->can('view', 'cover')->name('covers.report');
        Route::post('/covers/{cover}/comments', [CommentController::class, 'storeForCover'])->middleware('throttle:comment')->can('create', [Comment::class, 'cover'])->name('covers.comments.store');

        Route::prefix('moderation')->middleware('can:moderate,'.Report::class)->group(function () {
            Route::get('/reports', [ModerationController::class, 'index'])->name('moderation.reports.index');
            Route::get('/chapters/{chapter}', [ModerationController::class, 'showChapter'])->name('moderation.chapters.show');
            Route::post('/chapters/{chapter}/decision', [ModerationController::class, 'moderateChapter'])->can('moderate', 'chapter')->name('moderation.chapters.moderate');
            Route::post('/chapters/{chapter}/restore', [ModerationController::class, 'restoreChapter'])->can('restore', 'chapter')->name('moderation.chapters.restore');
            Route::get('/comments/{comment}', [ModerationController::class, 'showComment'])->name('moderation.comments.show');
            Route::post('/comments/{comment}/decision', [ModerationController::class, 'moderateComment'])->can('moderate', 'comment')->name('moderation.comments.moderate');
            Route::post('/comments/{comment}/restore', [ModerationController::class, 'restoreComment'])->can('restore', 'comment')->name('moderation.comments.restore');
            Route::get('/covers/{cover}', [ModerationController::class, 'showCover'])->name('moderation.covers.show');
            Route::post('/covers/{cover}/decision', [ModerationController::class, 'moderateCover'])->can('moderate', 'cover')->name('moderation.covers.moderate');
            Route::post('/covers/{cover}/restore', [ModerationController::class, 'restoreCover'])->can('restore', 'cover')->name('moderation.covers.restore');
        });
    });
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
