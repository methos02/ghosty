<?php

namespace App\Http\Requests;

use App\Enums\NotificationType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @see memory-bank/decisions/ADR-20-identite-et-gestion-du-compte.md
 */
final class UpdateNotificationPreferencesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'notifications_enabled' => ['required', 'boolean'],
            'disabled_notification_types' => ['present', 'array'],
            'disabled_notification_types.*' => ['string', 'distinct', Rule::in(NotificationType::optionalValues())],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'notifications_enabled.required' => __('validation.account.notifications_enabled.boolean'),
            'notifications_enabled.boolean' => __('validation.account.notifications_enabled.boolean'),
            'disabled_notification_types.present' => __('validation.account.disabled_notification_types.array'),
            'disabled_notification_types.array' => __('validation.account.disabled_notification_types.array'),
            'disabled_notification_types.*.string' => __('validation.account.disabled_notification_types.in'),
            'disabled_notification_types.*.distinct' => __('validation.account.disabled_notification_types.in'),
            'disabled_notification_types.*.in' => __('validation.account.disabled_notification_types.in'),
        ];
    }
}
