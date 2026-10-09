<?php

namespace Database\Seeders;

use App\Enums\NotificationType;
use App\Models\Chapter;
use App\Models\Like;
use App\Models\Notification;
use App\Models\Novel;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\File;

/**
 * @see memory-bank/decisions/ADR-10-notifications-in-app-agregees.md
 */
class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        /** @var list<array{type: string, chapter: string, actors?: list<string>, continuations?: list<string>, chapters?: list<string>, hours_ago: int, read?: bool}> $notifications */
        $notifications = File::json(database_path('data/notifications.json'));

        foreach ($notifications as $notification) {
            $type = NotificationType::from($notification['type']);
            $chapter = $this->chapter($notification['chapter']);
            $sentAt = now()->subHours($notification['hours_ago']);
            $isRead = $notification['read'] ?? false;

            Notification::create([
                'type' => $type->value,
                'notifiable_type' => $chapter->author->getMorphClass(),
                'notifiable_id' => $chapter->author_id,
                'group_key' => $type->groupKey($this->groupSubject($type, $chapter)),
                'data' => [
                    ...$this->subject($chapter),
                    ...$this->details($type, $chapter, $notification),
                ],
                'read_at' => $isRead ? $sentAt : null,
                'created_at' => $sentAt,
                'updated_at' => $sentAt,
            ]);
        }
    }

    private function groupSubject(NotificationType $type, Chapter $chapter): Chapter|Novel
    {
        return match ($type) {
            NotificationType::MainBranchGained, NotificationType::MainBranchLost => $chapter->novel,
            NotificationType::LikeReceived, NotificationType::ChapterContinued => $chapter,
        };
    }

    /**
     * @param  array{actors?: list<string>, continuations?: list<string>, chapters?: list<string>}  $notification
     * @return array<string, mixed>
     */
    private function details(NotificationType $type, Chapter $chapter, array $notification): array
    {
        return match ($type) {
            NotificationType::LikeReceived => $this->likeDetails($chapter, $notification['actors'] ?? []),
            NotificationType::ChapterContinued => $this->continuationDetails($notification['continuations'] ?? []),
            NotificationType::MainBranchGained, NotificationType::MainBranchLost => $this->branchMoveDetails(
                $notification['chapters'] ?? [$chapter->title]
            ),
        };
    }

    /**
     * @param  list<string>  $chapterTitles
     * @return array{chapters: list<array{id: int, title: string}>, count: int}
     */
    private function branchMoveDetails(array $chapterTitles): array
    {
        $chapters = array_map(fn (string $title): array => [
            'id' => $this->chapter($title)->id,
            'title' => $title,
        ], $chapterTitles);

        return [
            'chapters' => $chapters,
            'count' => count($chapters),
        ];
    }

    /**
     * @param  list<string>  $actors
     * @return array{last_actor_username: string|null, first_like_id: int|null, count: int}
     */
    private function likeDetails(Chapter $chapter, array $actors): array
    {
        $likeIds = array_map(fn (string $actor): int => Like::create([
            'user_id' => User::where('username', $actor)->firstOrFail()->id,
            'likeable_type' => $chapter->getMorphClass(),
            'likeable_id' => $chapter->id,
        ])->id, $actors);

        return [
            'last_actor_username' => Arr::last($actors),
            'first_like_id' => Arr::first($likeIds),
            'count' => count($likeIds),
        ];
    }

    /**
     * @param  list<string>  $continuationTitles
     * @return array{continuation: array{id: int, title: string, author_username: string}, count: int}
     */
    private function continuationDetails(array $continuationTitles): array
    {
        $continuation = $this->chapter((string) Arr::last($continuationTitles));

        return [
            'continuation' => [
                'id' => $continuation->id,
                'title' => $continuation->title,
                'author_username' => $continuation->author->username,
            ],
            'count' => count($continuationTitles),
        ];
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

    private function chapter(string $title): Chapter
    {
        return Chapter::with(['author', 'novel'])->where('title', $title)->firstOrFail();
    }
}
