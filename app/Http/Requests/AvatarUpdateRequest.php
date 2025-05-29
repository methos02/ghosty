<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AvatarUpdateRequest extends FormRequest
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
        return [
            'avatar' => 'required|image|mimes:jpeg,jpg|max:2000',
            'x' => 'required|numeric',
            'y' => 'required|numeric',
            'height' => 'required|numeric',
            'width' => 'required|numeric'
        ];
    }
}
