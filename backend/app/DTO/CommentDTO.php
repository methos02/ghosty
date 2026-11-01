<?php

namespace App\DTO;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @see memory-bank/decisions/ADR-13-commentaires.md
 */
final readonly class CommentDTO
{
    public function __construct(
        public string $content,
        public bool $isSpoiler = false
    ) {}

    public static function fromRequest(FormRequest $request): self
    {
        return new self(
            content: $request->string('content')->trim()->toString(),
            isSpoiler: $request->boolean('is_spoiler'),
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function attributes(): array
    {
        return [
            'content' => $this->content,
            'is_spoiler' => $this->isSpoiler,
        ];
    }
}
