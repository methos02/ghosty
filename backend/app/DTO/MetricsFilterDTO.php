<?php

namespace App\DTO;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Config;

final readonly class MetricsFilterDTO
{
    public function __construct(
        public int $days
    ) {}

    public static function fromRequest(FormRequest $request): self
    {
        return new self(
            days: $request->filled('days')
                ? $request->integer('days')
                : Config::integer('ghosty.metrics.default_days'),
        );
    }
}
