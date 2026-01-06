<?php
namespace App\Providers;

use App\Models\Design;
use App\Models\Order;
use App\Policies\DesignPolicy;
use App\Policies\OrderPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Design::class => DesignPolicy::class,
        Order::class => OrderPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
