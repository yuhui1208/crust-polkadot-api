"use strict";

var _create = require("../../create");

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
describe('IdentityFields', () => {
  const registry = new _create.TypeRegistry();
  it('has a custom u64 (64-bit) encodedLength', () => {
    expect(registry.createType('IdentityFields').encodedLength).toEqual(8);
  });
  it('encodes a sample', () => {
    expect(registry.createType('IdentityFields', ['Display', 'Legal']).valueEncoded.eqn(1 + 2)).toBe(true);
  });
  it('encodes to a valid u8a value', () => {
    expect(registry.createType('IdentityFields', ['Display', 'Legal']).toU8a()).toEqual(new Uint8Array([3, 0, 0, 0, 0, 0, 0, 0]));
  });
  it('decodes from a u8a', () => {
    expect(registry.createType('IdentityFields', new Uint8Array([1 + 2 + 64, 0, 0, 0, 0, 0, 0, 0])).toHuman()).toEqual(['Display', 'Legal', 'Image']);
  });
});