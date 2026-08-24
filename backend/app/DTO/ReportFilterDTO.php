<?php

namespace App\DTO;

use App\Enums\ReportReason;
use App\Enums\ReportStatus;
use Illuminate\Http\Request;

final readonly class ReportFilterDTO
{
    public function __construct(
        public ?ReportStatus $status = null,
        public ?ReportReason $reason = null
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            status: ReportStatus::tryFrom($request->integer('status')),
            reason: ReportReason::tryFrom($request->string('reason')->toString()),
        );
    }
}
