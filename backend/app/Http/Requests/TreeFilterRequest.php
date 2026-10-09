<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TreeFilterRequest extends FormRequest
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
            'from' => ['nullable', 'integer'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'from.integer' => __('validation.tree_filter.from.integer'),
        ];
    }
}
