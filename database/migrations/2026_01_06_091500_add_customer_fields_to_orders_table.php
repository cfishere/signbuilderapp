<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('customer_name')->after('status');
            $table->string('address_line1')->after('customer_name');
            $table->string('address_line2')->nullable()->after('address_line1');
            $table->string('city')->after('address_line2');
            $table->string('region')->after('city');
            $table->string('postal_code')->after('region');
            $table->string('country')->default('US')->after('postal_code');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'customer_name',
                'address_line1',
                'address_line2',
                'city',
                'region',
                'postal_code',
                'country',
            ]);
        });
    }
};
