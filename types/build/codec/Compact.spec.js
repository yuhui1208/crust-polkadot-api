"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _bn = _interopRequireDefault(require("bn.js"));

var _create = require("../create");

var _Date = _interopRequireDefault(require("./Date"));

var _U = _interopRequireDefault(require("../primitive/U32"));

var _Compact = _interopRequireDefault(require("./Compact"));

var _UInt = _interopRequireDefault(require("./UInt"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
describe('Compact', () => {
  const registry = new _create.TypeRegistry();
  describe('encodeU8a', () => {
    it('encodes short u8', () => {
      expect(_Compact.default.encodeU8a(18)).toEqual(new Uint8Array([18 << 2]));
    });
    it('encodes max u8 values', () => {
      expect(_Compact.default.encodeU8a(new (_UInt.default.with(32))(registry, 63))).toEqual(new Uint8Array([0b11111100]));
    });
    it('encodes basic u16 value', () => {
      expect(_Compact.default.encodeU8a(511)).toEqual(new Uint8Array([0b11111101, 0b00000111]));
    });
    it('encodes basic ua6 (not at edge)', () => {
      expect(_Compact.default.encodeU8a(111)).toEqual(new Uint8Array([0xbd, 0x01]));
    });
    it('encodes basic u32 values (short)', () => {
      expect(_Compact.default.encodeU8a(0xffff)).toEqual(new Uint8Array([254, 255, 3, 0]));
    });
    it('encodes basic u32 values (full)', () => {
      expect(_Compact.default.encodeU8a(0xfffffff9)).toEqual(new Uint8Array([3, 249, 255, 255, 255]));
    });
    it('encondes a large balance', () => {
      expect(_Compact.default.encodeU8a(registry.createType('Balance', '0x5af3107a4000'))).toEqual(new Uint8Array([3 + (6 - 4 << 2), 0x00, 0x40, 0x7a, 0x10, 0xf3, 0x5a]));
    });
  });
  describe('decodeU8a', () => {
    it('decoded u8 value', () => {
      expect(_Compact.default.decodeU8a(new Uint8Array([0b11111100]), 32)).toEqual([1, new _bn.default(63)]);
    });
    it('decodes from same u16 encoded value', () => {
      expect(_Compact.default.decodeU8a(new Uint8Array([0b11111101, 0b00000111]), 32)).toEqual([2, new _bn.default(511)]);
    });
    it('decodes from same u32 encoded value (short)', () => {
      expect(_Compact.default.decodeU8a(new Uint8Array([254, 255, 3, 0]), 32)).toEqual([4, new _bn.default(0xffff)]);
    });
    it('decodes from same u32 encoded value (full)', () => {
      expect(_Compact.default.decodeU8a(new Uint8Array([3, 249, 255, 255, 255]), 32)).toEqual([5, new _bn.default(0xfffffff9)]);
    });
    it('decodes from same u32 as u64 encoded value (full, default)', () => {
      expect(_Compact.default.decodeU8a(new Uint8Array([3, 249, 255, 255, 255]), 64)).toEqual([5, new _bn.default(0xfffffff9)]);
    });
  });
  describe('constructor', () => {
    it('has support for BigInt', () => {
      expect(new _Compact.default(registry, 'u128', 123456789000123456789n).toHuman()).toEqual('123,456,789,000,123,456,789');
    });
    it('has the correct bitLength for constructor values (BlockNumber)', () => {
      expect(new (_Compact.default.with(registry.createClass('BlockNumber')))(registry, 0xfffffff9).bitLength()).toEqual(32);
    });
    it('has the correct encodedLength for constructor values (string BlockNumber)', () => {
      expect(new (_Compact.default.with('BlockNumber'))(registry, 0xfffffff9).encodedLength).toEqual(5);
    });
    it('has the correct encodedLength for constructor values (class BlockNumber)', () => {
      expect(new (_Compact.default.with(registry.createClass('BlockNumber')))(registry, 0xfffffff9).encodedLength).toEqual(5);
    });
    it('has the correct encodedLength for constructor values (u32)', () => {
      expect(new (_Compact.default.with(_U.default))(registry, 0xffff9).encodedLength).toEqual(4);
    });
    it('constructs properly via Uint8Array as U32', () => {
      expect(new (_Compact.default.with(_U.default))(registry, new Uint8Array([254, 255, 3, 0])).toNumber()).toEqual(new _bn.default(0xffff).toNumber());
    });
    it('constructs properly via number as Moment', () => {
      expect(new (_Compact.default.with(_Date.default))(registry, 1537968546).toString().startsWith('Wed Sep 26 2018') // The time depends on the timezone this test is run in
      ).toBe(true);
    });
  });
  describe('utils', () => {
    it('compares against another Compact', () => {
      expect(new (_Compact.default.with(_U.default))(registry, 12345).eq(new (_Compact.default.with(_U.default))(registry, 12345))).toBe(true);
    });
    it('compares against a primitive', () => {
      expect(new (_Compact.default.with(_U.default))(registry, 12345).eq(12345)).toBe(true);
    });
    it('unwraps to the wrapped value', () => {
      expect(new (_Compact.default.with(_U.default))(registry, 12345).unwrap() instanceof _U.default).toBe(true);
    });
    it('has a valid toBn interface', () => {
      expect(new (_Compact.default.with('u128'))(registry, '12345678987654321').toBn().eq(new _bn.default('12345678987654321'))).toBe(true);
    });
    it('has a valid toBigInt interface', () => {
      expect(new (_Compact.default.with('u128'))(registry, 12345678987654321n).toBigInt() === 12345678987654321n).toBe(true);
    });
  });
  describe('helpers', () => {
    it('correctly adds the length prefix', () => {
      expect(_Compact.default.addLengthPrefix(Uint8Array.from([12, 13]))).toEqual(Uint8Array.from([2 << 2, 12, 13]));
    });
  });
});