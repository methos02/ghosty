<div class="row-flex div-decompte">
    <div class="decompte" data-decompte="init">
        <div class="decompte-titre"> Fin du cycle </div>
        <div class="row-flex">
            <div class="number">
                <div class="intitule">J</div>
                <div class="jour">00</div>
            </div>
            <div class="number">
                <div class="intitule">H</div>
                <div class="heure">00</div>
            </div>
            <div class="number">
                <div class="intitule">M</div>
                <div class="minute">00</div>
            </div>
            <div class="number">
                <div class="intitule">S</div>
                <div class="seconde">00</div>
            </div>
        </div>
    </div>
</div>
<div class="div-user">
    <div class="div-photo">
        <a href="{{route('profil')}}"><img src="{{ asset(Auth::user()->avatar_path) }}" alt="photo de profil"></a>
    </div>
    <div class="div-menu">
        <a href="{{route('profil')}}" class="header-pseudo">{{ Auth::user()->pseudo }}</a>
        <a href="{{route('brouillon')}}"><span id="nb_brouillon">{{ Auth::user()->nb_brouillon }}</span> brouillon{{ Auth::user()->nb_brouillon > 1 ? 's' : '' }} en cours </a>
        <a href="{{route('notifs')}}"><span id="nb_message">{{ Auth::user()->nb_notif }}</span> nouvelle{{ Auth::user()->plurielNotif() }} notification{{ Auth::user()->plurielNotif() }}</a>
    </div>
</div>