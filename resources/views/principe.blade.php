@extends('layouts.doctype')

@section('content')
    <div class="navbar-principe">
        @include('layouts._nav')
        <div class="nav-secondaire">
            <a href="#principe"> Le principe </a>
            <a href="#cycle"> Les cycles </a>
            <a href="#vote"> Voter </a>
            <a href="#debut"> Débuter un roman </a>
            <a href="#suite"> Continuer un roman </a>
            <a href="#cover"> Les couvertures </a>
        </div>
    </div>
    <div class="row-principe" id="principe">
        <div class="row-title theme-principe">
            <h1> Le principe </h1>
        </div>
        <div class="row-content">
            <div class="aide-content">
                <p> Ghosty vous offre la possibilité de participer à la création d’un roman. </p>
                <p> Vous pouvez tenir l’un ou plusieurs de ces rôles: </p>
                <ul>
                    <li>Auteur : vous rédigez le début d’un roman ou la suite d’une œuvre existante. </li>
                    <li>Illustrateur : vous proposez une couverture par roman </li>
                    <li>Lecteur : vous votez pour votre chapitre et/ou votre couverture préférés </li>
                </ul>
                <p> Une fois terminé, les romans seront mis en vente sur le site. <br> Une partie des bénéfices ira aux auteurs et à l'illustrateur.</p>
            </div>
            <div class="aide-content hidden-xs"></div>
        </div>
    </div>
    <div class="row-principe" id="cycle">
        <div class="row-title theme-cycle">
            <h1>Les cycles</h1>
        </div>
        <div class="row-content">
            <div class="aide-content">
                <p>La création des romans suit un cycle: </p>
                <ul>
                    <li> une phase d'écriture. </li>
                    <li> une phase de vote.</li>
                </ul>
                <p>Ce cycle recommence jusqu'à ce que le roman soit terminé.</p>
                <p>Un nouveau cycle démarre tous les lundis à minuit.</p>
                @if(!Auth::check())
                    <div class="row-btn-inscription hidden-xs">
                        <a href="" class="btn-inscription"  data-show="inscription"> Inscription </a>
                        <a href="" class="btn-inscription"  data-show="connexion"> Connexion </a>
                    </div>
                @endif
            </div>
            <div class="aide-content text-center">
                <div class="img-principe"><img src="{{asset('images/principe/cycle.png')}}" alt="image du cycle" ></div>
            </div>
        </div>
    </div>
    <div class="row-principe" id="vote">
        <div class="row-title theme-vote">
            <h1>Comment voter</h1>
            <p>Réservé aux utilsateurs connectés.</p>
        </div>
        <div class="row-content">
            <div class="aide-content">
                <p> Après avoir sélectionné un chapitre, cliquez sur Suite / Vote. </p>
                <p> A vous de faire votre choix:</p>
                <ul class="ul-vote">
                    <li><img src="{{asset('images/plus.png')}}" alt="vote positif"> : Si vous voulez que ce chapitre soit la suite du roman.</li>
                    <li><img src="{{asset('images/moins.png')}}" alt="vote négatif"> : Si vous ne voulez pas que ce chapitre soit la suite du roman.</li>
                </ul>
                <p>Un chapitre doit avoir un minimum de votes pour être pris en compte.</p>
                @if(!Auth::check())
                    <div class="row-btn-inscription hidden-xs">
                        <a href="" class="btn-inscription"  data-show="inscription"> Inscription </a>
                        <a href="" class="btn-inscription"  data-show="connexion"> Connexion </a>
                    </div>
                @endif
            </div>
            <div class="aide-content">
                <div class="img-principe"><img src="{{asset('images/principe/voter.png')}}" alt="image pour voter"></div>
            </div>
        </div>
    </div>
    <div class="row-principe" id="debut">
        <div class="row-title theme-debut">
            <h1>Débuter un roman</h1>
            <p>Réservé aux utilsateurs connectés.</p>
        </div>
        <div class="row-content">
            <div class="aide-content img-content">
                <div class="img-principe"><img src="{{asset('images/principe/debut.png')}}" alt="rédiger un début"></div>
            </div>
            <div class="aide-content text-content">
                <p> Cliquez sur "écrire un début" sur l'accueil pour commencer un roman. </p>
                <p> Selectionnez le genre de votre oeuvre et introduisez votre texte. </p>
                @if(!Auth::check())
                    <div class="row-btn-inscription hidden-xs">
                        <a href="" class="btn-inscription"  data-show="inscription"> Inscription </a>
                        <a href="" class="btn-inscription"  data-show="connexion"> Connexion </a>
                    </div>
                @endif
            </div>
        </div>
    </div>
    <div class="row-principe" id="suite">
        <div class="row-title theme-suite">
            <h1>Continuer un roman </h1>
            <p>Réservé aux utilsateurs connectés.</p>
        </div>
        <div class="row-content">
            <div class="aide-content">
                <p> Après avoir sélectionné un chapitre cliquez sur "Ajouter une suite".</p>
                <p> Introduisez votre chapitre et le résumé de votre chapitre.</p>
                @if(!Auth::check())
                    <div class="row-btn-inscription hidden-xs">
                        <a href="" class="btn-inscription"  data-show="inscription"> Inscription </a>
                        <a href="" class="btn-inscription"  data-show="connexion"> Connexion </a>
                    </div>
                @endif
            </div>
            <div class="aide-content">
                <div class="img-principe"><img src="{{asset('images/principe/suite.png')}}" alt="Continuer un roman"></div>
            </div>
        </div>
    </div>
    <div class="row-principe principe-last" id="cover">
        <div class="row-title theme-cover">
            <h1> Les couvertures </h1>
            <p>Réservé aux utilsateurs connectés.</p>
        </div>
        <div class="row-content">
            <div class="aide-content img-content">
                <div class="img-principe"><img src="{{asset('images/principe/cover.png')}}" alt="Proposer une couverture"></div>
            </div>
            <div class="aide-content text-content">
                <p> Vous pouvez proposer une couverture lorsque vous débutez un roman. </p>
                <p> Vous avez également la possibilité de proposer une couverture en sélectionnant un roman présent sur le site et en cliquant sur "Ajouter une couverture".</p>
                <p> Vous ne pouvez proposer qu'une couverture par roman.</p>
                @if(!Auth::check())
                    <div class="row-btn-inscription hidden-xs">
                        <a href="" class="btn-inscription"  data-show="inscription"> Inscription </a>
                        <a href="" class="btn-inscription"  data-show="connexion"> Connexion </a>
                    </div>
                @endif
            </div>
        </div>
    </div>
    @include('layouts._footer')
@endsection
