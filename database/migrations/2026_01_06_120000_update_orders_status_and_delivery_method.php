<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'delivery_method')) {
                $table->string('delivery_method')->nullable()->after('country');
            }
        });

        DB::table('orders')
            ->whereNull('order_number')
            ->orWhere('order_number', '')
            ->update(['order_number' => DB::raw('id')]);

        DB::table('orders')
            ->whereNull('status')
            ->orWhereIn('status', ['draft', 'submitted'])
            ->update(['status' => 'unpaid']);
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'delivery_method')) {
                $table->dropColumn('delivery_method');
            }
        });
    }
};
