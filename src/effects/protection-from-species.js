/**
 * This effect protects a creature from attacks delivered by creature of certain species
 * impose attack disadvantage from such creatures
 * make protected immune to mental influence like fear and charm from those species
 */
function init ({ effect }, { species = [] }) {
    if (Array.isArray(species)) {
        effect.data.species = species;
    } else {
        throw new TypeError('for effect "protection from species" species must be an array of string');
    }
}

module.exports = {
    init
};
