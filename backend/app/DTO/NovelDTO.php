<?php

namespace App\DTO;

use App\Http\Requests\StoreNovelRequest;
use Illuminate\Foundation\Http\FormRequest;

final readonly class NovelDTO
{
    public function __construct(
        public string $title,
        public int $genreId
    ) {}

    public static function fromRequest(FormRequest $request): self
    {
        return new self(
            title: $request->string('title')->toString(),
            genreId: $request->integer('genre_id'),
        );
    }

    public static function fromNovelCreation(StoreNovelRequest $request): self
    {
        return new self(
            title: $request->string('novel.title')->toString(),
            genreId: $request->integer('novel.genre_id'),
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
