<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('novels', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->foreignId('genre_id')->constrained()->onDelete('restrict');
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade');
            $table->string('cover_url')->nullable();
            $table->boolean('is_favorite')->default(false);
            $table->unsignedInteger('chapter_count')->default(0);

            /* @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md */
            $table->timestamp('branch_recomputed_at')->nullable();

            $table->timestamps();

            $table->index('author_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('novels');
    }
};
