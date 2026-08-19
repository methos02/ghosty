<?php

namespace App\Http\Requests;

use App\Models\Chapter;
use App\Repositories\ChapterRepository;
use App\Rules\LimitedTextChange;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Config;

/**
 * @see memory-bank/decisions/ADR-11-chapitre-publie-non-reecrivable.md
 */
class UpdateChapterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(ChapterRepository $chaptersR): array
    {
        $chapter = $chaptersR->find((int) $this->route('chapter'));

        if ($chapter->isDraft()) {
            return $this->draftRules();
        }

        return $this->correctionRules($chapter);
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => __('validation.chapter.title.required'),
            'title.min' => __('validation.chapter.title.min'),
            'content.required' => __('validation.chapter.content.required'),
            'summary.required' => __('validation.chapter.summary.required'),
            'summary.max' => __('validation.chapter.summary.max'),
        ];
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    private function draftRules(): array
    {
        $titleMin = Config::integer('ghosty.chapters.title_min_length');
        $titleMax = Config::integer('ghosty.chapters.title_max_length');

        return [
            'title' => ['required', 'string', "min:{$titleMin}", "max:{$titleMax}"],
            'content' => ['required', 'string'],
            'summary' => ['required', 'string', 'max:'.Config::integer('ghosty.chapters.summary_max_length')],
        ];
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    private function correctionRules(Chapter $published): array
    {
        return [
            'title' => ['required', 'string', new LimitedTextChange($published->title)],
            'content' => ['required', 'string', new LimitedTextChange($published->content)],
            'summary' => ['required', 'string', new LimitedTextChange($published->summary ?? '')],
        ];
    }
}
