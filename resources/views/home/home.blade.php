@extends('layouts.doctype')

@section('content')
    <div class="div-principale {{ Auth::check()? 'nav-profil': 'height-unlog' }}">
        @include('layouts._nav')
        @include( Auth::check()? 'home._logged': 'home._unlog' )
        @include('home._nav_centrale')
    </div>
    <div class="div-secondaire">
        @if(Auth::check())
            <div class="div-add" id="home-add" {!! $page !== 'add' ? 'style="display:none"' : '' !!}>
                @include('partial.form.form_roman')
            </div>
        @endif
        <div class="div-oeuvre" id="home-vote" {!! $page != 'vote' ? 'style="display:none"' : ''  !!} >
            @if($page == 'vote' && !$romans->isEmpty())
                @foreach($romans as $oeuvre)
                    @include('partial.oeuvre._div_roman', ['oeuvre' => $oeuvre])
                @endforeach
            @endif
            {{$page == 'vote' && $romans->isEmpty()? 'Aucun roman trouvé' : '' }}
        </div>
        <div class="div-oeuvre" id="home-continu" {!! $page != 'continu' ? 'style="display:none"' : ''  !!} >
            @if($page == 'continu' && !$romans->isEmpty())
                @foreach($romans as $oeuvre)
                    @include('partial.oeuvre._div_roman', ['oeuvre' => $oeuvre])
                @endforeach
            @endif
            {{$page == 'continu' && $romans->isEmpty()? 'Aucun roman trouvé' : '' }}
        </div>
    </div>
    @include('layouts._footer')
@endsection

@section('addon')
    @if(Auth::check())
        @include('layouts._modal_resize')
    @endif
    @include('layouts._modal', ['id_modal' => 'modal_infos'])
@endsection
