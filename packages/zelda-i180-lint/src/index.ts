const exec = require('child_process').exec;
const containsChinese = require('./utils/containsChinese')
const parseDiff = require('./utils/parseDiff')

interface notTranslationType {
    key: string;
    value: string;
}

const command = `git diff HEAD  src/utils/i18n/en.json`;
const notTranslation: notTranslationType[] = [];

exec(command, 'utf8', (err: any, stdout: string) => {
    if (err) {
        console.log(err);
    } else {
        if (!stdout) {
            console.log('本次提交暂无新增加内容');
            return;
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
            console.table(notTranslation, ['key', 'value']);
            throw new Error(
                `本次提交，存在未翻译的配置。请检查「如果确认此修改，请commit添加参数--no-verify 」`,
            );
        } else {
            console.log('未发现异常');
        }
    }
});