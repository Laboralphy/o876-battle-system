/**
 * Invisibility ends when taking hostile actions
 * @param effect
 * @param effectProcessor
 * @param target
 * @param attackOutcome
 */
function attack ({ effect, effectProcessor, target, attackOutcome }) {
    effectProcessor.removeEffect(effect);
}

module.exports = {
    attack
};
