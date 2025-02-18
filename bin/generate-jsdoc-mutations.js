const path = require('node:path');
const fs = require('node:fs');
const TreeSync = require('../src/libs/o876-xtree/sync');

function getAllParams (sFile) {
    const aParams = fs
        .readFileSync(sFile, {encoding: 'utf-8'})
        .split('\n')
        .filter(s => s.includes('@param') || s.includes('@return'));
    const nToDelete = aParams.findLastIndex(s => s.includes('state {') || s.includes('getters {') || s.includes('externals'));
    if (nToDelete < 0) {
        throw new Error('Need tag @param state {*} || getters {*} || externals in file ' + sFile);
    }
    const p = aParams
        .slice(nToDelete + 1)
        .filter(s => s.includes('@param'))
        .map(s => s
            .replace(/.*@param /, '')
            .replace(/ \{/, ': ')
            .replace(/}/, '')

        )
        .join(', ');
    const sReturn = aParams.findLast(s => s.includes('@return'));
    const sReturnType = sReturn
        ? (': ' + sReturn.replace(/.*@returns? \{/, '').replace(/}\s*$/, ''))
        : '';
    return ' {function({ ' + p + ' })' + sReturnType + '}';
}

function generateMutationReturnType (aPaths) {
    const p = aPaths.map(sPath => {
        return TreeSync.ls(sPath)
            .filter(f => f.name !== 'index.js')
            .map(f => path.basename(f.name, '.js'))
            .map(f => {
                const sFile = path.join(sPath, f) + '.js';
                return ' * @property ' + f + getAllParams(sFile);
            });
    }).flat();
    const x = [
        '/**',
        ' * @typedef RBSStoreMutations {Object}',
        ...p,
        ' */',
        '',
        'module.exports = {}'
    ];
    return x.join('\n');
}

console.log(generateMutationReturnType(process.argv.slice(2)));
