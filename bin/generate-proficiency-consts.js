const fs = require('fs')


function getProficienciesFromSkillFile (sFile) {
    const oSkillData = JSON.parse(fs.readFileSync(sFile).toString())
    return Object
        .values(oSkillData)
        .map(s => s.proficiency)
        .join('\n')
}

console.log(getProficienciesFromSkillFile(process.argv[2]))

