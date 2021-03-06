"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _Metadata = _interopRequireDefault(require("@polkadot/metadata/Metadata"));

var _static = _interopRequireDefault(require("@polkadot/metadata/Metadata/static"));

var _create = require("../create");

var _AccountId = _interopRequireDefault(require("../generic/AccountId"));

var _Text = _interopRequireDefault(require("../primitive/Text"));

var _Vec = _interopRequireDefault(require("./Vec"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const registry = new _create.TypeRegistry(); // eslint-disable-next-line no-new

new _Metadata.default(registry, _static.default);
describe('Vec', () => {
  let vector;
  beforeEach(() => {
    vector = new _Vec.default(registry, _Text.default, ['1', '23', '345', '4567', new _Text.default(registry, '56789')]);
  });
  it('wraps a sequence of values', () => {
    expect(vector.length).toEqual(5); // eslint-disable-line
  });
  it('has a sane representation for toString', () => {
    expect(vector.toString()).toEqual('[1, 23, 345, 4567, 56789]');
  });
  it('encodes with length prefix', () => {
    expect(vector.toU8a()).toEqual(new Uint8Array([5 << 2, 1 << 2, 49, 2 << 2, 50, 51, 3 << 2, 51, 52, 53, 4 << 2, 52, 53, 54, 55, 5 << 2, 53, 54, 55, 56, 57]));
  });
  it('allows construction via JSON', () => {
    expect(new _Vec.default(registry, _Text.default, ['6', '7']).toJSON()).toEqual(['6', '7']);
  });
  it('allows construction via JSON (string type)', () => {
    expect(new _Vec.default(registry, 'u32', ['6', '7']).toJSON()).toEqual([6, 7]);
  });
  it('exposes the type', () => {
    expect(vector.Type).toEqual('Text');
  });
  it('decodes reusing instantiated inputs', () => {
    const foo = new _Text.default(registry, 'bar');
    expect(new _Vec.default(registry, _Text.default, [foo])[0]).toBe(foo);
  });
  it('decodes a complex type via construction', () => {
    const test = (0, _create.createTypeUnsafe)(registry, 'Vec<(PropIndex, AccountId)>', [new Uint8Array([4, 10, 0, 0, 0, 209, 114, 167, 76, 218, 76, 134, 89, 18, 195, 43, 160, 168, 10, 87, 174, 105, 171, 174, 65, 14, 92, 203, 89, 222, 232, 78, 47, 68, 50, 219, 79])]);
    const first = test[0];
    expect(first[0].toNumber()).toEqual(10);
    expect(first[1].toString()).toEqual('5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaQua');
  });
  it('decodes a complex type via construction', () => {
    const INPUT = '0x08cc0200000000ce0200000001';
    const test = (0, _create.createTypeUnsafe)(registry, 'Vec<(u32, [u32; 0], u16)>', [INPUT]);
    expect(test.length).toEqual(2);
    expect(test.toHex()).toEqual(INPUT);
  });
  describe('vector-like functions', () => {
    it('allows retrieval of a specific item', () => {
      expect(vector[2].toString()).toEqual('345');
    });
    it('exposes a working forEach', () => {
      const result = {};
      vector.forEach((e, i) => {
        result[i] = e.toString();
      });
      expect(result).toEqual({
        0: '1',
        1: '23',
        2: '345',
        3: '4567',
        4: '56789'
      });
    });
    it('exposes a working concat', () => {
      expect(vector.concat(new _Vec.default(registry, _Text.default, ['987', '654'])).toString()).toEqual('1,23,345,4567,56789,987,654');
    });
    it('exposes a working filter', () => {
      expect(vector.filter((e, i) => i >= 3).toString()).toEqual('4567,56789');
    });
    it('exposes a working map', () => {
      expect(vector.map(e => e.toString().substr(0, 1))).toEqual(['1', '2', '3', '4', '5']);
    });
    it('exposes a working reduce', () => {
      expect(vector.reduce((r, e) => `${r}${e.toString()}`, '')).toEqual('123345456756789');
    });
    it('exposes a working indexOf', () => {
      expect(vector.indexOf('1')).toEqual(0);
      expect(vector.indexOf(new _Text.default(registry, '23'))).toEqual(1);
      expect(vector.indexOf('0')).toEqual(-1);
    });
  });
  describe('encode', () => {
    const testEncode = (to, expected) => it(`can encode ${to}`, () => {
      expect(vector[to]()).toEqual(expected);
    });

    testEncode('toHex', '0x1404310832330c3334351034353637143536373839');
    testEncode('toJSON', ['1', '23', '345', '4567', '56789']);
    testEncode('toString', '[1, 23, 345, 4567, 56789]');
    testEncode('toU8a', Uint8Array.from([20, 4, 49, 8, 50, 51, 12, 51, 52, 53, 16, 52, 53, 54, 55, 20, 53, 54, 55, 56, 57]));
  });
  describe('utils', () => {
    const vec = new _Vec.default(registry, _Text.default, ['123', '456']);
    it('compares against codec types', () => {
      expect(vec.eq([new _Text.default(registry, '123'), new _Text.default(registry, '456')])).toBe(true);
    });
    it('compares against codec + primitive types', () => {
      expect(vec.eq(['123', new _Text.default(registry, '456')])).toBe(true);
    });
    it('finds the index of an value', () => {
      const myId = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
      const vec = new _Vec.default(registry, _AccountId.default, ['5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw', '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty', '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY']);
      expect(vec.indexOf(myId)).toEqual(2);
    });
  });
});