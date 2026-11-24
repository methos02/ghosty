<?php

namespace App\Http\Requests;

use App\Helpers\CurrentUserHelper;
use App\Repositories\UserRepository;
use App\Rules\AvailableUsername;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Config;

/**
 * @see memory-bank/decisions/ADR-20-identite-et-gestion-du-compte.md
 */
final class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(UserRepository $usersR, CurrentUserHelper $currentUserHelper): array
    {
        return [
            'username' => ['sometimes', 'required', 'string', 'min:3', 'max:50', 'not_regex:/^deleted-/i', new AvailableUsername($usersR, $currentUserHelper->id())],
            'image' => ['sometimes', 'file', 'mimes:jpg,jpeg,png,webp', 'max:'.Config::integer('ghosty.avatars.max_size_kb')],
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
            'username.min' => __('validation.account.username.min'),
            'username.max' => __('validation.username.max'),
            'username.not_regex' => __('validation.username.reserved'),
            'image.file' => __('validation.account.avatar.required'),
            'image.mimes' => __('validation.account.avatar.mimes'),
            'image.max' => __('validation.account.avatar.max'),
        ];
    }
}
