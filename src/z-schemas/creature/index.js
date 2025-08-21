const z = require('zod');
const LABELS = require('../strings/labels');
const CONSTS = require('../../consts');
const Enum = require('../enums');
const PropertySchema = require('../property');
const ItemSchema = require('../item');
const ActionSchema = require('../action');

module.exports = z.strictObject({
    ref: z.string().optional().describe(LABELS.Fields.CreatureField.ref),
    entityType: z.literal(CONSTS.ENTITY_TYPE_ACTOR).describe(LABELS.Fields.CreatureField.entityType),
    classType: Enum.ClassType,
    level: z.number().int().min(1).describe(LABELS.Fields.CreatureField.level),
    abilities: z.object({
        strength: z.number().int().min(1).describe(LABELS.Fields.CreatureField.strength),
        dexterity: z.number().int().min(1).describe(LABELS.Fields.CreatureField.dexterity),
        constitution: z.number().int().min(1).describe(LABELS.Fields.CreatureField.constitution),
        intelligence: z.number().int().min(1).describe(LABELS.Fields.CreatureField.intelligence),
        wisdom: z.number().int().min(1).describe(LABELS.Fields.CreatureField.wisdom),
        charisma: z.number().int().min(1).describe(LABELS.Fields.CreatureField.charisma)
    }),
    ac: z.number().int().describe(LABELS.Fields.CreatureField.ac),
    hd: z.number().int().min(1).describe(LABELS.Fields.CreatureField.hd),
    specie: Enum.Specie,
    race: Enum.Race.optional().describe(LABELS.Fields.CreatureField.race),
    speed: z.number().int().min(0).describe(LABELS.Fields.CreatureField.speed),
    feats: z.array(Enum.Feats).optional().describe(LABELS.Fields.CreatureField.feats),
    properties: z.array(PropertySchema).describe(LABELS.Fields.CreatureField.properties),
    equipment: z.array(z.union([z.string(), ItemSchema])).describe(LABELS.Fields.CreatureField.equipment),
    proficiencies: z.array(Enum.Proficiency).describe(LABELS.Fields.CreatureField.proficiencies),
    actions: z.array(ActionSchema).describe(LABELS.Fields.CreatureField.actions),
    spells: z.array(z.string()).optional().describe(LABELS.Fields.CreatureField.spells)
});
