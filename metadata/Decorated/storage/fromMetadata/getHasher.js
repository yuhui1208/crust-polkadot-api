"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getHasher;

var _util = require("@polkadot/util");

var _utilCrypto = require("@polkadot/util-crypto");

// Copyright 2017-2020 @polkadot/metadata authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const DEFAULT_FN = data => (0, _utilCrypto.xxhashAsU8a)(data, 128);

const HASHERS = {
  Blake2_128: data => // eslint-disable-line camelcase
  (0, _utilCrypto.blake2AsU8a)(data, 128),
  Blake2_128Concat: data => // eslint-disable-line camelcase
  (0, _util.u8aConcat)((0, _utilCrypto.blake2AsU8a)(data, 128), (0, _util.u8aToU8a)(data)),
  Blake2_256: data => // eslint-disable-line camelcase
  (0, _utilCrypto.blake2AsU8a)(data, 256),
  Identity: data => (0, _util.u8aToU8a)(data),
  Twox128: data => (0, _utilCrypto.xxhashAsU8a)(data, 128),
  Twox256: data => (0, _utilCrypto.xxhashAsU8a)(data, 256),
  Twox64Concat: data => (0, _util.u8aConcat)((0, _utilCrypto.xxhashAsU8a)(data, 64), (0, _util.u8aToU8a)(data))
};
/** @internal */

function getHasher(hasher) {
  return HASHERS[hasher === null || hasher === void 0 ? void 0 : hasher.type] || DEFAULT_FN;
}