import { exec } from 'child_process';
import { consola } from 'consola'
import containsChinese from './utils/containsChinese';
import parseDiff from './utils/parseDiff';
import toObject from './utils/toObject';
import findAllDiff from './findAllDiff';

export interface notTranslationType {
    key: string;
    value: string;
}

interface AddTextType {
    type: string;
    text: string;
}

const execDiff = (path: string, asBin: boolean = false) => {
    const command = `git diff --cached  ${path}`;
    let notTranslation: notTranslationType[] = [];

    return new Promise((res, rej) => {
        exec(command, async (err, stdout: string) => {
            if (err) {
                console.error(err);
                rej(err);
            } else {
                if (!stdout) {
                    consola.info('本次提交暂无新增加内容');
                    res(notTranslation);
                    return;
                }

                let curAddText: AddTextType[] = [];
                const parseResult = parseDiff(stdout);

                if (parseResult && parseResult.change.length > 0) {
                    curAddText = parseResult.change.reduce((pre: AddTextType[], cur: any) => {
                        return [
                            ...pre,
                            ...cur.content.filter((item: any) => item.type === '+')
                        ];
                    }, curAddText);

                    curAddText.forEach((item: AddTextType) => {
                        const curItemObjectData = toObject(item.text);

                        if (containsChinese(curItemObjectData[Object.keys(curItemObjectData)[0]])) {
                            notTranslation.push({
                                key: Object.keys(curItemObjectData)[0],
                                value: curItemObjectData[Object.keys(curItemObjectData)[0]],
                            });
                        }
                    });
                }else if(!parseResult){
                    notTranslation = findAllDiff(path,true)
                }

                if (notTranslation.length > 0) {
                    if (asBin) {
                        consola.warn('本次提交，存在未翻译的配置。请检查')
                        console.table(notTranslation, ['key', 'value']);

                        const result = await consola.prompt("返回修改?", {
                            type: "confirm",
                        });

                        if(result){
                            throw new Error(
                                `已中断此次commit`,
                            );
                        }

                        consola.success('翻译检查通过')
                        res(notTranslation);
                       
                    } else {
                        res(notTranslation);
                    }

                } else {
                    console.info('未发现异常');
                    consola.success('翻译检查通过')
                    res(notTranslation);
                }
            }
        });
    });
};


export default execDiff;
