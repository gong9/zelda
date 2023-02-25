
const peg = require('peggy');
const path = require('path');
const fs = require('fs');

const parseDiff = (diffData: string) => {
    const rule = fs.readFileSync(path.resolve(__dirname, '../peggy/diffParser.peggy'));
    const parser = peg.generate(rule.toString());

    return parser.parse(diffData);
};

export default parseDiff