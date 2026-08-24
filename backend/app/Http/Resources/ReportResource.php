<?php

namespace App\Http\Resources;

use App\Models\Chapter;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Report
 */
class ReportResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reason' => $this->reason->value,
            'description' => $this->description,
            'status' => $this->status->value,
            'reporter' => [
                'id' => $this->reporter_id,
                'username' => $this->whenLoaded('reporter', fn () => $this->reporter->username),
            ],
            'reported' => [
                'type' => $this->reportable_type,
                'id' => $this->reportable_id,
                'title' => $this->whenLoaded('reportable', fn () => $this->reportedTitle()),
            ],
            'moderator_id' => $this->moderator_id,
            'resolution' => $this->resolution?->value,
            'processed_at' => $this->processed_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }

    private function reportedTitle(): ?string
    {
        if ($this->reportable instanceof Chapter) {
            return $this->reportable->title;
        }

        return null;
    }
}
