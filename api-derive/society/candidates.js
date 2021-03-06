"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.candidates = candidates;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _util = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @description Get the candidate info for a society
 */
function candidates(instanceId, api) {
  return (0, _util.memo)(instanceId, () => api.query.society.candidates().pipe((0, _operators.switchMap)(candidates => (0, _rxjs.combineLatest)([(0, _rxjs.of)(candidates), api.query.society.suspendedCandidates.multi(candidates.map(({
    who
  }) => who))])), (0, _operators.map)(([candidates, suspended]) => candidates.map(({
    kind,
    value,
    who
  }, index) => ({
    accountId: who,
    isSuspended: suspended[index].isSome,
    kind,
    value
  })))));
}