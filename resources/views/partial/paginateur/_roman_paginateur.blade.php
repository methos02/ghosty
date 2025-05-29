@if($roman->nb_suite > 1)
    <div class="toolbar-center">
        @include('partial.paginateur._paginateur', ['oeuvre' => 'roman', 'roman' => $roman, 'chapitre' => $chapitre])
    </div>
@endif
