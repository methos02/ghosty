<?php

use App\Roman;
use Carbon\Carbon;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRomansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('romans', function (Blueprint $table) {
            $table->increments('id');
            $table->string('titre_roman')->default('')->nullable();
            $table->string('slug')->default('');
            $table->string('cover')->default('defaut/cover-vide.jpg');
            $table->integer('name_cover')->default(-1);
            $table->integer('user_id');
            $table->foreign('user_id')->references('id')->on('users')
                ->onDelete('restrict')
                ->onUpdate('restrict');
            $table->integer('genre_id');
            $table->foreign('genre_id')->references('id')->on('genres')
                ->onDelete('restrict')
                ->onUpdate('restrict');
            $table->text('slug_genre');
            $table->integer('nb_suite')->default(0);
            $table->integer('nb_favoris')->default(0);
            $table->integer('nb_vote')->default(0);
            $table->integer('vote')->default(0);
            $table->integer('statut')->unsigned()->default(Roman::S_BROUILLON);
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
        Schema::dropIfExists('romen');
    }
}
