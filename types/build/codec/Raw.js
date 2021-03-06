"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = require("@polkadot/util");

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/** @internal */
function decodeU8a(value) {
  if ((0, _util.isU8a)(value)) {
    return value;
  }

  return (0, _util.u8aToU8a)(value);
}
/**
 * @name Raw
 * @description
 * A basic wrapper around Uint8Array, with no frills and no fuss. It does differ
 * from other implementations where it will consume the full Uint8Array as passed to it.
 * As such it is meant to be subclassed where the wrapper takes care of the
 * actual lengths instead of used directly.
 * @noInheritDoc
 */


class Raw extends Uint8Array {
  constructor(registry, value) {
    super(decodeU8a(value));
    this.registry = void 0;
    this.registry = registry;
  }
  /**
   * @description The length of the value when encoded as a Uint8Array
   */


  get encodedLength() {
    return this.length;
  }
  /**
   * @description returns a hash of the contents
   */


  get hash() {
    return new Raw(this.registry, this.registry.hash(this.toU8a()));
  }
  /**
   * @description Returns true if the wrapped value contains only ASCII printable characters
   */


  get isAscii() {
    return (0, _util.isAscii)(this);
  }
  /**
   * @description Returns true if the type wraps an empty/default all-0 value
   */


  get isEmpty() {
    return !this.length || (0, _util.isUndefined)(this.find(value => !!value));
  }
  /**
   * @description Returns true if the wrapped value contains only utf8 characters
   */


  get isUtf8() {
    return (0, _util.isUtf8)(this);
  }
  /**
   * @description The length of the value
   */


  get length() {
    // only included here since we ignore inherited docs
    return super.length;
  }
  /**
   * @description Returns the number of bits in the value
   */


  bitLength() {
    return this.length * 8;
  }
  /**
   * @description Compares the value of the input to see if there is a match
   */


  eq(other) {
    if (other instanceof Uint8Array) {
      return this.length === other.length && !this.some((value, index) => value !== other[index]);
    }

    return this.eq(decodeU8a(other));
  }
  /**
   * @description Create a new subarray from the actual buffer. This is needed for compat reasons since a new Uint8Array gets returned here
   * @param begin The position to start at
   * @param end The position to end at
   */


  subarray(begin, end) {
    return Uint8Array.from(this).subarray(begin, end);
  }
  /**
   * @description Returns a hex string representation of the value
   */


  toHex() {
    return (0, _util.u8aToHex)(this);
  }
  /**
   * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
   */


  toHuman() {
    return this.isAscii ? this.toUtf8() : this.toJSON();
  }
  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */


  toJSON() {
    return this.toHex();
  }
  /**
   * @description Returns the base runtime type name for this instance
   */


  toRawType() {
    return 'Raw';
  }
  /**
   * @description Returns the string representation of the value
   */


  toString() {
    return this.toHex();
  }
  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars


  toU8a(isBare) {
    return Uint8Array.from(this);
  }
  /**
   * @description Returns the wrapped data as a UTF-8 string
   */


  toUtf8() {
    (0, _util.assert)(this.isUtf8, 'The character sequence is not a valid Utf8 string');
    return (0, _util.u8aToString)(this);
  }

}

exports.default = Raw;