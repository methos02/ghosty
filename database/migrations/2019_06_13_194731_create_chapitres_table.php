<?php

use App\Chapitre;
use Carbon\Carbon;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateChapitresTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('chapitres', function (Blueprint $table) {
            $table->increments('id');
            $table->string('titre_chapitre')->default('')->nullable();
            $table->string('slug')->default('');
            $table->longText('recit')->nullable();
            $table->longText('resume')->nullable();
            $table->integer('order')->unsigned()->default(1);
            $table->boolean('end')->default(0);
            $table->integer('user_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('users')
                ->onDelete('restrict')
                ->onUpdate('restrict');
            $table->integer('roman_id')->unsigned();
            $table->foreign('roman_id')->references('id')->on('romans')
                ->onDelete('restrict')
                ->onUpdate('restrict');
            $table->integer('nb_modif')->unsigned()->default(0);
            $table->integer('nb_com')->unsigned()->default(0);
            $table->integer('vote')->unsigned()->default(0);
            $table->integer('nb_vote')->unsigned()->default(0);
            $table->integer('statut_chap')->unsigned()->default(Chapitre::S_BROUILLON);
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
        Schema::dropIfExists('chapitres');
    }
}
