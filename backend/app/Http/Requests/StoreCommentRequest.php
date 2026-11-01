<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Config;

class StoreCommentRequest extends FormRequest
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
            'content' => ['required', 'string', 'max:'.Config::integer('ghosty.comments.content_max_length')],
            'is_spoiler' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'content.required' => __('validation.comment.content.required'),
            'content.string' => __('validation.comment.content.string'),
            'content.max' => __('validation.comment.content.max'),
            'is_spoiler.boolean' => __('validation.comment.is_spoiler.boolean'),
        ];
    }
}
