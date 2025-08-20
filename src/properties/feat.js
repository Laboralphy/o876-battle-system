/**
 * This property adds a feat on creature.
 * @param property {RBSProperty}
 * @param feat {string} FEAT_*
 * @param properties {string[]} list of property identifier associated with this feat
 */
function init ({ property, feat, properties }) {
    property.data.feat = feat;
    property.data.properties = properties;
}

module.exports = {
    init
};
