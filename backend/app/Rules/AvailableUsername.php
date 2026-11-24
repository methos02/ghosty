<?php

namespace App\Rules;

use App\Repositories\UserRepository;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * @see memory-bank/decisions/ADR-20-identite-et-gestion-du-compte.md
 */
class AvailableUsername implements ValidationRule
{
    public function __construct(
        private readonly UserRepository $usersR,
        private readonly ?int $ownerId = null
    ) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value)) {
            return;
        }

        if ($this->usersR->isUsernameTaken($value, $this->ownerId)) {
            $fail('validation.username.unique')->translate();
        }
    }
}
