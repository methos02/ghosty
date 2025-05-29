<div class="cadre-header h4"> Changer mot de passe </div>
@if (session('alert'))
    <div class="alert alert-danger" role="alert">
        {!! session('alert') !!}
    </div>
@endif
<p> Un Email pour réinitialiser votre mot de passe vous sera envoyé.</p>
<div class="cadre-body">
    @if (session('status'))
        <div class="alert alert-success" role="alert">
            {{ session('status') }}
        </div>
    @endif
    {!! FormCustom::open('password_email',['action' => route('password.email'), 'method' => 'post', 'class' => 'row-column','errors' => $errors, 'old' => Session::getOldInput()]) !!}
        @csrf
        {!! FormCustom::mail('email', "Adresse Email", ['width' => 'order']) !!}
        <div class="row-flex">
            {!! FormCustom::btn('Envoyer le mail', ['class' => 'btn-gold', 'verif' => 'password_email']) !!}
            <a class="btn" href="{{ route('password.request') }}" data-affiche="login"> Connexion </a>
        </div>
    {!! Form::close() !!}
</div>
