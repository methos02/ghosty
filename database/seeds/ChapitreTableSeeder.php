<?php
use Illuminate\Database\Seeder;
use joshtronic\LoremIpsum;

class ChapitreTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        $lipsum = new LoremIpsum();

        DB::table('Chapitres')->insert([
            'titre_chapitre' => 'Premier Chapitre',
            'slug' => 'premier-chapitre',
            'recit' => $lipsum->paragraphs(5),
            'resume' => substr($lipsum->paragraphs(1), 0, 150),
            'order' => 1,
            'user_id' => 1,
            'roman_id' => 1,
            'statut_chap' => 1,
        ]);

        DB::table('Chapitres')->insert([
            'titre_chapitre' => 'Second Chapitre',
            'slug' => 'second-chapitre',
            'recit' => $lipsum->paragraphs(5),
            'resume' => substr($lipsum->paragraphs(1), 0, 150),
            'order' => 2,
            'user_id' => 2,
            'roman_id' => 1,
            'statut_chap' => 1,
        ]);

        DB::table('Chapitres')->insert([
            'titre_chapitre' => 'Chapitre brouillon horreur',
            'slug' => 'chapitre-brouillon-horreur',
            'recit' => $lipsum->paragraphs(5),
            'resume' => substr($lipsum->paragraphs(1), 0, 150),
            'order' => 1,
            'user_id' => 1,
            'roman_id' => 2,
            'statut_chap' => \App\Chapitre::S_BROUILLON,
        ]);

        DB::table('Chapitres')->insert([
            'titre_chapitre' => 'Premier Chapitre populaire',
            'slug' => 'premier-chapitre-populaire',
            'recit' => $lipsum->paragraphs(5),
            'resume' => substr($lipsum->paragraphs(1), 0, 150),
            'order' => 1,
            'user_id' => 1,
            'roman_id' => 3,
            'statut_chap' => 1,
        ]);

        DB::table('Chapitres')->insert([
            'titre_chapitre' => 'Chapitre in Vote',
            'slug' => 'chapitre-in-vote',
            'recit' => $lipsum->paragraphs(5),
            'resume' => substr($lipsum->paragraphs(1), 0, 150),
            'order' => 1,
            'user_id' => 2,
            'roman_id' => 3,
            'statut_chap' => 0,
        ]);


        DB::table('Chapitres')->insert([
            'titre_chapitre' => 'Premier Chapitre new',
            'slug' => 'premier-chapitre-new',
            'recit' => $lipsum->paragraphs(5),
            'resume' => substr($lipsum->paragraphs(1), 0, 150),
            'order' => 1,
            'user_id' => 1,
            'roman_id' => 4,
            'statut_chap' => 1,
        ]);

        DB::table('Chapitres')->insert([
            'titre_chapitre' => 'Chapitre brouillon sciences fiction',
            'slug' => 'chapitre-brouillon-sciences-fiction',
            'recit' => $lipsum->paragraphs(5),
            'resume' => substr($lipsum->paragraphs(1), 0, 150),
            'order' => 1,
            'user_id' => 1,
            'roman_id' => 5,
            'statut_chap' => \App\Chapitre::S_BROUILLON,
        ]);
    }
}
