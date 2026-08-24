<?php

namespace Database\Factories;

use App\Enums\ReportReason;
use App\Enums\ReportResolution;
use App\Enums\ReportStatus;
use App\Models\Chapter;
use App\Models\Report;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;

/**
 * @extends Factory<Report>
 */
class ReportFactory extends Factory
{
    protected $model = Report::class;

    public function definition(): array
    {
        return [
            'reporter_id' => UserFactory::new(),
            'reportable_type' => (new Chapter)->getMorphClass(),
            'reportable_id' => ChapterFactory::new(),
            'reason' => ReportReason::PoorQuality,
            'description' => fake()->sentence(),
            'status' => ReportStatus::Pending,
        ];
    }

    public function on(Model $reportable): static
    {
        return $this->state(fn () => [
            'reportable_type' => $reportable->getMorphClass(),
            'reportable_id' => $reportable->getKey(),
        ]);
    }

    public function processed(ReportResolution $resolution = ReportResolution::Dismissed): static
    {
        return $this->state(fn () => ['status' => ReportStatus::Processed])
            ->afterMaking(fn (Report $report) => $report->forceFill([
                'resolution' => $resolution,
                'processed_at' => now(),
            ]));
    }
}
