<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\UploadedFile;

/**
 * @see memory-bank/decisions/ADR-16-illustrations-du-roman.md
 */
class LandscapeImage implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! $value instanceof UploadedFile) {
            return;
        }

        $dimensions = @getimagesize($value->getRealPath());

        if ($dimensions === false || $dimensions[0] <= $dimensions[1]) {
            $fail('validation.cover.image.landscape')->translate();
        }
    }
}
