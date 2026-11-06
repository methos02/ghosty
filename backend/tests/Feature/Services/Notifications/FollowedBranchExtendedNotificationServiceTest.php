<?php

namespace Tests\Feature\Services\Notifications;

use App\Enums\NotificationType;
use App\Models\Chapter;
use App\Models\Follow;
use App\Models\User;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class FollowedBranchExtendedNotificationServiceTest extends TestCase
{
    use NotificationTestHelpers;

    #[Test]
    public function a_continuation_deep_in_a_followed_branch_notifies_its_follower(): void
    {
        $root = Chapter::factory()->create();
        $head = Chapter::factory()->continuing($root)->create();
        $tail = Chapter::factory()->continuing($head)->create();
        $follower = User::factory()->create();
        Follow::factory()->by($follower)->on($head)->create();

        $continuation = $this->continueWith($tail, User::factory()->create());

        $notification = $this->notificationsOf($follower, NotificationType::FollowedBranchExtended)->sole();
        $this->assertSame($continuation->id, data_get($notification->data, 'chapter.id'));
        $this->assertSame($root->novel->slug, data_get($notification->data, 'novel.slug'));
        $this->assertSame(1, $notification->data['count']);
    }

    #[Test]
    public function a_continuation_beside_the_followed_branch_notifies_nobody(): void
    {
        $root = Chapter::factory()->create();
        $head = Chapter::factory()->continuing($root)->create();
        $sibling = Chapter::factory()->continuing($root)->create();
        $follower = User::factory()->create();
        Follow::factory()->by($follower)->on($head)->create();

        $this->continueWith($sibling, User::factory()->create());

        $this->assertCount(0, $this->notificationsOf($follower, NotificationType::FollowedBranchExtended));
    }

    #[Test]
    public function the_follower_who_writes_the_continuation_is_not_notified(): void
    {
        $head = Chapter::factory()->create();
        $follower = User::factory()->create();
        Follow::factory()->by($follower)->on($head)->create();

        $this->continueWith($head, $follower);

        $this->assertCount(0, $this->notificationsOf($follower, NotificationType::FollowedBranchExtended));
    }

    #[Test]
    public function the_author_of_the_parent_following_the_branch_is_only_told_once(): void
    {
        $head = Chapter::factory()->create();
        Follow::factory()->by($head->author)->on($head)->create();

        $this->continueWith($head, User::factory()->create());

        $this->assertCount(0, $this->notificationsOf($head->author, NotificationType::FollowedBranchExtended));
        $this->assertCount(1, $this->notificationsOf($head->author, NotificationType::ChapterContinued));
    }

    #[Test]
    public function successive_continuations_of_a_followed_novel_gather_in_a_single_unread_notification(): void
    {
        $root = Chapter::factory()->create();
        $follower = User::factory()->create();
        Follow::factory()->by($follower)->on($root)->create();

        $first = $this->continueWith($root, User::factory()->create());
        $second = $this->continueWith($first, User::factory()->create());

        $notification = $this->notificationsOf($follower, NotificationType::FollowedBranchExtended)->sole();
        $this->assertSame([$first->id, $second->id], data_get($notification->data, 'chapters.*.id'));
        $this->assertSame(2, $notification->data['count']);
    }

    #[Test]
    public function a_draft_continuation_does_not_notify_the_followers(): void
    {
        $head = Chapter::factory()->create();
        $follower = User::factory()->create();
        Follow::factory()->by($follower)->on($head)->create();

        $this->continueWith($head, User::factory()->create(), asDraft: true);

        $this->assertCount(0, $this->notificationsOf($follower, NotificationType::FollowedBranchExtended));
    }
}
