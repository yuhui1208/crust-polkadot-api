"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indexes = indexes;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _AccountIndex = require("@polkadot/types/generic/AccountIndex");

var _util = require("@polkadot/util");

var _util2 = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const enumsetSize = _AccountIndex.ENUMSET_SIZE.toNumber();

let indicesCache = null;

function queryEnumSet(api) {
  return api.query.indices.nextEnumSet().pipe( // use the nextEnumSet (which is a counter of the number of sets) to construct
  // a range of values to query [0, 1, 2, ...]. Retrieve the full enum set for the
  // specific index - each query can return up to ENUMSET_SIZE (64) records, each
  // containing an AccountId
  (0, _operators.switchMap)(next => api.query.indices.enumSet.multi([...Array(next.toNumber() + 1).keys()])), (0, _operators.map)(all => all.reduce((indexes, list, outerIndex) => {
    (list || []).forEach((accountId, innerIndex) => {
      // re-create the index based on position 0 is [0][0] and likewise
      // 64 (0..63 in first) is [1][0] (the first index value in set 2)
      const index = outerIndex * enumsetSize + innerIndex;
      indexes[accountId.toString()] = api.registry.createType('AccountIndex', index);
    });
    return indexes;
  }, {})));
}

function queryAccounts(api) {
  return api.query.indices.accounts.entries().pipe((0, _operators.map)(entries => entries.reduce((indexes, [key, idOpt]) => {
    if (idOpt.isSome) {
      indexes[idOpt.unwrap()[0].toString()] = key.args[0];
    }

    return indexes;
  }, {})));
}
/**
 * @name indexes
 * @returns Returns all the indexes on the system.
 * @description This is an unwieldly query since it loops through
 * all of the enumsets and returns all of the values found. This could be up to 32k depending
 * on the number of active accounts in the system
 * @example
 * <BR>
 *
 * ```javascript
 * api.derive.accounts.indexes((indexes) => {
 *   console.log('All existing AccountIndexes', indexes);
 * });
 * ```
 */


function indexes(instanceId, api) {
  return (0, _util2.memo)(instanceId, () => indicesCache ? (0, _rxjs.of)(indicesCache) : (api.query.indices ? (0, _util.isFunction)(api.query.indices.accounts) ? queryAccounts(api).pipe((0, _operators.startWith)({})) : queryEnumSet(api).pipe((0, _operators.startWith)({})) : (0, _rxjs.of)({})).pipe((0, _operators.map)(indices => {
    indicesCache = indices;
    return indices;
  })));
}