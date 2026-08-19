<?php

namespace App\DTO;

use Illuminate\Http\Request;

final readonly class DraftFilterDTO
{
    public function __construct(
        public ?int $parentId = null,
        public ?bool $isRoot = null
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            parentId: $request->filled('parent_id') ? $request->integer('parent_id') : null,
            isRoot: $request->filled('is_root') ? $request->boolean('is_root') : null,
        );
    }
}
