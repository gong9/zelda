import { exec } from 'child_process';
import execDiff from '../';

describe('i18n-init', () => {
    it('normal use', () => {
        exec('git add ./mock/en.json');
        const data = execDiff('./mock/en.json', false);
        console.log(data);
        
    });
});