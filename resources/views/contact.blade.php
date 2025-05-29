@extends('layouts.page')

@section('class', 'contact')

@section('first-part')
    <h1 class="first-title"> Contact  </h1>
    <div class="first-content">
        Un retour de votre expérience sur Equipassion.fr est très important à nos yeux. <br>
        Si vous avez une question ou une suggestion, n'hésitez pas à nous contacter. <br>
        Vous aurez une réponse le plus rapidement possible.
    </div>
@endsection

@section('second-part')
    {!! FormCustom::open('form-contact',['action' => route('send'), 'method' => 'post', 'class' => 'row-column', 'errors' => $errors, 'old' => Session::getOldInput()]) !!}
    @csrf
    {!! FormCustom::mail('mail', 'Votre adresse mail', ['width' => 'order', 'obliger' => 1]) !!}
    {!! FormCustom::titre('sujet', 'Sujet', ['width' => 'order', 'obliger' => 1]) !!}
    {!! FormCustom::text('message', 'Message', ['width' => 'order', 'height' => 200, 'obliger' => 1]) !!}
    {!! FormCustom::btn('Envoyer', ['class' => 'btn-gold', 'verif' => 'form-contact']) !!}
    {!! FormCustom::close() !!}
@endsection
