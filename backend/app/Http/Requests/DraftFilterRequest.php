<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DraftFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'parent_id' => ['nullable', 'integer'],
            'is_root' => ['nullable', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'parent_id.integer' => __('validation.draft_filter.parent_id.integer'),
            'is_root.boolean' => __('validation.draft_filter.is_root.boolean'),
        ];
    }
}
