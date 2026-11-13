<?php

namespace App\Services;

use App\DTO\NovelCoverDTO;
use App\Models\Novel;
use App\Models\NovelCover;
use App\Models\User;
use App\Repositories\LikeRepository;
use App\Repositories\NovelCoverRepository;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use LogicException;

/**
 * @see memory-bank/decisions/ADR-16-illustrations-du-roman.md
 */
class CoverService
{
    private const DIRECTORY = 'covers';

    public function __construct(
        private readonly NovelCoverRepository $novelCoversR,
        private readonly LikeRepository $likesR,
        private readonly UserRepository $usersR,
        private readonly OfficialCoverService $officialCoverService
    ) {}

    public function create(Novel $novel, User $author, NovelCoverDTO $novelCoverDTO): NovelCover
    {
        $imagePath = $this->store($novel->id, $novelCoverDTO);

        $cover = DB::transaction(function () use ($novel, $author, $imagePath): NovelCover {
            $cover = $this->novelCoversR->create([
                'novel_id' => $novel->id,
                'author_id' => $author->id,
                'image_path' => $imagePath,
                'status' => NovelCover::STATUS_PUBLISHED,
            ]);

            $this->usersR->addRole($author, User::ROLE_ILLUSTRATOR);

            return $cover;
        });

        $this->officialCoverService->update($novel->id, $author->id);

        return $cover;
    }

    public function replaceImage(NovelCover $cover, NovelCoverDTO $novelCoverDTO): NovelCover
    {
        $previousImagePath = $cover->image_path;
        $imagePath = $this->store($cover->novel_id, $novelCoverDTO);

        DB::transaction(function () use ($cover, $imagePath): void {
            $this->likesR->deleteAllOnLikeable($cover);
            $this->novelCoversR->resetLikeCount($cover);
            $this->novelCoversR->update($cover, ['image_path' => $imagePath]);
        });

        Storage::disk(NovelCover::DISK)->delete($previousImagePath);
        $this->officialCoverService->update($cover->novel_id, $cover->author_id);

        return $cover->refresh();
    }

    public function hide(NovelCover $cover): void
    {
        $this->novelCoversR->update($cover, ['status' => NovelCover::STATUS_HIDDEN]);
        $this->officialCoverService->update($cover->novel_id, null);
    }

    public function restore(NovelCover $cover): void
    {
        $this->novelCoversR->update($cover, ['status' => NovelCover::STATUS_PUBLISHED]);
        $this->officialCoverService->update($cover->novel_id, null);
    }

    private function store(int $novelId, NovelCoverDTO $novelCoverDTO): string
    {
        $imagePath = $novelCoverDTO->image->store(self::DIRECTORY.'/'.$novelId, NovelCover::DISK);

        if ($imagePath === false) {
            throw new LogicException('The cover image could not be stored.');
        }

        return $imagePath;
    }
}
