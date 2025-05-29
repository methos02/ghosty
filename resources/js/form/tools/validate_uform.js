export function validate_uform(uform) {
    if(uform.find('[data-statut=ereur]').length === 0) {
        $('[data-btn_uform=' + uform.data('uform') + ']').removeClass('uForm-erreur');
    }
}