<?php

namespace Tests\Feature\Services\Notifications;

use App\DTO\ChapterDTO;
use App\DTO\CommentDTO;
use App\Enums\NotificationType;
use App\Models\Chapter;
use App\Models\Comment;
use App\Models\Notification;
use App\Models\Novel;
use App\Models\User;
use App\Services\BranchService;
use App\Services\ChapterService;
use App\Services\CommentService;
use Illuminate\Database\Eloquent\Collection;

trait NotificationTestHelpers
{
    /**
     * @return Collection<int, Notification>
     */
    private function notificationsOf(User $user, NotificationType $type): Collection
    {
        return Notification::query()
            ->where('notifiable_id', $user->id)
            ->where('type', $type->value)
            ->get();
    }

    private function continueWith(Chapter $parent, User $author, bool $asDraft = false): Chapter
    {
        return app(ChapterService::class)->createChild(
            $parent->refresh(),
            $author,
            new ChapterDTO('La suite', str_repeat('Texte de la suite. ', 20), asDraft: $asDraft)
        );
    }

    private function recomputeBranchLikes(Chapter $chapter): void
    {
        app(BranchService::class)->recomputeBranchLikes(Novel::findOrFail($chapter->novel_id));
    }

    private function commentOn(Chapter $chapter, User $author): Comment
    {
        return app(CommentService::class)->create($author, $chapter, new CommentDTO('Un commentaire.'));
    }

    private function replyTo(Comment $parent, User $author): Comment
    {
        return app(CommentService::class)->createReply($author, $parent, new CommentDTO('Une réponse.'));
    }
}
