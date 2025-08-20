const z = require('zod');

const oMaster = {
    Enum: {
        Ability: require('./Enum/Ability'),
        ActionType: require('./Enum/ActionType'),
        Ailment: require('./Enum/Ailment'),
        AttackType: require('./Enum/AttackType'),
        ClassType: require('./Enum/ClassType'),
        DamageType: require('./Enum/DamageType'),
        Disease: require('./Enum/Disease'),
        ImmunityType: require('./Enum/ImmunityType'),
        Proficiency: require('./Enum/Proficiency'),
        PropertyType: require('./Enum/PropertyType'),
        Race: require('./Enum/Race'),
        Skill: require('./Enum/Skill'),
        Specie: require('./Enum/Specie'),
        Threat: require('./Enum/Threat'),
    },
    Struct: {
        Action: require('./Struct/Action'),
        Property: require('./Struct/Property')
    }
};

const oCopy = {
    Enum: null
};

const oZOD = {
};

function processEnums () {
    return Object.fromEntries(Object
        .entries(oMaster.Enum)
        .map(([sCategory, aEntries]) =>
            [sCategory, Object.fromEntries(aEntries
                .map((sValue) => [sValue, { value: sValue, label: sValue }])
            )]
        ));
}

function main () {
    console.log(processEnums());
}

main();
