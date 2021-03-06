"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = require("@polkadot/util");

var _utilCrypto = require("@polkadot/util-crypto");

var _U8aFixed = _interopRequireDefault(require("../codec/U8aFixed"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/** @internal */
function decodeAccountId(value) {
  if (!value) {
    return new Uint8Array();
  } else if ((0, _util.isU8a)(value) || Array.isArray(value)) {
    return (0, _util.u8aToU8a)(value);
  } else if ((0, _util.isHex)(value)) {
    return (0, _util.hexToU8a)(value.toString());
  } else if ((0, _util.isString)(value)) {
    return (0, _utilCrypto.decodeAddress)(value.toString());
  }

  throw new Error('Unknown type passed to AccountId constructor');
}
/**
 * @name AccountId
 * @description
 * A wrapper around an AccountId/PublicKey representation. Since we are dealing with
 * underlying PublicKeys (32 bytes in length), we extend from U8aFixed which is
 * just a Uint8Array wrapper with a fixed length.
 */


class AccountId extends _U8aFixed.default {
  constructor(registry, value) {
    const decoded = decodeAccountId(value); // Part of stream containing >= 32 bytes or a all empty (defaults)

    (0, _util.assert)(decoded.length >= 32 || !decoded.some(b => b), `Invalid AccountId provided, expected 32 bytes, found ${decoded.length}`);
    super(registry, decoded, 256);
  }

  static encode(value, ss58Format) {
    return (0, _utilCrypto.encodeAddress)(value, ss58Format);
  }
  /**
   * @description Compares the value of the input to see if there is a match
   */


  eq(other) {
    return super.eq(decodeAccountId(other));
  }
  /**
   * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
   */


  toHuman() {
    return this.toJSON();
  }
  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */


  toJSON() {
    return this.toString();
  }
  /**
   * @description Returns the string representation of the value
   */


  toString() {
    return AccountId.encode(this, this.registry.chainSS58);
  }
  /**
   * @description Returns the base runtime type name for this instance
   */


  toRawType() {
    return 'AccountId';
  }

}

exports.default = AccountId;