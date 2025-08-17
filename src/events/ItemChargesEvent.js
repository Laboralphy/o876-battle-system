const GenericEvent = require('./GenericEvent');
const CONSTS = require('../consts');

class ItemChargesEvent extends GenericEvent {
    constructor ({ system, item, charges }) {
        super(CONSTS.EVENT_CREATURE_USE_ITEM, system);
        this.item = this.validateItem(item);
        this.charges = charges;
    }
}

module.exports = ItemChargesEvent;
