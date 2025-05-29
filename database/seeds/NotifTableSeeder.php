<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NotifTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {

        DB::table('Notifs')->insert([
            'titre' => 'Fin de vote',
            'content' => 'Le vote est terminé pour les chapitres suivant.',
            'user_id' => 1,
            'statut' => 1,
        ]);

        DB::table('Notifs')->insert([
            'titre' => 'Nouveau commentaire',
            'content' => 'Methos vous a écris un nouveau commentaire.',
            'user_id' => 1,
            'statut' => 0,
        ]);
    }
}
