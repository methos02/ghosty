<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Arbre du multivers narratif : un chapitre peut recevoir plusieurs suites,
     * aucune n'élimine les autres.
     *
     * @see memory-bank/decisions/ADR-07-modele-multivers-arbre-de-chapitres.md
     */
    public function up(): void
    {
        Schema::create('chapters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('novel_id')->constrained('novels')->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('chapters')->cascadeOnDelete();
            $table->foreignId('author_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->longText('content');
            $table->text('summary')->nullable();

            $table->string('path');
            $table->unsignedSmallInteger('depth')->default(0);

            // Volontairement pas `children_count` : Eloquent réserve ce nom au
            // résultat de `withCount('children')`, qui écraserait ce compteur.
            $table->unsignedInteger('continuations_count')->default(0);
            $table->unsignedInteger('like_count')->default(0);
            $table->unsignedInteger('comment_count')->default(0);
            $table->unsignedInteger('read_count')->default(0);

            $table->boolean('is_main_child')->default(false);
            $table->unsignedTinyInteger('status')->default(1);

            $table->timestamp('published_at')->nullable();
            $table->timestamp('last_activity_at')->nullable();
            $table->timestamps();

            $table->index(['novel_id', 'parent_id']);
            $table->index(['parent_id', 'is_main_child']);
            $table->index(['status', 'last_activity_at']);
            $table->index('path');
            $table->index(
                ['novel_id', 'continuations_count', 'status', 'last_activity_at'],
                'chapters_active_branches_index'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chapters');
    }
};
