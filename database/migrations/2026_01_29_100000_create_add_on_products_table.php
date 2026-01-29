<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('add_on_products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('id_category')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->string('unit_type')->default('each');
            $table->string('length_unit')->nullable();
            $table->unsignedInteger('length_min')->nullable();
            $table->unsignedInteger('length_max')->nullable();
            $table->unsignedInteger('length_step')->nullable();
            $table->json('options')->nullable();
            $table->json('pricing')->nullable();
            $table->json('shipping_profile')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('add_on_products');
    }
};
