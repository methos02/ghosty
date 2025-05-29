export function updatePaginateur() {
    let paginateur = $('.div-navigation');
    let order = $('input[data-order]').attr('placeholder').replace(/ /g,'');
    let max = $('span[data-nbmax]').html().replace(/ /g,'');

    paginateur.find('.maximum').prop("disabled", false).removeClass('maximum');

    if(order === max || order === '1') {
        let btn = order === max ? 'plus' :'moins';
        $('button[data-lecture=' + btn + ']').prop("disabled",true).addClass('maximum');
    }
}
