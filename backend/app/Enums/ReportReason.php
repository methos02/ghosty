<?php

namespace App\Enums;

/**
 * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
 */
enum ReportReason: string
{
    case PoorQuality = 'poor_quality';
    case OffTopic = 'off_topic';
    case Plagiarism = 'plagiarism';
    case UnauthorizedIllustration = 'unauthorized_illustration';
    case Spam = 'spam';
    case HateSpeech = 'hate_speech';
    case Insult = 'insult';
    case Harassment = 'harassment';
    case PersonalAttack = 'personal_attack';
    case LikeManipulation = 'like_manipulation';
    case Illegal = 'illegal';
}
