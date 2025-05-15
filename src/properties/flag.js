/**
 * This property adds a flag on creature. This is useful for inner mechanisms like temporary immunity
 * @param effect {RBSProperty}
 * @param flag {string}
 * @param value {string|number}
 */
function init ({ property, flag, value }) {
    property.data.flag = flag;
    property.data.value = value;
}

module.exports = {
    init
};
