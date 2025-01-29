<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class service extends Model
{
    protected $fillable = ['id', 'name', 'catId'];
    public function categorie(){ 
        return $this->belongsTo(categorie::class);
    }
    public function workers(){
        return $this->belongsToMany(User::class);
    }
    
}
