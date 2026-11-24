<?php

namespace App\DTO;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @see memory-bank/decisions/ADR-20-identite-et-gestion-du-compte.md
 */
final readonly class NotificationPreferencesDTO
{
    /**
     * @param  array<int, string>  $disabledTypes
     */
    public function __construct(
        public bool $isEnabled,
        public array $disabledTypes
    ) {}

    public static function fromRequest(FormRequest $request): self
    {
        return new self(
            $request->boolean('notifications_enabled'),
            self::disabledTypesFrom($request)
        );
    }

    /**
     * @return array<int, string>
     */
    private static function disabledTypesFrom(FormRequest $request): array
    {
        $submittedTypes = $request->array('disabled_notification_types');
        $types = array_filter($submittedTypes, is_string(...));

        return array_values($types);
    }

    /**
     * @return array<string, mixed>
     */
    public function attributes(): array
    {
        return [
            'notifications_enabled' => $this->isEnabled,
            'disabled_notification_types' => $this->disabledTypes,
        ];
    }
}
