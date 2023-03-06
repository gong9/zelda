import fs from 'fs';
import containsChinese from "./utils/containsChinese";
import { notTranslationType } from './exec';

const findAllDiff = (path: string) => {
    if (!path) {
        console.info('path is empty');
        return;
    }

    const notTranslation: notTranslationType[] = [];
  
    try {
        const fileData = fs.readFileSync(path);
        const fileDataObj = JSON.parse(fileData.toString());
       
        Object.keys(fileDataObj).forEach((key) => {
            if (containsChinese(fileDataObj[key])) {
                notTranslation.push({
                    key,
                    value: fileDataObj[key],
                });
            }
        }
        );

        if (notTranslation.length > 0) {
            console.table(notTranslation, ['key', 'value']);
            return notTranslation;
        }

    } catch (error) {
        console.error(error);
        return notTranslation;
    }
};

export default findAllDiff;