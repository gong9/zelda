import toObject from "../utils/toObject";

describe('toObject',()=>{
    it('no comma',()=>{
       const data =  toObject('"10"  :   "si 11"');
       expect(data).toEqual({10:"si 11"});
    });

    it('has comma',()=>{
        const data =  toObject('"10"  :   "si 11",');
        expect(data).toEqual({10:"si 11"});
     });
});