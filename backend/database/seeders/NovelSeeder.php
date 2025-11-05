<?php

namespace Database\Seeders;

use App\Models\Novel;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NovelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonPath = database_path('data/novels.json');
        $novels = json_decode(file_get_contents($jsonPath), true);

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
