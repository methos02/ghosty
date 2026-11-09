<?php

namespace Tests\Feature\Rules;

use App\Rules\PassageRemovalOnly;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Validator;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PassageRemovalOnlyTest extends TestCase
{
    private const ORIGINAL = 'Il ouvrit la porte. Une insulte gratuite ici. Puis il sortit.';

    private string $marker;

    protected function setUp(): void
    {
        parent::setUp();

        $this->marker = Config::string('ghosty.moderation.removed_passage_marker');
    }

    private function error(string $original, string $contentAfterRemoval): ?string
    {
        return Validator::make(
            ['content' => $contentAfterRemoval],
            ['content' => [new PassageRemovalOnly($original)]]
        )->errors()->first('content') ?: null;
    }

    #[Test]
    public function accepts_a_passage_replaced_by_the_marker(): void
    {
        $contentAfterRemoval = "Il ouvrit la porte. {$this->marker} Puis il sortit.";

        $this->assertNull($this->error(self::ORIGINAL, $contentAfterRemoval));
    }

    #[Test]
    public function accepts_several_passages_replaced_by_the_marker(): void
    {
        $contentAfterRemoval = "{$this->marker} la porte. {$this->marker} Puis il sortit.";

        $this->assertNull($this->error(self::ORIGINAL, $contentAfterRemoval));
    }

    #[Test]
    public function refuses_added_text(): void
    {
        $contentAfterRemoval = "Il ouvrit la porte. {$this->marker} Puis il sortit en riant.";

        $this->assertSame(__('validation.moderation.content.altered'), $this->error(self::ORIGINAL, $contentAfterRemoval));
    }

    #[Test]
    public function refuses_modified_text(): void
    {
        $contentAfterRemoval = "Il ferma la porte. {$this->marker} Puis il sortit.";

        $this->assertSame(__('validation.moderation.content.altered'), $this->error(self::ORIGINAL, $contentAfterRemoval));
    }

    #[Test]
    public function refuses_reordered_passages(): void
    {
        $contentAfterRemoval = "Puis il sortit. {$this->marker} Il ouvrit la porte.";

        $this->assertSame(__('validation.moderation.content.altered'), $this->error(self::ORIGINAL, $contentAfterRemoval));
    }

    #[Test]
    public function refuses_a_marker_inserted_without_removing_anything(): void
    {
        $contentAfterRemoval = "Il ouvrit la porte.{$this->marker} Une insulte gratuite ici. Puis il sortit.";

        $this->assertSame(__('validation.moderation.content.nothing_removed'), $this->error(self::ORIGINAL, $contentAfterRemoval));
    }

    #[Test]
    public function refuses_a_text_without_marker(): void
    {
        $this->assertSame(__('validation.moderation.content.nothing_removed'), $this->error(self::ORIGINAL, self::ORIGINAL));
    }

    #[Test]
    public function refuses_a_passage_removed_without_marker(): void
    {
        $this->assertSame(
            __('validation.moderation.content.altered'),
            $this->error(self::ORIGINAL, 'Il ouvrit la porte. Puis il sortit.')
        );
    }

    #[Test]
    public function accepts_a_new_removal_on_a_text_already_cut(): void
    {
        $original = "Il ouvrit la porte. {$this->marker} Une autre insulte. Puis il sortit.";
        $contentAfterRemoval = "Il ouvrit la porte. {$this->marker} {$this->marker} Puis il sortit.";

        $this->assertNull($this->error($original, $contentAfterRemoval));
    }

    #[Test]
    public function refuses_a_text_already_cut_sent_back_unchanged(): void
    {
        $original = "Il ouvrit la porte. {$this->marker} Puis il sortit.";

        $this->assertSame(__('validation.moderation.content.nothing_removed'), $this->error($original, $original));
    }

    #[Test]
    public function refuses_a_previous_marker_moved_instead_of_a_new_removal(): void
    {
        $original = "Il ouvrit la porte. {$this->marker} Puis il sortit.";
        $contentAfterRemoval = "{$this->marker} Il ouvrit la porte. Puis il sortit.";

        $this->assertSame(__('validation.moderation.content.altered'), $this->error($original, $contentAfterRemoval));
    }
}
