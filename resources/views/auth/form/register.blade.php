<div class="cadre-header h4"> Inscription </div>
<div class="cadre-body">
        @if (session('status'))
                <div class="alert alert-success" role="alert">
                        {{ session('status') }}
                </div>
        @endif
        {!! FormCustom::open('register',['action' => route('register'), 'method' => 'post', 'class' => 'row-column form-register', 'errors' => $errors, 'old' => Session::getOldInput()]) !!}
                @csrf
                {!! FormCustom::titre('pseudo', "Pseudo", ['width' => 'order', 'message' => 'pseudo', 'obliger' => true]) !!}
                {!! FormCustom::mail('email', "Adresse Email", ['width' => 'order', 'obliger' => true]) !!}
                {!! FormCustom::mdp_2('password', "Mot de passe", ['width' => 'order', 'obliger' => true]) !!}
                {!! FormCustom::checkbox('mailling', 'M\'inscrire à la mailling liste.') !!}
                {!! FormCustom::btn('S\'inscrire', ['class' => 'btn-gold', 'verif' => 'register']) !!}
        {!! Form::close() !!}
</div>