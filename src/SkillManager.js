/**
 * This class is used to check skills.
 * Sometimes you don't want to roll skills more thant once each turn (stealth, perception...)
 * This class will debounce skill rolls
 */
class SkillManager {
    constructor () {
        this._time = 0
    }

    set time (value) {
        this._time = value
    }

    get time () {
        return this._time
    }


}