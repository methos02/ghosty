<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @property-read User $author
 * @property-read Novel $novel
 * @property int $id
 * @property int $novel_id
 * @property int|null $parent_id
 * @property int $author_id
 * @property string $title
 * @property string $content
 * @property string|null $summary
 * @property string $path
 * @property int $depth
 * @property int $continuations_count
 * @property int $like_count
 * @property int $branch_like_count
 * @property int $comment_count
 * @property int $read_count
 * @property int $status
 * @property \Illuminate\Support\Carbon|null $published_at
 * @property \Illuminate\Support\Carbon|null $corrected_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Chapter> $children
 * @property-read int|null $children_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Like> $likes
 * @property-read int|null $likes_count
 * @property-read Chapter|null $parent
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Report> $reports
 * @property-read int|null $reports_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Like> $viewerLikes
 * @property-read int|null $viewer_likes_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter drafts()
 * @method static \Database\Factories\ChapterFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter hasChildren()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter published()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter roots()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter whereAuthorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter whereBranchLikeCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter whereCommentCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter whereContinuationsCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter whereCorrectedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter whereDepth($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter whereLikeCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter whereNovelId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter whereParentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter wherePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter wherePublishedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter whereReadCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter whereSummary($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperChapter {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\GenreFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Genre newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Genre newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Genre query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Genre whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Genre whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Genre whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Genre whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Genre whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperGenre {}
}

namespace App\Models{
/**
 * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
 * @property-read User $user
 * @property int $id
 * @property int $user_id
 * @property string $likeable_type
 * @property int $likeable_id
 * @property string|null $created_ip
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property-read \Illuminate\Database\Eloquent\Model $likeable
 * @method static \Database\Factories\LikeFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Like newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Like newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Like query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Like whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Like whereCreatedIp($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Like whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Like whereLikeableId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Like whereLikeableType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Like whereUserId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperLike {}
}

namespace App\Models{
/**
 * @property-read User $author
 * @property-read Genre $genre
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property int $genre_id
 * @property int $author_id
 * @property string|null $cover_url
 * @property bool $is_favorite
 * @property int $chapter_count
 * @property \Illuminate\Support\Carbon|null $branch_recomputed_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Chapter> $chapters
 * @property-read int|null $chapters_count
 * @property-read \App\Models\Chapter|null $rootChapter
 * @method static \Database\Factories\NovelFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Novel newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Novel newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Novel query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Novel whereAuthorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Novel whereBranchRecomputedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Novel whereChapterCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Novel whereCoverUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Novel whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Novel whereGenreId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Novel whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Novel whereIsFavorite($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Novel whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Novel whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Novel whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperNovel {}
}

namespace App\Models{
/**
 * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
 * @property-read User $reporter
 * @property int $id
 * @property int $reporter_id
 * @property string $reportable_type
 * @property int $reportable_id
 * @property \App\Enums\ReportReason $reason
 * @property string|null $description
 * @property \App\Enums\ReportStatus $status
 * @property int|null $moderator_id
 * @property \App\Enums\ReportResolution|null $resolution
 * @property \Illuminate\Support\Carbon|null $processed_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Model $reportable
 * @method static \Database\Factories\ReportFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report pending()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereModeratorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereProcessedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereReportableId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereReportableType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereReporterId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereResolution($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperReport {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $username
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property array<array-key, mixed> $roles
 * @property string|null $avatar
 * @property bool $notifications_enabled
 * @property string|null $firstname
 * @property string|null $lastname
 * @property \Illuminate\Support\Carbon|null $birth_date
 * @property int $warning_count
 * @property int $new_messages_count
 * @property \Illuminate\Support\Carbon|null $banned_until
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Sanctum\PersonalAccessToken> $tokens
 * @property-read int|null $tokens_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereAvatar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereBannedUntil($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereBirthDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereFirstname($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereLastname($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereNewMessagesCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereNotificationsEnabled($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRoles($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUsername($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereWarningCount($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperUser {}
}

