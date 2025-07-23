/**
 * @typedef RBSActionRequirement {object}
 * @property classType {string} required class type to use this action
 * @property level {number} required class level to use this action
 *
 * @typedef RBSAction {object}
 * @property id {string} id of action
 * @property requirements {RBSActionRequirement}
 * @property limited {boolean} if true, then this action has limited use
 * @property actionType {string} action type
 * @property cooldown {number} if > 0 then the action cannot be used until 0
 * @property charges {number} number of uses left
 * @property recharging {boolean} if true then this action is recharging (need to call rechargeActions regularly
 * @property range {number} action range
 * @property script {string} script to call if action hits
 * @property parameters {{}} parameters passed to script
 * @property ready {boolean} if true this action is ready to use, else, action cannot be used
 * @property bonus {boolean} if true, this is a bonus action
 * @property hostile {boolean} if true, this action is considered as hostile
 *
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {Object<string, RBSAction >}
 */
module.exports = (state, getters) => Object.fromEntries(
    Object
        .entries(state.actions)
        .filter(([id, action]) => {
            if (!action.requirements) {
                return true;
            }
            const { classType = '', level = 1 } = action.requirements;
            if (classType !== '' && classType !== getters.getClassType) {
                return false;
            }
            return getters.getLevel >= level;
        })
        .map(([id, action]) => {
            const acdt = action.cooldownTimer;
            const acdtl = acdt.length;
            const recharging = acdtl > 0;
            const charges = action.dailyCharges - acdtl; // remaining charge for that day
            const cooldown = (!action.limited || charges > 0)
                ? 0
                : acdt[0];
            const ready = action.limited ? charges > 0 : true;
            const oAction = {
                id,
                limited: action.limited,
                actionType: action.actionType,
                cooldown,
                charges,
                maxCharges: action.dailyCharges,
                recharging,
                range: action.range,
                script: action.script,
                parameters: action.parameters,
                ready,
                bonus: action.bonus,
                hostile: action.hostile
            };
            return [id, oAction];
        })
);
