"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = compareArray;

var _util = require("@polkadot/util");

var _util2 = require("./util");

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// NOTE These are used internally and when comparing objects, expects that
// when the second is an Codec[] that the first has to be as well
function compareArray(a, b) {
  if (Array.isArray(b)) {
    return a.length === b.length && (0, _util.isUndefined)(a.find((value, index) => (0, _util2.hasEq)(value) ? !value.eq(b[index]) : value !== b[index]));
  }

  return false;
}