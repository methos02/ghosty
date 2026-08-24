<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    private const DEFAULT_REGISTERED_HOURS_AGO = 720;

    public function run(): void
    {
        /** @var array<int, array{username: string, email: string, roles: list<string>, email_verified?: bool, registered_hours_ago?: int}> $users */
        $users = File::json(database_path('data/users.json'));

        foreach ($users as $user) {
            $registeredAt = now()->subHours($user['registered_hours_ago'] ?? self::DEFAULT_REGISTERED_HOURS_AGO);
            $hasVerifiedEmail = $user['email_verified'] ?? true;

            DB::table('users')->insert([
                'username' => $user['username'],
                'email' => $user['email'],
                'password' => Hash::make('password'),
                'roles' => json_encode($user['roles']),
                'email_verified_at' => $hasVerifiedEmail ? $registeredAt : null,
                'created_at' => $registeredAt,
                'updated_at' => $registeredAt,
            ]);
        }
    }
}
