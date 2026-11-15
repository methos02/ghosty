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

    /**
     * @see memory-bank/decisions/ADR-17-profils-et-signalement-utilisateur.md
     *
     * @return list<self>
     */
    public static function allowedForUser(): array
    {
        return [
            self::Spam,
            self::HateSpeech,
            self::Insult,
            self::Harassment,
            self::PersonalAttack,
            self::LikeManipulation,
            self::Illegal,
        ];
    }
}
