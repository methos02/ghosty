@extends('notif.layout')

@section('page', 'Reception')

@section('table-header')
    <th class="colonne-check"><button class="message-supp" data-action="notif-supp"  data-href="/notifs/delete"><img src="{{asset('images/corbeille.png')}}" class="message-icone-supp" alt="corbeille"></button></th>
    <th class="colonne-puce"></th>
    <th></th>
    <th class="colonne-date"><a href="{{route('corbeille')}}">Corbeille</a></th>
@endsection
