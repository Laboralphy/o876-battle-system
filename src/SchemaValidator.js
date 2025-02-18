const jsonschema = require('jsonschema');
const Validator = jsonschema.Validator;

class SchemaValidator {
    constructor () {
        this._schemas = {};
        this._validator = null;
        /**
         * @type {Object<string, Object>}
         * @private
         */
        this._schemaIndex = {};
    }

    /**
     * @param value {Object<string, Object>}
     */
    set schemaIndex (value) {
        this._schemaIndex = value;
    }

    /**
     * @returns {Object<string, Object>}
     */
    get schemaIndex () {
        return this._schemaIndex;
    }

    get validator () {
        return this._validator;
    }

    get schemas () {
        return this._schemas;
    }

    /**
     *
     * @param oSchemaRegistry {Object<string, Object>}
     */
    initValidator (oSchemaRegistry) {
        const v = new Validator();
        this._validator = v;
        /**
         * @type {object}
         * @private
         */
        this._schemas = oSchemaRegistry;
        for (const [sId, oData] of Object.entries(oSchemaRegistry)) {
            const sSchemaId = sId;
            oData.id = sSchemaId;
            v.addSchema(oData, '/' + sSchemaId);
        }
    }

    /**
     * Load all schemas
     * You may choose between async and sync by setting asyncMode prior to call init
     * @returns {Promise<void>|void}
     */
    init () {
        this.initValidator(this._schemaIndex);
    }

    /**
     * Validates an object, throws an error if object is invalid acocrding to schema
     * @param oObject {object}
     * @param sSchemaId {string}
     * @returns {boolean}
     * @throws
     */
    validate (oObject, sSchemaId) {
        if (!(sSchemaId in this._schemas)) {
            console.error(this._schemas);
            throw new Error('ERR_UNKNOWN_SCHEMA: ' + sSchemaId + ' - known schemas are : ' + Object.keys(this._schemas).join(', '));
        }
        const r = this._validator.validate(oObject, this._schemas[sSchemaId]);
        if (!r.valid) {
            const sErrors = r
                .errors
                .map(e => e.stack)
                .join('\n');
            throw new TypeError('ERR_SCHEMA_VALIDATION:\nschema: ' + sSchemaId + '\nerror: ' + sErrors);
        }
        return true;
    }
}

module.exports = SchemaValidator;
