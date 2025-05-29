export function insertErreur(input, message){
    input.border.addClass('input_erreur');
    input.$champ.attr('data-statut','erreur');

    if(message !== undefined && message !== ""){
        input.message.append('<span class="input_message" data-message="erreur">' + message + '</span>');
        input.message.find('.label-input').hide();
    }

    if(input.uForm !== undefined) {
        $('[data-btn_uform=' + input.uForm.data('uform') + ']').addClass('uForm-erreur');
    }
}