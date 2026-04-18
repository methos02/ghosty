const getNestedProperty = (object, key) => {
    if(object === undefined || typeof object !== 'object') { throw new Error('Object is undefined or not an object') }
    if(key === undefined || key === null) { throw new Error('Key is undefined or null') }

    if (!key.includes('.')) { return object[key] }

    let result = object
    for (const keyPart of key.split('.')) {
        if(result[keyPart] === undefined) {
            result = undefined;
            break;
        }

        result = result[keyPart]
    }

    return result
}

const HUNDRED = 100
const percentOf = (part, total) => {
    return (part / total) * HUNDRED
}

export const utilsH = {
    getNestedProperty,
    percentOf
}
