<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * @see memory-bank/decisions/ADR-10-notifications-in-app-agregees.md
     */
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('type');
            $table->morphs('notifiable');
            $table->text('data');
            $table->timestamp('read_at')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->string('group_key')->nullable()->index();
            $table->string('unread')
                ->nullable()
                ->virtualAs('CASE WHEN read_at IS NULL THEN group_key END');

            $table->unique(
                ['notifiable_type', 'notifiable_id', 'unread'],
                'notifications_one_unread_per_group'
            );
            $table->index(['notifiable_type', 'notifiable_id', 'read_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
