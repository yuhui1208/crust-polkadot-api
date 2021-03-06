"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nextExternal = nextExternal;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _util = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function withImage(api, nextOpt) {
  if (nextOpt.isNone) {
    return (0, _rxjs.of)(null);
  }

  const [imageHash, threshold] = nextOpt.unwrap();
  return api.derive.democracy.preimage(imageHash).pipe((0, _operators.map)(image => ({
    image,
    imageHash,
    threshold
  })));
}

function nextExternal(instanceId, api) {
  return (0, _util.memo)(instanceId, () => {
    var _api$query$democracy;

    return ((_api$query$democracy = api.query.democracy) === null || _api$query$democracy === void 0 ? void 0 : _api$query$democracy.nextExternal) ? api.query.democracy.nextExternal().pipe((0, _operators.switchMap)(nextOpt => withImage(api, nextOpt))) : (0, _rxjs.of)(null);
  });
}