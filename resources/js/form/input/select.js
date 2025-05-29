export function verifSelect(input) {
    if (input.value === "-1" && input.obliger === '1') {
        return "";
    }
}

export function noValidateSelect(input) {
    return input.$champ.data('obliger') === undefined && input.value === "-1";
}