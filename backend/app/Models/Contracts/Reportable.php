<?php

namespace App\Models\Contracts;

use App\Models\Chapter;
use App\Models\Comment;
use App\Models\NovelCover;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
 *
 * @phpstan-require-extends Model
 *
 * @phpstan-sealed Chapter|Comment|NovelCover
 *
 * @property-read int $id
 * @property-read int $author_id
 * @property-read User $author
 */
interface Reportable extends AuthoredContent {}
