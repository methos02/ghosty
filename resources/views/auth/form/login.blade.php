<div class="cadre-header h4"> Connexion </div>
<div class="cadre-body">
    @if (session('status'))
        <div class="alert alert-success" role="alert">
            {{ session('status') }}
        </div>
    @endif
    @if (strpos(Session::get('url.intended', url('/')), 'email/verify/') !== false )
        <div class="alert alert-danger" role="alert">
            Vous devez être connecté pour activer votre compte
        </div>
    @endif
    {!! FormCustom::open('login',['action' => route('login'), 'method' => 'post', 'class' => 'row-column','errors' => $errors, 'old' => Session::getOldInput()]) !!}
    @csrf
    {!! FormCustom::mail('email', "Adresse Email", ['width' => 'order', 'obliger' => true]) !!}
    {!! FormCustom::mdp('password', "Mot de passe", ['width' => 'order', 'obliger' => true]) !!}
    {!! FormCustom::checkbox('remember', 'Rester connecté') !!}
    <div class="row-flex">
        {!! FormCustom::btn('Se connecter', ['class' => 'btn-gold', 'verif' => 'login']) !!}
        <a class="btn" href="#"  data-affiche="reset" >Mot de passe?</a>
    </div>
    {!! Form::close() !!}
</div>