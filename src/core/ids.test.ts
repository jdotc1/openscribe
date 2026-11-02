import { describe, expect, it } from 'vitest'
import { randomId, sha256, stableStringify } from './ids'

describe('identifiants et sérialisation du cache', () => {
  it('trie récursivement les clés des objets indépendamment de leur insertion', () => {
    const a = { z: { y: 2, x: 1 }, a: [{ b: 3, a: 4 }] }
    const b = { a: [{ a: 4, b: 3 }], z: { x: 1, y: 2 } }
    expect(stableStringify(a)).toBe(stableStringify(b))
    expect(stableStringify(a)).toBe('{"a":[{"a":4,"b":3}],"z":{"x":1,"y":2}}')
  })

  it('omet les propriétés undefined, mais conserve null', () => {
    expect(stableStringify({ omitted: undefined, value: null })).toBe('{"value":null}')
    expect(stableStringify([1, 2])).not.toBe(stableStringify([2, 1]))
  })

  it('calcule le vecteur de référence SHA-256 pour abc', async () => {
    expect(await sha256('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
  })

  it('crée des identifiants distincts avec un préfixe facultatif', () => {
    const ids = Array.from({ length: 32 }, () => randomId('note'))
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toMatch(/^note_[a-z0-9]{12}$/)
    expect(randomId()).toMatch(/^[a-z0-9]{12}$/)
  })
})
