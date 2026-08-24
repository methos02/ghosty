<?php

namespace App\Support;

use App\Models\Novel;

final class CoverUrlSupport
{
    private const DIRECTORY = 'images/covers';

    private const PREFIX = 'cover_default';

    public static function forNovel(Novel $novel): string
    {
        return $novel->cover_url ?? self::forGenreSlug($novel->genre->slug);
    }

    public static function forGenreSlug(?string $slug): string
    {
        $path = self::DIRECTORY.'/'.self::PREFIX.'_'.$slug.'.jpg';

        if ($slug === null || ! file_exists(public_path($path))) {
            $path = self::DIRECTORY.'/'.self::PREFIX.'.jpg';
        }

        return asset($path);
    }
}
