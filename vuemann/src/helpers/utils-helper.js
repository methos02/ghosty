const getGenreIconClass = genre => {
    if(!genre) { return '' }
    if(genre.toLowerCase() === "f") { return "fa-solid fa-venus" }
    return genre.toLowerCase() === "m" ? "fa-solid fa-mars" : "fa-solid fa-neuter"
}

const isRecursivelyIncluded = (subset, object) => {
    if (typeof subset !== 'object' || subset === null) { return subset === object }
    
    return Object.keys(subset).every(key => key in object && utilsH.isRecursivelyIncluded(subset[key], object[key]));
};

const copyObject = object => {
    const cloned = {};
    for (const key in object) {
        if (object[key] !== undefined && object[key].constructor === Object) {
            cloned[key] = copyObject(object[key]);
            continue
        }

        cloned[key] = object[key]
    }
    return cloned;
}
const HUNDRED = 100
const percentOf = (part, total) => {
    return (part / total) * HUNDRED
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

export const utilsH = { 
    isRecursivelyIncluded, 
    copyObject, 
    percentOf, 
    getGenreIconClass,
    getNestedProperty 
}
  
