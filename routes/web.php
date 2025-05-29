<?php
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Auth::routes(['verify' => true]);
Route::get('/success_register', ['uses' => 'Auth\RegisterController@successRegister', 'as' => 'register.success']);

Route::get('/', function() { return redirect('/vote/all/top');})->name('home');
Route::get('/{page}/{genre}/{tri}', ['uses' => 'AppController@home'])
    ->where(['page' => 'vote|continu', 'genre' => '[\w\d\-\_]+|all', 'tri' => 'top|random|populaire|last']);
Route::get('/add/{genre?}', ['uses' => 'AppController@add']);

Route::post('/getBrouillon', ['uses' => 'RomanController@getBrouillon']);
Route::put('/update/roman', ['uses' => 'RomanController@update', 'as' => 'roman.update']);

Route::get('/principe', ['uses' => 'AppController@principe', 'as' => 'principe']);
Route::get('/conditions_generales', ['uses' => 'AppController@cgu', 'as' => 'cgu']);
Route::get('/droits_auteurs', ['uses' => 'AppController@auteurs', 'as' => 'auteurs']);

Route::get('/contact', ['uses' => 'ContactController@contact', 'as' => 'contact']);
Route::post('/contact', ['uses' => 'ContactController@send', 'as' => 'send']);

Route::post('/roman/infos', ['uses' => 'RomanController@infos']);
Route::post('/chapitre/infos', ['uses' => 'ChapitreController@infos']);
Route::get('/chapitre_vote/{slug}', ['uses' => 'RomanController@chapitreInVote', 'as' => 'chapitres.vote'])->where('slug', '[\w\d\-\_]+');

Route::get('/add/{slug}', ['uses' => 'ChapitreController@add', 'as' => 'chapitre.add'])->where('slug', '[\w\d\-\_]+');
Route::get('/lire/{slug}', ['uses' => 'ChapitreController@show', 'as' => 'chapitre.show'])->where('slug', '[\w\d\-\_]+');

Route::get('/profil', ['uses' => 'UserController@profil', 'as' => 'profil']);
Route::get('/favoris', ['uses' => 'UserController@favoris', 'as' => 'favoris']);
Route::post('/update_avatar', 'UserController@updateAvatar');
Route::post('/update_mail', ['uses' => 'Usercontroller@resetMail', 'as' => 'user_mail']);
Route::post('/update_mdp', ['uses' => 'Usercontroller@updateMdp', 'as' => 'user_mdp']);
Route::post('/update_notif', ['uses' => 'Usercontroller@updateNotif']);
Route::post('/mailling_register', ['uses' => 'UserController@maillingRegister', 'as' => 'mailling_register']);

Route::get('/participation', ['uses' => 'UserController@participation', 'as' => 'participation']);
Route::get('/vote_utilisateur', ['uses' => 'UserController@userVote', 'as' => 'vote_user']);
Route::get('/brouillon', ['uses' => 'UserController@brouillon', 'as' => 'brouillon']);
Route::get('/vote_oeuvre_utilisateur', ['uses' => 'UserController@voteOeuvreUser', 'as' => 'vote_oeuvre_user']);

Route::get('/notifications', ['uses' => 'NotifController@index', 'as' => 'notifs']);
Route::get('/corbeille', ['uses' => 'NotifController@corbeille', 'as' => 'corbeille']);
Route::post('/notifs/delete', ['uses' => 'NotifController@delete']);
Route::post('/notifs/recup', ['uses' => 'NotifController@recup']);
Route::post('/notifs/destroy', ['uses' => 'NotifController@destroy']);
Route::post('/notif', ['uses' => 'NotifController@show']);

Route::get('/admin/signalement', ['uses' => 'AdminController@signals', 'as' => 'admin.signals']);
Route::get('/admin/mail', ['uses' => 'AdminController@mail', 'as' => 'admin.mail']);

Route::post('/json/chapitre/order', ['uses' => 'ChapitreController@jsonOrder']);
Route::post('/json/chapitre/slug', ['uses' => 'ChapitreController@jsonSlug']);

Route::post('/html/home/roman', ['uses' => 'RomanController@htmlRoman']);