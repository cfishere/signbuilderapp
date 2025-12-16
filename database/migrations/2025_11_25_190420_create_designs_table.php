<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('designs', function (Blueprint $table) {
            $table->id();

            // Ownership
            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            // Link to eventual orders (kept loose for now)
            $table->unsignedBigInteger('order_id')->nullable();
            // When you have an orders table, you can add a foreign key in a later migration:
            // $table->foreign('order_id')->references('id')->on('orders')->nullOnDelete();

            // Basic info
            $table->string('name')->nullable(); // "Main Street Wall Sign"
            $table->string('slug')->nullable();
            $table->unique(['user_id', 'slug']); // per-user unique slug

            // Sign domain metadata
            $table->string('sign_type');       // e.g. "wall_sign_cabinet", "channel_letters"
            $table->string('sign_category')->nullable(); // e.g. "Wall Sign", "Monument", etc.

            // Physical sign dimensions (inches)
            $table->unsignedInteger('sign_width')->nullable();   // face width in inches
            $table->unsignedInteger('sign_height')->nullable();  // face height in inches
            $table->unsignedInteger('sign_depth')->nullable();   // cabinet depth, if applicable

            // Canvas setup / editor environment
            $table->unsignedInteger('canvas_width')->nullable();   // px
            $table->unsignedInteger('canvas_height')->nullable();  // px
            $table->unsignedTinyInteger('grid_size')->default(24); // px per square
            $table->boolean('grid_enabled')->default(true);
            $table->boolean('snap_to_grid')->default(true);
            $table->string('background_color', 20)->nullable(); // e.g. "#ffffff" or "transparent"

            // Serialized Fabric.js state + extra settings
            // Use JSON if your MariaDB version supports it; otherwise change to longText.
            $table->json('canvas_state');          // full fabric canvas.toJSON() output
            $table->json('settings')->nullable();  // any extra config, pricing params, template data, etc.

            // UX / misc
            $table->string('thumbnail_path')->nullable(); // e.g. storage path to preview image
            $table->string('status')->default('draft');   // "draft", "final", "ordered", etc.

            $table->timestamps();

            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('designs');
    }
};
