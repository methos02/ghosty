<?php

namespace App\DTO;

use Illuminate\Http\Request;

final readonly class TreeFilterDTO
{
    public function __construct(
        public ?int $fromChapterId = null
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            fromChapterId: $request->filled('from') ? $request->integer('from') : null,
        );
    }
}
