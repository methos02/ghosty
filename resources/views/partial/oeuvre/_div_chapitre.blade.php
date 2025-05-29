@extends('partial.oeuvre._div_oeuvre')

@section('data')
    data-chapitre="{{$oeuvre->slug}}"
@overwrite

@section('infos')
    {{$oeuvre->user->pseudo}}
@overwrite
