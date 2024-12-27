const vm = require('node:vm')
const {parse} = require('csv-parse/sync');
const fs = require('fs');

class SmartData {
    constructor ({ data = {} } = {}) {
        this._data = data
    }

    loadCSV (sFile) {
        return parse(fs
            .readFileSync(sFile)
            .toString(), {
            delimiter: ',',
            columns: false,
            skip_empty_lines: true
        })
    }

    /**
     * Turns a string from camel case (lower case + dash) to snake case (uppercase + underscore)
     * @param s {string} input string as lower camel case
     * @returns {string} output string as snake case
     */
    toSNAKECASE (s) {
        return s.replace(/-/g, '_').toUpperCase()
    }

    /**
     * Search for a constant
     * @param sSearch {string}
     * @param sRadix {string} helps for disambiguation
     * @returns {*|string|string|number}
     */
    searchConst (sSearch, sRadix = '') {
        const CONSTS = this._data
        if (sSearch.toString().toUpperCase() === 'TRUE') {
            return true
        }
        if (sSearch.toString().toUpperCase() === 'FALSE') {
            return false
        }
        if (typeof sSearch === 'number') {
            return sSearch
        }
        if (Array.isArray(sSearch)) {
            return sSearch.map(s => this.searchConst(s, sRadix))
        }
        let sSearchUpper = this.toSNAKECASE(sSearch)

        const fSearch = s => {
            if (sRadix !== '' && !s.startsWith(sRadix.toUpperCase())) {
                return false
            }
            return s.endsWith(sSearchUpper)
        }

        let sFound = Object.values(CONSTS).find(fSearch)
        if (sFound) {
            return sFound
        }
        sSearchUpper = '_' + this.toSNAKECASE(sSearch)
        sFound = Object.values(CONSTS).find(fSearch)
        return sFound === undefined ? sSearch : sFound
    }

    /**
     *
     * @param oCodes {Object<string, string>}
     * @return {vm.Script[]}
     */
    compile (oCodes) {
        const aCompiled = []
        for (const [idCode, sCode] of Object.entries(oCodes)) {
            aCompiled.push(new vm.Script(sCode))
        }
        return aCompiled
    }

    createContext () {
        const oContext = {
            c: null,
            _id: '',
            value: '',
            leftValue: '',
            _output: {},
        }

        /**
         * Set property name and value.
         * The property name will be the string value of the previous column
         * The property value will be the current column value (if JSON, then it will be parsed)
         * @param obj
         */
        function kv (obj) {
            if (typeof oContext.value === 'number') {
                obj[oContext.leftValue] = oContext.value
                return
            }
            const sTrimmedValue = oContext.value.trim()
            const c0 = sTrimmedValue.charAt(0)
            const sSigns = '[{"\''
            obj[oContext.leftValue] = sSigns.includes(c0) ? JSON.parse(sTrimmedValue) : sTrimmedValue
        }

        /**
         * Return the last item of an array
         * @param arr {[]}
         * @returns {any}
         */
        function last (arr) {
            return arr.length > 0 ? arr[arr.length - 1] : undefined
        }

        /**
         * Commit the current object
         */
        function output () {
            if (oContext.c) {
                oContext._output[oContext._id] = oContext.c
            }
            oContext.c = {}
        }

        function id (s) {
            oContext._id = s
        }

        oContext.ref = (s, r) => this.searchConst(s, r)
        oContext.kv = kv
        oContext.output = output
        oContext.last = last
        oContext.id = id
        oContext.c = {}

        return vm.createContext(oContext)
    }

    runRow (aRow, aScripts, oContext) {
        if (!Array.isArray(aRow)) {
            console.error(aRow)
            throw new TypeError('ERR_ARRAY_EXPECTED')
        }
        aRow.forEach((value, i) => {
            if (value !== '') {
                value = isNaN(+value) ? value : parseFloat(value)
                oContext.value = value

                try {
                    if (aScripts[i]) {
                        aScripts[i].runInContext(oContext)
                    }
                } catch (e) {
                    console.error(e)
                    console.error(aRow)
                    console.error('COLUMN ' + i + ' : ' + value)
                    throw e
                } finally {
                    oContext.leftValue = value
                }
            }
        })
    }

    run (aRows) {
        const [aHeader, aScripts, ...aData] = aRows
        if (!aHeader) {
            throw new Error('no header defined')
        }
        const oScripts = aHeader.reduce((prev, curr, i) => {
            prev[curr] = aScripts[i]
            return prev
        }, {})
        const aCompiledScripts = this.compile(oScripts)
        const oContext = this.createContext()
        aData.forEach((row, i) => {
            this.runRow(row, aCompiledScripts, oContext)
        })
        oContext.output()
        return oContext._output
    }
}

module.exports = SmartData