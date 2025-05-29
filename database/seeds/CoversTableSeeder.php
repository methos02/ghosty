<?php

use Illuminate\Database\Seeder;

class CoversTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('covers')->insert([
            'path' => 'cover_test.jpg',
            'roman_id' => 1,
            'user_id' => 1,
        ]);
    }
}