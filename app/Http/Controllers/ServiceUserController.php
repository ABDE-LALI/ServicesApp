<?php

namespace App\Http\Controllers;

use App\Models\service;
use App\Models\ServiceUser;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceUserController extends Controller
{
    public function ShowServices()
    {
        if (!auth()->check()) {
            return redirect('/');
        }
        $user = auth()->user();
        if ($user && $user->isWorker()) {
            $services = ServiceUser::where('workerId', $user->id)->get();
    
            return Inertia::render('WorkerServices', [
                'services' => $services,
            ]);
        }
    
        return redirect('/')->with('error', 'Unauthorized');
    } 
}
