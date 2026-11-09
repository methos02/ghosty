<?php

namespace App\Http\Resources;

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
            'resolution' => $this->resolution?->value,
            'processed_at' => $this->processed_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
