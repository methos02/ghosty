@extends('layouts.page')

@section('background'){{asset($roman->cover_path)}} @endsection

@section('first-part')
    <div class="roman-titre" id="roman-titre">{{ $roman->titre_roman }}</div>
@endsection

@section('second-part')
    <div class="row-flex">
        @foreach($chapitres as $oeuvre)
            @include('partial.oeuvre._div_chapitre', ['oeuvre' => $oeuvre])
        @endforeach
    </div>
@endsection

@section('addon')
    @include('layouts._modal', ['id_modal' => 'modal_infos'])
@endsection
