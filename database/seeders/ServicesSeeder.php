<?php
namespace Database\Seeders;

use App\Models\service;
use Illuminate\Database\Seeder;

    class ServicesSeeder extends Seeder
    {
        public function run()
        {
            $services = [
                [
                    'name' => 'Haircut',
                    'description' => 'A professional haircut tailored to your style.',
                    'workerId' => 1, // Assumes a user with id 1 exists in the users table
                    'sercatId' => 1, // Assumes a category with id 1 exists in the categories table
                    'serviceRaiting' => 5,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'name' => 'Manicure',
                    'description' => 'Complete manicure service including nail shaping and polish.',
                    'workerId' => 2, // Assumes a user with id 2 exists in the users table
                    'sercatId' => 2, // Assumes a category with id 2 exists in the categories table
                    'serviceRaiting' => 4,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'name' => 'Car Wash',
                    'description' => 'Thorough exterior car cleaning service.',
                    'workerId' => 3, // Assumes a user with id 3 exists in the users table
                    'sercatId' => 3, // Assumes a category with id 3 exists in the categories table
                    'serviceRaiting' => 5,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'name' => 'Dog Grooming',
                    'description' => 'Comprehensive grooming services for dogs.',
                    'workerId' => 4, // Assumes a user with id 4 exists in the users table
                    'sercatId' => 4, // Assumes a category with id 4 exists in the categories table
                    'serviceRaiting' => 5,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ];
            foreach ($services as $service) {
                service::create($service);
            }
        }
    }