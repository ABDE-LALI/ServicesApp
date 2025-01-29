<?php
namespace Database\Seeders;
use App\Models\categorie;
use Illuminate\Database\Seeder;

    class CategorieSeeder extends Seeder
    {
        public function run()
        {
            $categories = [
                ['name' => 'Categorie 1'],
                ['name' => 'Categorie 2'],
                ['name' => 'Categorie 3'],
                ['name' => 'Categorie 4'],
                ['name' => 'Categorie 5'],
            ];
            foreach ($categories as $categorie) {
                categorie::create($categorie);
            }
        }
    }