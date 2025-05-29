@extends('layouts.info')

@section('titre')
    {{$roman->titre_roman}}
@overwrite

@section('cover')
    {{asset($roman->cover_path)}}
@overwrite

@section('btn')
    @if( Auth::check() && $roman->statut == \App\Roman::S_WRITE )
        <a href="{{ route('chapitre.add',['slug' => $roman->slug]) }}" class="btn-ghosty btn-native btn-neg-native"> Continuer </a>
    @elseif( Auth::check() && $roman->statut == \App\Roman::S_VOTE )
        <a href="{{ route('chapitres.vote',['slug' => $roman->slug]) }}" class="btn-ghosty btn-native btn-neg-native"> Voter </a>
    @endif
@endsection