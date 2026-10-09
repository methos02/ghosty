<?php

namespace App\Http\Requests;

use App\Enums\ReportReason;
use App\Enums\ReportStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReportFilterRequest extends FormRequest
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
        return [
            'status' => ['nullable', Rule::enum(ReportStatus::class)],
            'reason' => ['nullable', Rule::enum(ReportReason::class)],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'status.enum' => __('validation.report_filter.status.enum'),
            'reason.enum' => __('validation.report.reason.enum'),
        ];
    }
}
