/**
 * This property protects a creature from attacks delivered by creature of certain species
 * impose attack disadvantage from such creatures
 * make protected immune to mental influence like fear and charm from those species
 */
function init ({ property }, { species = [] }) {
    if (Array.isArray(species)) {
        property.data.species = species;
    } else {
        throw new TypeError('for property "protection from species" species must be an array of string');
    }
}

module.exports = {
    init
};
