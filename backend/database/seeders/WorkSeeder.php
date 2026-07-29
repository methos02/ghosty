<?php

namespace Database\Seeders;

use App\Models\Work;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class WorkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /** @var array<int, array{order: int, type: int, title: string, content: string}> $chapters */
        $chapters = File::json(database_path('data/works.json'));

        $chapterCount = collect($chapters)->where('type', Work::TYPE_CHAPTER)->count();
        $novels = DB::table('novels')->get(['id', 'author_id']);

        foreach ($novels as $novel) {
            foreach ($chapters as $chapter) {
                DB::table('works')->insert([
                    'novel_id' => $novel->id,
                    'author_id' => $novel->author_id,
                    'title' => $chapter['title'],
                    'content' => $chapter['content'],
                    'order' => $chapter['order'],
                    'type' => $chapter['type'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            DB::table('novels')->where('id', $novel->id)->update(['chapter_count' => $chapterCount]);
        }
    }
}
