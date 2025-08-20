const PROPERTIES = require('./Struct/Property');

const aProps = new Set();
for (const px of Object.values(PROPERTIES)) {
    Object.keys(px).forEach((k) => {
        aProps.add(k);
    });
}

console.log([...aProps]);
