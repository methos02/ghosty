<?php

namespace App\Support;

use App\Models\Chapter;
use App\Models\Comment;
use App\Models\Notification;
use App\Models\Novel;
use Illuminate\Support\Collection;

/**
 * @see memory-bank/decisions/ADR-10-notifications-in-app-agregees.md
 */
final class NotificationDataSupport
{
    /**
     * @return array{chapter: array{id: int, title: string}, novel: array{slug: string, title: string}}
     */
    public static function chapterSubject(Chapter $chapter): array
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
     * @return array{chapter: array{id: int, title: string}|null, novel: array{slug: string, title: string}}
     */
    public static function commentableSubject(Chapter|Novel $commentable): array
    {
        if ($commentable instanceof Chapter) {
            return self::chapterSubject($commentable);
        }

        return [
            'chapter' => null,
            'novel' => [
                'slug' => $commentable->slug,
                'title' => $commentable->title,
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function commentData(Comment $comment, Chapter|Novel $commentable, ?Notification $pending): array
    {
        return [
            ...self::commentableSubject($commentable),
            'last_actor_username' => $comment->author->username,
            'count' => self::pendingCount($pending) + 1,
        ];
    }

    /**
     * @param  list<array{id: int, title: string}>  $chapters
     * @return array<string, mixed>
     */
    public static function novelChaptersData(Novel $novel, array $chapters): array
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
     * @param  Collection<int, Chapter>  $chapters
     * @return list<array{id: int, title: string}>
     */
    public static function chapterSummaries(Collection $chapters): array
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
     * @param  list<array{id: int, title: string}>  $pendingChapters
     * @param  list<array{id: int, title: string}>  $newChapters
     * @return list<array{id: int, title: string}>
     */
    public static function mergeChapterSummaries(array $pendingChapters, array $newChapters): array
    {
        $chaptersById = [];

        foreach ([...$pendingChapters, ...$newChapters] as $chapter) {
            $chaptersById[$chapter['id']] = $chapter;
        }

        return array_values($chaptersById);
    }

    /**
     * @return list<array{id: int, title: string}>
     */
    public static function pendingChapterSummaries(?Notification $pending): array
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

    public static function pendingCount(?Notification $pending): int
    {
        $count = $pending?->data['count'] ?? 0;

        return is_int($count) ? $count : 0;
    }
}
