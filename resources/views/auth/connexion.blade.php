@extends('layouts.layout_auth')

@section('auth-content')
    <div class="div-register {!!  $page === 'login'? 'cadre-none' : ''; !!}">
        @include('auth.form.register')
    </div>
    <div class="div-login {!!  $page === 'register' || $page === 'password' ? 'cadre-none' : ''; !!}">
        <div data-div="login" {!! HtmlShortcut::isVisible( $page !== 'password' ) !!}> @include('auth.form.login') </div>
        <div data-div="reset" {!! HtmlShortcut::isVisible( $page === 'password' ) !!}> @include('auth.form.reset') </div>
    </div>
    <div class="div-switch-connexion" id="div-switch-connexion" {!!  $page === 'register'? 'style="left: 50%; border-radius: 0px 3px 3px 0px;"' : ''; !!}>
        <div class="div-switch-btn" data-div="btn-login" {!!  $page === 'register'? 'style="display: none"' : ''; !!} >
            <h4 class="h4 text-center">Nouveau parmis nous ?</h4>
            <p> Inscrivez vous </p>
            <p> et </p>
            <p> Recevez 2 vidéos gratuites. </p>
            <button class="btn" data-affiche="btn-register"> S'inscrire </button>
        </div>
        <div class="div-switch-btn" data-div="btn-register" {!!  $page === 'login'? 'style="display: none"' : ''; !!}>
            <h4 class="h4 text-center">Déjà membre ?</h4>
            <p> Connectez vous </p>
            <p> Pour voir ou revoir nos vidéos.</p>
            <button class="btn" data-affiche="btn-login"> Se connecter </button>
        </div>
    </div>
@endsection