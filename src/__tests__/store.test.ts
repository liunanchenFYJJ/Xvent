import { map, delay, mapTo } from 'rxjs/operators'
import { create, provider, zip, returnSelf, connect } from '../store'

test('create', () => {
  const { updator, snapshot } = create({
    name: 'wenxu',
    age: (v: number) => v - 1
  })
  expect(snapshot.name).toBe('wenxu')
  expect(snapshot.age).toBeUndefined()
  expect(updator.name()).toBe('wenxu')
  expect(updator.age(10)).toBe(9)
  expect(snapshot.age).toBe(9)
})

test('pipe', () => {
  const { updator } = create({
    str: returnSelf<string>()
  })
  const { updator : _up, snapshot } = create({
    chars: (str: string) => str.split('')
  })
  connect(updator.str, _up.chars)
  updator.str('www')
  expect(snapshot.chars).toEqual(['w','w','w'])
})

test('provider', done => {
  const { updator, snapshot } = create({
    add1: provider<number, number>([map((v: number) => v + 1)]),
    smalldelay: provider([delay(10)]),
    delayHi: provider<any, string>([delay(1000), map(v => v + ' hi')])
  })
  updator.add1(1)(v => {
    expect(v).toBe(2)
  })
  const fn = jest.fn()
  updator.smalldelay('ni')(fn)()
  updator.delayHi('wenxu')(v => {
    expect(v).toBe('wenxu hi')
    // expect(snapshot.delayHi).toBe('hi')
    expect(fn.mock.calls.length).toBe(0)
    done()
  })
  expect(snapshot.add1).toBe(2)
})

test('watch', () => {
  const {updator} = create({
    name: 'wenxu',
    age: (v: number) => v - 1,
    ten: provider<any, number>([mapTo(10)])
  })
  const fn = jest.fn()
  updator.ten.addReader(fn)
  updator.ten()((v: number) => {
    expect(v).toBe(10)
  })
  expect(fn.mock.calls).toEqual([[10]])
  const fn2 = jest.fn()
  updator.age.addReader(fn2)
  updator.age(11)
  expect(fn2.mock.calls).toEqual([[10]])
})

test('zip', () => {
  const {updator} = create({
    name: 'wenxu',
    ten: provider([mapTo(10)])
  })
  zip<any[]>([updator.name()])(([name]) => {
    expect(name).toBe('wenxu')
  })
  zip<any[]>([updator.ten(), updator.name()])(([v,n]) => {
    expect(v).toBe(10)
    expect(n).toBe('wenxu')
  })
})

test('self', () => {
  const {updator} = create({
    name: returnSelf<string>()
  })
  expect(updator.name('wenxu')).toBe('wenxu')
})
