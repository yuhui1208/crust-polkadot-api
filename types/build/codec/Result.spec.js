"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _util = require("@polkadot/util");

var _primitive = require("../primitive");

var _create = require("../create");

var _Result = _interopRequireDefault(require("./Result"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
describe('Result', () => {
  const registry = new _create.TypeRegistry();

  const Type = _Result.default.with({
    Error: _primitive.Text,
    Ok: _primitive.u32
  });

  it('has a sane toRawType representation', () => {
    expect(new Type(registry).toRawType()).toEqual('Result<u32,Text>');
  });
  it('decodes from a u8a (success)', () => {
    const result = new Type(registry, new Uint8Array([0, 1, 2, 3, 4]));
    expect(result.isOk);
    expect(result.asOk.toU8a()).toEqual(new Uint8Array([1, 2, 3, 4]));
    expect(result.toHex()).toEqual('0x0001020304');
    expect(result.toJSON()).toEqual({
      Ok: 0x04030201
    });
  });
  it('decodes from a u8a (error)', () => {
    const result = new Type(registry, new Uint8Array([1, 4 << 2, 100, 101, 102, 103]));
    expect(result.isError);
    expect(result.asError.toU8a()).toEqual(new Uint8Array([4 << 2, 100, 101, 102, 103]));
    expect(result.toHex()).toEqual('0x011064656667');
    expect(result.toJSON()).toEqual({
      Error: (0, _util.hexToString)('0x64656667')
    });
  });
  it('decodes from a JSON representation', () => {
    const result = new Type(registry, {
      Error: 'error'
    });
    expect(result.toHex()).toEqual('0x01146572726f72');
  });
  it('decodes reusing instanciated inputs', () => {
    const foo = new _primitive.Text(registry, 'bar');
    expect(new _Result.default(registry, _primitive.Text, _primitive.Text, {
      Ok: foo
    }).asOk).toBe(foo);
  });
  it('returns a proper raw typedef rom a built-in', () => {
    expect(registry.createType('DispatchResult').toRawType()).toEqual('Result<(),DispatchError>');
  });
});