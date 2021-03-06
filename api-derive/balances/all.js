"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.all = all;

var _bn = _interopRequireDefault(require("bn.js"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _util = require("@polkadot/util");

var _util2 = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const VESTING_ID = '0x76657374696e6720';

function calcBalances(api, [{
  accountId,
  accountNonce,
  freeBalance,
  frozenFee,
  frozenMisc,
  reservedBalance,
  votingBalance
}, bestNumber, [vesting, locks]]) {
  let lockedBalance = api.registry.createType('Balance');
  let lockedBreakdown = [];
  let vestingLocked = api.registry.createType('Balance');
  let allLocked = false;

  if (Array.isArray(locks)) {
    // only get the locks that are valid until passed the current block
    lockedBreakdown = locks.filter(({
      until
    }) => !until || bestNumber && until.gt(bestNumber));
    const notAll = lockedBreakdown.filter(({
      amount
    }) => !amount.isMax());
    allLocked = lockedBreakdown.some(({
      amount
    }) => amount.isMax());
    vestingLocked = api.registry.createType('Balance', lockedBreakdown.filter(({
      id
    }) => id.eq(VESTING_ID)).reduce((result, {
      amount
    }) => result.iadd(amount), new _bn.default(0))); // get the maximum of the locks according to https://github.com/paritytech/substrate/blob/master/srml/balances/src/lib.rs#L699

    if (notAll.length) {
      lockedBalance = api.registry.createType('Balance', (0, _util.bnMax)(...notAll.map(({
        amount
      }) => amount)));
    }
  } // Calculate the vesting balances,
  //  - offset = balance locked at startingBlock
  //  - perBlock is the unlock amount


  const {
    locked: vestingTotal,
    perBlock,
    startingBlock
  } = vesting || api.registry.createType('VestingInfo');
  const isStarted = bestNumber.gt(startingBlock);
  const vestedNow = isStarted ? perBlock.mul(bestNumber.sub(startingBlock)) : new _bn.default(0);
  const vestedBalance = vestedNow.gt(vestingTotal) ? vestingTotal : api.registry.createType('Balance', vestedNow);
  const isVesting = isStarted && !vestingLocked.isZero();
  const vestedClaimable = api.registry.createType('Balance', isVesting ? vestingLocked.sub(vestingTotal.sub(vestedBalance)) : 0);
  const availableBalance = api.registry.createType('Balance', allLocked ? 0 : (0, _util.bnMax)(new _bn.default(0), freeBalance.sub(lockedBalance)));
  const vestingEndBlock = api.registry.createType('BlockNumber', isVesting ? vestingTotal.div(perBlock).add(startingBlock) : 0);
  return {
    accountId,
    accountNonce,
    availableBalance,
    freeBalance,
    frozenFee,
    frozenMisc,
    isVesting,
    lockedBalance,
    lockedBreakdown,
    reservedBalance,
    vestedBalance,
    vestedClaimable,
    vestingEndBlock,
    vestingLocked,
    vestingPerBlock: perBlock,
    vestingTotal,
    votingBalance
  };
} // old


function queryOld(api, accountId) {
  return api.queryMulti([[api.query.balances.locks, accountId], [api.query.balances.vesting, accountId]]).pipe((0, _operators.map)(([locks, optVesting]) => {
    let vestingNew = null;

    if (optVesting.isSome) {
      const {
        offset: locked,
        perBlock,
        startingBlock
      } = optVesting.unwrap();
      vestingNew = api.registry.createType('VestingInfo', {
        locked,
        perBlock,
        startingBlock
      });
    }

    return [vestingNew, locks];
  }));
} // current (balances  vesting)


function queryCurrent(api, accountId) {
  var _api$query$vesting;

  return (((_api$query$vesting = api.query.vesting) === null || _api$query$vesting === void 0 ? void 0 : _api$query$vesting.vesting) ? api.queryMulti([[api.query.balances.locks, accountId], [api.query.vesting.vesting, accountId]]) : api.query.balances.locks(accountId).pipe((0, _operators.map)(locks => [locks, api.registry.createType('Option<VestingInfo>')]))).pipe((0, _operators.map)(([locks, optVesting]) => [optVesting.unwrapOr(null), locks]));
}
/**
 * @name all
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


function all(instanceId, api) {
  return (0, _util2.memo)(instanceId, address => api.derive.balances.account(address).pipe((0, _operators.switchMap)(account => !account.accountId.isEmpty ? (0, _rxjs.combineLatest)([(0, _rxjs.of)(account), api.derive.chain.bestNumber(), (0, _util.isFunction)(api.query.system.account) || (0, _util.isFunction)(api.query.balances.account) ? queryCurrent(api, account.accountId) : queryOld(api, account.accountId)]) : (0, _rxjs.of)([account, api.registry.createType('BlockNumber'), [null, api.registry.createType('Vec<BalanceLock>')]])), (0, _operators.map)(result => calcBalances(api, result))));
}