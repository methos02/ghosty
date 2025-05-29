import {updatePaginateur} from '../part/paginateur';

$(document).on('click', 'div[data-chapitre]', function(){
    let slug = $(this).data('chapitre');

    $.ajax({
        url:"/chapitre/infos",
        type: 'POST',
        dataType: 'html',
        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
        data: {slug: slug},
        success:function(data) {
            $('#modal_infos .modal-content').html(data);
            $('#modal_infos').trigger('modal-open');
        }
    });
});

$(document).on('click','button[data-lecture]',function(e){
    e.preventDefault();
    let action = $(this).data('lecture');
    let order = $('input[data-order]').attr('placeholder');

    order = (action === 'plus')? parseInt(order) + 1 : parseInt(order) - 1;

    changeChapitre(order);
});

$(document).on('keydown',function(e) {
    if($(':focus').is('textarea') || $('.div-navigation').length === 0) return;

    let max = $('span[data-nbmax]').html().replace(/ /g,''), order;
    let input = $('input[data-order]');

    if(e.which === 39 || e.which === 37) {
        order = input.attr('placeholder').replace(/ /g,'');
        order = (e.which === 39)? parseInt(order) + 1 : parseInt(order) - 1;
    }

    if(e.which === 13) {
        order = input.val();
    }

    if(order <= max && order >= '1') {
        changeChapitre(order);
    }
});

function changeChapitre(order){
    let id_roman = $('.div-navigation').data('roman');

    $.ajax({
        url: "/json/chapitre/order",
        type: 'POST',
        dataType: 'json',
        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
        data: {id_roman:id_roman, order:order},
        success:function(chapitre) {
            updateChapitre(chapitre);
            history.pushState('', '', '/lire/' + chapitre.slug);
        }
    });
}

export function getChapitre(slug){
    $.ajax({
        url: "/json/chapitre/slug",
        type: 'POST',
        dataType: 'json',
        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
        data: {slug:slug},
        success:function(chapitre) {
            updateChapitre(chapitre);
        }
    });
}

function updateChapitre (chapitre) {
    $('#chapitre-titre').html(chapitre.order + '. ' + chapitre.titre);
    $('#writer').html(chapitre.writer);
    $('#chapitre-content').html(chapitre.content);
    $('input[data-order]').attr('placeholder', chapitre.order);

    updatePaginateur();
}