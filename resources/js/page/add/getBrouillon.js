import {hydrateForm} from "../../form/tools/formTool/hydrateForm";
import {insertErreur} from "../../form/tools/insertErreur";
import {defineParamInput} from "../../form/tools/defineParamInput";
import {updateSelectTitreCover} from "./eventCover";

$(document).on('change', 'select[name=slug_genre][data-modif=1]:not(.blue)', function(e){
    e.preventDefault();
    let $select = $('select[name=slug_genre]');
    let genre = window.location.pathname.split('/')[2];
    $('form[name=form-roman]').append('<input name="redirect" type="hidden" value="' + $select.val() + '">');
    $select.val(genre);
    $("#alert-change")
        .appendTo($('[name=slug_genre]').closest('.label-compact'))
        .show()
    ;
});

$(document).on('change input', 'form[name=form-roman] :input', function(){
    if($(this).attr('name') !== 'slug_genre') {
        $('select[name=slug_genre]').attr('data-modif', '1');
        $('#roman-cancel-modif').fadeIn(300);
    }
});

$(document).on('change', 'select[name=slug_genre][data-modif!=1]', function(e){
    e.preventDefault();
    getBrouillon($(this).val());
});

$(document).on('click', '[data-load=roman]', function(e){
    e.preventDefault();
    let $input = $('input[name=redirect]');
    let genre = $input.val();
    $('select[name=slug_genre]').val(genre);
    $input.remove();
    getBrouillon(genre, false);
});

$(document).on('click', 'button[name=reset_roman_add]', function(e){
    e.preventDefault();
    let slug_genre = $('select[name=slug_genre]').val();
    getBrouillon(slug_genre, false, function() {
        $('#cancel-modif').trigger('click');
    });
});

export function getBrouillon(slug_genre, popstate, callback) {
    let $form = $('form[name=form-roman]');
    let $select = $('select[name=slug_genre]');

    $select.closest('.label-compact').append('<span id="loader-add" class="loader-add"><img src="/images/loader.gif" alt="loader"></span>');

    /**
     * @param {Object} data.brouillon
     * @param {string} data.brouillon.titre_roman
     * @param {string} data.brouillon.name_cover
     * @param {int} data.brouillon.statut_chap
     * */
    $.ajax({
        url: '/getBrouillon',
        type: 'POST',
        dataType: 'json',
        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
        data: {slug_genre: slug_genre},
        success:function(data) {
            updateFormRoman($form, data.brouillon, $select);

            if(popstate !== false) { history.pushState('', '', '/add/' + $select.val()); }
            if(callback !== undefined) {callback()}
            $('#loader-add').remove();
        },
        error:function(jqXHR){
            insertErreur(defineParamInput($select), jqXHR.responseJSON.errors.slug_genre);
            $('#loader-add').remove();
        }
    });
}

function updateFormRoman($form, brouillon, $select) {
    $('.input-cover').attr('data-cover', brouillon.name_cover);
    hydrateForm($form, brouillon, ['init']);
    updateSelectTitreCover(brouillon.titre_roman, brouillon.cover);

    $('#cover-genre').html( function() { return $select.find('option:selected').html() });
    $('#alert-change').hide();
    $('[data-confirm=roman-add]').trigger('click');
    $('select[name=slug_genre]').removeAttr('data-modif');
    $('#roman-cancel-modif').hide();
    $('#roman-brouillon').toggle(brouillon.statut_chap !== 1);
    $(document).trigger('cancel-cropper');

    if ($select.hasClass('blue')) {
        $select.find('option[value="-1"]').remove();
        $select.removeClass('blue');
    }
}