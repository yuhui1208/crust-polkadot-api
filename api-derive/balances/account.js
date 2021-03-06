"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.account = account;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _util = require("@polkadot/util");

var _util2 = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function calcBalances(api, [accountId, [freeBalance, reservedBalance, frozenFee, frozenMisc, accountNonce]]) {
  return {
    accountId,
    accountNonce,
    freeBalance,
    frozenFee,
    frozenMisc,
    reservedBalance,
    votingBalance: api.registry.createType('Balance', freeBalance.toBn())
  };
} // old


function queryBalancesFree(api, accountId) {
  return api.queryMulti([[api.query.balances.freeBalance, accountId], [api.query.balances.reservedBalance, accountId], [api.query.system.accountNonce, accountId]]).pipe((0, _operators.map)(([freeBalance, reservedBalance, accountNonce]) => [freeBalance, reservedBalance, api.registry.createType('Balance'), api.registry.createType('Balance'), accountNonce]));
}

function queryBalancesAccount(api, accountId) {
  return api.queryMulti([[api.query.balances.account, accountId], [api.query.system.accountNonce, accountId]]).pipe((0, _operators.map)(([{
    feeFrozen,
    free,
    miscFrozen,
    reserved
  }, accountNonce]) => [free, reserved, feeFrozen, miscFrozen, accountNonce]));
}

function queryCurrent(api, accountId) {
  // AccountInfo is current, support old, eg. Edgeware
  return api.query.system.account(accountId).pipe((0, _operators.map)(infoOrTuple => {
    const {
      feeFrozen,
      free,
      miscFrozen,
      reserved
    } = infoOrTuple.nonce ? infoOrTuple.data : infoOrTuple[1];
    const accountNonce = infoOrTuple.nonce || infoOrTuple[0];
    return [free, reserved, feeFrozen, miscFrozen, accountNonce];
  }));
}
/**
 * @name account
 * @param {( AccountIndex | AccountId | Address | string )} address - An accounts Id in different formats.
 * @returns An object containing the results of various balance queries
 * @example
 * <BR>
 *
 * ```javascript
 * const ALICE = 'F7Hs';
 *
 * api.derive.balances.all(ALICE, ({ accountId, lockedBalance }) => {
 *   console.log(`The account ${accountId} has a locked balance ${lockedBalance} units.`);
 * });
 * ```
 */


function account(instanceId, api) {
  return (0, _util2.memo)(instanceId, address => api.derive.accounts.accountId(address).pipe((0, _operators.switchMap)(accountId => accountId ? (0, _rxjs.combineLatest)([(0, _rxjs.of)(accountId), (0, _util.isFunction)(api.query.system.account) ? queryCurrent(api, accountId) : (0, _util.isFunction)(api.query.balances.account) ? queryBalancesAccount(api, accountId) : queryBalancesFree(api, accountId)]) : (0, _rxjs.of)([api.registry.createType('AccountId'), [api.registry.createType('Balance'), api.registry.createType('Balance'), api.registry.createType('Balance'), api.registry.createType('Balance'), api.registry.createType('Index')]])), (0, _operators.map)(result => calcBalances(api, result))));
}