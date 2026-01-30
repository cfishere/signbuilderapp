<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->unsignedInteger('job_number')->unique();
            $table->string('job_board_status')->nullable();

            $table->string('print_image_path')->nullable();
            $table->unsignedInteger('print_image_ppi')->nullable();
            $table->unsignedInteger('print_image_width')->nullable();
            $table->unsignedInteger('print_image_height')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_jobs');
    }
};
