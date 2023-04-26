import fs from 'fs';
import { consola } from 'consola'
import containsChinese from "./utils/containsChinese";
import { notTranslationType } from './exec';

const findAllDiff = (path: string, isPrivate = false) => {
    const notTranslation: notTranslationType[] = [];

    try {
        const fileData = fs.readFileSync(path);

        if (!fileData.toString()) {
            consola.warn('文件内容为空')
            return notTranslation;
        }

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

        if (!isPrivate && notTranslation.length > 0) {
            consola.info('以下是未翻译的配置：')
            console.table(notTranslation, ['key', 'value']);
        }

        return notTranslation;

    } catch (error) {
        consola.error(error);
        return notTranslation;
    }
};

export default findAllDiff;