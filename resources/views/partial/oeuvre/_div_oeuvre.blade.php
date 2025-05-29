<div class="fiche-oeuvre">
    <div class="oeuvre-cover @yield('cursor', '')" @yield('data', '')>
        <img src="{{asset($oeuvre->cover_path)}}" alt="couverture oeuvre">
        <div class="oeuvre-cadre {{$oeuvre->border}}">
            <div class="abs_top right top-corner-right">{{$oeuvre->barre}}</div>
            <div class="oeuvre-titre">{{$oeuvre->titre}}</div>
            <div class="oeuvre-genre {{$oeuvre->color}}"> @yield('infos') </div>
        </div>
    </div>
</div>