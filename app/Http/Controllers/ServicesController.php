<?php

namespace App\Http\Controllers;

use App\Models\service;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

    class ServicesController extends Controller
{
    public function ShowAllServices(){
        $services = service::all();
        // dd($services);
        return Inertia::render('AllServices', ['services'=>$services, 'showserv'=>true]);
    }
    public function showServiceDetailes($id){
        $service = service::find($id);
        $worker = User::find($service->workerId); 
        return Inertia::render('ServiceDetailes', ['service'=>$service, 'worker'=>$worker]);
    }
}
