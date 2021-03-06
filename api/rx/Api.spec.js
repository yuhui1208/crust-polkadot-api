"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _operators = require("rxjs/operators");

var _testingPairs = _interopRequireDefault(require("@polkadot/keyring/testingPairs"));

var _index = _interopRequireDefault(require("@polkadot/rpc-provider/mock/index"));

var _types = require("@polkadot/types");

var _util = require("../../test/util");

var _Api = _interopRequireDefault(require("./Api"));

// Copyright 2017-2020 @polkadot/api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
describe('ApiRx', () => {
  const registry = new _types.TypeRegistry();
  const keyring = (0, _testingPairs.default)({
    type: 'ed25519'
  });
  let provider;
  beforeEach(() => {
    jest.setTimeout(3000000);
    provider = new _index.default(registry);
  });
  describe('decorator.signAsync', () => {
    it('signs a transfer using an external signer', () => {
      const signer = new _util.SingleAccountSigner(registry, keyring.alice_session);

      _Api.default.create({
        provider,
        registry,
        signer
      }).pipe((0, _operators.switchMap)(api => api.tx.balances.transfer(keyring.eve.address, 12345).signAsync(keyring.alice_session, {})), (0, _operators.map)(tx => {
        expect(tx.signature.toHex()).toEqual('0x97f3cfe5088fcd575313e983f45d02b0f630e7b94ff9a3ac50e20cd096a8f554fda73d42ead891b5a1d3ce5607d83f20b0c6570b555e949cfb5763d0abcd590b');
      }));
    });
    it('allows the second argument to signAsync to be omitted', () => {
      const signer = new _util.SingleAccountSigner(registry, keyring.alice_session);

      _Api.default.create({
        provider,
        registry,
        signer
      }).pipe((0, _operators.switchMap)(api => api.tx.balances.transfer(keyring.eve.address, 12345).signAsync(keyring.alice_session)), (0, _operators.map)(tx => {
        expect(tx.signature.toHex()).toEqual('0x97f3cfe5088fcd575313e983f45d02b0f630e7b94ff9a3ac50e20cd096a8f554fda73d42ead891b5a1d3ce5607d83f20b0c6570b555e949cfb5763d0abcd590b');
      }));
    });
  });
});