<button class="modal-close" data-close="modal">&times;</button>
<div class="info-header" style="background: -webkit-linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5)), url(@yield('cover') ">
    <div class="info-titre" id="info-titre">@yield('titre')</div>

    @if( Auth::check())
        <div class="div-link">
            <div class="cadre-link reference">
                <a href="" data-action="favoris" data-legende>
                    <img src="images/coeur.png" alt="Coeur" >
                    <span class="hover-legende" style="display: none"> Favoris </span>

                </a>
            </div>
        </div>
    @endif
</div>
<div class="modal-body">
    @if( !Auth::check())
        <div class="row-flex info-auth">
            <a href="{{route('login')}}" class="btn-switch" data-show="connexion"> Connexion </a>
            <a href="{{route('register')}}" class="btn-switch" data-show="inscription"> Inscription </a>
        </div>
    @endif
    <div class="text-right" id="div-resume">
        <a href="{{ route('chapitre.show',['slug' => $chapitre->slug]) }}" class="btn-ghosty btn-native btn-neg-native" > Lire </a>
        @yield('btn')
    </div>
    <div id="info-resume" class="info-resume">{{ $chapitre->resume }}</div>
</div>
