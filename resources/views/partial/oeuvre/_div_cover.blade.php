@extends('partial.oeuvres.div_oeuvre')

@section('data')
    data-roman="{{$oeuvre->slug}}"
@endsection

@section('infos')
    {{$oeuvre->genre->name}}
@endsection