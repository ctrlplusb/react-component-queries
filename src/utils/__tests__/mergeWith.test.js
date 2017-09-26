import mergeWith from '../mergeWith'

describe('When mering props with `mergeWith`', () => {
  describe('and we are using "apply left prop" as resolver', () => {
    const resolver = x => x
    it('it should keep all defined values on left side.', () => {
      const a = {
        string: 'string',
        zero: 0,
        negaive: -1,
        float: 0.555555,
        deep: {
          er: 'foo',
        },
        array: [0, 1],
        emptyArray: [],
      }
      expect(mergeWith(a, {}, resolver)).toMatchObject({
        string: 'string',
        zero: 0,
        negaive: -1,
        float: 0.555555,
        deep: {
          er: 'foo',
        },
        array: [0, 1],
        emptyArray: [],
      })
    })

    it('it should keep all defined values on right side.', () => {
      const b = {
        string: 'string',
        zero: 0,
        negaive: -1,
        float: 0.555555,
        deep: {
          er: 'foo',
        },
        array: [0, 1],
        emptyArray: [],
      }
      expect(mergeWith({}, b, resolver)).toMatchObject({
        string: 'string',
        zero: 0,
        negaive: -1,
        float: 0.555555,
        deep: {
          er: 'foo',
        },
        array: [0, 1],
        emptyArray: [],
      })
    })

    it('it should copy existing values and use left one on conflict.', () => {
      const a = {
        string: 'string',
      }
      const b = {
        string: 'my string',
      }
      expect(mergeWith(a, b, resolver)).toMatchObject({
        string: 'string',
      })
    })
  })
})
