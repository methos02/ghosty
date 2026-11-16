<?php

namespace App\Repositories;

use App\Helpers\AggregateHelper;
use App\Models\Chapter;
use App\Models\ChapterRead;
use App\Models\Comment;
use App\Models\Follow;
use App\Models\Like;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;

/**
 * @see memory-bank/decisions/ADR-18-indicateurs-du-mvp.md
 */
class MetricsRepository
{
    private const READER = 'coalesce(cast(chapter_reads.user_id as char), chapter_reads.session_key)';

    private const OUTSIDE_MAIN_BRANCH = 'main_branch_last_chapters.id is not null'
        .' and substr(main_branch_last_chapters.path, 1, length(chapters.path)) <> chapters.path'
        .' and substr(chapters.path, 1, length(main_branch_last_chapters.path)) <> main_branch_last_chapters.path';

    /**
     * @return array{active: int, returning: int, alternate_branch: int}
     */
    public function readerCountsSince(CarbonInterface $since): array
    {
        $readers = $this->readsSince($since)
            ->join('novels', 'novels.id', '=', 'chapters.novel_id')
            ->leftJoin('chapters as main_branch_last_chapters', 'main_branch_last_chapters.id', '=', 'novels.main_branch_last_chapter_id')
            ->selectRaw(self::READER.' as reader')
            ->selectRaw('count(distinct date(chapter_reads.created_at)) as active_days')
            ->selectRaw('max(case when '.self::OUTSIDE_MAIN_BRANCH.' then 1 else 0 end) as has_read_alternate_branch')
            ->groupByRaw(self::READER);

        $counts = ChapterRead::query()
            ->fromSub($readers, 'readers')
            ->selectRaw('count(*) as active_count')
            ->selectRaw('sum(case when active_days >= 2 then 1 else 0 end) as returning_count')
            ->selectRaw('sum(has_read_alternate_branch) as alternate_branch_count')
            ->toBase()
            ->first();

        return [
            'active' => AggregateHelper::toInteger($counts?->active_count),
            'returning' => AggregateHelper::toInteger($counts?->returning_count),
            'alternate_branch' => AggregateHelper::toInteger($counts?->alternate_branch_count),
        ];
    }

    /**
     * @return array{started: int, completed: int}
     */
    public function novelReadingCountsSince(CarbonInterface $since): array
    {
        $novelReadings = $this->readsSince($since)
            ->selectRaw(self::READER.' as reader')
            ->addSelect('chapters.novel_id')
            ->selectRaw('max(case when chapters.status = ? and chapters.continuations_count = 0 then 1 else 0 end) as has_reached_branch_end', [Chapter::STATUS_PUBLISHED])
            ->groupByRaw(self::READER.', chapters.novel_id');

        $counts = ChapterRead::query()
            ->fromSub($novelReadings, 'novel_readings')
            ->selectRaw('count(*) as started_count')
            ->selectRaw('sum(has_reached_branch_end) as completed_count')
            ->toBase()
            ->first();

        return [
            'started' => AggregateHelper::toInteger($counts?->started_count),
            'completed' => AggregateHelper::toInteger($counts?->completed_count),
        ];
    }

    /**
     * @return array{publishing: int, returning: int}
     */
    public function publishingAuthorCountsSince(CarbonInterface $since): array
    {
        $publishedSince = Chapter::query()
            ->where('published_at', '>=', $since);

        $returningAuthors = $publishedSince->clone()
            ->whereExists(
                Chapter::query()
                    ->from('chapters as earlier_chapters')
                    ->selectRaw('1')
                    ->whereColumn('earlier_chapters.author_id', 'chapters.author_id')
                    ->whereColumn('earlier_chapters.published_at', '<', 'chapters.published_at')
                    ->toBase()
            );

        return [
            'publishing' => $publishedSince->distinct()->count('author_id'),
            'returning' => $returningAuthors->distinct()->count('author_id'),
        ];
    }

    /**
     * @return array{published: int, continued: int}
     */
    public function continuationCountsPublishedSince(CarbonInterface $since): array
    {
        $continuations = Chapter::query()
            ->continuations()
            ->where('published_at', '>=', $since);

        return [
            'published' => $continuations->clone()->count(),
            'continued' => $continuations->hasChildren()->count(),
        ];
    }

    /**
     * @return array{existing: int, extended: int}
     */
    public function branchCountsExtendedSince(CarbonInterface $since): array
    {
        $branches = Chapter::query()
            ->published()
            ->hasChildren();

        $extendedBranches = $branches->clone()
            ->whereIn(
                'id',
                Chapter::query()
                    ->select('parent_id')
                    ->published()
                    ->where('published_at', '>=', $since)
            );

        return [
            'existing' => $branches->count(),
            'extended' => $extendedBranches->count(),
        ];
    }

    /**
     * @return array{published: int, inactive: int}
     */
    public function inactiveContinuationCountsPublishedBefore(CarbonInterface $before): array
    {
        $continuations = Chapter::query()
            ->published()
            ->continuations()
            ->where('published_at', '<', $before);

        $inactiveContinuations = $continuations->clone()
            ->where('like_count', 0)
            ->where('comment_count', 0)
            ->where('continuations_count', 0);

        return [
            'published' => $continuations->count(),
            'inactive' => $inactiveContinuations->count(),
        ];
    }

    public function branchFollowerCount(): int
    {
        return Follow::query()
            ->distinct()
            ->count('user_id');
    }

    public function commentCountSince(CarbonInterface $since): int
    {
        return Comment::query()
            ->where('created_at', '>=', $since)
            ->count();
    }

    public function likeCountSince(CarbonInterface $since): int
    {
        return Like::query()
            ->where('created_at', '>=', $since)
            ->count();
    }

    /**
     * @return Builder<ChapterRead>
     */
    private function readsSince(CarbonInterface $since): Builder
    {
        return ChapterRead::query()
            ->join('chapters', 'chapters.id', '=', 'chapter_reads.chapter_id')
            ->where('chapter_reads.created_at', '>=', $since);
    }
}
