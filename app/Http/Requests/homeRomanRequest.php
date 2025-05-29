<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class homeRomanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules() {
        return [
            'tri' => ['required', Rule::in(['top', 'last', 'random', 'populaire'])],
            'id_genre' => $this->input('id_genre') != 'all' ? 'exists:genres,slug' : '',
            'page' => ['required', Rule::in(['vote', 'continu'])]
        ];
    }
}
