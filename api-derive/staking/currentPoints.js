"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.currentPoints = currentPoints;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _util = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function retrievePointsPrev(api, currentElected) {
  return api.query.staking.currentEraPointsEarned().pipe((0, _operators.map)(({
    individual,
    total
  }) => api.registry.createType('EraRewardPoints', {
    individual: new Map(individual.map(points => api.registry.createType('RewardPoint', points)).map((points, index) => [currentElected[index], points])),
    total
  })));
}
/**
 * @description Retrieve the staking overview, including elected and points earned
 */


function currentPoints(instanceId, api) {
  return (0, _util.memo)(instanceId, () => api.derive.staking.overview().pipe((0, _operators.switchMap)(({
    activeEra,
    nextElected
  }) => api.query.staking.erasRewardPoints ? api.query.staking.erasRewardPoints(activeEra) : api.query.staking.currentEraPointsEarned ? retrievePointsPrev(api, nextElected) : (0, _rxjs.of)(api.registry.createType('EraRewardPoints')))));
}