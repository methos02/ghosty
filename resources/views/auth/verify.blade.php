@extends('layouts.layout_auth')

@section('auth-content')
    <div class="div-verify">
        <h1>{{ Session('title') ?? 'Adresse email non vérifiée.' }}</h1>
        <div class="card-body">
            @if (session('resent'))
                <div class="alert alert-success" role="alert">
                    Un mail contenant le lien vient de vous être renvoyé.
                </div>
            @endif
            <p>
                Pour accéder à la partie réservée au membre veuillez cliquer sur le lien contenu dans le mail que vous avez reçu à l'adresse: {{ Auth::user()->email }}
            </p>
            <p>
                Si vous n'avez pas reçu l'email, vérifiez dans les emails indésirables et cliquez sur le lien suivant, <a href="{{ route('verification.resend') }}"> envoie d'un nouveau mail</a>.
            </p>
        </div>
    </div>
@endsection
