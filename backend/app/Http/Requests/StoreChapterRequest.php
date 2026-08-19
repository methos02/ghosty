<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Config;

class StoreChapterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, string>
     */
    public function rules(): array
    {
        $titleMin = Config::integer('ghosty.chapters.title_min_length');
        $titleMax = Config::integer('ghosty.chapters.title_max_length');

        return [
            'parent_id' => 'required|integer|exists:chapters,id',
            'title' => "required|string|min:{$titleMin}|max:{$titleMax}",
            'content' => 'required|string',
            'summary' => 'required|string|max:'.Config::integer('ghosty.chapters.summary_max_length'),
            'is_draft' => 'sometimes|boolean',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'parent_id.required' => __('validation.chapter.parent.required'),
            'parent_id.exists' => __('validation.chapter.parent.exists'),
            'title.required' => __('validation.chapter.title.required'),
            'title.min' => __('validation.chapter.title.min'),
            'content.required' => __('validation.chapter.content.required'),
            'summary.required' => __('validation.chapter.summary.required'),
            'summary.max' => __('validation.chapter.summary.max'),
        ];
    }
}
