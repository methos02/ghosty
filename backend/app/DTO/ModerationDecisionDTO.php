<?php

namespace App\DTO;

use App\Enums\ReportResolution;
use Illuminate\Foundation\Http\FormRequest;

/**
 * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
 */
final readonly class ModerationDecisionDTO
{
    public function __construct(
        public ReportResolution $resolution,
        public ?string $contentAfterRemoval = null,
        public ?SanctionDTO $sanction = null
    ) {}

    public static function fromRequest(FormRequest $request): self
    {
        return new self(
            resolution: ReportResolution::from($request->string('resolution')->toString()),
            contentAfterRemoval: $request->filled('content') ? $request->string('content')->toString() : null,
            sanction: SanctionDTO::fromRequest($request),
        );
    }
}
