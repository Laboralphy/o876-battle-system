const fs = require('fs');


function getSkillsFromSkillFile (sFile) {
    const oSkillData = JSON.parse(fs.readFileSync(sFile).toString());
    return Object
        .keys(oSkillData)
        .join('\n');
}

console.log(getSkillsFromSkillFile(process.argv[2]));

