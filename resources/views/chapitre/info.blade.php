@extends('layouts.info')

@section('titre')
    {{$chapitre->titre_chapitre}}
@overwrite

@section('cover')
    {{asset($chapitre->cover_path)}}
@overwrite