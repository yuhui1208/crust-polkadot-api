"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.query = query;
exports.queryMulti = queryMulti;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _util = require("@polkadot/util");

var _util2 = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function parseController(stashId, [controllerIdOpt, nominatorsOpt, rewardDestination, validatorPrefs, exposure], stakingLedgerOpt) {
  const nominators = nominatorsOpt.unwrapOr(null);
  return {
    accountId: stashId,
    controllerId: controllerIdOpt.unwrapOr(null),
    exposure,
    nominators: nominators ? Array.isArray(nominators) ? nominators[0].targets : nominators.targets : [],
    rewardDestination,
    stakingLedger: stakingLedgerOpt.unwrapOrDefault(),
    stashId,
    validatorPrefs: Array.isArray(validatorPrefs) ? validatorPrefs[0] : validatorPrefs
  };
}

function retrievePrev(api, stashId) {
  return api.queryMulti([[api.query.staking.bonded, stashId], [api.query.staking.nominators, stashId], [api.query.staking.payee, stashId], [api.query.staking.validators, stashId], [api.query.staking.stakers, stashId]]);
}

function retrieveCurr(api, stashIds, activeEra) {
  return (0, _rxjs.combineLatest)([api.query.staking.bonded.multi(stashIds), api.query.staking.nominators ? api.query.staking.nominators.multi(stashIds) : (0, _rxjs.of)(stashIds.map(() => api.registry.createType('Option<Nominations>'))), api.query.staking.payee.multi(stashIds), api.query.staking.validators.multi(stashIds), api.query.staking.erasStakers.multi(stashIds.map(stashId => [activeEra, stashId]))]).pipe((0, _operators.map)(([controllerIdOpt, nominatorsOpt, rewardDestination, validatorPrefs, exposure]) => controllerIdOpt.map((controllerIdOpt, index) => [controllerIdOpt, nominatorsOpt[index], rewardDestination[index], validatorPrefs[index], exposure[index]])));
}

function retrieveControllers(api, optControllerIds) {
  const ids = optControllerIds.filter(opt => opt.isSome).map(opt => opt.unwrap());

  if (!ids.length) {
    return (0, _rxjs.of)(optControllerIds.map(() => api.registry.createType('Option<StakingLedger>')));
  }

  return api.query.staking.ledger.multi(ids).pipe((0, _operators.map)(optLedgers => {
    let offset = -1;
    return optControllerIds.map(opt => opt.isSome ? optLedgers[++offset] : api.registry.createType('Option<StakingLedger>'));
  }));
}
/**
 * @description From a stash, retrieve the controllerId and all relevant details
 */


function query(instanceId, api) {
  return (0, _util2.memo)(instanceId, accountId => api.derive.staking.queryMulti([accountId]).pipe((0, _operators.map)(([first]) => first)));
}

function queryMulti(instanceId, api) {
  return (0, _util2.memo)(instanceId, accountIds => accountIds.length ? api.derive.session.indexes().pipe((0, _operators.switchMap)(({
    activeEra
  }) => {
    const stashIds = accountIds.map(accountId => api.registry.createType('AccountId', accountId));
    return ((0, _util.isFunction)(api.query.staking.erasStakers) ? retrieveCurr(api, stashIds, activeEra) : (0, _rxjs.combineLatest)(stashIds.map(stashId => retrievePrev(api, stashId)))).pipe((0, _operators.switchMap)(results => retrieveControllers(api, results.map(([optController]) => optController)).pipe((0, _operators.map)(stakingLedgerOpts => stashIds.map((stashId, index) => parseController(stashId, results[index], stakingLedgerOpts[index]))))));
  })) : (0, _rxjs.of)([]));
}