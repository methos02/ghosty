import {dateParam} from "../input/date";
import {heureParam} from "../input/heure";
import {mdpParam} from "../input/mdp";
import {textParam} from "../input/textarea";
import {fileParam} from "../input/file";
import {multiSelectParam} from "../input/multiSelect";

export function defineParamInput(champ) {
    let $champ = $(champ);

    let input = {
        champ: champ,
        $champ: $champ,
        div: $champ.closest('label'),
        uForm: $champ.closest('[data-uform]'),
        message: $champ.closest('label'),
        border: $champ,
        value: $champ.val() !== null ? $champ.val().trim() : null,
        erreur: $champ.attr('data-message'),

        name: $champ.attr('name'),
        obliger: $champ.attr('data-obliger'),
        type: $champ.attr('data-type'),
    };

    if(input.type === 'date') { input = dateParam(input); }
    if(input.type === 'heure') { input = heureParam(input); }
    if(input.type === 'mdp') { input = mdpParam(input); }
    if(input.type === 'texte') { input = textParam(input); }
    if(input.type === 'file') { input = fileParam(input); }
    if(input.type === 'multiselect') { input = multiSelectParam(input); }

    return input;
}