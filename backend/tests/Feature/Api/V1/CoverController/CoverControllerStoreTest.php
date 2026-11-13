<?php

namespace Tests\Feature\Api\V1\CoverController;

use App\Enums\SanctionType;
use App\Http\Controllers\Api\V1\CoverController;
use App\Http\Requests\StoreCoverRequest;
use App\Models\Chapter;
use App\Models\Novel;
use App\Models\NovelCover;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CoverControllerStoreTest extends TestCase
{
    private Novel $novel;

    private User $illustrator;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
        $this->novel = Chapter::factory()->create()->novel;
        $this->illustrator = User::factory()->create();
    }

    private function route(): string
    {
        return "/api/v1/novels/{$this->novel->slug}/covers";
    }

    private function landscape(): UploadedFile
    {
        return UploadedFile::fake()->image('couverture.jpg', 1600, 900);
    }

    #[Test]
    public function uses_the_form_request(): void
    {
        $this->assertTrue($this->hasFormRequest(CoverController::class, 'store', StoreCoverRequest::class));
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(CoverController::class.'@store');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(
            ['api', 'auth:sanctum', 'can:create,App\Models\NovelCover,novel'],
            $route->gatherMiddleware()
        );
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->postJson($this->route(), ['image' => $this->landscape()])->assertUnauthorized();
    }

    #[Test]
    public function stores_the_proposal_and_its_image(): void
    {
        $response = $this->actingAs($this->illustrator)
            ->postJson($this->route(), ['image' => $this->landscape()])
            ->assertCreated()
            ->assertJsonPath('cover.novel_id', $this->novel->id)
            ->assertJsonPath('cover.author.username', $this->illustrator->username)
            ->assertJsonPath('cover.like_count', 0)
            ->assertJsonPath('cover.is_liked', false);

        $cover = NovelCover::query()->sole();
        $this->assertSame($this->illustrator->id, $cover->author_id);
        $this->assertStringStartsWith("covers/{$this->novel->id}/", $cover->image_path);
        Storage::disk('public')->assertExists($cover->image_path);
        $response->assertJsonPath('cover.image_url', Storage::disk('public')->url($cover->image_path));
    }

    #[Test]
    public function the_first_proposal_becomes_the_official_cover(): void
    {
        $response = $this->actingAs($this->illustrator)
            ->postJson($this->route(), ['image' => $this->landscape()])
            ->assertCreated();

        $response->assertJsonPath('official_cover_id', $response->json('cover.id'));
        $this->assertDatabaseHas('novels', [
            'id' => $this->novel->id,
            'official_cover_id' => $response->json('cover.id'),
        ]);
    }

    #[Test]
    public function a_later_proposal_without_likes_does_not_replace_the_official_cover(): void
    {
        $official = NovelCover::factory()->on($this->novel)->create();
        $this->novel->forceFill(['official_cover_id' => $official->id])->save();

        $this->actingAs($this->illustrator)
            ->postJson($this->route(), ['image' => $this->landscape()])
            ->assertCreated()
            ->assertJsonPath('official_cover_id', $official->id);

        $this->assertDatabaseHas('novels', [
            'id' => $this->novel->id,
            'official_cover_id' => $official->id,
        ]);
    }

    #[Test]
    public function grants_the_illustrator_role(): void
    {
        $this->actingAs($this->illustrator)
            ->postJson($this->route(), ['image' => $this->landscape()])
            ->assertCreated();

        $this->assertTrue($this->illustrator->refresh()->hasRole(User::ROLE_ILLUSTRATOR));
    }

    #[Test]
    public function refuses_a_second_proposal_by_the_same_contributor(): void
    {
        NovelCover::factory()->on($this->novel)->by($this->illustrator)->create();

        $this->actingAs($this->illustrator)
            ->postJson($this->route(), ['image' => $this->landscape()])
            ->assertConflict()
            ->assertJsonPath('message', __('covers.already_proposed'));

        $this->assertDatabaseCount('novel_covers', 1);
    }

    #[Test]
    public function refuses_a_novel_whose_first_chapter_is_not_published(): void
    {
        $draftNovel = Chapter::factory()->draft()->create()->novel;

        $this->actingAs($this->illustrator)
            ->postJson("/api/v1/novels/{$draftNovel->slug}/covers", ['image' => $this->landscape()])
            ->assertForbidden();
    }

    #[Test]
    #[DataProvider('blockingBans')]
    public function refuses_a_banned_contributor(SanctionType $ban): void
    {
        $banned = User::factory()->banned($ban)->create();

        $this->actingAs($banned)
            ->postJson($this->route(), ['image' => $this->landscape()])
            ->assertForbidden();
    }

    /**
     * @return array<string, array{SanctionType}>
     */
    public static function blockingBans(): array
    {
        return [
            'write ban' => [SanctionType::WriteBan],
            'account ban' => [SanctionType::AccountBan],
        ];
    }

    #[Test]
    public function requires_an_image(): void
    {
        $this->actingAs($this->illustrator)
            ->postJson($this->route(), [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['image' => __('validation.cover.image.required')]);
    }

    #[Test]
    public function refuses_a_file_that_is_not_an_accepted_image(): void
    {
        $this->actingAs($this->illustrator)
            ->postJson($this->route(), ['image' => UploadedFile::fake()->create('couverture.pdf', 100, 'application/pdf')])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['image' => __('validation.cover.image.mimes')]);
    }

    #[Test]
    public function refuses_an_image_over_the_size_limit(): void
    {
        $tooHeavy = UploadedFile::fake()->image('couverture.jpg', 1600, 900)->size(5121);

        $this->actingAs($this->illustrator)
            ->postJson($this->route(), ['image' => $tooHeavy])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['image' => __('validation.cover.image.max', ['max' => 5120])]);
    }

    #[Test]
    public function refuses_an_image_below_the_minimum_dimensions(): void
    {
        $this->actingAs($this->illustrator)
            ->postJson($this->route(), ['image' => UploadedFile::fake()->image('couverture.jpg', 700, 400)])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['image' => __('validation.cover.image.dimensions')]);
    }

    #[Test]
    public function refuses_a_portrait_image(): void
    {
        $this->actingAs($this->illustrator)
            ->postJson($this->route(), ['image' => UploadedFile::fake()->image('couverture.jpg', 900, 1600)])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['image' => __('validation.cover.image.landscape')]);
    }
}
