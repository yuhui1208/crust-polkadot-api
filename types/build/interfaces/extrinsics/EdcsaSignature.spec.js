"use strict";

var _util = require("@polkadot/util");

var _create = require("../../create");

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const TESTS = ['0x55bd020bdbbdc02de34e915effc9b18a99002f4c29f64e22e8dcbb69e722ea6c28e1bb53b9484063fbbfd205e49dcc1f620929f520c9c4c3695150f05a28f52a01', '0x98adffe14b1882ba5a861d6aaa10805d52aed56f480e1ece01505a77470f29f15cb4b0a1dc33177761de8270199282baf160f255e1ca0e4c8354b54b0059e40a1c'];
describe('EdcsaSignature', () => {
  const registry = new _create.TypeRegistry();
  it('constructs and has a valid representation (toHex)', () => {
    expect(registry.createType('EcdsaSignature', TESTS[0]).toHex()).toEqual(TESTS[0]);
  });
  it('constructs and has a valid representation (toJSON)', () => {
    expect(registry.createType('EcdsaSignature', TESTS[0]).toJSON()).toEqual(TESTS[0]);
  });
  it('constructs and has a valid representation (toU8a)', () => {
    expect(registry.createType('EcdsaSignature', TESTS[1]).toU8a()).toEqual((0, _util.hexToU8a)(TESTS[1]));
  });
});