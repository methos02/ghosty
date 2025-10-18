const capitalize = string => {
    if (typeof string !== 'string' || string.length === 0) { return '' }

    return string[0].toUpperCase() + string.toLowerCase().slice(1)
}

const normalize = string => {
    // eslint-disable-next-line unicorn/prefer-string-replace-all
    return string.normalize("NFD").replace(/[\u0300-\u036F]/g, "").toLowerCase();
}

export const wordHelper = { capitalize, normalize }
