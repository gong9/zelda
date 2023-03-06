import { exec } from 'child_process';
import containsChinese from './utils/containsChinese';
import parseDiff from './utils/parseDiff';
import toObject from './utils/toObject';

export interface notTranslationType {
    key: string;
    value: string;
}

interface AddTextType  {
    type: string;
    text: string;
}

const execDiff = (path: string, asBin: boolean = false) => {
    const command = `git diff --cached  ${path}`;
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
                    return;
                }  

                let curAddText: AddTextType[] = [];
              
                if(parseDiff(stdout).change.length > 0){
                    curAddText = parseDiff(stdout).change.reduce((pre:AddTextType[],cur:any)=>{
                        return [
                            ...pre,
                            ...cur.content.filter((item: any) => item.type === '+')
                        ];
                    },curAddText);
                }
                
                curAddText.forEach((item: AddTextType) => {
                    const curItemObjectData = toObject(item.text);
                    
                    if (containsChinese(curItemObjectData[Object.keys(curItemObjectData)[0]])) {
                        notTranslation.push({
                            key: Object.keys(curItemObjectData)[0],
                            value: curItemObjectData[Object.keys(curItemObjectData)[0]],
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
