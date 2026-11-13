<?php

namespace App\Http\Requests;

use App\Rules\LandscapeImage;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Config;
use Illuminate\Validation\Rule;

/**
 * @see memory-bank/decisions/ADR-16-illustrations-du-roman.md
 */
final class StoreCoverRequest extends FormRequest
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
            'image' => [
                'required',
                'file',
                'mimes:jpg,jpeg,png,webp',
                'max:'.Config::integer('ghosty.covers.max_size_kb'),
                Rule::dimensions()
                    ->minWidth(Config::integer('ghosty.covers.min_width'))
                    ->minHeight(Config::integer('ghosty.covers.min_height'))
                    ->maxWidth(Config::integer('ghosty.covers.max_width'))
                    ->maxHeight(Config::integer('ghosty.covers.max_height')),
                new LandscapeImage,
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'image.required' => __('validation.cover.image.required'),
            'image.file' => __('validation.cover.image.required'),
            'image.mimes' => __('validation.cover.image.mimes'),
            'image.max' => __('validation.cover.image.max'),
            'image.dimensions' => __('validation.cover.image.dimensions'),
        ];
    }
}
