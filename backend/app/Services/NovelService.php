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

    public function create(User $author, NovelDTO $datas, ChapterDTO $origin): Novel
    {
        return DB::transaction(function () use ($author, $datas, $origin) {
            $novel = $this->novelsR->create([
                ...$datas->attributes(),
                'author_id' => $author->id,
            ]);

            $this->chapterService->create($novel, $author, $origin);

            return $novel;
        });
    }

    public function update(Novel $novel, NovelDTO $datas): Novel
    {
        return $this->novelsR->update($novel, $datas->attributes());
    }
}
