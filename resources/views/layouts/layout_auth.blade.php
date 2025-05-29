@extends('layouts.doctype')

@section('content')
    <div class="single-part">
        <div class="theme-connexion">
            @include('layouts._nav')
        </div>
        <div class="div-connexion {!! isset($page) && $page === 'login'? 'cadre-login' : ''; !!}">
            <div class="cadre-auth">
                @yield('auth-content')
            </div>
        </div>
    </div>
    @include('layouts._footer')
@endsection
