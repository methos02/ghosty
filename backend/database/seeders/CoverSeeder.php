<?php

namespace Database\Seeders;

use App\DTO\NovelCoverDTO;
use App\Models\Novel;
use App\Models\User;
use App\Services\CoverLikeService;
use App\Services\CoverService;
use Illuminate\Database\Seeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;

/**
 * @see memory-bank/decisions/ADR-16-illustrations-du-roman.md
 */
class CoverSeeder extends Seeder
{
    private const DEMO_IMAGES_DIRECTORY = 'images/covers';

    public function run(CoverService $coverService, CoverLikeService $coverLikeService): void
    {
        /** @var list<array{novel: string, author: string, image: string, likers: list<string>}> $covers */
        $covers = File::json(database_path('data/covers.json'));

        foreach ($covers as $cover) {
            $created = $coverService->create(
                $this->novel($cover['novel']),
                $this->user($cover['author']),
                new NovelCoverDTO($this->demoImage($cover['image']))
            );

            foreach ($cover['likers'] as $liker) {
                $coverLikeService->like($this->user($liker), $created, null);
            }
        }
    }

    private function demoImage(string $fileName): UploadedFile
    {
        return new UploadedFile(public_path(self::DEMO_IMAGES_DIRECTORY.'/'.$fileName), $fileName, test: true);
    }

    private function novel(string $title): Novel
    {
        return Novel::query()
            ->where('title', $title)
            ->firstOrFail();
    }

    private function user(string $username): User
    {
        return User::query()
            ->where('username', $username)
            ->firstOrFail();
    }
}
