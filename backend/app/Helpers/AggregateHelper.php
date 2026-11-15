<?php

namespace App\Helpers;

final class AggregateHelper
{
    public static function toInteger(mixed $aggregate): int
    {
        return is_numeric($aggregate) ? (int) $aggregate : 0;
    }
}
