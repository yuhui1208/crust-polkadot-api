"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.referendumsFinished = referendumsFinished;

var _operators = require("rxjs/operators");

var _util = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function referendumsFinished(instanceId, api) {
  return (0, _util.memo)(instanceId, () => api.derive.democracy.referendumIds().pipe((0, _operators.switchMap)(ids => api.query.democracy.referendumInfoOf.multi(ids)), (0, _operators.map)(infos => infos.filter(optInfo => optInfo.isSome).map(optInfo => optInfo.unwrap()).filter(info => info.isFinished).map(info => info.asFinished))));
}