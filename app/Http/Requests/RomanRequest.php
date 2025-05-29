<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RomanRequest extends FormRequest
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
    public function rules()
    {
        $req = $this->input('update_roman') == 'publier' ? 'required|' : 'nullable|';
        $req_cover = $this->hasFile('cover')? 'required|' : 'nullable|';

        return [
            'titre_roman' => $req . 'string',
            'titre_chapitre' => $req . $req . 'string',
            'recit' => $req . 'string',
            'resume' => $req . 'string|max:500',
            'cover' => 'image|mimes:jpeg,jpg|max:2000|nullable',
            'name_cover' => $req_cover . 'integer',
            'x' => $req_cover . 'numeric',
            'y' => $req_cover . 'numeric',
            'height' => $req_cover . 'numeric',
            'width' => $req_cover . 'numeric',
        ];
    }
}
