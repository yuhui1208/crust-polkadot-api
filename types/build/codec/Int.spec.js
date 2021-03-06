"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _create = require("../create");

var _Int = _interopRequireDefault(require("./Int"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
describe('Int', () => {
  const registry = new _create.TypeRegistry();
  it('provides a toBigInt interface', () => {
    expect(new _Int.default(registry, -1234).toBigInt()).toEqual(-1234n);
  });
  it('provides a toBn interface', () => {
    expect(new _Int.default(registry, -1234).toBn().toNumber()).toEqual(-1234);
  });
  it('provides a toNumber interface', () => {
    expect(new _Int.default(registry, -1234).toNumber()).toEqual(-1234);
  });
  it('converts to Little Endian from the provided value', () => {
    expect(new _Int.default(registry, -1234).toU8a()).toEqual(new Uint8Array([46, 251, 255, 255, 255, 255, 255, 255]));
  });
  it('converts to Little Endian from the provided value (bitLength)', () => {
    expect(new _Int.default(registry, -1234, 32).toU8a()).toEqual(new Uint8Array([46, 251, 255, 255]));
  });
  it('converts to hex/string', () => {
    const i = new _Int.default(registry, '0x12', 16);
    expect(i.toHex()).toEqual('0x0012');
    expect(i.toString()).toEqual('18');
  });
  it('converts to equivalents', () => {
    const a = new _Int.default(registry, '-123');
    expect(new _Int.default(registry, a).toNumber()).toEqual(-123);
  });
  it('converts to JSON depending on flags', () => {
    expect(new _Int.default(registry, 0x12, 16).toJSON()).toEqual('0x0012');
    expect(new _Int.default(registry, 0x12, 16, false).toJSON()).toEqual(0x12);
  });
  describe('static with', () => {
    it('allows default toRawType', () => {
      expect(new (_Int.default.with(64))(registry).toRawType()).toEqual('i64');
    });
    it('allows toRawType override', () => {
      expect(new (_Int.default.with(64, 'SomethingElse'))(registry).toRawType()).toEqual('SomethingElse');
    });
  });
});