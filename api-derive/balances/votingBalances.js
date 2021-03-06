"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.votingBalances = votingBalances;

var _rxjs = require("rxjs");

var _util = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function votingBalances(instanceId, api) {
  return (0, _util.memo)(instanceId, addresses => !addresses || !addresses.length ? (0, _rxjs.of)([]) : (0, _rxjs.combineLatest)(addresses.map(accountId => api.derive.balances.account(accountId))));
}