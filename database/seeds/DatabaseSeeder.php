<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(GenresTableSeeder::class);
        $this->call(CoversTableSeeder::class);
        $this->call(UsersTableSeeder::class);
        $this->call(RomansTableSeeder::class);
        $this->call(ChapitreTableSeeder::class);
        $this->call(NotifTableSeeder::class);
    }
}
