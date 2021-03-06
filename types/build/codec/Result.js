"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = require("@polkadot/util");

var _Enum = _interopRequireDefault(require("./Enum"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @name Result
 * @description
 * A Result maps to the Rust Result type, that can either wrap a success or error value
 */
class Result extends _Enum.default {
  constructor(registry, Ok, Error, value) {
    // NOTE This is order-dependent, Ok (with index 0) needs to be first
    // eslint-disable-next-line sort-keys
    super(registry, {
      Ok,
      Error
    }, value);
  }

  static with(Types) {
    return class extends Result {
      constructor(registry, value) {
        super(registry, Types.Ok, Types.Error, value);
      }

    };
  }
  /**
   * @description Returns the wrapper Error value (if isError)
   */


  get asError() {
    (0, _util.assert)(this.isError, 'Cannot extract Error value from Ok result, check isError first');
    return this.value;
  }
  /**
   * @description Returns the wrapper Ok value (if isOk)
   */


  get asOk() {
    (0, _util.assert)(this.isOk, 'Cannot extract Ok value from Error result, check isOk first');
    return this.value;
  }
  /**
   * @description Checks if the Result has no value
   */


  get isEmpty() {
    return this.isOk && this.value.isEmpty;
  }
  /**
   * @description Checks if the Result wraps an Error value
   */


  get isError() {
    return !this.isOk;
  }
  /**
   * @description Checks if the Result wraps an Ok value
   */


  get isOk() {
    return this.index === 0;
  }
  /**
   * @description Returns the base runtime type name for this instance
   */


  toRawType() {
    const Types = this._toRawStruct();

    return `Result<${Types.Ok},${Types.Error}>`;
  }

}

exports.default = Result;