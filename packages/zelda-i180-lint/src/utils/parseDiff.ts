import peg from 'peggy';
import path from 'path';
import fs from 'fs';

const parseDiff = (diffData: string) => {
    const rule = fs.readFileSync(path.resolve(__dirname, '../peggy/diffParser.peggy'));
    const parser = peg.generate(rule.toString());

    try {
        return parser.parse(diffData);
    } catch (error) {
        return null;
    }
};

export default parseDiff;