<?php

namespace App\DTO;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;
use LogicException;

/**
 * @see memory-bank/decisions/ADR-16-illustrations-du-roman.md
 */
final readonly class NovelCoverDTO
{
    public function __construct(
        public UploadedFile $image
    ) {}

    public static function fromRequest(FormRequest $request): self
    {
        $image = $request->file('image');

        if (! $image instanceof UploadedFile) {
            throw new LogicException('A validated cover request carries one uploaded image.');
        }

        return new self($image);
    }
}
