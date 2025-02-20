<?php

namespace App\Http\Controllers;

use App\Models\service;
use App\Models\User;
use Inertia\Inertia;

    class ServicesController extends Controller
{
    public function ShowAllServices(){
        $services = service::all();
        // dd($services);
        return Inertia::render('AllServices', ['services'=>$services, 'showserv'=>true]);
    }
    // public function ShowServices()
    // {
    //     if (!auth()->check()) {
    //         return redirect('/');
    //     }
    //     $user = auth()->user();
    //     if ($user && $user->isWorker()) {
    //         $services = Service::where('workerId', $user->id)->get();
    
    //         return Inertia::render('WorkerServices', [
    //             'services' => $services,
    //         ]);
    //     }
    
    //     return redirect('/')->with('error', 'Unauthorized');
    // }
    public function ShowServiceDetailes($id){
        $service = service::find($id);
        $worker = User::find($service->workerId); 
        return Inertia::render('ServiceDetailes', ['service'=>$service, 'worker'=>$worker]);
    }
    
    public function DeleteService(){

    }
}
