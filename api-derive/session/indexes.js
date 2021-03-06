"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indexes = indexes;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _util = require("@polkadot/util");

var _util2 = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function isEraOpt(era) {
  return (0, _util.isFunction)(era.unwrapOrDefault);
} // parse into Indexes


function parse([activeEra, activeEraStart, currentEra, currentIndex, validatorCount]) {
  return {
    activeEra,
    activeEraStart,
    currentEra,
    currentIndex,
    validatorCount
  };
} // query for previous V2


function queryNoActive(api) {
  return api.queryMulti([api.query.staking.currentEra, api.query.session.currentIndex, api.query.staking.validatorCount]).pipe((0, _operators.map)(([currentEraOpt, currentIndex, validatorCount]) => {
    const currentEra = isEraOpt(currentEraOpt) ? currentEraOpt.unwrapOrDefault() : currentEraOpt;
    return parse([currentEra, api.registry.createType('Option<Moment>'), currentEra, currentIndex, validatorCount]);
  }));
} // query based on latest


function query(api) {
  return api.queryMulti([api.query.staking.activeEra, api.query.staking.currentEra, api.query.session.currentIndex, api.query.staking.validatorCount]).pipe((0, _operators.map)(([activeOpt, currentEra, currentIndex, validatorCount]) => {
    const {
      index,
      start
    } = activeOpt.unwrapOrDefault();
    return parse([index, start, currentEra.unwrapOrDefault(), currentIndex, validatorCount]);
  }));
} // empty set when none is available


function empty(api) {
  return (0, _rxjs.of)(parse([api.registry.createType('EraIndex'), api.registry.createType('Option<Moment>'), api.registry.createType('EraIndex'), api.registry.createType('SessionIndex', 1), api.registry.createType('u32')]));
}

function indexes(instanceId, api) {
  return (0, _util2.memo)(instanceId, () => api.query.session && api.query.staking ? (0, _util.isFunction)(api.query.staking.activeEra) ? query(api) : queryNoActive(api) : empty(api));
}