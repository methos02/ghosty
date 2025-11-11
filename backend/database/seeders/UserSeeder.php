<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'pseudo' => 'admin',
            'email' => 'admin@ghosty.fr',
            'password' => Hash::make('password'),
            'roles' => [User::ROLE_READER, User::ROLE_AUTHOR, User::ROLE_MODERATOR, User::ROLE_ADMIN],
            'email_verified_at' => now(),
        ]);

        User::create([
            'pseudo' => 'moderateur1',
            'email' => 'moderateur@ghosty.fr',
            'password' => Hash::make('password'),
            'roles' => [User::ROLE_READER, User::ROLE_MODERATOR],
            'email_verified_at' => now(),
        ]);

        User::create([
            'pseudo' => 'auteur1',
            'email' => 'auteur@ghosty.fr',
            'password' => Hash::make('password'),
            'roles' => [User::ROLE_READER, User::ROLE_AUTHOR],
            'email_verified_at' => now(),
        ]);

        User::create([
            'pseudo' => 'lecteur1',
            'email' => 'lecteur@ghosty.fr',
            'password' => Hash::make('password'),
            'roles' => [User::ROLE_READER],
            'email_verified_at' => now(),
        ]);
    }
}
