import  containsChinese  from '../utils/containsChinese';

describe('containsChinese',()=>{
    it('should return true if the text contains at least one Chinese characters',()=>{
        expect(containsChinese('你好')).toBe(true);
    });
    it('should return false if the text does not contain Chinese characters',()=>{
        expect(containsChinese('hello')).toBe(false);
    });
});