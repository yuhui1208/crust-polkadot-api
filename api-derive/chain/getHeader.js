"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHeader = getHeader;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _type = require("../type");

var _util = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @name getHeader
 * @param {( Uint8Array | string )} hash - A block hash as U8 array or string.
 * @returns An array containing the block header and the block author
 * @description Get a specific block header and extend it with the author
 * @example
 * <BR>
 *
 * ```javascript
 * const { author, number } = await api.derive.chain.getHeader('0x123...456');
 *
 * console.log(`block #${number} was authored by ${author}`);
 * ```
 */
function getHeader(instanceId, api) {
  return (0, _util.memo)(instanceId, hash => (0, _rxjs.combineLatest)([api.rpc.chain.getHeader(hash), api.query.session ? api.query.session.validators.at(hash) : (0, _rxjs.of)([])]).pipe((0, _operators.map)(([header, validators]) => new _type.HeaderExtended(api.registry, header, validators)), (0, _operators.catchError)(() => // where rpc.chain.getHeader throws, we will land here - it can happen that
  // we supplied an invalid hash. (Due to defaults, storeage will have an
  // empty value, so only the RPC is affected). So return undefined
  (0, _rxjs.of)())));
}