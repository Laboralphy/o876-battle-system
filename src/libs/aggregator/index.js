/**
 * Aggrège les effets spécifiés dans la liste, selon un prédicat
 * @param aPropAndEffectTypes {string[]} liste des effets désirés
 * @param getters {RBSStoreGetters}
 * @param effectFilter {function}
 * @param effectAmpMapper {function}
 * @param effectSorter {function}
 * @param effectForEach {function}
 * @param propFilter {function}
 * @param propAmpMapper {function}
 * @param propSorter {function}
 * @param propForEach {function}
 * @param restrictSlots {string[]}
 * @param excludeInnate {boolean}
 * @returns {{sorter: Object<String, {sum: number, max: number, count: number}>, max: number, min: number, sum: number, count: number, effects: number, ip: number }}
 */
function aggregateModifiers (aPropAndEffectTypes, getters, {
    effectFilter = null,
    propFilter = null,
    effectAmpMapper = null,
    propAmpMapper = null,
    effectSorter = null,
    propSorter = null,
    effectForEach = null,
    propForEach = null,
    restrictSlots = [],
    excludeInnate = false
} = {}) {
    const aTypeSet = new Set(
        Array.isArray(aPropAndEffectTypes)
            ? aPropAndEffectTypes
            : [aPropAndEffectTypes]
    );
    const aFilteredEffects = getters
        .getEffects
        .filter(eff =>
            aTypeSet.has(eff.type) &&
            (effectFilter ? effectFilter(eff) : true)
        )
        .map(eff => ({
            ...eff,
            amp: effectAmpMapper ? effectAmpMapper(eff) : eff.amp
        }));
    if (effectForEach) {
        aFilteredEffects.forEach(effectForEach);
    }
    const aStartingProperties = [];
    if (Array.isArray(restrictSlots) && restrictSlots.length > 0) {
        if (!excludeInnate) {
            aStartingProperties.push(...getters.getInnateProperties);
        }
        const oSlotProperties = getters.getSlotProperties;
        restrictSlots.forEach(s => {
            if (oSlotProperties[s]) {
                aStartingProperties.push(...oSlotProperties[s]);
            }
        });
    } else {
        if (!excludeInnate) {
            aStartingProperties.push(...getters.getInnateProperties);
        }
        aStartingProperties.push(...getters.getEquipmentProperties);
    }
    const aFilteredProperties = aStartingProperties
        .filter(ip =>
            aTypeSet.has(ip.type) &&
            (propFilter ? propFilter(ip) : true)
        )
        .map(prop => ({
            ...prop,
            amp: propAmpMapper ? propAmpMapper(prop) : prop.amp
        }));
    if (propForEach) {
        aFilteredProperties.forEach(propForEach);
    }
    const oSorter = {};
    const rdisc = sDisc => {
        if (typeof sDisc !== 'string') {
            throw new Error('invalid sorting key for aggregateModifiers prop/effect sorter "' + sDisc + '"');
        }
        if (!(sDisc in oSorter)) {
            oSorter[sDisc] = {
                sum: 0,
                max: 0,
                count: 0
            };
        }
        return oSorter[sDisc];
    };
    if (effectSorter) {
        aFilteredEffects.forEach(f => {
            const sDisc = effectSorter(f);
            const sd = rdisc(sDisc);
            if (isNaN(f.amp)) {
                throw TypeError('Effect amp has not been properly evaluated');
            }
            const amp = f.amp | 0;
            sd.max = Math.max(sd.max, amp);
            sd.sum += amp;
            ++sd.count;
        });
    }
    if (propSorter) {
        aFilteredProperties.forEach(f => {
            const sDisc = propSorter(f);
            if (sDisc === undefined) {
                console.error(f);
                console.error(propSorter.toString());
                throw new Error('property sorted returned undefined');
            }
            const sd = rdisc(sDisc);
            if (isNaN(f.amp)) {
                throw TypeError('Item property amp has not been properly evaluated');
            }
            const amp = f.amp | 0;
            sd.max = Math.max(sd.max, amp);
            sd.sum += amp;
            ++sd.count;
        });
    }

    let nIPAcc = 0, nEffAcc = 0, nMin = Infinity, nMax = -Infinity;
    aFilteredEffects.forEach(({ amp }) => {
        nEffAcc += amp;
        nMax = Math.max(nMax, amp);
        nMin = Math.min(nMin, amp);
    });
    aFilteredProperties.forEach(({ amp }) => {
        nIPAcc += amp;
        nMax = Math.max(nMax, amp);
        nMin = Math.min(nMin, amp);
    });
    return {
        sum: nEffAcc + nIPAcc,
        effects: nEffAcc,
        ip: nIPAcc,
        max: nMax,
        min: nMin,
        count: aFilteredEffects.length + aFilteredProperties.length,
        sorter: oSorter
    };
}

module.exports = {
    aggregateModifiers
};
