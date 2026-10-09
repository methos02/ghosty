<?php

namespace App\Services;

use App\Enums\NotificationType;
use App\Models\Chapter;
use App\Models\Notification;
use App\Models\Novel;
use App\Models\User;
use App\Repositories\ChapterRepository;
use App\Repositories\LikeRepository;
use App\Repositories\NotificationRepository;
use Closure;
use Illuminate\Support\Collection;

/**
 * @see memory-bank/decisions/ADR-10-notifications-in-app-agregees.md
 */
class NotificationService
{
    public function __construct(
        private readonly NotificationRepository $notificationsR,
        private readonly ChapterRepository $chaptersR,
        private readonly LikeRepository $likesR
    ) {}

    public function chapterContinued(Chapter $continuation, Chapter $parent): void
    {
        $this->push(
            $parent->author,
            $continuation->author_id,
            NotificationType::ChapterContinued,
            $parent,
            fn (?Notification $pending): array => [
                ...$this->subject($parent),
                'continuation' => [
                    'id' => $continuation->id,
                    'title' => $continuation->title,
                    'author_username' => $continuation->author->username,
                ],
                'count' => $this->pendingCount($pending) + 1,
            ]
        );
    }

    public function likeReceived(Chapter $chapter, User $liker): void
    {
        $this->push(
            $chapter->author,
            $liker->id,
            NotificationType::LikeReceived,
            $chapter,
            fn (?Notification $pending): array => [
                ...$this->subject($chapter),
                'last_actor_username' => $liker->username,
                ...$this->likeTally($chapter, $liker, $pending),
            ]
        );
    }

    /**
     * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
     */
    public function mainBranchSwitch(?Chapter $previousLastChapter, Chapter $newLastChapter): void
    {
        $novel = $newLastChapter->novel;
        $newBranchIds = $newLastChapter->pathChapterIds();
        $previousBranchIds = $previousLastChapter?->pathChapterIds() ?? [];

        $joiningChapters = $this->chaptersR->findByIds(array_values(array_diff($newBranchIds, $previousBranchIds)));
        $leavingChapters = $this->chaptersR->findByIds(array_values(array_diff($previousBranchIds, $newBranchIds)));

        foreach ($joiningChapters->groupBy('author_id') as $authorChapters) {
            $this->addToUnreadBranchNotification(NotificationType::MainBranchGained, $novel, $authorChapters);
            $this->removeFromUnreadBranchNotification(NotificationType::MainBranchLost, $novel, $authorChapters);
        }

        foreach ($leavingChapters->groupBy('author_id') as $authorChapters) {
            $this->addToUnreadBranchNotification(NotificationType::MainBranchLost, $novel, $authorChapters);
            $this->removeFromUnreadBranchNotification(NotificationType::MainBranchGained, $novel, $authorChapters);
        }
    }

    /**
     * @param  Collection<int, Chapter>  $authorChapters
     */
    private function addToUnreadBranchNotification(NotificationType $type, Novel $novel, Collection $authorChapters): void
    {
        $this->push(
            $authorChapters->firstOrFail()->author,
            null,
            $type,
            $novel,
            fn (?Notification $pending): array => $this->branchMoveData($novel, $this->mergeChapterSummaries(
                $this->pendingChapterSummaries($pending),
                $this->chapterSummaries($authorChapters)
            ))
        );
    }

    /**
     * @param  Collection<int, Chapter>  $authorChapters
     */
    private function removeFromUnreadBranchNotification(NotificationType $type, Novel $novel, Collection $authorChapters): void
    {
        $pending = $this->notificationsR->findUnread($authorChapters->firstOrFail()->author, $type->groupKey($novel));

        if ($pending === null) {
            return;
        }

        $withdrawnIds = $authorChapters->pluck('id')->all();
        $remainingChapters = array_values(array_filter(
            $this->pendingChapterSummaries($pending),
            fn (array $chapter): bool => ! in_array($chapter['id'], $withdrawnIds, true)
        ));

        if ($remainingChapters === []) {
            $this->notificationsR->delete($pending);

            return;
        }

        $this->notificationsR->update($pending, $this->branchMoveData($novel, $remainingChapters));
    }

