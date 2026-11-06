<?php

namespace Database\Seeders;

use App\DTO\CommentDTO;
use App\Models\Chapter;
use App\Models\Novel;
use App\Models\User;
use App\Services\CommentService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

/**
 * @see memory-bank/decisions/ADR-13-commentaires.md
 */
class CommentSeeder extends Seeder
{
    public function run(CommentService $commentService): void
    {
        /** @var list<array{chapter?: string, novel?: string, author: string, content: string, is_spoiler?: bool, replies?: list<array{author: string, content: string, is_spoiler?: bool}>}> $comments */
        $comments = File::json(database_path('data/comments.json'));

        foreach ($comments as $comment) {
            $created = $commentService->create(
                $this->user($comment['author']),
                $this->commentable($comment),
                new CommentDTO($comment['content'], $comment['is_spoiler'] ?? false)
            );

            foreach ($comment['replies'] ?? [] as $reply) {
                $commentService->createReply(
                    $this->user($reply['author']),
                    $created,
                    new CommentDTO($reply['content'], $reply['is_spoiler'] ?? false)
                );
            }
        }
    }

    /**
     * @param  array{chapter?: string, novel?: string}  $comment
     */
    private function commentable(array $comment): Chapter|Novel
    {
        if (isset($comment['novel'])) {
            return Novel::query()
                ->where('title', $comment['novel'])
                ->firstOrFail();
        }

        return Chapter::query()
            ->where('title', $comment['chapter'] ?? '')
            ->firstOrFail();
    }

    private function user(string $username): User
    {
        return User::query()
            ->where('username', $username)
            ->firstOrFail();
    }
}
