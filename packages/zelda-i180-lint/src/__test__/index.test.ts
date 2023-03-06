import execDiff from '../exec';
import path from 'path';

describe('i18n-init', () => {
    // 测试：需要手动改变mock文件
    it('normal use', async() => {
        const data= await execDiff(path.join(__dirname,'./mock/en.json'), false) as any;    
        expect(data.length).toBeGreaterThan(0);
    });
});