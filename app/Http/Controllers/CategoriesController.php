<?php

namespace App\Http\Controllers;

use App\Models\categorie;
use App\Models\service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoriesController extends Controller
{
    public function ShowAllCategories(){
        $categories = categorie::all();
        return Inertia::render('AllCategories', ['categories'=>$categories, 'howcats'=>true]);
    }
    public function ShowCategorieServices($id){
        $categorie = categorie::find($id);
        $CategorieServices = service::where('sercatId', $categorie->id)->get();
        return Inertia::render('CategorieServices', ['categorie' => $categorie, 'services' => $CategorieServices]);
    }
}
