<div class="dropdown">
    <a href="#" class="link-hamburger" data-open="dropdown-content"><span class="hamburger"></span></a>
    <div class="dropdown-content" data-menu="dropdown" style="display: none">
        <a href="{{route('home')}}">Accueil</a>
        <a href="{{route('principe')}}"> Principe </a>
        <a href="{{route('profil')}}">Profil</a>
        <span role="separator" class="divider"></span>
        <a href="{{route('notifs')}}">Mes notifications</a>
        <a href="{{route('participation')}}">Mes Participations</a>
        <a href="{{route('vote_user')}}">Mes votes</a>
        <a href="{{route('vote_oeuvre_user')}}">Mes oeuvres en cours de vote</a>
        @if(Auth::user()->droit === App\User::ADMIN)
            <span role="separator" class="divider"></span>
            class="header-li-admin"><a href="{{route('admin.signals')}}">Les signalements {{ $numb_signals ?? '' }}</a>
            class="header-li-admin"><a href="{{route('admin.mail')}}"> Envoi mail </a>
        @endif
        <span role="separator" class="divider"></span>
        <form action="{{route('logout')}}" method="POST">
            @csrf
            <input type="submit" value="Déconnexion">
        </form>
    </div>
</div>
<a class="img-link reference" href="{{route('favoris')}}" data-legende>
    <img src="{{asset('images/coeur.png')}}" alt="coeur">
    <span class="hover-legende" style="display: none"> Favoris </span>
    {{ Auth::user()->new_favoris != 0 ? '<span class="badge">' . Auth::user()->new_favoris . '</span>' : ''}}
</a>
