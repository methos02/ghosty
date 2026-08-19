<?php

namespace App\Http\Requests;

use App\Repositories\NovelRepository;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Config;

class UpdateNovelRequest extends FormRequest
{
    public function authorize(NovelRepository $novelsR): bool
    {
        $novel = $novelsR->findBySlug($this->route('slug'));

        return $this->user()?->can('update', $novel) ?? false;
    }

    /**
     * @return array<string, string>
     */
    public function rules(): array
    {
        $titleMin = Config::integer('ghosty.chapters.title_min_length');
        $titleMax = Config::integer('ghosty.chapters.title_max_length');

        return [
            'title' => "required|string|min:{$titleMin}|max:{$titleMax}",
            'genre_id' => 'required|integer|exists:genres,id',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => __('validation.novel.title.required'),
            'title.min' => __('validation.novel.title.min'),
            'genre_id.required' => __('validation.novel.genre.required'),
            'genre_id.exists' => __('validation.novel.genre.exists'),
        ];
    }
}
