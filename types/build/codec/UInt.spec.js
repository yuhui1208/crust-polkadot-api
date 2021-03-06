"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _bn = _interopRequireDefault(require("bn.js"));

var _create = require("../create");

var _UInt = _interopRequireDefault(require("./UInt"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
describe('UInt', () => {
  const registry = new _create.TypeRegistry();
  it('fails on a number that is too large for the bits specified', () => {
    expect(() => new _UInt.default(registry, '12345678901234567890123456789012345678901234567890', 32)).toThrow('u32: Input too large. Found input with 164 bits, expected 32');
  });
  it('fails on negative numbers', () => {
    expect(() => new _UInt.default(registry, -123, 32)).toThrow('u32: Negative number passed to unsigned type');
  });
  it('allows for construction via BigInt', () => {
    expect(new _UInt.default(registry, 123456789123456789123456789n, 128).toHuman()).toEqual('123,456,789,123,456,789,123,456,789');
  });
  it('provides a toBigInt interface', () => {
    expect(new _UInt.default(registry, 9876543210123456789n).toBigInt()).toEqual(9876543210123456789n);
  });
  it('provides a toBn interface', () => {
    expect(new _UInt.default(registry, 987).toBn().toNumber()).toEqual(987);
  });
  it('provides a toNumber interface', () => {
    expect(new _UInt.default(registry, 4567).toNumber()).toEqual(4567);
  });
  it('converts to Little Endian from the provided value', () => {
    expect(new _UInt.default(registry, 1234567).toU8a()).toEqual(new Uint8Array([135, 214, 18, 0, 0, 0, 0, 0]));
  });
  it('converts to Little Endian from the provided value (bitLength)', () => {
    expect(new _UInt.default(registry, 1234567, 32).toU8a()).toEqual(new Uint8Array([135, 214, 18, 0]));
  });
  it('converts to hex/string', () => {
    const u = new _UInt.default(registry, '0x12', 16);
    expect(u.toHex()).toEqual('0x0012');
    expect(u.toString()).toEqual('18');
  });
  it('converts to equivalents', () => {
    const a = new _UInt.default(registry, '123');
    expect(new _UInt.default(registry, a).toNumber()).toEqual(123);
  });
  it('converts to JSON representation based on flags/size', () => {
    expect(new _UInt.default(registry, '0x12345678', 64, true).toJSON()).toEqual('0x0000000012345678');
    expect(new _UInt.default(registry, '0x1234567890', 64, false).toJSON()).toEqual(0x1234567890);
    expect(new _UInt.default(registry, '0x1234567890abcdef', 64, false).toJSON()).toEqual('0x1234567890abcdef');
  });
  describe('eq', () => {
    const test = new _UInt.default(registry, 12345);
    it('compares against other BN values', () => {
      expect(test.eq(new _bn.default(12345))).toBe(true);
    });
    it('compares against other number values', () => {
      expect(test.eq(12345)).toBe(true);
    });
    it('compares against hex values', () => {
      expect(test.eq('0x3039')).toBe(true);
    });
  });
  describe('isMax()', () => {
    it('is false where not full', () => {
      expect(new _UInt.default(registry, '0x1234', 32).isMax()).toEqual(false);
      expect(new _UInt.default(registry, '0xffffff', 32).isMax()).toEqual(false);
      expect(new _UInt.default(registry, '0x12345678', 32).isMax()).toEqual(false);
      expect(new _UInt.default(registry, '0xfffffff0', 32).isMax()).toEqual(false);
    });
    it('is true when full', () => {
      expect(new _UInt.default(registry, '0xffffffff', 32).isMax()).toEqual(true);
    });
  });
  describe('static with', () => {
    it('allows default toRawType', () => {
      expect(new (_UInt.default.with(64))(registry).toRawType()).toEqual('u64');
    });
    it('allows toRawType override', () => {
      expect(new (_UInt.default.with(64, 'SomethingElse'))(registry).toRawType()).toEqual('SomethingElse');
    });
  });
});