<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'pseudo' => 'methos',
            'email' => 'leonfrederic@gmx.fr',
            'droit' => 3,
            'email_verified_at' => '2019-09-06 00:00:00',
            'password' => bcrypt('frodon'),
            'nb_notif' => 1
        ]);

        DB::table('users')->insert([
            'pseudo' => 'user',
            'email' => 'user@gmx.fr',
            'droit' => 1,
            'password' => bcrypt('user'),
        ]);
    }
}
