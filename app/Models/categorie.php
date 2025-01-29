<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class categorie extends Model
{
    protected $fillable = ['id', 'name', 'servicesId'];
    public function services(){
        return $this->hasMany(service::class);
    }
}
