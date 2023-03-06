import path from 'path';
import findAllDiff from "../findAllDiff";

describe('findAllDiff',()=>{
    it('normal use',()=>{
       const notTranslation =  findAllDiff(path.resolve(__dirname,'./mock/en.json'));
       expect(notTranslation?.length).toBeGreaterThan(0);
    });
});