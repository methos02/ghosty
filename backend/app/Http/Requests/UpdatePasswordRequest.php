<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @see memory-bank/decisions/ADR-20-identite-et-gestion-du-compte.md
 */
final class UpdatePasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'current_password' => ['required', 'string', 'current_password:sanctum'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'current_password.required' => __('validation.account.current_password.required'),
            'current_password.string' => __('validation.account.current_password.required'),
            'current_password.current_password' => __('validation.account.current_password.current_password'),
            'password.required' => __('validation.account.password.required'),
            'password.string' => __('validation.account.password.required'),
            'password.min' => __('validation.account.password.min'),
            'password.confirmed' => __('validation.account.password.confirmed'),
        ];
    }
}
