<?php
namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

    class UserSeeder extends Seeder{
        public function run(){
            $users = [
                ['name' => 'User 1','phone' => '0632974239874', 'email' => 'user1@example.com', 'password' => Hash::make('password')],
                ['name' => 'User 2','phone' => '0632974239876', 'email' => 'user2@example.com', 'password' => Hash::make('password')],
                ['name' => 'User 3','phone' => '0632974239877', 'email' => 'user3@example.com', 'password' => Hash::make('password')],
                ['name' => 'User 4','phone' => '0632974239875', 'email' => 'user4@example.com', 'password' => Hash::make('password')],
            ];
            foreach ($users as $user) {
                User::create($user);
            }
        }
    }