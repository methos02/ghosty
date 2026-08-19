<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Config;

/**
 * @see memory-bank/decisions/ADR-11-chapitre-publie-non-reecrivable.md
 */
class LimitedTextChange implements ValidationRule
{
    public function __construct(
        private readonly string $published
    ) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $published = self::split($this->published);
        $corrected = self::split(is_string($value) ? $value : '');

        if ($this->exceedsAllowance($published, $corrected, self::allowanceFor($this->published))) {
            $fail('validation.chapter.proofreading.too_many')->translate();
        }
    }

    public static function allowanceFor(string $text): int
    {
        $words = count(self::split($text));
        $percent = Config::integer('ghosty.chapters.proofreading.max_changed_percent');
        $minimum = Config::integer('ghosty.chapters.proofreading.min_changed_words');

        return max($minimum, intdiv($words * $percent, 100));
    }

    /**
     * @return list<string>
     */
    private static function split(string $text): array
    {
        $words = preg_split('/\s+/u', mb_strtolower(trim($text)), -1, PREG_SPLIT_NO_EMPTY);

        return $words === false ? [] : $words;
    }

    /**
     * Les mots communs en tete et en queue ne pesent rien dans la distance :
     * d(a.x.b, a.y.b) vaut d(x, y). Les retirer reduit le tableau a comparer.
     *
     * @param  list<string>  $published
     * @param  list<string>  $corrected
     * @return array{0: list<string>, 1: list<string>}
     */
    private static function trimCommonEnds(array $published, array $corrected): array
    {
        $publishedCount = count($published);
        $correctedCount = count($corrected);
        $shortest = min($publishedCount, $correctedCount);

        $head = 0;
        while ($head < $shortest && $published[$head] === $corrected[$head]) {
            $head++;
        }

        $tail = 0;
        while (
            $tail < $shortest - $head
            && $published[$publishedCount - 1 - $tail] === $corrected[$correctedCount - 1 - $tail]
        ) {
            $tail++;
        }

        return [
            array_slice($published, $head, $publishedCount - $head - $tail),
            array_slice($corrected, $head, $correctedCount - $head - $tail),
        ];
    }

    /**
     * Distance d'edition de Levenshtein bornee a $allowance : seules les cases
     * situees a moins de $allowance de la diagonale peuvent appartenir a un
     * chemin acceptable, le reste du tableau n'est jamais calcule.
     *
     * @param  list<string>  $published
     * @param  list<string>  $corrected
     */
    private function exceedsAllowance(array $published, array $corrected, int $allowance): bool
    {
        [$published, $corrected] = self::trimCommonEnds($published, $corrected);

        $publishedCount = count($published);
        $correctedCount = count($corrected);

        if (abs($publishedCount - $correctedCount) > $allowance) {
            return true;
        }

        $unreachable = $allowance + 1;
        $previous = range(0, min($correctedCount, $allowance));

        for ($row = 1; $row <= $publishedCount; $row++) {
            $first = max(1, $row - $allowance);
            $last = min($correctedCount, $row + $allowance);
            $current = [$first - 1 => $first === 1 ? min($row, $unreachable) : $unreachable];

            for ($column = $first; $column <= $last; $column++) {
                $cost = $published[$row - 1] === $corrected[$column - 1] ? 0 : 1;
                $current[$column] = min(
                    ($previous[$column] ?? $unreachable) + 1,
                    $current[$column - 1] + 1,
                    ($previous[$column - 1] ?? $unreachable) + $cost,
                    $unreachable
                );
            }

            $previous = $current;
        }

        return ($previous[$correctedCount] ?? $unreachable) > $allowance;
    }
}
