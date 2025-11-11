<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pseudo' => 'required|string|min:3|max:50|unique:users,pseudo',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ];
    }

    public function messages(): array
    {
        return [
            'pseudo.required' => __('validation.register.pseudo.required'),
            'pseudo.min' => __('validation.register.pseudo.min'),
            'pseudo.unique' => __('validation.register.pseudo.unique'),
            'email.required' => __('validation.register.email.required'),
            'email.email' => __('validation.register.email.email'),
            'email.unique' => __('validation.register.email.unique'),
            'password.required' => __('validation.register.password.required'),
            'password.min' => __('validation.register.password.min'),
            'password.confirmed' => __('validation.register.password.confirmed'),
        ];
    }
}
