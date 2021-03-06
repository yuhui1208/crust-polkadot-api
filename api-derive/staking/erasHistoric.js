"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.erasHistoric = erasHistoric;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _util = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function erasHistoric(instanceId, api) {
  return (0, _util.memo)(instanceId, withActive => {
    var _api$query$staking;

    return ((_api$query$staking = api.query.staking) === null || _api$query$staking === void 0 ? void 0 : _api$query$staking.activeEra) ? api.queryMulti([api.query.staking.activeEra, api.query.staking.historyDepth]).pipe((0, _operators.map)(([activeEraOpt, historyDepth]) => {
      const result = [];
      const max = historyDepth.toNumber();
      const activeEra = activeEraOpt.unwrapOrDefault().index;
      let lastEra = activeEra;

      while (lastEra.gten(0) && result.length < max) {
        if (lastEra !== activeEra || withActive === true) {
          result.push(api.registry.createType('EraIndex', lastEra));
        }

        lastEra = lastEra.subn(1);
      } // go from oldest to newest


      return result.reverse();
    })) : (0, _rxjs.of)([]);
  });
}