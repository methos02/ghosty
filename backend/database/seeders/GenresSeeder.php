<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GenresSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonPath = database_path('data/genres.json');
        $genres = json_decode(file_get_contents($jsonPath), true);

        DB::table('genres')->truncate();

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
