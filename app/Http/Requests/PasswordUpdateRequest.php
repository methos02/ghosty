<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Hash;

class PasswordUpdateRequest extends FormRequest
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
            'password' => 'required',
            'new_password_1' => 'required|same:new_password_2',
            'new_password_2' => 'required'
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator($validator)
    {
        // checks user current password
        // before making changes
        $validator->after(function ($validator) {
            if ( !Hash::check($this->password, $this->user()->password) ) {
                $validator->errors()->add('password', 'Your current password is incorrect.');
            }
        });
        return;
    }
}
