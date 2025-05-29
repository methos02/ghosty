<div class="div-centrale">
    <div class="navbar-side">
        <label for="order_roman">Trier par</label>
        <select name="order_roman" id="order_roman" {!! $page === 'add' ? 'disabled="disabled"' : '' !!}>
            <option value="top" {!! $tri === 'top' ? 'selected="selected"' : '' !!}>Top 10</option>
            <option value="populaire" {!! $tri === 'populaire' ? 'selected="selected"' : '' !!}>Popularité</option>
            <option value="last" {!! $tri === 'last' ? 'selected="selected"' : '' !!} >Jour de Vote</option>
            <option value="random" {!! $tri === 'random' ? 'selected="selected"' : '' !!}>Aléatoire</option>
        </select>
    </div>
    <div class="navbar-center">
        @if(Auth::check())
            <a href="" class="btn-switch {{ $page === 'add' ? 'visited' : '' }}" data-page="add"> Ecrire un début </a>
        @endif
        <a href="" class="btn-switch {{ $page === 'vote' ? 'visited' : '' }}" data-page="vote">  Lire / Voter </a>
        <a href="" class="btn-switch {{ $page === 'continu' ? 'visited' : '' }}" data-page="continu"> Ecrire une suite </a>
    </div>
    <div class="navbar-side">
        <label for="genre_roman">Genres</label>
        <select name="genre_roman" id="genre_roman" {{ $page === 'add' ? 'disabled="disabled' : '' }}>
            <option value="all">Tous</option>
            {!! $optionGenres !!}
        </select>
    </div>
</div>