    /**
     * @param  list<array{id: int, title: string}>  $chapters
     * @return array<string, mixed>
     */
    private function branchMoveData(Novel $novel, array $chapters): array
    {
        return [
            'chapter' => $chapters[0] ?? null,
            'novel' => [
                'slug' => $novel->slug,
                'title' => $novel->title,
            ],
            'chapters' => $chapters,
            'count' => count($chapters),
        ];
    }

    /**
     * @param  list<array{id: int, title: string}>  $pendingChapters
     * @param  list<array{id: int, title: string}>  $newChapters
     * @return list<array{id: int, title: string}>
     */
    private function mergeChapterSummaries(array $pendingChapters, array $newChapters): array
    {
        $chaptersById = [];

        foreach ([...$pendingChapters, ...$newChapters] as $chapter) {
            $chaptersById[$chapter['id']] = $chapter;
        }

        return array_values($chaptersById);
    }

    /**
     * @param  Collection<int, Chapter>  $chapters
     * @return list<array{id: int, title: string}>
     */
    private function chapterSummaries(Collection $chapters): array
    {
        $summaries = [];

        foreach ($chapters as $chapter) {
            $summaries[] = [
                'id' => $chapter->id,
                'title' => $chapter->title,
            ];
        }

        return $summaries;
    }

    /**
     * @return list<array{id: int, title: string}>
     */
    private function pendingChapterSummaries(?Notification $pending): array
    {
        $pendingChapters = $pending?->data['chapters'] ?? [];
        $summaries = [];

        foreach (is_array($pendingChapters) ? $pendingChapters : [] as $chapter) {
            if (is_array($chapter) && is_int($chapter['id'] ?? null) && is_string($chapter['title'] ?? null)) {
                $summaries[] = ['id' => $chapter['id'], 'title' => $chapter['title']];
            }
        }

        return $summaries;
    }

    /**
     * @param  Closure(?Notification): array<string, mixed>  $data
     */
    private function push(User $recipient, ?int $actorId, NotificationType $type, Chapter|Novel $subject, Closure $data): void
    {
        if ($recipient->id === $actorId || ! $recipient->notifications_enabled) {
            return;
        }

        $groupKey = $type->groupKey($subject);
        $pending = $this->notificationsR->findUnread($recipient, $groupKey);

        $this->notificationsR->saveUnread($recipient, $type, $groupKey, $data($pending));
    }

    /**
     * @return array{chapter: array{id: int, title: string}, novel: array{slug: string, title: string}}
     */
    private function subject(Chapter $chapter): array
    {
        return [
            'chapter' => [
                'id' => $chapter->id,
                'title' => $chapter->title,
            ],
            'novel' => [
                'slug' => $chapter->novel->slug,
                'title' => $chapter->novel->title,
            ],
        ];
    }

    /**
     * @return array{first_like_id: int, count: int}
     */
    private function likeTally(Chapter $chapter, User $liker, ?Notification $pending): array
    {
        $firstLikeId = $pending === null
            ? $this->likesR->findUserLikeId($liker->id, $chapter)
            : $this->pendingFirstLikeId($pending);

        return [
            'first_like_id' => $firstLikeId,
            'count' => $this->likesR->countLikesSinceLikeId($chapter, $firstLikeId),
        ];
    }

    private function pendingFirstLikeId(Notification $pending): int
    {
        $firstLikeId = $pending->data['first_like_id'] ?? 0;

        return is_int($firstLikeId) ? $firstLikeId : 0;
    }

    private function pendingCount(?Notification $pending): int
    {
        $count = $pending?->data['count'] ?? 0;

        return is_int($count) ? $count : 0;
    }
}
