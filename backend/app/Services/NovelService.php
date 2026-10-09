<?php

namespace App\Services;

use App\DTO\ChapterDTO;
use App\DTO\NovelDTO;
use App\Models\Novel;
use App\Models\User;
use App\Repositories\NovelRepository;
use Illuminate\Support\Facades\DB;

class NovelService
{
    public function __construct(
        private readonly NovelRepository $novelsR,
        private readonly ChapterService $chapterService
    ) {}

    public function create(User $author, NovelDTO $novelDTO, ChapterDTO $chapterDTO): Novel
    {
        return DB::transaction(function () use ($author, $novelDTO, $chapterDTO) {
            $novel = $this->novelsR->create([
                ...$novelDTO->attributes(),
                'author_id' => $author->id,
            ]);

            $this->chapterService->create($novel, $author, $chapterDTO);

            return $novel;
        });
    }

    public function update(Novel $novel, NovelDTO $novelDTO): Novel
    {
        return $this->novelsR->update($novel, $novelDTO->attributes());
    }
}
