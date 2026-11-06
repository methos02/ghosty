<?php

namespace Tests\Feature\Services\Notifications;

use App\Enums\NotificationType;
use App\Models\Chapter;
use App\Models\User;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class MainBranchSwitchNotificationServiceTest extends TestCase
{
    use NotificationTestHelpers;

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
