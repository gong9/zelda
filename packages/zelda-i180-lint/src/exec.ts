import { exec } from 'child_process';
import containsChinese from './utils/containsChinese';
import parseDiff from './utils/parseDiff';

interface notTranslationType {
    key: string;
    value: string;
}

const execDiff = (path: string, asBin: boolean = false) => {
    const command = `git diff HEAD  ${path}`;
    const notTranslation: notTranslationType[] = [];

    return new Promise((res, rej) => {
        exec(command, (err, stdout: string) => {
            if (err) {
                console.error(err);
                rej(err);
            } else {
                if (!stdout) {
                    console.info('本次提交暂无新增加内容');
                    res(notTranslation);
                }

                const curAddText = parseDiff(stdout).change[0].content.filter(
                    (item: any) => item.type === '+',
                );

                curAddText.forEach((item: any) => {
                    const curItemValue = item.text.split('": "');

                    if (curItemValue.length > 2) {
                        throw new Error(`${item} 无法正确解析，请手动判断`);
                    }

                    if (containsChinese(curItemValue[1])) {
                        notTranslation.push({
                            key: curItemValue[0],
                            value: curItemValue[1],
                        });
                    }
                });

                if (notTranslation.length > 0) {
                    if (asBin) {
                        console.table(notTranslation, ['key', 'value']);
                        throw new Error(
                            `本次提交，存在未翻译的配置。请检查「如果确认此修改，请commit添加参数--no-verify 」`,
                        );
                    } else {
                        res(notTranslation);
                    }

                } else {
                    console.info('未发现异常');
                    res(notTranslation);
                }
            }
        });
    });


};


export default execDiff;
