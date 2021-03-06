"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._stakerPrefs = _stakerPrefs;
exports.stakerPrefs = stakerPrefs;

var _operators = require("rxjs/operators");

var _util = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function _stakerPrefs(instanceId, api) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (0, _util.memo)(instanceId, (accountId, eras, _withActive) => {
    return api.query.staking.erasValidatorPrefs.multi(eras.map(era => [era, accountId])).pipe((0, _operators.map)(all => all.map((validatorPrefs, index) => ({
      era: eras[index],
      validatorPrefs
    }))));
  });
}

function stakerPrefs(instanceId, api) {
  return (0, _util.memo)(instanceId, (accountId, withActive = false) => api.derive.staking.erasHistoric(withActive).pipe((0, _operators.switchMap)(eras => api.derive.staking._stakerPrefs(accountId, eras, withActive))));
}