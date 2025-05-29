<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta property="og:image" content="https://www.ghosty.fr/images/miniature_facebook.png" />
    <meta property="og:title" content="Ghosty" />
    <meta property="og:description" content="Le premier site de roman participatif." />

    <title>{{ config('app.name', 'Laravel') }} @yield('page_name') </title>

    <script src="{{ asset('js/app.js') }}" defer></script>
    <link rel="icon" type="image/png" href="{{asset('images/logo_mini.png')}}" />
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,300,400,700" rel="stylesheet">
    <link href="{{ asset('css/styles.css') }}" rel="stylesheet">
</head>
<body>
<div class="content">
    @yield('content')
</div>
@yield('addon', '')
@if (session('success'))
    @include('layouts.flash', ['class' => 'message-global message-success', 'message' => session('success')])
@endif
@if (session('error'))
    @include('layouts.flash', ['class' => 'message-global message-erreur', 'message' => session('error')])
@endif
</body>
</html>
