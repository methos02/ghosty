<?php

namespace App\Enums;

/**
 * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
 */
enum ReportStatus: int
{
    case Pending = 1;
    case Processed = 2;
}
