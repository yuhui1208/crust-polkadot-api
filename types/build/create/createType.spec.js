"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _Int = _interopRequireDefault(require("../codec/Int"));

var _ = require(".");

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
describe('createType', () => {
  const registry = new _.TypeRegistry();
  it('allows creation of a H256 (with proper toRawType)', () => {
    expect(registry.createType('H256').toRawType()).toEqual('H256');
    expect(registry.createType('Hash').toRawType()).toEqual('H256');
  });
  it('allows creation of a Fixed64 (with proper toRawType & instance)', () => {
    const f64 = registry.createType('Fixed64');
    expect(f64.toRawType()).toEqual('Fixed64');
    expect(f64.bitLength()).toEqual(64);
    expect(f64.isUnsigned).toBe(false);
    expect(f64 instanceof _Int.default).toBe(true);
  });
  it('allows creation of a Struct', () => {
    const raw = '{"balance":"Balance","index":"u32"}';
    const struct = (0, _.createTypeUnsafe)(registry, raw, [{
      balance: 1234,
      index: '0x10'
    }]);
    expect(struct.toJSON()).toEqual({
      balance: 1234,
      index: 16
    });
    expect(struct.toRawType()).toEqual(raw);
  });
  it('allows creation of a BTreeMap', () => {
    expect((0, _.createTypeUnsafe)(registry, 'BTreeMap<Text,u32>', ['0x041c62617a7a696e6745000000']).toString()).toEqual('{"bazzing":69}');
  });
  it('allows creation of a BTreeSet', () => {
    expect((0, _.createTypeUnsafe)(registry, 'BTreeSet<u32>', ['0x1002000000180000001e00000050000000']).toString()).toEqual('[2,24,30,80]');
  });
  it('allows creation of a Enum (simple)', () => {
    expect((0, _.createTypeUnsafe)(registry, '{"_enum": ["A", "B", "C"]}', [1]).toJSON()).toEqual('B');
  });
  it('allows creation of a Enum (parametrised)', () => {
    expect((0, _.createTypeUnsafe)(registry, '{"_enum": {"A": null, "B": "u32", "C": null} }', [1]).toJSON()).toEqual({
      B: 0
    });
  });
  it('allows creation of a Result', () => {
    expect((0, _.createTypeUnsafe)(registry, 'Result<u32,Text>', ['0x011064656667']).toJSON()).toEqual({
      Error: 'defg'
    });
  });
  it('allows creation of a Set', () => {
    expect((0, _.createTypeUnsafe)(registry, '{"_set": { "A": 1, "B": 2, "C": 4, "D": 8, "E": 16, "G": 32, "H": 64, "I": 128 } }', [1 + 4 + 16 + 64]).strings).toEqual(['A', 'C', 'E', 'H']);
  });
  it('allows creation of a Tuple', () => {
    expect((0, _.createTypeUnsafe)(registry, '(Balance,u32)', [[1234, 5678]]).toJSON()).toEqual([1234, 5678]);
  });
  it('allows creation for a UInt<bitLength>', () => {
    expect((0, _.createTypeUnsafe)(registry, 'UInt<2048>').toRawType()).toEqual('u2048');
  });
  it('fails creation for a UInt<bitLength> where bitLength is not power of 8', () => {
    expect(() => (0, _.createTypeUnsafe)(registry, 'UInt<20>').toRawType()).toThrow('UInt<20>: Only support for UInt<bitLength>, where length <= 8192 and a power of 8');
  });
  it('fails on creation of DoNotConstruct', () => {
    const Clazz = (0, _.createClass)(registry, 'DoNotConstruct<UnknownSomething>');
    expect(() => new Clazz(registry)).toThrow('Cannot construct unknown type UnknownSomething');
  });
  it('allows creation of a [u8; 8]', () => {
    expect((0, _.createTypeUnsafe)(registry, '[u8; 8]', [[0x12, 0x00, 0x23, 0x00, 0x45, 0x00, 0x67, 0x00]]).toHex()).toEqual('0x1200230045006700');
  });
  it('allows creation of a [u16; 4]', () => {
    expect((0, _.createTypeUnsafe)(registry, '[u16; 4]', [[0x1200, 0x2300, 0x4500, 0x6700]]).toU8a()).toEqual(new Uint8Array([0x00, 0x12, 0x00, 0x23, 0x00, 0x45, 0x00, 0x67]));
  });
  describe('instanceof', () => {
    it('instanceof should work (primitive type)', () => {
      const value = registry.createType('Balance', 1234);
      expect(value instanceof registry.createClass('Balance')).toBe(true);
    });
    it('instanceof should work (srml type)', () => {
      const value = registry.createType('Gas', 1234);
      const Gas = registry.createClass('Gas');
      expect(value instanceof Gas).toBe(true);
    });
    it('instanceof should work (complex type)', () => {
      registry.register({
        TestComplex: {
          balance: 'Balance',
          // eslint-disable-next-line sort-keys
          accountId: 'AccountId',
          log: '(u64, u32)',
          // eslint-disable-next-line sort-keys
          fromSrml: 'Gas'
        }
      });
      const value = (0, _.createTypeUnsafe)(registry, 'TestComplex', [{
        accountId: '0x1234567812345678123456781234567812345678123456781234567812345678',
        balance: 123,
        fromSrml: 0,
        log: [456, 789]
      }]);
      expect(value instanceof (0, _.createClass)(registry, 'TestComplex')).toBe(true);
    });
    it('allows for re-registration of a type', () => {
      const balDef = registry.createType('Balance');
      expect(balDef instanceof registry.createClass('Balance'));
      expect(balDef.bitLength()).toEqual(128);
      registry.register({
        Balance: 'u32'
      });
      const balu32 = registry.createType('Balance');
      expect(balu32 instanceof registry.createClass('Balance'));
      expect(balu32.bitLength()).toEqual(32);
    });
    it('allows for re-registration of a type (affecting derives)', () => {
      registry.register({
        Balance: 'u128',
        TestComplex: {
          balance: 'Balance',
          // eslint-disable-next-line sort-keys
          accountId: 'AccountId',
          log: '(u64, u32)',
          // eslint-disable-next-line sort-keys
          fromSrml: 'Gas'
        }
      }); // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

      const cmpDef = (0, _.createTypeUnsafe)(registry, 'TestComplex'); // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call

      expect(cmpDef.balance.bitLength()).toEqual(128);
      registry.register({
        Balance: 'u32'
      }); // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

      const cmpu32 = (0, _.createTypeUnsafe)(registry, 'TestComplex'); // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call

      expect(cmpu32.balance.bitLength()).toEqual(32);
    });
  });
});