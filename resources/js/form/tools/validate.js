import {validateFile} from "../input/file";
import {noValidateSelect} from "../input/select";
import {validate_uform} from "./validate_uform";

export function validate (input) {
    if (input.type === 'file') {validateFile(input); return;}
    if (input.type === 'select' && noValidateSelect(input)) {return;}

    input.$champ.attr('data-statut','valide');
    input.border.addClass('input_valide');
    input.$champ.trigger('valide');

    if(input.uForm !== undefined) {
        validate_uform(input.uForm);
    }
}