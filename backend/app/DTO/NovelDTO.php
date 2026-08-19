<?php

namespace App\DTO;

use Illuminate\Foundation\Http\FormRequest;

final readonly class NovelDTO
{
    public function __construct(
        public string $title,
        public int $genreId
    ) {}

    public static function fromRequest(FormRequest $request, bool $addPrefix = false): self
    {
        $prefix = $addPrefix ? 'novel.' : '';

        return new self(
            title: $request->string($prefix.'title')->toString(),
            genreId: $request->integer($prefix.'genre_id'),
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function attributes(): array
    {
        return [
            'title' => $this->title,
            'genre_id' => $this->genreId,
        ];
    }
}
