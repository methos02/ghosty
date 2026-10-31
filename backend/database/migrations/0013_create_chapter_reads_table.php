<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * @see memory-bank/decisions/ADR-12-suivi-de-branche-et-parcours-de-lecture.md
     */
    public function up(): void
    {
        Schema::create('chapter_reads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chapter_id')->constrained('chapters')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->uuid('session_key');
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['chapter_id', 'session_key'], 'chapter_reads_unique_per_session');
            $table->unique(['chapter_id', 'user_id'], 'chapter_reads_unique_per_user');
            $table->index(['user_id', 'created_at']);
            $table->index('session_key');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chapter_reads');
    }
};
