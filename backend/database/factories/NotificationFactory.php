<?php

namespace Database\Factories;

use App\Enums\NotificationType;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Notification>
 */
class NotificationFactory extends Factory
{
    protected $model = Notification::class;

    public function definition(): array
    {
        return [
            'type' => NotificationType::LikeReceived->value,
            'notifiable_type' => (new User)->getMorphClass(),
            'notifiable_id' => UserFactory::new(),
            'data' => ['count' => 1],
            'group_key' => NotificationType::LikeReceived->value.':chapter:'.Str::random(8),
        ];
    }

    public function to(User $recipient): static
    {
        return $this->state(fn () => [
            'notifiable_id' => $recipient->id,
        ]);
    }

    public function read(): static
    {
        return $this->state(fn () => [
            'read_at' => now(),
        ]);
    }
}
