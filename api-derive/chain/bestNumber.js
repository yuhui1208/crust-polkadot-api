"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bestNumber = bestNumber;

var _operators = require("rxjs/operators");

var _util = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @name bestNumber
 * @returns The latest block number.
 * @example
 * <BR>
 *
 * ```javascript
 * api.derive.chain.bestNumber((blockNumber) => {
 *   console.log(`the current best block is #${blockNumber}`);
 * });
 * ```
 */
function bestNumber(instanceId, api) {
  return (0, _util.memo)(instanceId, () => api.derive.chain.subscribeNewHeads().pipe((0, _operators.map)(header => header.number.unwrap())));
}