@extends('layouts.page')
@section('class', 'contact')

@section('first-part')
    <h1 class="first-title"> Mes Notifications - @yield('page') </h1>
@endsection

@section('second-part')
    <table class="tableau tableau-message">
        <tr>
            @yield('table-header')
        </tr>
        @foreach($notifs as $notif)
            <tr class="tr-message{{$notif->isNew() ? ' message-new' : ''}}" data-notif="{{$notif->id}}">
                <td><label><input name="notif[]" type="checkbox" value="{{$notif->id}}"></label></td>
                <td>{!! $notif->isNew() ? '<img src="' . asset('images/puce_new.png') . '" alt="Puce New">' : '' !!}</td>
                <td>{{$notif->titre}}</td>
                <td>{{$notif->created_at}}</td>
            </tr>
        @endforeach

        @if($notifs->isEmpty())
            <tr><td class="empty-result" colspan="4">Vous n'avez pas de notification. </td></tr>
        @endif

    </table>
@endsection

@section('addon')
    @include('layouts._modal', ['id_modal' => 'modal_notif'])
@endsection
