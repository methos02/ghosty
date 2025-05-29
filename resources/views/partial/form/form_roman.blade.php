{!! FormCustom::openUpdate('form-roman', $brouillon != 'roman_empty' ? $brouillon->withFirstAndGenre() : [], ['class' => 'form-recit', 'action' => route('roman.update'), 'errors' => $errors, 'file' => true]) !!}
@csrf
<div class="row-flex">
    {!! FormCustom::select('slug_genre', 'Genre', $genres, ['obliger' => 1, 'null' => $brouillon == 'roman_empty', 'class_label' => $brouillon == 'roman_empty'? 'blue' : '']) !!}
    {!! FormCustom::titre('titre_roman', 'Titre du roman', ['obliger' => 1, 'width' => 'order', 'disabled' => $brouillon == 'roman_empty']) !!}
    <div id="alert-change" {!! HtmlShortcut::isVisible(false) !!}>
        <div class="arrow-up"></div>
        <p> Voulez vous enregistrer votre brouillon. </p>
        <p> Si vous ne le faite pas vos modifications seront perdues.</p>
        <div class="row-flex">
            <input type="submit" name="update_roman" id="roman-save" value="Enregistrer" class="btn btn-success">
            <button class="btn btn-danger" data-load="roman">Annuler modifications</button>
        </div>
    </div>
</div>
@include('partial.form.inputs.inputs_chapitre', ['form' => 'roman'])
<div class="marg-updown" data-uform="cover" style="display: none">@include('partial.form.inputs.inputs_cover')</div>
<div class="row-flex" data-confirm="roman-add">
    <input type="submit" name="update_roman" id="roman-brouillon" value="Brouillon" class="btn btn-info" {!! HtmlShortcut::isVisible(!is_object($brouillon) || $brouillon->first()->statut_chap != 0 ) !!} {{ $brouillon == 'roman_empty' ? 'disabled="disabled"' : '' }}>
    <button data-confirm="cancel-roman-add" class="btn btn-danger" id="roman-cancel-modif" {!! HtmlShortcut::isVisible(false) !!}> Annuler les modifications </button>
    <button data-confirm="publier" class="btn btn-success" {{ $brouillon == 'roman_empty' ? 'disabled="disabled"' : '' }} >Publier</button>
</div>
<div class="text-center" data-confirm="cancel-roman-add" {!! HtmlShortcut::isVisible(false) !!} >
    <p>Les modifications que vous avez faite vont être perdues.</p>
    <button name="reset_roman_add" class="btn btn-success"> Valider </button>
    <button data-confirm="roman-add" id="cancel-modif" class="btn btn-danger"> Annuler </button>
</div>
<div class="text-center" data-confirm="publier" {!! HtmlShortcut::isVisible(false) !!} >
    <p>Votre roman sera soumis aux votes lundi prochain, vous pourrez toujours le modifier d'ici là.</p>
    <input type="submit" name="update_roman" value="Publier" class="btn btn-success" data-verif="form-roman">
    <button data-confirm="roman-add" id="cancel-modif" class="btn btn-danger"> Annuler </button>
</div>
{!! FormCustom::close() !!}
