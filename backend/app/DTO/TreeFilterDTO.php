<?php

namespace App\DTO;

use Illuminate\Foundation\Http\FormRequest;

final readonly class TreeFilterDTO
{
    public function __construct(
        public ?int $fromChapterId = null
    ) {}

    public static function fromRequest(FormRequest $request): self
    {
        return new self(
            fromChapterId: $request->filled('from') ? $request->integer('from') : null,
        );
    }
}
