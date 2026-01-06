<?php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController; //recommended to add per chatgtp.  Controller also created.
use App\Http\Controllers\API\DesignController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\DesignIndexController;
use App\Http\Controllers\OrderIndexController;
use App\Http\Controllers\OrderShowController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Artisan;

Route::inertia('/', 'GetStarted')->name('getstarted');

/*Route::inertia('/canvas', 'Canvas')->name('canvas.get');*/
Route::get('/canvas', function (Request $request) {
    return Inertia::render('CanvasPage', [           
        'designId' => $request->query('design_id')
            ? (int) $request->query('design_id')
            : null,
        'signType' => $request->query('sign_type') ?? $request->query('signType'),
    ]);
})->name('canvas.get');

Route::middleware(['auth'])->group(function () {
    Route::get('/designs', [DesignIndexController::class, 'index'])->name('designs.index');
    Route::get('/orders', [OrderIndexController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderShowController::class, 'show'])->name('orders.show');
});

Route::middleware(['auth'])->prefix('api')->group(function () {    
    Route::post('/designs', [DesignController::class, 'store'])->name('designs.store');
    Route::get('/designs/{design}', [DesignController::class, 'show'])->name('designs.show');
    Route::put('/designs/{design}', [DesignController::class, 'update'])->name('designs.update');
    Route::delete('/designs/{design}', [DesignController::class, 'destroy'])->name('designs.destroy');

    Route::get('/orders', [OrderController::class, 'index'])->name('orders.api.index');
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::put('/orders/{order}', [OrderController::class, 'update'])->name('orders.update');
    Route::delete('/orders/{order}', [OrderController::class, 'destroy'])->name('orders.destroy');
});

//AUTH ROUTES
// Show login form
Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login')->middleware('guest');

// Show register form
Route::get('/register', function () {
    return Inertia::render('Auth/Register');
})->name('register')->middleware('guest');

// Handle login
Route::post('/login', function (Request $request) {
    $credentials = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required'],
    ]);

    if (Auth::attempt($credentials)) {
        $request->session()->regenerate();
        return redirect()->intended('/editor');
    }

    return back()->withErrors(['email' => 'Invalid credentials.']);
});

// Handle registration
Route::post('/register', function (Request $request) {
    $request->validate([
        'name' => ['required', 'string', 'max:255'],
        'email' => ['required', 'email', 'unique:users,email'],
        'password' => ['required', 'string', 'min:6', 'confirmed'],
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    Auth::login($user);
    return redirect('/editor');
});

// Logout
Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/');
});

Route::get('clearall', function(){
    // Execute the desired Artisan command
        Artisan::call('cache:clear');
        // Get the output of the command
        $output = Artisan::output();

        Artisan::call('config:clear');
        $output .= ' '.Artisan::output();

        /*This command removes the cached route file, which is typically located in bootstrap/cache/routes.php. Clearing the route cache is necessary when you make changes to your route definitions*/
        Artisan::call('route:clear');
        $output .= ' '.Artisan::output();      

        return "Commands execution output: " . $output;

});

//do not run this on the develpment local server. If you do, run config::clear.
Route::get('configcache', function(){
    /*This command will combine all of your application's configuration files into a single, optimized file, typically located at bootstrap/cache/config.php. This process can improve application performance, especially in production environments, by reducing the overhead of loading multiple configuration files during each request.
    Production Deployment:
    It is recommended to run php artisan config:cache as part of your production deployment process.
    Local Development:
    *****!!!! Avoid running this command during local development ***!!!, as it can make changes to your .env file or configuration files not take effect immediately without clearing the cache.
    env() Function:
    !!!!! After caching the configuration, the .env file will not be loaded. Ensure that you are only calling the env() function within your configuration files, not directly within your application code, as calls to env() outside of configuration files will return null once the configuration is cached.
    Clearing the Cache:
    If you modify your configuration files after caching them, you must clear the cache for the changes to take effect by running php artisan config:clear.
    */
    /* Clear any existing configuration cache: It automatically runs config:clear before caching.
    Combine all your configuration files: All configuration values defined in your config directory and .env file are compiled into a single, optimized file.
    Store the cached configuration: The compiled configuration is saved to bootstrap/cache/config.php.*/
        Artisan::call('config:cache');
        $output .= ', '.Artisan::output();

});
