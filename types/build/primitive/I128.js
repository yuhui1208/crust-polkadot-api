"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Int = _interopRequireDefault(require("../codec/Int"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @name I128
 * @description
 * A 128-bit signed integer
 */
class I128 extends _Int.default.with(128) {}

exports.default = I128;