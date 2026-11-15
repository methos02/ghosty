<?php

namespace App\Http\Resources;

use App\Helpers\AggregateHelper;
use App\Models\Chapter;
use App\Models\Comment;
use App\Models\NovelCover;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;
use LogicException;

/**
 * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
 *
 * @mixin Report
 */
class ReportedContentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'type' => $this->reportable_type,
            'id' => $this->reportable_id,
            'report_count' => AggregateHelper::toInteger($this->getAttribute('report_count')),
            'reasons' => $this->reasons(),
            'first_reported_at' => $this->firstReportedAt(),
            ...$this->reportedContent(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function reportedContent(): array
    {
        $reportable = $this->reportable;

        return match (true) {
            $reportable instanceof Chapter => ['chapter' => new ChapterListResource($reportable)],
            $reportable instanceof Comment => ['comment' => new ModeratedCommentResource($reportable)],
            $reportable instanceof NovelCover => ['cover' => new CoverResource($reportable)],
            $reportable instanceof User => ['user' => new UserSummaryResource($reportable)],
            default => throw new LogicException(sprintf('Report on %s %d targets an unsupported content.', $this->reportable_type, $this->reportable_id)),
        };
    }

    /**
     * @return list<string>
     */
    private function reasons(): array
    {
        $reasons = $this->getAttribute('reasons');

        return is_string($reasons) ? explode(',', $reasons) : [];
    }

    private function firstReportedAt(): ?string
    {
        $firstReportedAt = $this->getAttribute('first_reported_at');

        return is_string($firstReportedAt) ? Carbon::parse($firstReportedAt)->toIso8601String() : null;
    }
}
