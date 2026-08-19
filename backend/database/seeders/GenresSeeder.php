<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class GenresSeeder extends Seeder
{
    public function run(): void
    {
        /** @var array<int, array{id: int, name: string}> $genres */
        $genres = File::json(database_path('data/genres.json'));

        foreach ($genres as $genre) {
            DB::table('genres')->insert([
                'id' => $genre['id'],
                'name' => $genre['name'],
                'slug' => Str::slug($genre['name']),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
