<?php

namespace App\DTO;

use App\Http\Requests\StoreNovelRequest;
use Illuminate\Foundation\Http\FormRequest;

final readonly class ChapterDTO
{
    public function __construct(
        public string $title,
        public string $content,
        public ?string $summary = null,
        public bool $asDraft = false
    ) {}

    public static function fromRequest(FormRequest $request): self
    {
        return new self(
            title: $request->string('title')->toString(),
            content: $request->string('content')->toString(),
            summary: $request->filled('summary') ? $request->string('summary')->toString() : null,
            asDraft: $request->boolean('is_draft'),
        );
    }

    public static function fromNovelCreation(StoreNovelRequest $request): self
    {
        return new self(
            title: $request->string('chapter.title')->toString(),
            content: $request->string('chapter.content')->toString(),
            summary: $request->filled('chapter.summary') ? $request->string('chapter.summary')->toString() : null,
            asDraft: $request->boolean('chapter.is_draft'),
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
