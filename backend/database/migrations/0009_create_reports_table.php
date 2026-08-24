<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
     */
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reporter_id')->constrained('users')->cascadeOnDelete();
            $table->morphs('reportable');
            $table->string('reason', 32);
            $table->text('description')->nullable();
            $table->unsignedTinyInteger('status')->default(1);
            $table->foreignId('moderator_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('resolution', 32)->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();

            $table->unique(['reporter_id', 'reportable_type', 'reportable_id'], 'reports_unique_per_reporter_and_content');
            $table->index(['status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
