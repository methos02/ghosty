@foreach($romans as $oeuvre)
    @include('partial.oeuvre._div_roman', ['oeuvre' => $oeuvre])
@endforeach