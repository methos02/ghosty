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
 * @property-read \App\Models\User $author
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Chapter> $children
 * @property-read int|null $children_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Comment> $comments
 * @property-read int|null $comments_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Follow> $follows
 * @property-read int|null $follows_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Like> $likes
 * @property-read int|null $likes_count
 * @property-read \App\Models\Novel $novel
 * @property-read Chapter|null $parent
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Report> $reports
 * @property-read int|null $reports_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter byAuthor(int $authorId)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter drafts()
 * @method static \Database\Factories\ChapterFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter hasChildren()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter orderBranchByLike()
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
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter withUserFollow(?int $userId)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter withUserLike(?int $userId)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Chapter withUserReport(?int $userId)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperChapter {}
}

namespace App\Models{
/**
 * @see memory-bank/decisions/ADR-12-suivi-de-branche-et-parcours-de-lecture.md
 * @property int $id
 * @property int $chapter_id
 * @property int|null $user_id
 * @property string $session_key
 * @property \Illuminate\Support\Carbon $created_at
 * @property-read \App\Models\Chapter $chapter
 * @property-read \App\Models\User|null $user
 * @method static \Database\Factories\ChapterReadFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChapterRead newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChapterRead newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChapterRead query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChapterRead whereChapterId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChapterRead whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChapterRead whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChapterRead whereSessionKey($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChapterRead whereUserId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperChapterRead {}
}

namespace App\Models{
/**
 * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
 * @property int $id
 * @property int $chapter_id
 * @property int|null $moderator_id
 * @property string $content
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChapterVersion newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChapterVersion newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChapterVersion query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChapterVersion whereChapterId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChapterVersion whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChapterVersion whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChapterVersion whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChapterVersion whereModeratorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChapterVersion whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperChapterVersion {}
}

namespace App\Models{
/**
 * @see memory-bank/decisions/ADR-13-commentaires.md
 * @property int $id
 * @property int $author_id
 * @property string $commentable_type
 * @property int $commentable_id
 * @property int|null $parent_id
 * @property int $reply_count
 * @property string|null $content
 * @property bool $is_spoiler
 * @property int $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $author
 * @property-read \Illuminate\Database\Eloquent\Model $commentable
 * @property-read Comment|null $parent
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Comment> $replies
 * @property-read int|null $replies_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Report> $reports
 * @property-read int|null $reports_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Comment> $visibleReplies
 * @property-read int|null $visible_replies_count
 * @method static \Database\Factories\CommentFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment shownInThread()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment topLevel()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment whereAuthorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment whereCommentableId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment whereCommentableType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment whereIsSpoiler($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment whereParentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment whereReplyCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment withUserReport(?int $userId)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperComment {}
}

namespace App\Models{
/**
 * @see memory-bank/decisions/ADR-12-suivi-de-branche-et-parcours-de-lecture.md
 * @property int $id
 * @property int $user_id
 * @property int $chapter_id
 * @property \Illuminate\Support\Carbon $created_at
 * @property-read \App\Models\Chapter $chapter
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\FollowFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Follow newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Follow newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Follow query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Follow whereChapterId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Follow whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Follow whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Follow whereUserId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperFollow {}
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
 * @property int $id
 * @property int $user_id
 * @property string $likeable_type
 * @property int $likeable_id
 * @property string|null $created_ip
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property-read \Illuminate\Database\Eloquent\Model $likeable
 * @property-read \App\Models\User $user
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
 * @see memory-bank/decisions/ADR-10-notifications-in-app-agregees.md
 * @property array<string, mixed> $data
 * @property string $id
 * @property string $type
 * @property string $notifiable_type
 * @property int $notifiable_id
 * @property \Illuminate\Support\Carbon|null $read_at
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 * @property string|null $group_key
 * @property string|null $unread
 * @property-read \Illuminate\Database\Eloquent\Model $notifiable
 * @method static \Illuminate\Notifications\DatabaseNotificationCollection<int, static> all($columns = ['*'])
 * @method static \Database\Factories\NotificationFactory factory($count = null, $state = [])
 * @method static \Illuminate\Notifications\DatabaseNotificationCollection<int, static> get($columns = ['*'])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification read()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification unread()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereData($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereGroupKey($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereNotifiableId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereNotifiableType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereReadAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereUnread($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperNotification {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property int $genre_id
 * @property int $author_id
 * @property string|null $cover_url
 * @property bool $is_favorite
 * @property int $chapter_count
 * @property int $comment_count
 * @property \Illuminate\Support\Carbon|null $branch_recomputed_at
 * @property int|null $main_branch_last_chapter_id
 * @property int|null $official_cover_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $author
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Chapter> $chapters
 * @property-read int|null $chapters_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Comment> $comments
 * @property-read int|null $comments_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\NovelCover> $covers
 * @property-read int|null $covers_count
 * @property-read \App\Models\Genre $genre
 * @property-read \App\Models\NovelCover|null $officialCover
 * @property-read \App\Models\Chapter|null $rootChapter
 * @method static \Database\Factories\NovelFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Novel newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Novel newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Novel query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Novel whereAuthorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Novel whereBranchRecomputedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Novel whereChapterCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Novel whereCommentCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Novel whereCoverUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Novel whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Novel whereGenreId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Novel whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Novel whereIsFavorite($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Novel whereMainBranchLastChapterId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Novel whereOfficialCoverId($value)
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
 * @see memory-bank/decisions/ADR-16-illustrations-du-roman.md
 * @property int $id
 * @property int $novel_id
 * @property int $author_id
 * @property string $image_path
 * @property int $status
 * @property int $like_count
 * @property int $comment_count
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $author
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Comment> $comments
 * @property-read int|null $comments_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Like> $likes
 * @property-read int|null $likes_count
 * @property-read \App\Models\Novel $novel
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Report> $reports
 * @property-read int|null $reports_count
 * @method static \Database\Factories\NovelCoverFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NovelCover newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NovelCover newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NovelCover published()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NovelCover query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NovelCover whereAuthorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NovelCover whereCommentCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NovelCover whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NovelCover whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NovelCover whereImagePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NovelCover whereLikeCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NovelCover whereNovelId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NovelCover whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NovelCover whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NovelCover withUserLike(?int $userId)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NovelCover withUserReport(?int $userId)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperNovelCover {}
}

namespace App\Models{
/**
 * @see memory-bank/decisions/ADR-12-suivi-de-branche-et-parcours-de-lecture.md
 * @property int $id
 * @property int $user_id
 * @property int $novel_id
 * @property int $chapter_id
 * @property \Illuminate\Support\Carbon $read_at
 * @property-read \App\Models\Chapter $chapter
 * @property-read \App\Models\Novel $novel
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\ReadingProgressFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReadingProgress newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReadingProgress newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReadingProgress query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReadingProgress whereChapterId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReadingProgress whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReadingProgress whereNovelId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReadingProgress whereReadAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReadingProgress whereUserId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperReadingProgress {}
}

namespace App\Models{
/**
 * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
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
 * @property-read \App\Models\User $reporter
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
 * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
 * @property int $id
 * @property int $user_id
 * @property int|null $moderator_id
 * @property int|null $report_id
 * @property \App\Enums\SanctionType $type
 * @property \Illuminate\Support\Carbon|null $until
 * @property string $reason
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sanction activeBans()
 * @method static \Database\Factories\SanctionFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sanction newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sanction newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sanction query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sanction whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sanction whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sanction whereModeratorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sanction whereReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sanction whereReportId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sanction whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sanction whereUntil($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sanction whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sanction whereUserId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperSanction {}
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
 * @property int $new_messages_count
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Sanction> $activeBans
 * @property-read int|null $active_bans_count
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Sanction> $sanctions
 * @property-read int|null $sanctions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Sanctum\PersonalAccessToken> $tokens
 * @property-read int|null $tokens_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereAvatar($value)
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
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperUser {}
}

