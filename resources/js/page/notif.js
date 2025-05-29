//LIRE UNE NOTIF
$(document).on('click','.tr-message', function(e){
    //Si on click sur une checkbox alors rien faire
    if($(e.target).is('input[type=checkbox]')) {
        return;
    }

    let id_notif = $(this).data('notif');

    $.ajax({
        url: "/notif",
        type: 'POST',
        dataType: 'html',
        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
        data: {id_notif:id_notif},
        success:function(data) {
            $('.modal-content').html(data);
            $('#modal_notif').trigger('modal-open');

            removeNew(id_notif);
        }
    });
});


//Sélection message
$(document).on('click','input[name="notif[]"]', function(){
    let div = $(this).closest('tr');
    div.toggleClass('message-check', !div.hasClass('message-check'));
});

//Suppression des messages seletionné
$(document).on('click','[data-action=notif-supp], [data-action=notif-recup], [data-action=notif-vider]', function(e){
    e.preventDefault();
    let selector = $(this).data('action')=== 'notif-vider'? '.tr-message' : '.message-check';
    let ids_notif = selectNotifCheck(selector);

    if(ids_notif.length === 0) return false;

    $.ajax({
        url: $(this).data('href'),
        type: 'POST',
        dataType: 'json',
        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
        data: {ids_notif:ids_notif},
        success:function(data) {
            window.flash.messageGlobalSuccess('body', data.message);

            $(selector).each(function () {
                $(this).remove();
            });

            if($('.tableau-message tr').length === 1){
                $('.tableau-message').append("<tr><td class=\"empty-result\" colspan=\"4\"> Vous n'avez pas de notification. </td></tr>")
            }
        }
    });
});

function removeNew(id_notif) {
    $('[data-notif=' + id_notif + ']')
        .removeClass('message-new')
        .find('img[src*=puce]').remove();
}

function selectNotifCheck(selector) {
    let ids_notif = [];

    $(selector).each(function () {
        ids_notif.push($(this).data('notif'));
    });

    return ids_notif
}