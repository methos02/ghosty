<?php

use Illuminate\Database\Seeder;

class GenresTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('genres')->insert([
            'name_genre' => 'Science Fiction',
            'slug_genre' => 'science-fiction',
        ]);
        DB::table('genres')->insert([
            'name_genre' => 'Horreur',
            'slug_genre' => 'horreur',
        ]);
        DB::table('genres')->insert([
            'name_genre' => 'Aventure',
            'slug_genre' => 'aventure',
        ]);
        DB::table('genres')->insert([
            'name_genre' => 'Héroique Fantasie',
            'slug_genre' => 'heroique-fantasie',
        ]);
        DB::table('genres')->insert([
            'name_genre' => 'Romance',
            'slug_genre' => 'romance',
        ]);
        DB::table('genres')->insert([
            'name_genre' => 'Policier',
            'slug_genre' => 'policier',
        ]);
        DB::table('genres')->insert([
            'name_genre' => 'Thriller',
            'slug_genre' => 'thriller',
        ]);
        DB::table('genres')->insert([
            'name_genre' => 'Enfant',
            'slug_genre' => 'enfant'
        ]);
        DB::table('genres')->insert([
            'name_genre' => 'Sport',
            'slug_genre' => 'sport',
        ]);
        DB::table('genres')->insert([
            'name_genre' => 'Jeux Vidéos',
            'slug_genre' => 'jeux-videos',
        ]);
        DB::table('genres')->insert([
            'name_genre' => 'Fan Fiction',
            'slug_genre' => 'fan-fiction',
        ]);
        DB::table('genres')->insert([
            'name_genre' => 'Péplum',
            'slug_genre' => 'peplum',
        ]);
        DB::table('genres')->insert([
            'name_genre' => 'Comédie',
            'slug_genre' => 'comedie',
        ]);
        DB::table('genres')->insert([
            'name_genre' => 'Histoire/Fiction',
            'slug_genre' => 'histoire-fiction'
        ]);
        DB::table('genres')->insert([
            'name_genre' => 'Dramatique',
            'slug_genre' => 'dramatique',
        ]);
    }
}
