const copyObject = object => {
    const cloned = {};
    for (const key in object) {
        if (object[key] !== undefined && object[key] !== null && object[key].constructor === Object) {
            cloned[key] = copyObject(object[key]);
            continue
        }

        cloned[key] = object[key]
    }
    return cloned;
}

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

const isRecursivelyIncluded = (subset, object) => {
    if (typeof subset !== 'object' || subset === null) { return subset === object }

    return Object.keys(subset).every(key => key in object && utilsH.isRecursivelyIncluded(subset[key], object[key]));
};

const HUNDRED = 100
const percentOf = (part, total) => {
    return (part / total) * HUNDRED
}

const voidToEmpty = (data, exclude = []) => {
    const result = {}
    for (const [key, value] of Object.entries(data)) {
        if (exclude.includes(key)) {
            result[key] = value
            continue
        }
        result[key] = value ?? ''
    }
    return result
}

export const utilsH = {
    copyObject,
    getNestedProperty,
    isRecursivelyIncluded,
    percentOf,
    voidToEmpty
}
