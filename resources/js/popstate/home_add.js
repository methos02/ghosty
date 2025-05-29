import {getBrouillon} from "../page/add/getBrouillon";
import {afficheRomanAdd} from "../page/home";
import {cleanForm} from "../form/tools/formTool/cleanForm";

export function popstate_home_add() {
    if($('.btn-switch.visited').data('page') !== 'add') {
        afficheRomanAdd('add', false);
    }

    let slug_genre = location.pathname.match(/\/add\/(.*)/);

    if(slug_genre !== null) {
        getBrouillon(slug_genre[1], false);
        return
    }

    cleanForm($('form[name=form-roman]'), ['empty', 'init', 'disable'], ['slug_genre']);
    $('select[name=slug_genre]')
        .prepend('<option value="-1"> ------ </option>')
        .val(-1)
        .addClass('blue')
        .trigger('init-input')
    ;
}