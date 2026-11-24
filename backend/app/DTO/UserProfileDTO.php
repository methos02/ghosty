<?php

namespace App\DTO;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;

/**
 * @see memory-bank/decisions/ADR-20-identite-et-gestion-du-compte.md
 */
final readonly class UserProfileDTO
{
    /**
     * @param  array<string, mixed>  $sentFields
     */
    public function __construct(
        private array $sentFields,
        public ?UploadedFile $avatar
    ) {}

    public static function fromRequest(FormRequest $request): self
    {
        $avatar = $request->file('image');

        return new self(
            collect($request->validated())->except('image')->all(),
            $avatar instanceof UploadedFile ? $avatar : null
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function attributes(): array
    {
        return $this->sentFields;
    }
}
