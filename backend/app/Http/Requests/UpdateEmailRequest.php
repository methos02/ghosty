<?php

namespace App\Http\Requests;

use App\Helpers\CurrentUserHelper;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @see memory-bank/decisions/ADR-20-identite-et-gestion-du-compte.md
 */
final class UpdateEmailRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(CurrentUserHelper $currentUserHelper): array
    {
        return [
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($currentUserHelper->id())],
            'current_password' => ['required', 'string', 'current_password:sanctum'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.required' => __('validation.account.email.required'),
            'email.email' => __('validation.account.email.email'),
            'email.max' => __('validation.account.email.email'),
            'email.unique' => __('validation.account.email.unique'),
            'current_password.required' => __('validation.account.current_password.required'),
            'current_password.string' => __('validation.account.current_password.required'),
            'current_password.current_password' => __('validation.account.current_password.current_password'),
        ];
    }
}
