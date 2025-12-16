<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        Inertia::share([
            'auth' => [
                'user' => fn () => auth()->user()
                    ? [
                        'id'       => auth()->id(),
                        'name'     => auth()->user()->name,
                        'email'    => auth()->user()->email,
                        'is_admin' => (bool) (auth()->user()->is_admin ?? false),
                    ]
                    : null,
            ],
        ]);
    }
}
