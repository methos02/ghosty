<nav>
    <div class="side-left">
        <a href="{{route('home')}}" >
            <img src="{{asset('images/logo_mini.png')}}" class="logo" alt="logo">
            <span class="title-left hidden-xs">Ghos</span><span class="title-right hidden-xs">TY</span>
        </a>
    </div>
    <div class="side-right">
        @if(Auth::check())
            @include('layouts.navbarre._logged')
        @else
            @include('layouts.navbarre._unlogged')
        @endif
        <?php if($_SERVER['PHP_SELF'] == '/principe.php') { echo '<div class="hamburger-menu visible-xs"  data-affiche="side-menu"></div>';}?>
        @yield('nav-right')
    </div>
</nav>