<?php

namespace Database\Seeders;

use App\Models\Novel;
use App\Models\User;
use Illuminate\Database\Seeder;
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

        $authorId = User::where('pseudo', 'auteur1')->value('id');

        foreach ($novels as $novel) {
            Novel::create([
                'title' => $novel['title'],
                'genre_id' => $novel['genre_id'],
                'author_id' => $authorId,
                'cover_url' => $novel['cover_url'],
                'is_favorite' => false,
            ]);
        }
    }
}
