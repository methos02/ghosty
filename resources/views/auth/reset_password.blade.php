@extends('layouts.layout_auth')

@section('auth-content')
    <div class="div-reset">
        <div class="cadre-header h4"> Changement de mot de passe </div>
        <div class="cadre-body">
            {!! FormCustom::open('reset_password',['action' => route('password.update'), 'method' => 'post', 'class' => 'row-column','errors' => $errors, 'old' => Session::getOldInput()]) !!}
            {{ csrf_field() }}
            <input type="hidden" name="token" value="{{ $token }}">
            <input type="hidden" name="email" value="{{ $email }}">
            @if($errors->has('email'))
                <span class="alert alert-danger"> {{ $errors->first() }}</span>
            @endif
            {!! FormCustom::mdp_2('password', "Mot de passe", ['width' => 'order', 'obliger' => true]) !!}
            {!! FormCustom::btn('Se connecter', ['class' => 'btn-gold', 'verif' => 'reset_password']) !!}
            {!! Form::close() !!}
        </div>
    </div>
@endsection
