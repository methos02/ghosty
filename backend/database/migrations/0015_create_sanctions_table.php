<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
     */
    public function up(): void
    {
        Schema::create('sanctions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('moderator_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('report_id')->nullable()->constrained('reports')->nullOnDelete();
            $table->string('type', 32);
            $table->timestamp('until')->nullable();
            $table->text('reason');
            $table->timestamps();

            $table->index(['user_id', 'type', 'until']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sanctions');
    }
};
