$(document).on('input change', 'input[name=titre_roman], input[name=cover], select[name=name_cover]', function(){
    let titre = $('input[name=titre_roman]').val();
    let cover = $('.appercu-file img').attr('src');

    updateSelectTitreCover(titre, cover);
});

$(document).on('reset-cropper', 'input[name=cover]', function(){
    let viewCover = $('.input-cover').data('cover');

    $('#div-affiche-titre').toggle(viewCover === 1, initSelectNameCover(viewCover));

    $('[data-part=cover-title]').html(function() {
        return $('select[name=name_cover]').val() === '1' ? $('input[name=titre_roman]').val() : '';
    });
});

$(document).on('change', '#name_cover', function(){
    let titre = $(this).val() === '1' ? $('input[name=titre_roman]').val() : '';
    $('[data-part=cover-title]').html(titre);
});

export function updateSelectTitreCover(titre, cover) {
    $('select[name=name_cover]').attr('data-obliger', function() {
        return !isCoverVide(cover) && titre !== '' ? 1 : null;
    });

    if($('input[name=cover]').data('statut') === 'erreur') return;

    $('#div-affiche-titre').toggle(titre !== '' && !isCoverVide(cover), function() {
        if($('#div-affiche-titre').is(':hidden')) { initSelectNameCover() }
    });

    $('[data-part=cover-title]').html(function() {
        return $('select[name=name_cover]').val() === '1' ? titre : '';
    });
}

function isCoverVide(cover) {
    return cover !== undefined && cover.indexOf("cover-vide") !== -1 && document.querySelector('input[name=cover]').files[0] === undefined;
}

function initSelectNameCover(value) {
    let select = $('select[name=name_cover]');
    select.val(value !== undefined ? value : -1);

    if(value === -1 || value === undefined) { select.trigger('init-input') }
}