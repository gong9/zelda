#!/usr/bin/env node
import { cli } from 'cleye';
import execDiff from "./exec";
import packJson from '../package.json';

const argv = cli({
    name: 'zelda-i180-lint',
    version: packJson.version,
    description: 'i180 lint',
    flags: {
        path: {
            type: String,
            description: 'Input your file path',
            alias: 'p',
        }
    }
});

const curPath = argv.flags.path;

if (curPath) {
    console.log(curPath);
    execDiff(curPath, true);
} else {
    console.info('请输入文件路径');
}

export default execDiff;




