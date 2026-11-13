<?php

namespace Database\Seeders;

use App\Models\Chapter;
use App\Models\Comment;
use App\Models\NovelCover;
use App\Models\User;
use App\Repositories\ReportRepository;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

/**
 * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
 */
class ReportSeeder extends Seeder
{
    public function run(ReportRepository $reportsR): void
    {
        /** @var list<array{reporter: string, chapter?: string, comment?: string, cover?: array{novel: string, author: string}, reason: string, description: string}> $reports */
        $reports = File::json(database_path('data/reports.json'));

        foreach ($reports as $report) {
            $reportsR->create(
                $this->reporter($report['reporter'])->id,
                $this->reportable($report),
                $report['reason'],
                $report['description']
            );
        }
    }

    /**
     * @param  array{chapter?: string, comment?: string, cover?: array{novel: string, author: string}}  $report
     */
    private function reportable(array $report): Chapter|Comment|NovelCover
    {
        if (isset($report['cover'])) {
            return $this->cover($report['cover']);
        }

        if (isset($report['comment'])) {
            return Comment::query()
                ->whereLike('content', $report['comment'].'%')
                ->firstOrFail();
        }

        return Chapter::query()
            ->where('title', $report['chapter'] ?? '')
            ->firstOrFail();
    }

    /**
     * @param  array{novel: string, author: string}  $cover
     */
    private function cover(array $cover): NovelCover
    {
        return NovelCover::query()
            ->whereRelation('novel', 'title', $cover['novel'])
            ->whereRelation('author', 'username', $cover['author'])
            ->firstOrFail();
    }

    private function reporter(string $username): User
    {
        return User::query()
            ->where('username', $username)
            ->firstOrFail();
    }
}
