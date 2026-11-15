<?php

namespace App\Models\Contracts;

use App\Models\Chapter;
use App\Models\Comment;
use App\Models\NovelCover;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
 * @see memory-bank/decisions/ADR-17-profils-et-signalement-utilisateur.md
 *
 * @phpstan-require-extends Model
 *
 * @phpstan-sealed Chapter|Comment|NovelCover|User
 *
 * @property-read int $id
 */
interface Reportable extends NotificationSubject
{
    public function reportedUser(): User;
}
