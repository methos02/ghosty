<?php

namespace App\DTO;

use Illuminate\Foundation\Http\FormRequest;

final readonly class ChapterDTO
{
    public function __construct(
        public string $title,
        public string $content,
        public ?string $summary = null,
        public bool $asDraft = false
    ) {}

    public static function fromRequest(FormRequest $request, bool $addPrefix = false): self
    {
        $prefix = $addPrefix ? 'chapter.' : '';

        return new self(
            title: $request->string($prefix.'title')->toString(),
            content: $request->string($prefix.'content')->toString(),
            summary: $request->filled($prefix.'summary') ? $request->string($prefix.'summary')->toString() : null,
            asDraft: $request->boolean($prefix.'is_draft'),
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function attributes(): array
    {
        return [
            'title' => $this->title,
            'content' => $this->content,
            'summary' => $this->summary,
        ];
    }
}
