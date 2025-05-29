@extends('layouts.page')
@section('titre', 'Profil')

@section('first-part')
    <div class="profil-top">
        {!! FormCustom::open('form-avatar',['class' => 'form-avatar']) !!}
        {!! FormCustom::img_cropper('avatar', '', ['preview' => asset('storage/avatar/' . $user->avatar), 'ratio' => '1', 'class_btn' => 'btn-neg-native']) !!}
        {!! Form::close() !!}
        <h4 class="h4 title-profil"> Profil de {{ $user->pseudo }}</h4>
    </div>
@endsection

@section('second-part')
    <div class="profil-bot">
        {!! FormCustom::open('user-mail',['action' => route('user_mail'), 'method' => 'post', 'errors' => $errors, 'old' => Session::getOldInput()]) !!}
        <strong>Changer d'adresse mail</strong>
        @csrf
        <div class="row-flex">
            {!! FormCustom::mail('mail', 'Adresse mail', ['obliger' => true, 'width' => 'order']) !!}
            {!! FormCustom::btn('Modifier Mail', ['class' => 'btn-ghosty btn-neg-native', 'verif' => 'user-mail']) !!}
        </div>
        {!! Form::close() !!}
        {!! FormCustom::open('reset-password',['action' => route('user_mdp'), 'method' => 'post', 'errors' => $errors, 'old' => Session::getOldInput()]) !!}
        <strong>Changer de mot de passe</strong>
        @csrf
        <div class="row-flex">
            {!! FormCustom::mdp('password', 'Ancien mot de passe', ['obliger' => true, 'width' => 'order']) !!}
            {!! FormCustom::mdp_2('new_password', 'Nouveau mot de passe', ['obliger' => true, 'width' => 'order']) !!}
            {!! FormCustom::btn('Modifier mot de passe', ['class' => 'btn-ghosty btn-neg-native', 'verif' => 'reset-password']) !!}
        </div>
        {!! Form::close() !!}
        <strong>Notification</strong>
        <div class="row-flex">
            {!! FormCustom::open('maillingRegister') !!}
                @csrf
                {!! FormCustom::checkbox('notif', 'Recevoir des mails concernant les notifications', ['checked' => $user->notif]) !!}
            {!! Form::close() !!}
        </div>
        <div class="alert danger" id="notif-disable" {!! $user->notif != 0 ? 'style="display:none"' : '' !!}>
            Vous n'êtes pas averti des évènements qui se passent sur le site (évolutions des romans, résultats de vote, commentaires ...).
        </div>
    </div>
    @include('layouts._modal_resize')
@endsection