"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keys = keys;
exports.keysMulti = keysMulti;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _util = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function extractsIds(stashId, queuedKeys, nextKeys) {
  const sessionIds = (queuedKeys.find(([currentId]) => currentId.eq(stashId)) || [undefined, []])[1];
  const nextSessionIds = nextKeys.unwrapOr([]);
  return {
    nextSessionIds,
    sessionIds
  };
}

function keys(instanceId, api) {
  return (0, _util.memo)(instanceId, stashId => api.derive.staking.keysMulti([stashId]).pipe((0, _operators.map)(([first]) => first)));
}

function keysMulti(instanceId, api) {
  return (0, _util.memo)(instanceId, stashIds => stashIds.length ? api.query.session.queuedKeys().pipe((0, _operators.switchMap)(queuedKeys => {
    var _api$consts$session;

    return (0, _rxjs.combineLatest)([(0, _rxjs.of)(queuedKeys), ((_api$consts$session = api.consts.session) === null || _api$consts$session === void 0 ? void 0 : _api$consts$session.dedupKeyPrefix) ? api.query.session.nextKeys.multi(stashIds.map(stashId => [api.consts.session.dedupKeyPrefix, stashId])) : api.query.session.nextKeys.multi(stashIds)]);
  }), (0, _operators.map)(([queuedKeys, nextKeys]) => stashIds.map((stashId, index) => extractsIds(stashId, queuedKeys, nextKeys[index])))) : (0, _rxjs.of)([]));
}