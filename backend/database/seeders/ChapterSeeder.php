<?php

namespace Database\Seeders;

use App\Models\Chapter;
use App\Models\Novel;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class ChapterSeeder extends Seeder
{
    /** @var array<string, int> */
    private array $authorIds = [];

    public function run(): void
    {
        $novels = File::json(database_path('data/chapters.json'));

        /** @var array<string, int> $authorIds */
        $authorIds = User::pluck('id', 'username')->all();
        $this->authorIds = $authorIds;

        foreach ($novels as $novel) {
            if (! is_array($novel)) {
                continue;
            }

            $found = Novel::where('title', $this->text($novel, 'novel'))->first();
            $data = $novel['data'] ?? null;

            if ($found === null || ! is_array($data)) {
                continue;
            }

            $this->createChapter($found, $data, null);

            $found->update(['chapter_count' => $found->chapters()->count()]);
        }
    }

    /**
     * @param  array<mixed, mixed>  $data
     */
    private function createChapter(Novel $novel, array $data, ?Chapter $parent): Chapter
    {
        $chapter = Chapter::create([
            'novel_id' => $novel->id,
            'parent_id' => $parent?->id,
            'author_id' => $this->authorIds[$this->text($data, 'author')],
            'title' => $this->text($data, 'title'),
            'summary' => $this->text($data, 'summary'),
            'content' => $this->paragraphs($data, 'content'),
            'path' => '',
            'depth' => $parent === null ? 0 : $parent->depth + 1,
            'status' => Chapter::STATUS_PUBLISHED,
            'published_at' => now(),
        ]);

        $likeCount = $this->number($data, 'like_count');

        $chapter->forceFill([
            'path' => $parent === null
                ? Chapter::PATH_SEPARATOR.$chapter->id.Chapter::PATH_SEPARATOR
                : $parent->path.$chapter->id.Chapter::PATH_SEPARATOR,
            'like_count' => $likeCount,
            'branch_like_count' => ($parent === null ? 0 : $parent->branch_like_count) + $likeCount,
        ])->save();

        $children = is_array($data['children'] ?? null) ? $data['children'] : [];

        foreach ($children as $child) {
            if (! is_array($child)) {
                continue;
            }

            $this->createChapter($novel, $child, $chapter);
        }

        $chapter->forceFill(['continuations_count' => count($children)])->save();

        return $chapter->refresh();
    }

    /**
     * @param  array<mixed, mixed>  $data
     */
    private function text(array $data, string $key): string
    {
        $value = $data[$key] ?? '';

        return is_string($value) ? $value : '';
    }

    /**
     * @param  array<mixed, mixed>  $data
     */
    private function paragraphs(array $data, string $key): string
    {
        $value = $data[$key] ?? [];

        if (! is_array($value)) {
            return '';
        }

        return implode("\n\n", array_filter($value, 'is_string'));
    }

    /**
     * @param  array<mixed, mixed>  $data
     */
    private function number(array $data, string $key): int
    {
        $value = $data[$key] ?? 0;

        return is_int($value) ? $value : 0;
    }
}
