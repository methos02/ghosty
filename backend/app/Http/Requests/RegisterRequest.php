<?php

namespace App\Http\Requests;

use App\Repositories\UserRepository;
use App\Rules\AvailableUsername;
use Illuminate\Foundation\Http\FormRequest;

final class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @see memory-bank/decisions/ADR-20-identite-et-gestion-du-compte.md
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(UserRepository $usersR): array
    {
        return [
            'username' => ['required', 'string', 'min:3', 'max:50', 'not_regex:/^deleted-/i', new AvailableUsername($usersR)],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'username.required' => __('validation.register.username.required'),
            'username.min' => __('validation.register.username.min'),
            'username.max' => __('validation.username.max'),
            'username.not_regex' => __('validation.username.reserved'),
            'email.required' => __('validation.register.email.required'),
            'email.email' => __('validation.register.email.email'),
            'email.unique' => __('validation.register.email.unique'),
            'password.required' => __('validation.register.password.required'),
            'password.min' => __('validation.register.password.min'),
            'password.confirmed' => __('validation.register.password.confirmed'),
        ];
    }
}
