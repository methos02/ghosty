<?php

namespace App\Http\Resources;

use App\Models\Chapter;
use App\Models\Comment;
use App\Models\Report;
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
            'report_count' => $this->reportCount(),
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

        if ($reportable instanceof Chapter) {
            return [
                'chapter' => new ChapterListResource($reportable),
                'comment' => null,
            ];
        }

        if ($reportable instanceof Comment) {
            return [
                'chapter' => null,
                'comment' => new ModeratedCommentResource($reportable),
            ];
        }

        throw new LogicException(sprintf('Report on %s %d targets an unsupported content.', $this->reportable_type, $this->reportable_id));
    }

    private function reportCount(): int
    {
        $reportCount = $this->getAttribute('report_count');

        return is_numeric($reportCount) ? (int) $reportCount : 0;
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
