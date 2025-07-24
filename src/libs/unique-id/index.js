const STR36_Z8 = 2821109907455;
const STR36_Z6 = 2176782335;

/**
 * @returns {string}
 */
function getUniqueId () {
    return Date.now().toString(36).substring(0, 6) + Math.floor(Math.random() *  STR36_Z8).toString(36);
}

module.exports = {
    getUniqueId
};
