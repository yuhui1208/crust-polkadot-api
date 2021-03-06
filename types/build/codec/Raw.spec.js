"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _create = require("../create");

var _Raw = _interopRequireDefault(require("./Raw"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const registry = new _create.TypeRegistry();

const testDecode = (type, input, expected) => it(`can decode from ${type}`, () => {
  const e = new _Raw.default(registry, input);
  expect(e.toString()).toBe(expected);
});

const testEncode = (to, expected) => it(`can encode ${to}`, () => {
  const e = new _Raw.default(registry, [1, 2, 3, 4, 5]);
  expect(e[to]()).toEqual(expected);
});

describe('Raw', () => {
  let u8a;
  beforeEach(() => {
    u8a = new _Raw.default(registry, [1, 2, 3, 4, 5]);
  });
  testDecode('Array', [1, 2, 3, 4, 5], '0x0102030405');
  testDecode('hex', '0x0102030405', '0x0102030405');
  testDecode('U8a', new Uint8Array([1, 2, 3, 4, 5]), '0x0102030405');
  testDecode('Uint8Array', Uint8Array.from([1, 2, 3, 4, 5]), '0x0102030405');
  testEncode('toJSON', '0x0102030405');
  testEncode('toHex', '0x0102030405');
  testEncode('toString', '0x0102030405');
  testEncode('toU8a', Uint8Array.from([1, 2, 3, 4, 5]));
  it('contains the length of the elements', () => {
    expect(u8a.length).toEqual(5);
  });
  it('correctly encodes length', () => {
    expect(u8a.encodedLength).toEqual(5);
  });
  it('allows wrapping of a pre-existing instance', () => {
    expect(new _Raw.default(registry, u8a).length).toEqual(5);
  });
  it('implements subarray correctly', () => {
    expect(u8a.subarray(1, 3)).toEqual(Uint8Array.from([2, 3]));
  });
  describe('utils', () => {
    it('compares against other U8a', () => {
      expect(u8a.eq(new Uint8Array([1, 2, 3, 4, 5]))).toBe(true);
    });
    it('compares against other U8a (non-length)', () => {
      expect(u8a.eq(new Uint8Array([1, 2, 3, 4]))).toBe(false);
    });
    it('compares against other U8a (mismatch)', () => {
      expect(u8a.eq(new Uint8Array([1, 2, 3, 4, 6]))).toBe(false);
    });
    it('compares against hex inputs', () => {
      expect(u8a.eq('0x0102030405')).toBe(true);
    });
    it('has valid isAscii', () => {
      expect(u8a.isAscii).toBe(false);
      expect(new _Raw.default(registry, '0x2021222324').isAscii).toBe(true);
    });
    it('has valid toUtf8', () => {
      expect(new _Raw.default(registry, 'Приветствую, ми').toUtf8()).toEqual('Приветствую, ми');
      expect(new _Raw.default(registry, '0xe4bda0e5a5bd').toUtf8()).toEqual('你好');
    });
    it('throws on invalid utf8', () => {
      expect(() => new _Raw.default(registry, '0x7f07b1f87709608bee603bbc79a0dfc29cd315c1351a83aa31adf7458d7d3003').toUtf8()).toThrow(/The character sequence is not a valid Utf8 string/);
    });
  });
});