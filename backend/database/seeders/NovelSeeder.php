<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class NovelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /** @var array<int, array{title: string, genre_id: int, cover_url: string}> $novels */
        $novels = File::json(database_path('data/novels.json'));

        DB::table('novels')->truncate();

        foreach ($novels as $novel) {
            DB::table('novels')->insert([
                'title' => $novel['title'],
                'genre_id' => $novel['genre_id'],
                'cover_url' => $novel['cover_url'],
                'is_favorite' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
