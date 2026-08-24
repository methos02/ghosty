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
        Schema::create('likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->morphs('likeable');
            $table->ipAddress('created_ip')->nullable();
            $table->timestamp('created_at')->nullable();

            $table->unique(['user_id', 'likeable_type', 'likeable_id'], 'likes_unique_per_user_and_content');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('likes');
    }
};
