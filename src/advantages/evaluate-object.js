/**
 * Evaluates an object : produces an objet { result: boolean, values: Set<string> }
 * evaluate all properties as boolean returning function.
 * need to evaluate all properties to get a complete true-property list
 * @param object {{[s: string]: function(*): boolean}}
 * @param params {*}
 * @returns {{result: boolean, values: Set<string>}}
 * result would be the final boolean result, and values would be a set of string indicating which properties
 * have return "true"
 */
function evaluateObject (object, ...params) {
    return Object
        .entries(object)
        .reduce((prev, [sEntry, f]) => {
            if (f(...params)) {
                prev.result = true;
                prev.values.add(sEntry);
            }
            return prev;
        }, { result: false, values: new Set()});
}

module.exports = {
    evaluateObject
};
