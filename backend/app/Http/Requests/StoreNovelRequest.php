<?php

namespace App\Http\Requests;

use App\Models\Novel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Config;

class StoreNovelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Novel::class) ?? false;
    }

    /**
     * @return array<string, string>
     */
    public function rules(): array
    {
        $titleMin = Config::integer('ghosty.chapters.title_min_length');
        $titleMax = Config::integer('ghosty.chapters.title_max_length');

        return [
            'novel.title' => "required|string|min:{$titleMin}|max:{$titleMax}",
            'novel.genre_id' => 'required|integer|exists:genres,id',
            'chapter.title' => "required|string|min:{$titleMin}|max:{$titleMax}",
            'chapter.content' => 'required|string',
            'chapter.summary' => 'required|string|max:'.Config::integer('ghosty.chapters.summary_max_length'),
            'chapter.is_draft' => 'sometimes|boolean',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'novel.title.required' => __('validation.novel.title.required'),
            'novel.title.min' => __('validation.novel.title.min'),
            'novel.genre_id.required' => __('validation.novel.genre.required'),
            'novel.genre_id.exists' => __('validation.novel.genre.exists'),
            'chapter.title.required' => __('validation.chapter.title.required'),
            'chapter.title.min' => __('validation.chapter.title.min'),
            'chapter.content.required' => __('validation.chapter.content.required'),
            'chapter.summary.required' => __('validation.chapter.summary.required'),
            'chapter.summary.max' => __('validation.chapter.summary.max'),
        ];
    }
}
