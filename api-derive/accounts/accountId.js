"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.accountId = accountId;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _util = require("@polkadot/util");

var _utilCrypto = require("@polkadot/util-crypto");

var _util2 = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function retrieve(api, address) {
  const decoded = (0, _util.isU8a)(address) ? address : (0, _utilCrypto.decodeAddress)((address || '').toString());

  if (decoded.length === 32) {
    return (0, _rxjs.of)(api.registry.createType('AccountId', decoded));
  }

  const accountIndex = api.registry.createType('AccountIndex', decoded);
  return api.derive.accounts.indexToId(accountIndex.toString()).pipe((0, _operators.map)(accountId => {
    (0, _util.assert)(accountId, 'Unable to retrieve accountId');
    return accountId;
  }));
}
/**
 * @name accountId
 * @param {(Address | AccountId | AccountIndex | string | null)} address - An accounts address in various formats.
 * @description  An [[AccountId]]
 */


function accountId(instanceId, api) {
  return (0, _util2.memo)(instanceId, address => retrieve(api, address));
}