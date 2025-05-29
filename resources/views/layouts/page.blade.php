@extends('layouts.doctype')

@section('content')
    <div class="div-first" id="div-first" style="background: -webkit-linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2)), url(@yield('background', '/images/accueil.jpg')">
        @include('layouts._nav')
        @yield('first-part')
    </div>
    <div class="div-second" id="div-second">
        @yield('second-part')
    </div>
    @include('layouts._footer')
@endsection
