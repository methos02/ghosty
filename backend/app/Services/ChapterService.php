<?php

namespace App\Services;

use App\DTO\ChapterDTO;
use App\Models\Chapter;
use App\Models\Novel;
use App\Models\User;
use App\Repositories\ChapterRepository;
use App\Repositories\NovelRepository;
use Illuminate\Support\Facades\DB;

/**
 * @see memory-bank/decisions/ADR-07-modele-multivers-arbre-de-chapitres.md
 * @see memory-bank/decisions/ADR-11-chapitre-publie-non-reecrivable.md
 */
class ChapterService
{
    public function __construct(
        private readonly ChapterRepository $chaptersR,
        private readonly NovelRepository $novelsR
    ) {}

    public function create(Novel $novel, User $author, ChapterDTO $datas): Chapter
    {
        return DB::transaction(function () use ($novel, $author, $datas) {
            $chapter = $this->chaptersR->create($this->attributes($datas, $author, [
                'novel_id' => $novel->id,
                'parent_id' => null,
                'depth' => 0,
            ]));

            if (! $datas->asDraft) {
                $this->registerPublication($chapter, null);
            }

            return $this->withPath($chapter, Chapter::PATH_SEPARATOR);
        });
    }

    public function createChild(Chapter $parent, User $author, ChapterDTO $datas): Chapter
    {
        return DB::transaction(function () use ($parent, $author, $datas) {
            $chapter = $this->chaptersR->create($this->attributes($datas, $author, [
                'novel_id' => $parent->novel_id,
                'parent_id' => $parent->id,
                'depth' => $parent->depth + 1,
            ]));

            if (! $datas->asDraft) {
                $this->registerPublication($chapter, $parent);
            }

            return $this->withPath($chapter, $parent->path);
        });
    }

    public function publish(Chapter $chapter): Chapter
    {
        return DB::transaction(function () use ($chapter) {
            $published = $this->chaptersR->update($chapter, [
                'status' => Chapter::STATUS_PUBLISHED,
                'published_at' => now(),
            ]);

            $this->registerPublication($published, $this->chaptersR->parentOf($published));

            return $published;
        });
    }

    public function update(Chapter $chapter, ChapterDTO $datas): Chapter
    {
        if ($chapter->isDraft()) {
            return $this->chaptersR->update($chapter, $datas->attributes());
        }

        return $this->chaptersR->update($chapter, [
            ...$datas->attributes(),
            'corrected_at' => now(),
        ]);
    }

    public function delete(Chapter $chapter): void
    {
        DB::transaction(function () use ($chapter) {
            if (! $chapter->isRoot()) {
                $this->chaptersR->delete($chapter);

                return;
            }

            $this->chaptersR->deleteByNovel($chapter->novel_id);
            $this->novelsR->deleteById($chapter->novel_id);
        });
    }

    private function withPath(Chapter $chapter, string $prefix): Chapter
    {
        return $this->chaptersR->update($chapter, [
            'path' => $prefix.$chapter->id.Chapter::PATH_SEPARATOR,
        ]);
    }

    private function registerPublication(Chapter $chapter, ?Chapter $parent): void
    {
        $this->novelsR->incrementChapterCount($chapter->novel_id);

        if ($parent === null) {
            return;
        }

        $this->chaptersR->incrementChildrenCount($parent);
        $this->chaptersR->updateBranchLikeCount($chapter, $parent);
    }

    /**
     * @param  array<string, mixed>  $position
     * @return array<string, mixed>
     */
    private function attributes(ChapterDTO $datas, User $author, array $position): array
    {
        return [
            ...$position,
            ...$datas->attributes(),
            'author_id' => $author->id,
            'path' => '',
            'status' => $datas->asDraft ? Chapter::STATUS_DRAFT : Chapter::STATUS_PUBLISHED,
            'published_at' => $datas->asDraft ? null : now(),
        ];
    }
}
