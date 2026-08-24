<?php

namespace Tests\Feature\Rules;

use App\Rules\LimitedTextChange;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Validator;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class LimitedTextChangeTest extends TestCase
{
    private function fails(string $published, string $corrected): bool
    {
        return Validator::make(
            ['content' => $corrected],
            ['content' => [new LimitedTextChange($published)]]
        )->fails();
    }

    /**
     * @return list<string>
     */
    private function sentence(int $words, string $prefix = 'mot'): array
    {
        return array_map(fn (int $index) => $prefix.$index, range(1, $words));
    }

    #[Test]
    public function counts_words_not_characters(): void
    {
        Config::set('ghosty.chapters.correction.min_changed_words', 1);

        $this->assertFalse($this->fails('le chat dort', 'le chien dort'));
        $this->assertTrue($this->fails('le chat dort', 'le chien court'));
    }

    #[Test]
    public function ignores_case_and_repeated_spaces(): void
    {
        Config::set('ghosty.chapters.correction.min_changed_words', 0);

        $this->assertFalse($this->fails('Le chat  dort', "le    CHAT\ndort"));
    }

    #[Test]
    public function accepts_a_correction_sitting_exactly_on_the_allowance(): void
    {
        Config::set('ghosty.chapters.correction.min_changed_words', 2);

        $published = implode(' ', $this->sentence(50));
        $corrected = str_replace(['mot10 ', 'mot20 '], ['autre10 ', 'autre20 '], $published.' ');

        $this->assertFalse($this->fails($published, trim($corrected)));
    }

    #[Test]
    public function refuses_one_change_beyond_the_allowance(): void
    {
        Config::set('ghosty.chapters.correction.min_changed_words', 2);

        $published = implode(' ', $this->sentence(50));
        $corrected = str_replace(
            ['mot10 ', 'mot20 ', 'mot30 '],
            ['autre10 ', 'autre20 ', 'autre30 '],
            $published.' '
        );

        $this->assertTrue($this->fails($published, trim($corrected)));
    }

    #[Test]
    public function refuses_a_length_gap_wider_than_the_allowance_without_scanning(): void
    {
        Config::set('ghosty.chapters.correction.min_changed_words', 3);

        $published = implode(' ', $this->sentence(200));
        $corrected = implode(' ', $this->sentence(100));

        $this->assertTrue($this->fails($published, $corrected));
    }

    #[Test]
    public function stays_fast_on_a_long_chapter(): void
    {
        $published = implode(' ', $this->sentence(4000));
        $corrected = str_replace('mot2000 ', 'autre2000 ', $published.' ');

        $start = microtime(true);
        $failed = $this->fails($published, trim($corrected));
        $elapsed = microtime(true) - $start;

        $this->assertFalse($failed);
        $this->assertLessThan(2, $elapsed, 'la distance bornee doit rester loin du cout quadratique');
    }

    #[Test]
    public function keeps_counting_changes_sitting_at_both_ends(): void
    {
        Config::set('ghosty.chapters.correction.min_changed_words', 1);

        $published = implode(' ', $this->sentence(40));
        $corrected = $published;
        $corrected = str_replace('mot1 ', 'autre1 ', $corrected);
        $corrected = str_replace(' mot40', ' autre40', $corrected);

        $this->assertTrue($this->fails($published, $corrected));
    }

    #[Test]
    public function refuses_to_fill_a_field_the_published_chapter_left_empty(): void
    {
        $summary = implode(' ', $this->sentence(40, 'resume'));

        $this->assertTrue($this->fails('', $summary));
    }

    #[Test]
    public function still_accepts_a_short_addition_within_the_floor(): void
    {
        $this->assertFalse($this->fails('', 'un resume tres court'));
    }
}
