/**
 * Sort an array, a parent item is placed before all its children/dependencies
 * @param aObjects {object[]}
 * @param sKeyId {string}
 * @param sKeyParentId {string}
 * @returns {object[]}
 */
function sortByDependency(aObjects, sKeyId, sKeyParentId) {
    const indexer = new Map()
    const result = []
    const visited = new Set()
    const inProgress = new Set()

    // Préparer une map pour un accès rapide par ID
    aObjects.forEach(item => {
        indexer.set(item[sKeyId], item)
    })

    function visitOne (p) {
        const parent = indexer.get(p)
        if (parent) {
            visit(parent) // Visiter le parent d'abord
        }
    }

    // Fonction récursive pour visiter les dépendances
    function visit (item) {
        const id = item[sKeyId]
        const parentId = item[sKeyParentId]
        if (visited.has(id)) {
            return // Éviter les doublons
        }
        if (inProgress.has(id)) {
            throw new Error(`Cyclic dependency detected involving item with ID: ${id}`)
        }
        inProgress.add(id)

        if (parentId !== undefined) {
            if (Array.isArray(parentId)) {
                parentId.forEach(visitOne)
            } else {
                visitOne(parentId)
            }
        }
        inProgress.delete(id)
        visited.add(id)
        result.push(item)
    }

    // Visiter chaque élément
    aObjects.forEach(item => visit(item))

    return result
}

module.exports = {
    sortByDependency
}