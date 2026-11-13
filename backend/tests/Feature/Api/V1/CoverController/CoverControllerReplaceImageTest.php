<?php

namespace Tests\Feature\Api\V1\CoverController;

use App\Enums\SanctionType;
use App\Http\Controllers\Api\V1\CoverController;
use App\Http\Requests\StoreCoverRequest;
use App\Models\Comment;
use App\Models\Like;
use App\Models\Novel;
use App\Models\NovelCover;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CoverControllerReplaceImageTest extends TestCase
{
    private User $illustrator;

    private NovelCover $cover;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
        Storage::disk('public')->put('covers/1/ancienne.jpg', 'ancienne');
        $this->illustrator = User::factory()->create();
        $this->cover = NovelCover::factory()->by($this->illustrator)->create(['image_path' => 'covers/1/ancienne.jpg']);
    }

    private function route(NovelCover $cover): string
    {
        return "/api/v1/covers/{$cover->id}/image";
    }

    private function landscape(): UploadedFile
    {
        return UploadedFile::fake()->image('nouvelle.jpg', 1600, 900);
    }

    #[Test]
    public function uses_the_form_request(): void
    {
        $this->assertTrue($this->hasFormRequest(CoverController::class, 'replaceImage', StoreCoverRequest::class));
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(CoverController::class.'@replaceImage');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum', 'can:update,cover'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->postJson($this->route($this->cover), ['image' => $this->landscape()])->assertUnauthorized();
    }

    #[Test]
    public function replaces_the_image_and_deletes_the_previous_file(): void
    {
        $this->actingAs($this->illustrator)
            ->postJson($this->route($this->cover), ['image' => $this->landscape()])
            ->assertOk()
            ->assertJsonPath('cover.id', $this->cover->id);

        $newPath = $this->cover->refresh()->image_path;
        $this->assertNotSame('covers/1/ancienne.jpg', $newPath);
        Storage::disk('public')->assertExists($newPath);
        Storage::disk('public')->assertMissing('covers/1/ancienne.jpg');
    }

    #[Test]
    public function the_replaced_proposal_loses_all_its_likes(): void
    {
        $this->cover->forceFill(['like_count' => 2])->save();
        Like::factory()->count(2)->on($this->cover)->create();

        $this->actingAs($this->illustrator)
            ->postJson($this->route($this->cover), ['image' => $this->landscape()])
            ->assertOk()
            ->assertJsonPath('cover.like_count', 0);

        $this->assertDatabaseMissing('likes', [
            'likeable_type' => 'novel_cover',
            'likeable_id' => $this->cover->id,
        ]);
    }

    #[Test]
    public function the_replaced_proposal_keeps_its_comments(): void
    {
        Comment::factory()->on($this->cover)->create();

        $this->actingAs($this->illustrator)
            ->postJson($this->route($this->cover), ['image' => $this->landscape()])
            ->assertOk()
            ->assertJsonPath('cover.comment_count', 1);
    }

    #[Test]
    public function losing_its_likes_hands_the_official_cover_to_the_most_liked_rival(): void
    {
        $novel = $this->cover->novel;
        $rival = NovelCover::factory()->on($novel)->liked(1)->create();
        $this->cover->forceFill(['like_count' => 3])->save();
        $novel->forceFill(['official_cover_id' => $this->cover->id])->save();

        $this->actingAs($this->illustrator)
            ->postJson($this->route($this->cover), ['image' => $this->landscape()])
            ->assertOk()
            ->assertJsonPath('official_cover_id', $rival->id);

        $this->assertSame($rival->id, Novel::query()->findOrFail($novel->id)->official_cover_id);
    }

    #[Test]
    public function refuses_another_contributor(): void
    {
        $this->actingAs(User::factory()->create())
            ->postJson($this->route($this->cover), ['image' => $this->landscape()])
            ->assertForbidden();
    }

    #[Test]
    public function refuses_a_write_banned_author(): void
    {
        $banned = User::factory()->banned(SanctionType::WriteBan)->create();
        $cover = NovelCover::factory()->by($banned)->create();

        $this->actingAs($banned)
            ->postJson($this->route($cover), ['image' => $this->landscape()])
            ->assertForbidden();
    }

    #[Test]
    public function refuses_a_proposal_hidden_by_moderation(): void
    {
        $hidden = NovelCover::factory()->by($this->illustrator)->hidden()->create();

        $this->actingAs($this->illustrator)
            ->postJson($this->route($hidden), ['image' => $this->landscape()])
            ->assertForbidden();
    }

    #[Test]
    public function requires_an_image(): void
    {
        $this->actingAs($this->illustrator)
            ->postJson($this->route($this->cover), [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['image' => __('validation.cover.image.required')]);
    }
}
