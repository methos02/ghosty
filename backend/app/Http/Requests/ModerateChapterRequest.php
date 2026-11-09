<?php

namespace App\Http\Requests;

use App\Enums\ReportResolution;
use App\Enums\SanctionType;
use App\Helpers\RouteBindingHelper;
use App\Rules\PassageRemovalOnly;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Config;
use Illuminate\Validation\Rule;

/**
 * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
 */
class ModerateChapterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(RouteBindingHelper $routeBinding): array
    {
        $chapter = $routeBinding->chapter($this);
        $reasonMax = Config::integer('ghosty.moderation.reason_max_length');

        return [
            'resolution' => ['required', Rule::enum(ReportResolution::class)->only(ReportResolution::allowedForChapter($chapter))],
            'content' => ['exclude_unless:resolution,'.ReportResolution::PassageRemoved->value, 'required', 'string', new PassageRemovalOnly($chapter->content)],
            'sanction' => ['nullable', 'array'],
            'sanction.type' => ['required_with:sanction', Rule::enum(SanctionType::class)],
            'sanction.days' => ['nullable', 'integer', 'min:1', 'max:'.Config::integer('ghosty.moderation.sanction_max_days')],
            'sanction.reason' => ['required_with:sanction.type', 'string', "max:{$reasonMax}"],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'resolution.required' => __('validation.moderation.resolution.required'),
            'resolution.enum' => __('validation.moderation.resolution.enum'),
            'content.required' => __('validation.moderation.content.required'),
            'sanction.type.required_with' => __('validation.moderation.sanction.type.required'),
            'sanction.type.enum' => __('validation.moderation.sanction.type.enum'),
            'sanction.days.integer' => __('validation.moderation.sanction.days.integer'),
            'sanction.days.min' => __('validation.moderation.sanction.days.min'),
            'sanction.days.max' => __('validation.moderation.sanction.days.max'),
            'sanction.reason.required_with' => __('validation.moderation.sanction.reason.required'),
            'sanction.reason.max' => __('validation.moderation.sanction.reason.max'),
        ];
    }
}
