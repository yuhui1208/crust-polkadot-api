"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _util = require("@polkadot/util");

var _create = require("../create");

var _ExtrinsicPayload = _interopRequireDefault(require("./ExtrinsicPayload"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
describe('ExtrinsicPayload', () => {
  const registry = new _create.TypeRegistry();
  const TEST = {
    address: '5DTestUPts3kjeXSTMyerHihn1uwMfLj8vU8sqF7qYrFabHE',
    blockHash: '0xde8f69eeb5e065e18c6950ff708d7e551f68dc9bf59a07c52367c0280f805ec7',
    era: '0x0703',
    genesisHash: '0xdcd1346701ca8396496e52aa2785b1748deb6db09551b72159dcb3e08991025b',
    method: '0x0600ffd7568e5f0a7eda67a82691ff379ac4bba4f9c9b859fe779b5d46363b61ad2db9e56c',
    nonce: '0x00001234',
    specVersion: 123,
    tip: '0x00000000000000000000000000005678'
  };
  it('creates and can re-create from itself (U8a)', () => {
    const a = new _ExtrinsicPayload.default(registry, TEST, {
      version: 3
    });
    const b = new _ExtrinsicPayload.default(registry, a.toU8a(), {
      version: 3
    });
    expect(a).toEqual(b);
  });
  it('creates and can re-create from itself (hex)', () => {
    const a = new _ExtrinsicPayload.default(registry, TEST, {
      version: 3
    });
    const b = new _ExtrinsicPayload.default(registry, a.toHex(), {
      version: 3
    });
    expect(a).toEqual(b);
  });
  it('handles toU8a(true) correctly', () => {
    expect((0, _util.u8aToHex)(new _ExtrinsicPayload.default(registry, TEST, {
      version: 3
    }).toU8a(true))).toEqual( // no method length prefix
    '0x0600ffd7568e5f0a7eda67a82691ff379ac4bba4f9c9b859fe779b5d46363b61ad2db9e56c0703d148e25901007b000000dcd1346701ca8396496e52aa2785b1748deb6db09551b72159dcb3e08991025bde8f69eeb5e065e18c6950ff708d7e551f68dc9bf59a07c52367c0280f805ec7');
  });
  it('handles toU8a(false) correctly', () => {
    expect((0, _util.u8aToHex)(new _ExtrinsicPayload.default(registry, TEST, {
      version: 3
    }).toU8a())).toEqual( // with method length prefix
    '0x940600ffd7568e5f0a7eda67a82691ff379ac4bba4f9c9b859fe779b5d46363b61ad2db9e56c0703d148e25901007b000000dcd1346701ca8396496e52aa2785b1748deb6db09551b72159dcb3e08991025bde8f69eeb5e065e18c6950ff708d7e551f68dc9bf59a07c52367c0280f805ec7');
  });
});