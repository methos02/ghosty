<?php

namespace App\Models\Contracts;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * @phpstan-require-extends Model
 *
 * @property-read int $id
 * @property-read int $author_id
 * @property-read User $author
 */
interface AuthoredContent extends NotificationSubject {}
