<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('total_amount', 10, 2)->nullable()->after('status');
            $table->string('currency', 3)->default('USD')->after('total_amount');

            $table->string('paypal_order_id')->nullable()->after('currency');
            $table->string('paypal_capture_id')->nullable()->after('paypal_order_id');
            $table->string('paypal_payer_id')->nullable()->after('paypal_capture_id');
            $table->string('paypal_status')->nullable()->after('paypal_payer_id');
            $table->decimal('paypal_amount', 10, 2)->nullable()->after('paypal_status');
            $table->string('paypal_currency', 3)->nullable()->after('paypal_amount');
            $table->timestamp('paid_at')->nullable()->after('paypal_currency');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'total_amount',
                'currency',
                'paypal_order_id',
                'paypal_capture_id',
                'paypal_payer_id',
                'paypal_status',
                'paypal_amount',
                'paypal_currency',
                'paid_at',
            ]);
        });
    }
};
