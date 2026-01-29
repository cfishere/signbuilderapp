<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('add_on_product_sign_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('add_on_product_id')
                ->constrained('add_on_products')
                ->cascadeOnDelete();
            $table->string('sign_type');
            $table->timestamps();

            $table->unique(['add_on_product_id', 'sign_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('add_on_product_sign_types');
    }
};
