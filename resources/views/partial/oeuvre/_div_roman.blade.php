@extends('partial.oeuvre._div_oeuvre')

@section('data')
    data-roman="{{$oeuvre->slug}}"
@overwrite

@section('infos')
    {{$oeuvre->genre->name_genre}}
@overwrite