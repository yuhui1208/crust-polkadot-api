"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = require("@polkadot/util");

var _AbstractArray = _interopRequireDefault(require("./AbstractArray"));

var _utils = require("./utils");

var _Vec = _interopRequireDefault(require("./Vec"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @name VecFixed
 * @description
 * This manages codec arrays of a fixed length
 */
class VecFixed extends _AbstractArray.default {
  constructor(registry, Type, length, value = []) {
    const Clazz = (0, _utils.typeToConstructor)(registry, Type);
    super(registry, ...VecFixed.decodeVecFixed(registry, Clazz, length, value));
    this._Type = void 0;
    this._Type = Clazz;
  }
  /** @internal */


  static decodeVecFixed(registry, Type, allocLength, value) {
    const values = _Vec.default.decodeVec(registry, Type, (0, _util.isU8a)(value) ? (0, _util.u8aConcat)((0, _util.compactToU8a)(allocLength), value) : value);

    while (values.length < allocLength) {
      values.push(new Type(registry));
    }

    (0, _util.assert)(values.length === allocLength, `Expected a length of exactly ${allocLength} entries`);
    return values;
  }

  static with(Type, length) {
    return class extends VecFixed {
      constructor(registry, value) {
        super(registry, Type, length, value);
      }

    };
  }
  /**
   * @description The type for the items
   */


  get Type() {
    return new this._Type(this.registry).toRawType();
  }
  /**
   * @description The length of the value when encoded as a Uint8Array
   */


  get encodedLength() {
    return this.toU8a().length;
  }

  toU8a() {
    // we override, we don't add the length prefix for ourselves, and at the same time we
    // ignore isBare on entries, since they should be properly encoded at all times
    const encoded = this.map(entry => entry.toU8a());
    return encoded.length ? (0, _util.u8aConcat)(...encoded) : new Uint8Array([]);
  }
  /**
   * @description Returns the base runtime type name for this instance
   */


  toRawType() {
    return `[${this.Type};${this.length}]`;
  }

}

exports.default = VecFixed;