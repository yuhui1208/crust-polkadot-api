"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indexToId = indexToId;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _AccountIndex = require("@polkadot/types/generic/AccountIndex");

var _util = require("@polkadot/util");

var _util2 = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function queryEnumSet(api, _accountIndex) {
  const accountIndex = _accountIndex instanceof api.registry.createClass('AccountIndex') ? _accountIndex : api.registry.createType('AccountIndex', _accountIndex);
  return api.query.indices.enumSet(accountIndex.div(_AccountIndex.ENUMSET_SIZE)).pipe((0, _operators.startWith)([]), (0, _operators.map)(accounts => (accounts || [])[accountIndex.mod(_AccountIndex.ENUMSET_SIZE).toNumber()]));
} // current


function query(api, accountIndex) {
  return api.query.indices.accounts(accountIndex).pipe((0, _operators.map)(optResult => optResult.unwrapOr([])[0]));
}
/**
 * @name indexToId
 * @param {( AccountIndex | string )} accountIndex - An accounts index in different formats.
 * @returns Returns the corresponding AccountId.
 * @example
 * <BR>
 *
 * ```javascript
 * api.derive.accounts.indexToId('F7Hs', (accountId) => {
 *   console.log(`The AccountId of F7Hs is ${accountId}`);
 * });
 * ```
 */


function indexToId(instanceId, api) {
  return (0, _util2.memo)(instanceId, accountIndex => api.query.indices ? (0, _util.isFunction)(api.query.indices.accounts) ? query(api, accountIndex) : queryEnumSet(api, accountIndex) : (0, _rxjs.of)(undefined));
}