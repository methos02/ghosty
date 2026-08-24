<?php

namespace App\Enums;

/**
 * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
 */
enum ReportResolution: string
{
    case Dismissed = 'dismissed';
    case Hidden = 'hidden';
    case Archived = 'archived';
    case Removed = 'removed';
    case Sanction = 'sanction';
}
