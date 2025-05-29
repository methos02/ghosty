<?php

use Illuminate\Database\Seeder;

class RomansTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('Romans')->insert([
            'titre_roman' => 'Le premier Roman',
            'slug' => 'le-premier-roman',
            'cover' => 'defaut/1_standard.jpg',
            'name_cover' => 1,
            'user_id' => 1,
            'genre_id' => 1,
            'slug_genre' => 'science-fiction',
            'nb_suite' => 2,
            'statut' => 1,
        ]);

        DB::table('Romans')->insert([
            'titre_roman' => 'Le second Roman',
            'slug' => 'le-second-roman',
            'cover' => 'defaut/2_standard.jpg',
            'name_cover' => 1,
            'user_id' => 1,
            'genre_id' => 2,
            'slug_genre' => 'horreur',
        ]);

        DB::table('Romans')->insert([
            'titre_roman' => 'Le roman populaire',
            'slug' => 'le-roman-populaire',
            'cover' => 'defaut/3_standard.jpg',
            'name_cover' => 1,
            'nb_vote' => 50,
            'user_id' => 2,
            'genre_id' => 3,
            'slug_genre' => 'aventure',
            'statut' => 1,
        ]);

        DB::table('Romans')->insert([
            'titre_roman' => 'Le dernier roman',
            'slug' => 'le-dernier-roman',
            'cover' => 'defaut/4_standard.jpg',
            'name_cover' => 1,
            'user_id' => 1,
            'genre_id' => 4,
            'slug_genre' => 'heroique-fantasie',
            'statut' => 1,
        ]);

        DB::table('Romans')->insert([
            'titre_roman' => 'Brouillon de roman',
            'slug' => 'brouillon-de-roman',
            'cover' => 'defaut/1_standard.jpg',
            'name_cover' => 1,
            'user_id' => 1,
            'genre_id' => 1,
            'slug_genre' => 'science-fiction',
        ]);
    }
}