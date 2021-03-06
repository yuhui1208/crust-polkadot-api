"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitingInfo = waitingInfo;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _util = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function waitingInfo(instanceId, api) {
  return (0, _util.memo)(instanceId, () => (0, _rxjs.combineLatest)([api.derive.staking.validators(), api.derive.staking.stashes()]).pipe((0, _operators.switchMap)(([{
    nextElected
  }, stashes]) => {
    const elected = nextElected.map(a => a.toString());
    const waiting = stashes.filter(v => !elected.includes(v.toString()));
    return api.derive.staking.queryMulti(waiting).pipe((0, _operators.map)(info => ({
      info,
      waiting
    })));
  })));
}