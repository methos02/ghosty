<?php

namespace Database\Factories;

use App\Models\Chapter;
use App\Models\Comment;
use App\Models\Novel;
use App\Models\User;
use App\Repositories\ChapterRepository;
use App\Repositories\CommentRepository;
use App\Repositories\NovelRepository;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Comment>
 */
class CommentFactory extends Factory
{
    protected $model = Comment::class;

    public function definition(): array
    {
        return [
            'author_id' => UserFactory::new(),
            'commentable_type' => (new Chapter)->getMorphClass(),
            'commentable_id' => ChapterFactory::new(),
            'parent_id' => null,
            'content' => fake()->sentence(12),
            'is_spoiler' => false,
            'status' => Comment::STATUS_VISIBLE,
        ];
    }

    public function by(User $author): static
    {
        return $this->state(fn () => ['author_id' => $author->id]);
    }

    public function on(Chapter|Novel $commentable): static
    {
        return $this->state(fn () => [
            'commentable_type' => $commentable->getMorphClass(),
            'commentable_id' => $commentable->id,
        ]);
    }

    public function replyingTo(Comment $parent): static
    {
        return $this->state(fn () => [
            'commentable_type' => $parent->commentable_type,
            'commentable_id' => $parent->commentable_id,
            'parent_id' => $parent->id,
        ])->afterCreating(function (Comment $reply) use ($parent) {
            if ($reply->isVisible()) {
                app(CommentRepository::class)->incrementReplyCount($parent);
            }
        });
    }

    public function spoiler(): static
    {
        return $this->state(fn () => ['is_spoiler' => true]);
    }

    public function deleted(): static
    {
        return $this->state(fn () => [
            'status' => Comment::STATUS_DELETED,
            'content' => null,
        ]);
    }

    public function hidden(): static
    {
        return $this->state(fn () => ['status' => Comment::STATUS_HIDDEN]);
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Comment $comment) {
            if (! $comment->isVisible()) {
                return;
            }

            $commentable = $comment->commentable;

            if ($commentable instanceof Chapter) {
                app(ChapterRepository::class)->incrementCommentCount($commentable);

                return;
            }

            if ($commentable instanceof Novel) {
                app(NovelRepository::class)->incrementCommentCount($commentable);
            }
        });
    }
}
