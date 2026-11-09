<?php

namespace App\DTO;

use App\Enums\SanctionType;
use Illuminate\Foundation\Http\FormRequest;

/**
 * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
 */
final readonly class SanctionDTO
{
    public function __construct(
        public SanctionType $type,
        public string $reason,
        public ?int $days = null
    ) {}

    public static function fromRequest(FormRequest $request): ?self
    {
        if (! $request->filled('sanction.type')) {
            return null;
        }

        return new self(
            type: SanctionType::from($request->string('sanction.type')->toString()),
            reason: $request->string('sanction.reason')->trim()->toString(),
            days: $request->filled('sanction.days') ? $request->integer('sanction.days') : null,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function attributes(): array
    {
        return [
            'type' => $this->type,
            'reason' => $this->reason,
        ];
    }
}
