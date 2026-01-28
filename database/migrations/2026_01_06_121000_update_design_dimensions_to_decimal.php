<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $driver = DB::getDriverName();
        if ($driver !== 'mysql') {
            return;
        }

        DB::statement('ALTER TABLE designs MODIFY sign_width DECIMAL(8,2) NULL');
        DB::statement('ALTER TABLE designs MODIFY sign_height DECIMAL(8,2) NULL');
        DB::statement('ALTER TABLE designs MODIFY sign_depth DECIMAL(8,2) NULL');
    }

    public function down(): void
    {
        $driver = DB::getDriverName();
        if ($driver !== 'mysql') {
            return;
        }

        DB::statement('ALTER TABLE designs MODIFY sign_width INT UNSIGNED NULL');
        DB::statement('ALTER TABLE designs MODIFY sign_height INT UNSIGNED NULL');
        DB::statement('ALTER TABLE designs MODIFY sign_depth INT UNSIGNED NULL');
    }
};
