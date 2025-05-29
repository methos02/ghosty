<?php

use Carbon\Carbon;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCoversTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('covers', function (Blueprint $table) {
            $table->increments('id');
            $table->string('path');
            $table->string('user_id');
            $table->foreign('user_id')->references('id')->on('users')
                ->onDelete('restrict')
                ->onUpdate('restrict');
            $table->string('roman_id');
            $table->foreign('roman_id')->references('id')->on('romans')
                ->onDelete('restrict')
                ->onUpdate('restrict');
            $table->string('vote')->default(0);
            $table->string('nb_vote')->default(0);
            $table->string('statut')->default(0);
            $table->date('date_statut')->default(Carbon::now()->format('Y-m-d H:i:s'));
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('covers');
    }
}
