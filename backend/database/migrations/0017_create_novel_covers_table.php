<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * @see memory-bank/decisions/ADR-16-illustrations-du-roman.md
     */
    public function up(): void
    {
        Schema::create('novel_covers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('novel_id')->constrained('novels')->cascadeOnDelete();
            $table->foreignId('author_id')->constrained('users')->cascadeOnDelete();
            $table->string('image_path');
            $table->unsignedTinyInteger('status')->default(1);
            $table->unsignedInteger('like_count')->default(0);
            $table->unsignedInteger('comment_count')->default(0);
            $table->timestamps();

            $table->unique(['novel_id', 'author_id'], 'novel_covers_unique_per_author');
            $table->index(['novel_id', 'status', 'like_count']);
        });

        Schema::table('novels', function (Blueprint $table) {
            $table->foreign('official_cover_id')->references('id')->on('novel_covers')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('novels', function (Blueprint $table) {
            $table->dropForeign(['official_cover_id']);
        });
        Schema::dropIfExists('novel_covers');
    }
};
