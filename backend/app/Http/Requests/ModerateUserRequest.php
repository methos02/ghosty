<?php

namespace App\Http\Requests;

use App\Enums\ReportResolution;
use App\Enums\SanctionType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Config;
use Illuminate\Validation\Rule;

/**
 * @see memory-bank/decisions/ADR-17-profils-et-signalement-utilisateur.md
 */
final class ModerateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        $reasonMax = Config::integer('ghosty.moderation.reason_max_length');

        return [
            'resolution' => ['required', Rule::enum(ReportResolution::class)->only(ReportResolution::allowedForUser())],
            'sanction' => ['nullable', 'array', 'prohibited_if:resolution,'.ReportResolution::Dismissed->value],
            'sanction.type' => ['required_if:resolution,'.ReportResolution::Sanctioned->value, 'required_with:sanction', Rule::enum(SanctionType::class)],
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
            'sanction.prohibited_if' => __('validation.moderation.sanction.prohibited_for_dismissed_user'),
            'sanction.type.required_if' => __('validation.moderation.sanction.type.required_for_sanctioned_user'),
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
