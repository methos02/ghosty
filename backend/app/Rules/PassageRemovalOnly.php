<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Config;
use LogicException;

/**
 * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
 */
class PassageRemovalOnly implements ValidationRule
{
    public function __construct(
        private readonly string $original
    ) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $contentAfterRemoval = is_string($value) ? $value : '';
        $marker = Config::string('ghosty.moderation.removed_passage_marker');

        if ($marker === '') {
            throw new LogicException('ghosty.moderation.removed_passage_marker must not be empty.');
        }

        $fragments = explode($marker, $contentAfterRemoval);

        if (! $this->keepsOriginalFragmentsInOrder($fragments)) {
            $fail('validation.moderation.content.altered')->translate();

            return;
        }

        if (! $this->removesText($fragments, $marker)) {
            $fail('validation.moderation.content.nothing_removed')->translate();
        }
    }

    /**
     * @param  list<string>  $fragments
     */
    private function keepsOriginalFragmentsInOrder(array $fragments): bool
    {
        $offset = 0;

        foreach ($fragments as $fragment) {
            if ($fragment === '') {
                continue;
            }

            $position = strpos($this->original, $fragment, $offset);

            if ($position === false) {
                return false;
            }

            $offset = $position + strlen($fragment);
        }

        return true;
    }

    /**
     * @param  list<string>  $fragments
     */
    private function removesText(array $fragments, string $marker): bool
    {
        $keptLength = array_sum(array_map('strlen', $fragments));
        $originalTextLength = strlen($this->original) - substr_count($this->original, $marker) * strlen($marker);

        return count($fragments) > substr_count($this->original, $marker) + 1
            && $keptLength < $originalTextLength;
    }
}
