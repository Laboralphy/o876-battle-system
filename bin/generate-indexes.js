const path = require('node:path');
const fs = require('node:fs');
const TreeSync = require('../src/libs/o876-xtree/sync');

const TYPES = {
    RAW: 'RAW',
    REQUIRE: 'REQUIRE', // strip filename path and ext dans produce 'filename': require('./path/to/filename.ext')
    SPREAD: 'SPREAD', // uses spread operator to insert all properties of require('./path/to/filename.ext') into current object
    CONST_REQUIRE: 'CONST_REQUIRE', // same as REQUIRE but uppercases and camelcases FILENAME
    CONST_FILENAME: 'CONST_FILENAME' // create a string constant out of a directory content
};

const [
    ,
    ,
    PATH,
    COMMAND,
    PREFIX = ''
] = process.argv;

function filenameToPrefixedConst (sFile, sPrefix) {
    return (sPrefix ? (sPrefix.toUpperCase() + '_') : '') + path.basename(sFile, path.extname(sFile)).toUpperCase().replace(/-/g, '_');
}

/**
 * Builds an ìndex.js` require line.
 * @param sFile
 * @param sType
 * @param sPrefix
 * @returns {string}
 */
function buildLine (sFile, sType, sPrefix = '') {
    switch (sType) {
    case TYPES.REQUIRE: { // REQUIRE
        return '\'' + path.basename(sFile, path.extname(sFile)) + '\': require(\'./' + sFile + '\')';
    }

    case TYPES.CONST_REQUIRE: { // CONST_REQUIRE
        return '\'' + filenameToPrefixedConst(sFile, sPrefix) + '\': require(\'./' + sFile + '\')';
    }

    case TYPES.CONST_FILENAME: { // CONST_FILENAME
        const s = '"' + filenameToPrefixedConst(sFile, sPrefix) + '"';
        return s + ': ' + s;
    }

    case TYPES.SPREAD: { // SPREAD
        return '...require(\'./' + sFile + '\')';
    }

    default: {
        console.error('allowed type (2nd param) are', Object.values(TYPES).join(', '));
    }
    }
}

/**
 * This function build an `index.js` file requiring all other files in directory
 * @param sPath
 * @param sType
 * @param sPrefix
 */
function buildRequireIndex (sPath, sType, sPrefix) {
    // all files in directory
    const aRequires = TreeSync
        .tree(sPath)
        .filter(sFile => !sFile.endsWith('index.js') && path.extname(sFile).match(/\.js(on)?$/))
        .map(sFile => buildLine(sFile, sType, sPrefix));
    const d = new Date();
    const aOutput = [
        '// AUTOMATIC GENERATION : DO NOT MODIFY !',
        '// Date : ' + d.toJSON(),
        '// List of files in ' + sPath,
        '',
        'module.exports = {',
        aRequires.map(s => '    ' + s).join(',\n'),
        '};'
    ];
    const sOutput = aOutput.join('\n');
    console.log(sOutput);
}

buildRequireIndex(PATH, COMMAND, PREFIX);
