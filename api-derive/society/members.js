"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.members = members;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _util = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @description Get the member info for a society
 */
function members(instanceId, api) {
  return (0, _util.memo)(instanceId, () => api.query.society.members().pipe((0, _operators.switchMap)(members => (0, _rxjs.combineLatest)(members.map(accountId => api.derive.society.member(accountId))))));
}