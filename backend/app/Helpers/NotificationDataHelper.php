<?php

namespace App\Helpers;

use App\Enums\ReportResolution;
use App\Models\Chapter;
use App\Models\Comment;
use App\Models\Contracts\AuthoredContent;
use App\Models\Contracts\Commentable;
use App\Models\Contracts\Reportable;
use App\Models\Notification;
use App\Models\Novel;
use App\Models\NovelCover;
use Illuminate\Support\Collection;
use LogicException;

/**
 * @see memory-bank/decisions/ADR-10-notifications-in-app-agregees.md
 */
final class NotificationDataHelper
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
     * @see memory-bank/decisions/ADR-16-illustrations-du-roman.md
     *
     * @return array{chapter: null, novel: array{slug: string, title: string}, cover: array{id: int, image_url: string}}
     */
    public static function coverSubject(NovelCover $cover): array
    {
        return [
            'chapter' => null,
            'novel' => [
                'slug' => $cover->novel->slug,
                'title' => $cover->novel->title,
            ],
            'cover' => [
                'id' => $cover->id,
                'image_url' => $cover->imageUrl(),
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function contentSubject(AuthoredContent $content): array
    {
        if ($content instanceof Comment) {
            return self::contentSubject($content->target());
        }

        if ($content instanceof Chapter) {
            return self::chapterSubject($content);
        }

        if ($content instanceof NovelCover) {
            return self::coverSubject($content);
        }

        if ($content instanceof Novel) {
            return self::novelSubject($content);
        }

        throw new LogicException(sprintf('%s is not a supported notification subject.', $content::class));
    }

    /**
     * @return array{chapter: null, novel: array{slug: string, title: string}}
     */
    public static function novelSubject(Novel $novel): array
    {
        return [
            'chapter' => null,
            'novel' => [
                'slug' => $novel->slug,
                'title' => $novel->title,
            ],
        ];
    }

    /**
     * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
     *
     * @return array<string, mixed>
     */
    public static function moderatedContentData(Reportable $content, ReportResolution $resolution): array
    {
        return [
            ...self::contentSubject($content),
            'content_type' => $content->getMorphClass(),
            'resolution' => $resolution->value,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function commentData(Comment $comment, Commentable $commentable, ?Notification $pending): array
    {
        return [
            ...self::contentSubject($commentable),
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
