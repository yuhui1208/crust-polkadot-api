"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.info = info;

var _operators = require("rxjs/operators");

var _util = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function createDerive(api, [[hasBabe, epochDuration, sessionsPerEra], {
  activeEra,
  activeEraStart,
  currentEra,
  currentIndex,
  validatorCount
}]) {
  return {
    activeEra,
    activeEraStart,
    currentEra,
    currentIndex,
    eraLength: api.registry.createType('BlockNumber', sessionsPerEra.mul(epochDuration)),
    isEpoch: hasBabe,
    sessionLength: epochDuration,
    sessionsPerEra,
    validatorCount
  };
}

function queryAura(api) {
  return api.derive.session.indexes().pipe((0, _operators.map)(indexes => {
    var _api$consts$staking;

    return createDerive(api, [[false, api.registry.createType('u64', 1), ((_api$consts$staking = api.consts.staking) === null || _api$consts$staking === void 0 ? void 0 : _api$consts$staking.sessionsPerEra) || api.registry.createType('SessionIndex', 1)], indexes]);
  }));
}

function queryBabe(api) {
  return api.derive.session.indexes().pipe((0, _operators.map)(indexes => createDerive(api, [[true, api.consts.babe.epochDuration, api.consts.staking.sessionsPerEra], indexes])));
}
/**
 * @description Retrieves all the session and era query and calculates specific values on it as the length of the session and eras
 */


function info(instanceId, api) {
  return (0, _util.memo)(instanceId, () => api.consts.babe ? queryBabe(api) : queryAura(api));
}