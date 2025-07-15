const path = require('node:path');
const TreeSync = require('../src/libs/o876-xtree/sync');

const TYPES = {
    RAW: 'RAW',
    REQUIRE: 'REQUIRE', // strip filename path and ext dans produce 'filename': require('./path/to/filename.ext')
    SPREAD: 'SPREAD', // uses spread operator to insert all properties of require('./path/to/filename.ext') into current object
    CONST_REQUIRE: 'CONST_REQUIRE', // same as REQUIRE but uppercases and camelcases FILENAME
    CONST_REQUIRE_SECTION: 'CONST_REQUIRE_SECTION', // same as CONST_REQUIRE but with path section
    CONST_FILENAME: 'CONST_FILENAME' // create a string constant out of a directory content
};

const [
    ,
    ,
    PATH,
    COMMAND,
    PREFIX = ''
] = process.argv;

function toUpperCaseCamelCase (s) {
    return s.toUpperCase().replace(/-/g, '_');
}

function filenameToPrefixedConst (sFile, sPrefix) {
    return (sPrefix ? (sPrefix.toUpperCase() + '_') : '') + toUpperCaseCamelCase(path.basename(sFile, path.extname(sFile)));
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
        const s = '\'' + filenameToPrefixedConst(sFile, sPrefix) + '\'';
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


function dispatchPerFolder (aRequires, sPrefix) {
    const oSections = {};
    for (const sFile of aRequires) {
        const sPath = path.dirname(sFile);
        const sSection = toUpperCaseCamelCase(sPath);
        if (!(sSection in oSections)) {
            oSections[sSection] = [];
        }
        oSections[sSection].push(buildLine(sFile, TYPES.CONST_REQUIRE, sPrefix));
    }
    return oSections;
}

function renderRequires (aRequires, sIndent = '') {
    return aRequires.map(s => sIndent + s).join(',\n');
}

function renderSections (oSections) {
    const aOutput = [];
    for (const [sSection, aRequires] of Object.entries(oSections)) {
        if (sSection === '.') {
            aOutput.push(renderRequires(aRequires, '    '));
        } else {
            aOutput.push(`    '${sSection}': {\n` + renderRequires(aRequires, '        ') + '\n    }');
        }
    }
    return aOutput.join(',\n');
}

/**
 * This function build an `GroupMemberRegistry.js` file requiring all other files in directory
 * @param sPath
 * @param sType
 * @param sPrefix
 */
function buildRequireIndex (sPath, sType, sPrefix) {
    // all files in directory
    const aRequires = TreeSync
        .tree(sPath)
        .filter(sFile => !sFile.endsWith('GroupMemberRegistry.js') && path.extname(sFile).match(/\.js(on)?$/));
    const d = new Date();
    const aOutput = [
        '// AUTOMATIC GENERATION : DO NOT MODIFY !',
        '// Date : ' + d.toJSON(),
        '// List of files in ' + sPath,
        '',
        'module.exports = {',
        sType === TYPES.CONST_REQUIRE_SECTION
            ? renderSections(dispatchPerFolder(aRequires, sPrefix))
            : aRequires.map(s => '    ' + buildLine(s, sType, sPrefix)).join(',\n')
    ];
    aOutput.push('};');
    const sOutput = aOutput.join('\n');
    console.log(sOutput);
}

buildRequireIndex(PATH, COMMAND, PREFIX);
