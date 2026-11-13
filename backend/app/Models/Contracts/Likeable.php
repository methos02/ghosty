<?php

namespace App\Models\Contracts;

use App\Models\Chapter;
use App\Models\NovelCover;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
 *
 * @phpstan-require-extends Model
 *
 * @phpstan-sealed Chapter|NovelCover
 *
 * @property-read int $id
 * @property-read int $author_id
 * @property-read User $author
 * @property-read int $like_count
 */
interface Likeable extends AuthoredContent {}
