<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('price_rules', function (Blueprint $table) {
            $table->id();
            $table->string('sign_type')->unique();
            $table->string('pricing_method')->default('flat'); // flat|per_sq_in|channel_letters

            $table->decimal('base_rate', 10, 2)->nullable();
            $table->decimal('per_sq_in_rate', 10, 4)->nullable();
            $table->decimal('channel_letter_rate', 10, 2)->nullable();

            $table->decimal('min_price', 10, 2)->nullable();
            $table->decimal('max_price', 10, 2)->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('price_rules');
    }
};
