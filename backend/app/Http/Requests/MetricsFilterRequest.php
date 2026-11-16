<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Config;

final class MetricsFilterRequest extends FormRequest
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
            'days' => ['nullable', 'integer', 'min:1', 'max:'.Config::integer('ghosty.metrics.max_days')],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'days.integer' => __('validation.metrics_filter.days.integer'),
            'days.min' => __('validation.metrics_filter.days.min'),
            'days.max' => __('validation.metrics_filter.days.max'),
        ];
    }
}
