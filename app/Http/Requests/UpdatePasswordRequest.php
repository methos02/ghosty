<?php

namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePasswordRequest extends FormRequest
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
            'new_password_1' => 'required|different:password|alpha_num',
            'new_password_2' => 'required|same:new_password_1',
            'password' => 'required',
        ];
    }
}