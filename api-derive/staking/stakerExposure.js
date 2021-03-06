"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._stakerExposure = _stakerExposure;
exports.stakerExposure = stakerExposure;

var _operators = require("rxjs/operators");

var _util = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function _stakerExposure(instanceId, api) {
  return (0, _util.memo)(instanceId, (accountId, eras, withActive) => {
    const stakerId = api.registry.createType('AccountId', accountId).toString();
    return api.derive.staking._erasExposure(eras, withActive).pipe((0, _operators.map)(exposures => exposures.map(({
      era,
      nominators: allNominators,
      validators: allValidators
    }) => {
      const isValidator = !!allValidators[stakerId];
      const validators = {};
      const nominating = allNominators[stakerId] || [];

      if (isValidator) {
        validators[stakerId] = allValidators[stakerId];
      } else if (nominating) {
        nominating.forEach(({
          validatorId
        }) => {
          validators[validatorId] = allValidators[validatorId];
        });
      }

      return {
        era,
        isEmpty: !Object.keys(validators).length,
        isValidator,
        nominating,
        validators
      };
    })));
  });
}

function stakerExposure(instanceId, api) {
  return (0, _util.memo)(instanceId, (accountId, withActive = false) => api.derive.staking.erasHistoric(withActive).pipe((0, _operators.switchMap)(eras => api.derive.staking._stakerExposure(accountId, eras, withActive))));
}