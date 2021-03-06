"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _bn = _interopRequireDefault(require("bn.js"));

var _Decorated = _interopRequireDefault(require("@polkadot/metadata/Decorated"));

var _Metadata = _interopRequireDefault(require("@polkadot/metadata/Metadata"));

var _static = _interopRequireDefault(require("@polkadot/metadata/Metadata/static"));

var _testingPairs = _interopRequireDefault(require("@polkadot/keyring/testingPairs"));

var _create = require("../../create");

var _Extrinsic = _interopRequireDefault(require("./Extrinsic"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const registry = new _create.TypeRegistry();
const decorated = new _Decorated.default(registry, _static.default);
const keyring = (0, _testingPairs.default)({
  type: 'ed25519'
}, false); // eslint-disable-next-line no-new

new _Metadata.default(registry, _static.default);
describe('ExtrinsicV2', () => {
  it('constructs a sane Uint8Array (default)', () => {
    expect(new _Extrinsic.default(registry).toU8a()).toEqual(new Uint8Array([0, 0, // index
    0, 0, 0, 0 // fillBlock Perbill
    ]));
  });
  it('creates a unsigned extrinsic', () => {
    expect(new _Extrinsic.default(registry, decorated.tx.balances.transfer(keyring.bob.publicKey, 6969n)).toHex()).toEqual('0x' + '0600' + // balance.transfer
    'ff' + 'd7568e5f0a7eda67a82691ff379ac4bba4f9c9b859fe779b5d46363b61ad2db9' + 'e56c');
  });
  it('creates a signed extrinsic', () => {
    expect(new _Extrinsic.default(registry, decorated.tx.balances.transfer(keyring.bob.publicKey, 6969n)).sign(keyring.alice, {
      blockHash: '0xec7afaf1cca720ce88c1d1b689d81f0583cc15a97d621cf046dd9abf605ef22f',
      genesisHash: '0xdcd1346701ca8396496e52aa2785b1748deb6db09551b72159dcb3e08991025b',
      nonce: 1,
      runtimeVersion: {
        apis: [],
        authoringVersion: new _bn.default(123),
        implName: 'test',
        implVersion: new _bn.default(123),
        specName: 'test',
        specVersion: new _bn.default(123),
        transactionVersion: new _bn.default(123)
      },
      tip: 2
    }).toHex()).toEqual('0x' + 'ff' + 'd172a74cda4c865912c32ba0a80a57ae69abae410e5ccb59dee84e2f4432db4f' + '4f47f2d47095239adcb8b725c2c950348c0f65a5019b91e0946636c6c2424cdc' + '6c0cece073e18b40ba13d2dd3afcc0daa0f223fa6a8f59d1e025a2dde1d1200a' + '000408' + // era. nonce, tip
    '0600' + 'ff' + 'd7568e5f0a7eda67a82691ff379ac4bba4f9c9b859fe779b5d46363b61ad2db9' + 'e56c');
  });
});