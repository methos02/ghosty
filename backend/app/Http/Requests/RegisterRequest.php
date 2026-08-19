<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
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
        return [
            'username' => 'required|string|min:3|max:50|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ];
    }

    public function messages(): array
    {
        return [
            'username.required' => __('validation.register.username.required'),
            'username.min' => __('validation.register.username.min'),
            'username.unique' => __('validation.register.username.unique'),
            'email.required' => __('validation.register.email.required'),
            'email.email' => __('validation.register.email.email'),
            'email.unique' => __('validation.register.email.unique'),
            'password.required' => __('validation.register.password.required'),
            'password.min' => __('validation.register.password.min'),
            'password.confirmed' => __('validation.register.password.confirmed'),
        ];
    }
}
