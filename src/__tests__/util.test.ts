import { removeFromArray } from '../util'

test('removeFromArray', () => {
  expect(removeFromArray([0, 1], 1)).toEqual([0])
  expect(removeFromArray([0, 1], 0)).toEqual([1])
  expect(removeFromArray([0, 1], 2)).toEqual([0, 1])
})