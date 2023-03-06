import path from 'path';
import execDiff from '../exec';

describe('i18n-init', () => {
    // 测试：需要手动改变mock文件

    // 修改工作区
    // it('normal use', async() => {
    //     const data= await execDiff(path.join(__dirname,'./mock/en.json'), false) as any;    
    //     expect(data.length).toBeGreaterThan(0);
    // });

    // 没有修改工作区
    it('no modification',async()=>{
        const data= await execDiff(path.join(__dirname,'./mock/en.json'), false) as any;    
        expect(data.length).toBe(0);
    });
});