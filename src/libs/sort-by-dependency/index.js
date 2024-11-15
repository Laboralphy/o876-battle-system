function sortByDependency (aObjects, sIdProp, sAncestorProp) {
    const aRebukedItems = new Set() // items which has been met and rebuked at the back of the list
    const aCompleteItems = new Set() // items which ancestor has been met
    let i = 0
    const l = aObjects.length
    while (i < l) {
        const o = aObjects[i]
        const id = o[sIdProp]
        const ref = o[sAncestorProp]
        if (ref) {
            // There is an ancestor
            if (!aCompleteItems.has(ref)) {
                // the ancestors has not been met yet
                aObjects.splice(i, 1)
                aObjects.push(o)
                aRebukedItems.add(id)
            }
        }
    }
}

module.exports = {
    sortByDependency
}