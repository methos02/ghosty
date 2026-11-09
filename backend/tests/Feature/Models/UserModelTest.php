<?php

namespace Tests\Feature\Models;

use App\Enums\SanctionType;
use App\Models\Sanction;
use App\Models\User;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class UserModelTest extends TestCase
{
    #[Test]
    public function a_user_without_sanction_is_free_to_act(): void
    {
        $user = User::factory()->create();

        $this->assertFalse($user->isBanned());
        $this->assertFalse($user->isWriteBanned());
        $this->assertFalse($user->isCommentBanned());
    }

    #[Test]
    public function an_account_ban_blocks_every_action(): void
    {
        $user = User::factory()->banned()->create();

        $this->assertTrue($user->isBanned());
        $this->assertTrue($user->isWriteBanned());
        $this->assertTrue($user->isCommentBanned());
    }

    #[Test]
    public function a_targeted_ban_blocks_only_its_action(): void
    {
        $user = User::factory()->banned(SanctionType::CommentBan)->create();

        $this->assertFalse($user->isBanned());
        $this->assertFalse($user->isWriteBanned());
        $this->assertTrue($user->isCommentBanned());
    }

    #[Test]
    public function a_warning_blocks_nothing(): void
    {
        $user = User::factory()->banned(SanctionType::Warning)->create();

        $this->assertFalse($user->isBanned());
        $this->assertFalse($user->isWriteBanned());
        $this->assertFalse($user->isCommentBanned());
    }

    #[Test]
    public function an_expired_ban_no_longer_applies(): void
    {
        $user = User::factory()
            ->has(Sanction::factory()->expired(), 'sanctions')
            ->create();

        $this->assertFalse($user->isBanned());
        $this->assertNull($user->accountBan());
    }

    #[Test]
    public function the_account_ban_returned_is_the_permanent_one_first(): void
    {
        $user = User::factory()->create();
        Sanction::factory()->for($user)->create(['until' => now()->addMonth()]);
        $permanent = Sanction::factory()->for($user)->permanent()->create();

        $this->assertSame($permanent->id, $user->accountBan()?->id);
    }

    #[Test]
    public function the_account_ban_returned_is_the_latest_ending_one(): void
    {
        $user = User::factory()->create();
        Sanction::factory()->for($user)->create(['until' => now()->addDay()]);
        $longest = Sanction::factory()->for($user)->create(['until' => now()->addMonth()]);

        $this->assertSame($longest->id, $user->accountBan()?->id);
    }

    #[Test]
    public function a_moderator_or_an_admin_can_moderate(): void
    {
        $this->assertTrue(User::factory()->moderator()->create()->canModerate());
        $this->assertTrue(User::factory()->admin()->create()->canModerate());
    }

    #[Test]
    public function a_reader_cannot_moderate(): void
    {
        $this->assertFalse(User::factory()->create()->canModerate());
    }

    #[Test]
    public function a_banned_moderator_cannot_moderate(): void
    {
        $this->assertFalse(User::factory()->moderator()->banned()->create()->canModerate());
    }
}
