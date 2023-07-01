import path from 'node:path'
import findAllDiff from '../findAllDiff'

describe('findAllDiff', () => {
  it('normal use, have chinese', () => {
    const notTranslation = findAllDiff(path.resolve(__dirname, './mock/en.json'))
    expect(notTranslation?.length).toBeGreaterThan(0)
  })

  it('normal use, no chinese', () => {
    const notTranslation = findAllDiff(path.resolve(__dirname, './mock/testEn02.json'))
    expect(notTranslation?.length).toBe(0)
  })
})
