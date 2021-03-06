"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MORTAL_PERIOD = exports.MAX_FINALITY_LAG = exports.FALLBACK_PERIOD = exports.FALLBACK_MAX_HASH_COUNT = void 0;

var _bn = _interopRequireDefault(require("bn.js"));

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const FALLBACK_MAX_HASH_COUNT = 250; // default here to 5 min eras, adjusted based on the actual blocktime

exports.FALLBACK_MAX_HASH_COUNT = FALLBACK_MAX_HASH_COUNT;
const FALLBACK_PERIOD = new _bn.default(6 * 1000);
exports.FALLBACK_PERIOD = FALLBACK_PERIOD;
const MAX_FINALITY_LAG = new _bn.default(5);
exports.MAX_FINALITY_LAG = MAX_FINALITY_LAG;
const MORTAL_PERIOD = new _bn.default(5 * 60 * 1000);
exports.MORTAL_PERIOD = MORTAL_PERIOD;