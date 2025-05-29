@extends('notif.layout')

@section('page', 'Corbeille')

@section('table-header')
    <th class="colonne-check"><button data-action="notif-vider" data-href="/notifs/destroy">Vider</button></th>
    <th class="colonne-puce"><button data-action="notif-recup" data-href="/notifs/recup">Récupérer</button></th>
    <th></th>
    <th class="colonne-date"><a href="{{route('notifs')}}">Boite de reception</a></th>
@endsection
