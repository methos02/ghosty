<?php

namespace Tests\Feature\Api\V1\WorkController;

use App\Models\Novel;
use App\Models\Work;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class WorkControllerIndexTest extends TestCase
{
    private string $route = '/api/v1/works';

    #[Test]
    public function returns_chapter_filtered_by_novel_slug_order_and_type(): void
    {
        $novel = Novel::factory()->create(['slug' => 'mon-roman']);
        $chapter = Work::factory()->create([
            'novel_id' => $novel->id,
            'title' => 'Chapitre 1',
            'content' => 'Le contenu du premier chapitre.',
            'order' => 1,
            'type' => Work::TYPE_CHAPTER,
        ]);

        $otherNovel = Novel::factory()->create(['slug' => 'autre-roman']);
        Work::factory()->create(['novel_id' => $otherNovel->id, 'order' => 1]);

        $response = $this->getJson("{$this->route}?novel_slug=mon-roman&order=1&type=1");

        $response->assertOk();
        $response->assertJsonCount(1, 'works');
        $response->assertJsonPath('works.0.id', $chapter->id);
        $response->assertJsonPath('works.0.novel_id', $novel->id);
        $response->assertJsonPath('works.0.title', 'Chapitre 1');
        $response->assertJsonPath('works.0.content', 'Le contenu du premier chapitre.');
        $response->assertJsonPath('works.0.order', 1);
        $response->assertJsonPath('works.0.type', Work::TYPE_CHAPTER);
    }

    #[Test]
    public function excludes_covers_when_filtering_on_chapter_type(): void
    {
        $novel = Novel::factory()->create(['slug' => 'roman-mixte']);
        Work::factory()->create(['novel_id' => $novel->id, 'order' => 1, 'type' => Work::TYPE_CHAPTER]);
        Work::factory()->create(['novel_id' => $novel->id, 'order' => 1, 'type' => Work::TYPE_COVER]);

        $response = $this->getJson("{$this->route}?novel_slug=roman-mixte&type=1");

        $response->assertOk();
        $response->assertJsonCount(1, 'works');
        $response->assertJsonPath('works.0.type', Work::TYPE_CHAPTER);
    }
}
