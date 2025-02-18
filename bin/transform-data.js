const SmartData = require('../src/libs/smart-data');
const path = require('path');
const CONSTS = require('../src/consts');
const fs = require('fs');

function main (sFileName, sDestPath) {
    const sd = new SmartData({ data: CONSTS });
    const aRows = sd.loadCSV(sFileName);
    const oOutput = sd.run(aRows);
    Object
        .entries(oOutput)
        .filter(([sFile]) => sFile !== '')
        .forEach(([sFile, oStruct]) => {
            const sFileFinal = path.resolve(sDestPath, sFile + '.json');
            fs.writeFileSync(sFileFinal, JSON.stringify(oStruct, null, '  '));
        });
}

main(process.argv[2], process.argv[3]);
