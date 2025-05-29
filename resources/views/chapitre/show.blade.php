@extends('layouts.page')

@section('background'){{asset($roman->cover_path)}} @endsection

@section('first-part')
    <div class="roman-titre" id="roman-titre">{{ $roman->titre_roman }}</div>

@endsection

@section('second-part')
    <div class="toolbar" id="read-toolbar">
        <div class="toolbar-left">
            <a href="" data-legende data-show="config">
                <span class="glyphicon glyphicon-font link-config" ></span>
                <span class="hover-legende" style="display: none"> Options d'affichage !! </span>
            </a>
            <a href="" data-legende data-action="mode_lecture">
                <img src="{{asset('images/nuit.png')}}" alt="Mode nuit">
                <span class="hover-legende" style="display: none"> Mode lecture </span>
            </a>
            <a href="" data-legende data-action="mode_lecture" style="display: none">
                <img src="{{asset('images/jour.png')}}"  alt="Mode normal">
                <span class="hover-legende" style="display: none"> Mode normal </span>
            </a>
            <a href="" data-legende data-action="print">
                <img src="{{asset('images/print.png')}}" alt="Imprimer">
                <span class="hover-legende" style="display: none"> Imprimer le chapitre</span>
            </a>
        </div>
        @include('partial.paginateur._roman_paginateur', ['roman' => $roman, 'chapitre' => $chapitre])
        <div class="toolbar-right"></div>
    </div>
    <div class="chapitre-titre" id="chapitre-titre">{{$chapitre->order}}. {{ $chapitre->titre_chapitre }} </div>
    <div class="chapitre-writer" id="chapitre-writer"> par <span id="writer">{{ $chapitre->user->pseudo  }}</span></div>
    <div class="chapitre-content" id="chapitre-content">
        {{ $chapitre->recit }}
    </div>
@endsection
