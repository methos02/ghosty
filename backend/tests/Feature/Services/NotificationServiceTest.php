<?php

namespace Tests\Feature\Services;

use App\DTO\ChapterDTO;
use App\Enums\NotificationType;
use App\Models\Chapter;
use App\Models\Notification;
use App\Models\Novel;
use App\Models\User;
use App\Services\BranchService;
use App\Services\ChapterService;
use App\Services\LikeService;
use Illuminate\Database\Eloquent\Collection;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class NotificationServiceTest extends TestCase
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

    #[Test]
    public function a_published_continuation_notifies_the_author_of_the_parent(): void
    {
        $parent = Chapter::factory()->create();
        $continuation = $this->continueWith($parent, User::factory()->create(['username' => 'plume']));

        $notification = $this->notificationsOf($parent->author, NotificationType::ChapterContinued)->sole();

        $this->assertSame($parent->id, data_get($notification->data, 'chapter.id'));
        $this->assertSame($continuation->id, data_get($notification->data, 'continuation.id'));
        $this->assertSame('plume', data_get($notification->data, 'continuation.author_username'));
        $this->assertSame(1, $notification->data['count']);
    }

    #[Test]
    public function continuing_ones_own_chapter_notifies_nobody(): void
    {
        $parent = Chapter::factory()->create();

        $this->continueWith($parent, $parent->author);

        $this->assertDatabaseCount('notifications', 0);
    }

    #[Test]
    public function a_draft_continuation_notifies_nobody(): void
    {
        $parent = Chapter::factory()->create();

        $this->continueWith($parent, User::factory()->create(), asDraft: true);

        $this->assertCount(0, $this->notificationsOf($parent->author, NotificationType::ChapterContinued));
    }

    #[Test]
    public function publishing_a_draft_continuation_notifies_the_author_of_the_parent(): void
    {
        $parent = Chapter::factory()->create();
        $draft = $this->continueWith($parent, User::factory()->create(), asDraft: true);

        app(ChapterService::class)->publish($draft);

        $this->assertCount(1, $this->notificationsOf($parent->author, NotificationType::ChapterContinued));
    }

    #[Test]
    public function successive_continuations_gather_in_a_single_unread_notification(): void
    {
        $parent = Chapter::factory()->create();
        $this->continueWith($parent, User::factory()->create());
        $latest = $this->continueWith($parent, User::factory()->create());

        $notification = $this->notificationsOf($parent->author, NotificationType::ChapterContinued)->sole();

        $this->assertSame(2, $notification->data['count']);
        $this->assertSame($latest->id, data_get($notification->data, 'continuation.id'));
    }

    #[Test]
    public function a_continuation_after_reading_opens_a_fresh_notification(): void
    {
        $parent = Chapter::factory()->create();
        $this->continueWith($parent, User::factory()->create());
        Notification::query()->update(['read_at' => now()]);

        $this->continueWith($parent, User::factory()->create());

        $notifications = $this->notificationsOf($parent->author, NotificationType::ChapterContinued);
        $this->assertCount(2, $notifications);
        $this->assertSame([1], $notifications->whereNull('read_at')->pluck('data.count')->all());
    }

    #[Test]
    public function an_author_who_turned_notifications_off_receives_nothing(): void
    {
        $author = User::factory()->create(['notifications_enabled' => false]);
        $parent = Chapter::factory()->create(['author_id' => $author->id]);

        $this->continueWith($parent, User::factory()->create());

        $this->assertDatabaseCount('notifications', 0);
    }

    #[Test]
    public function a_support_notifies_the_author_of_the_chapter(): void
    {
        $chapter = Chapter::factory()->create();

        app(LikeService::class)->like(User::factory()->create(['username' => 'lectrice']), $chapter, null);

        $notification = $this->notificationsOf($chapter->author, NotificationType::LikeReceived)->sole();

        $this->assertSame($chapter->id, data_get($notification->data, 'chapter.id'));
        $this->assertSame('lectrice', $notification->data['last_actor_username']);
        $this->assertSame(1, $notification->data['count']);
    }

    #[Test]
    public function supports_gather_in_a_single_unread_notification(): void
    {
        $chapter = Chapter::factory()->create();

        foreach (User::factory()->count(3)->create() as $reader) {
            app(LikeService::class)->like($reader, $chapter, null);
        }

        $this->assertSame(3, $this->notificationsOf($chapter->author, NotificationType::LikeReceived)->sole()->data['count']);
    }

    #[Test]
    public function the_first_support_stays_counted_when_the_notification_is_stamped_a_second_later(): void
    {
        $chapter = Chapter::factory()->create();
        $service = app(LikeService::class);

        $service->like(User::factory()->create(), $chapter, null);
        Notification::query()->update(['created_at' => now()->addSecond()]);
        $service->like(User::factory()->create(), $chapter, null);

        $this->assertSame(2, $this->notificationsOf($chapter->author, NotificationType::LikeReceived)->sole()->data['count']);
    }

    #[Test]
    public function withdrawing_then_supporting_again_does_not_inflate_the_count(): void
    {
        $chapter = Chapter::factory()->create();
        $reader = User::factory()->create();
        $service = app(LikeService::class);

        $service->like($reader, $chapter, null);
        $service->unlike($reader, $chapter);
        $service->like($reader, $chapter, null);

        $this->assertSame(1, $this->notificationsOf($chapter->author, NotificationType::LikeReceived)->sole()->data['count']);
    }

    #[Test]
    public function a_branch_taking_the_lead_notifies_the_authors_it_brings_into_the_main_branch(): void
    {
        $root = Chapter::factory()->create();
        Chapter::factory()->continuing($root)->liked(2)->create();
        $challenger = Chapter::factory()->continuing($root)->liked(1)->create();

        $challenger->increment('like_count', 4);
        $this->recomputeBranchLikes($root);

        $notification = $this->notificationsOf($challenger->author, NotificationType::MainBranchGained)->sole();
        $this->assertSame($challenger->id, data_get($notification->data, 'chapter.id'));
    }

    #[Test]
    public function a_branch_losing_the_lead_tells_its_authors_but_not_the_shared_trunk(): void
    {
        $root = Chapter::factory()->create();
        $leader = Chapter::factory()->continuing($root)->liked(2)->create();
        $challenger = Chapter::factory()->continuing($root)->liked(1)->create();
        $this->recomputeBranchLikes($root);

        $challenger->increment('like_count', 4);
        $this->recomputeBranchLikes($root);

        $notification = $this->notificationsOf($leader->author, NotificationType::MainBranchLost)->sole();
        $this->assertSame([$leader->id], data_get($notification->data, 'chapters.*.id'));
        $this->assertDatabaseMissing('notifications', ['notifiable_id' => $root->author_id]);
    }

    #[Test]
    public function an_author_hears_once_for_all_their_chapters_joining_the_main_branch(): void
    {
        $root = Chapter::factory()->create();
        Chapter::factory()->continuing($root)->liked(2)->create();
        $author = User::factory()->create();
        $challenger = Chapter::factory()->continuing($root)->liked(1)->create(['author_id' => $author->id]);
        $sequel = Chapter::factory()->continuing($challenger)->liked(1)->create(['author_id' => $author->id]);
        $this->recomputeBranchLikes($root);

        $challenger->increment('like_count', 4);
        $this->recomputeBranchLikes($root);

        $notification = $this->notificationsOf($author, NotificationType::MainBranchGained)->sole();
        $this->assertSame([$challenger->id, $sequel->id], data_get($notification->data, 'chapters.*.id'));
        $this->assertSame(2, $notification->data['count']);
    }

    #[Test]
    public function an_author_on_both_sides_of_the_switch_hears_both_the_gain_and_the_loss(): void
    {
        $author = User::factory()->create();
        $root = Chapter::factory()->create();
        $leader = Chapter::factory()->continuing($root)->liked(2)->create(['author_id' => $author->id]);
        $challenger = Chapter::factory()->continuing($root)->liked(1)->create(['author_id' => $author->id]);
        $this->recomputeBranchLikes($root);

        $challenger->increment('like_count', 4);
        $this->recomputeBranchLikes($root);

        $this->assertSame(
            [$challenger->id],
            data_get($this->notificationsOf($author, NotificationType::MainBranchGained)->sole()->data, 'chapters.*.id')
        );
        $this->assertSame(
            [$leader->id],
            data_get($this->notificationsOf($author, NotificationType::MainBranchLost)->sole()->data, 'chapters.*.id')
        );
    }

    #[Test]
    public function an_unread_gain_that_turned_false_is_withdrawn(): void
    {
        $root = Chapter::factory()->create();
        $leader = Chapter::factory()->continuing($root)->liked(2)->create();
        $challenger = Chapter::factory()->continuing($root)->liked(1)->create();
        $this->recomputeBranchLikes($root);

        $challenger->increment('like_count', 4);
        $this->recomputeBranchLikes($root);
        $leader->increment('like_count', 9);
        $this->recomputeBranchLikes($root);

        $this->assertCount(0, $this->notificationsOf($challenger->author, NotificationType::MainBranchGained));
        $this->assertCount(1, $this->notificationsOf($challenger->author, NotificationType::MainBranchLost));
        $this->assertCount(0, $this->notificationsOf($leader->author, NotificationType::MainBranchLost));
    }

    #[Test]
    public function a_recompute_that_keeps_the_main_branch_notifies_nobody(): void
    {
        $root = Chapter::factory()->create();
        $leader = Chapter::factory()->continuing($root)->liked(2)->create();
        Chapter::factory()->continuing($root)->liked(1)->create();

        $leader->increment('like_count');
        $this->recomputeBranchLikes($root);

        $this->assertDatabaseCount('notifications', 0);
    }

    #[Test]
    public function lengthening_a_branch_without_support_never_hands_it_the_main_branch(): void
    {
        $root = Chapter::factory()->create();
        $leader = Chapter::factory()->continuing($root)->create(['published_at' => now()->subHour()]);
        Chapter::factory()->continuing($leader)->create(['published_at' => now()->subHour()]);
        $sibling = Chapter::factory()->continuing($root)->create();
        $siblingContinuation = Chapter::factory()->continuing($sibling)->create();

        $this->continueWith($siblingContinuation, User::factory()->create());
        $this->recomputeBranchLikes($root);

        $this->assertDatabaseMissing('notifications', ['type' => NotificationType::MainBranchGained->value]);
    }
}
