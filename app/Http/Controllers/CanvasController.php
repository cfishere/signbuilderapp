<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserCanvas;
use App\Models\User;
use Inertia\Inertia;

class CanvasController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->canvases()->select('id', 'title', 'sign_type')->latest()->get();
    }

    public function show(Request $request)
    {
        /*dd($request->all());*/
        sleep(1);
        /*$validatedData;*/

        /*//If User Design Id, fetch it, else validate form data and prep canvas based on data:
        if( empty( $request->input('designId') ) ) {*/
           
           /*$validatedData = $request->validate([
                'width' => ['required', 'max:2'],
                'height' => ['required', 'max:2'],
                'email' => ['required', 'email', 'max:255', 'unique:users'],
                'signType' => ['required', 'max:255'],
                'postalCode' => ['required', 'max:10'],
                'designId' => ['max:12'],
           ]);*/
       /* }
        else {
            $canvas = UserCanvas::where('id', $id)->where('user_id', auth()->id())->firstOrFail();
            return response()->json($canvas);
        }*/
       // Redirect to a new page, passing the data as props
        return Inertia::render('Canvas');
        
    }
}