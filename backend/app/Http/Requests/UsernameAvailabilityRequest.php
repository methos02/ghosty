<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @see memory-bank/decisions/ADR-20-identite-et-gestion-du-compte.md
 */
final class UsernameAvailabilityRequest extends FormRequest
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
            'username' => ['required', 'string'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'username.required' => __('validation.account.username.required'),
            'username.string' => __('validation.account.username.required'),
        ];
    }
}
