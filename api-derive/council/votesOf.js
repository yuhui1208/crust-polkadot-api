"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.votesOf = votesOf;

var _operators = require("rxjs/operators");

var _util = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function votesOf(instanceId, api) {
  return (0, _util.memo)(instanceId, accountId => api.derive.council.votes().pipe((0, _operators.map)(votes => (votes.find(([from]) => from.eq(accountId)) || [null, {
    stake: api.registry.createType('Balance'),
    votes: []
  }])[1])));
}