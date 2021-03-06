"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _bn = _interopRequireDefault(require("bn.js"));

var _create = require("../create");

var _AccountIndex = _interopRequireDefault(require("./AccountIndex"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
describe('AccountIndex', () => {
  const registry = new _create.TypeRegistry();
  it('creates a BN representation', () => {
    expect(registry.createType('AccountIndex', new Uint8Array([17, 18, 19, 20])).toNumber()).toEqual(336794129);
  });
  it('creates from BigInt', () => {
    expect(registry.createType('AccountIndex', 336794129n).toNumber()).toEqual(336794129);
  });
  it('creates a BN representation (from ss-58)', () => {
    expect(registry.createType('AccountIndex', 'Mwz15xP2').toNumber()).toEqual(336794129);
  });
  it('constructs 2-byte from number', () => {
    expect(registry.createType('AccountIndex', 256 * 1).toString()).toEqual('25GUyv');
  });
  it('constructs from number', () => {
    expect(registry.createType('AccountIndex', new _bn.default(336794129)).toString()).toEqual('Mwz15xP2');
  });
  it('compares ss-58 values', () => {
    expect(registry.createType('AccountIndex', 256 * 1).eq('25GUyv')).toBe(true);
  });
  it('compares numbers', () => {
    expect(registry.createType('AccountIndex', '2jpAFn').eq(256 * 1)).toBe(true);
  });
  describe('calcLength', () => {
    const testLength = (value, length) => {
      expect(_AccountIndex.default.calcLength(value)).toEqual(length);
    };

    it('returns 1 for <= 0xef', () => {
      testLength(0xef, 1);
    });
    it('returns 2 for > 0xef', () => {
      testLength(0xf0, 2);
    });
    it('returns 4 bytes for 32-bit inputs', () => {
      testLength(0xffeeddcc, 4);
    });
    it('returns 8 bytes for larger inputs', () => {
      testLength(0x122334455, 8);
    });
  });
});