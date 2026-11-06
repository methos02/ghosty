<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * @see memory-bank/decisions/ADR-13-commentaires.md
     */
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('author_id')->constrained('users')->cascadeOnDelete();
            $table->morphs('commentable');
            $table->foreignId('parent_id')->nullable()->constrained('comments')->cascadeOnDelete();
            $table->unsignedInteger('reply_count')->default(0);
            $table->text('content')->nullable();
            $table->boolean('is_spoiler')->default(false);
            $table->unsignedTinyInteger('status')->default(1);
            $table->timestamps();

            $table->index(['commentable_type', 'commentable_id', 'parent_id', 'status'], 'comments_thread_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
