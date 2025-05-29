<div class="row-flex row-center" id="div-affiche-titre" {!! HtmlShortcut::isVisible($brouillon != 'roman_empty' ? $brouillon->afficheCoverName() : false) !!} >
    {!! FormCustom::select('name_cover', 'Inclure le titre du roman sur la couverture', ['0' => 'non', '1' => 'oui'], ['null' => 1, 'short_label' => false]) !!}
</div>
<div class="row-flex row-center">
    <div class="input-cover" data-cover="{{ $brouillon->name_cover ?? -1 }}">
        {!! FormCustom::img_cropper('cover', 'Choisissez une couverture', ['ratio' => '8/5', 'disabled' => $brouillon == 'roman_empty']) !!}
        <div class="cadre-add">
            <div class="oeuvre-genre" id="cover-genre">{{ $brouillon->genre->name_genre ?? "" }}</div>
        </div>
        <div class="div-cover-titre">
            <div class="cover-titre" data-part="cover-title">{{isset($brouillon->name_cover) && $brouillon->name_cover == 1 ? $brouillon->titre_roman : ''}}</div>
        </div>
    </div>
</div>