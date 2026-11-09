<?php

namespace Database\Seeders;

use App\Models\Chapter;
use App\Models\Comment;
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
        /** @var list<array{reporter: string, chapter?: string, comment?: string, reason: string, description: string}> $reports */
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
     * @param  array{chapter?: string, comment?: string}  $report
     */
    private function reportable(array $report): Chapter|Comment
    {
        if (isset($report['comment'])) {
            return Comment::query()
                ->whereLike('content', $report['comment'].'%')
                ->firstOrFail();
        }

        return Chapter::query()
            ->where('title', $report['chapter'] ?? '')
            ->firstOrFail();
    }

    private function reporter(string $username): User
    {
        return User::query()
            ->where('username', $username)
            ->firstOrFail();
    }
}
