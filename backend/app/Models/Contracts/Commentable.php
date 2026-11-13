<?php

namespace App\Models\Contracts;

use App\Models\Chapter;
use App\Models\Novel;
use App\Models\NovelCover;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * @see memory-bank/decisions/ADR-13-commentaires.md
 *
 * @phpstan-require-extends Model
 *
 * @phpstan-sealed Chapter|Novel|NovelCover
 *
 * @property-read int $id
 * @property-read int $author_id
 * @property-read User $author
 * @property-read int $comment_count
 */
interface Commentable extends AuthoredContent
{
    public function isOpenToComments(): bool;
}
