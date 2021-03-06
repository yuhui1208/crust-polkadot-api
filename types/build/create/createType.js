"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTypeUnsafe = createTypeUnsafe;
exports.createType = createType;

var _util = require("@polkadot/util");

var _createClass = require("./createClass");

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function u8aHasValue(value) {
  return value.some(v => !!v);
} // With isPedantic, actually check that the encoding matches that supplied. This
// is much slower, but verifies that we have the correct types defined


function checkInstance(value, created) {
  // the underlying type created.toRawType()
  const rawType = created.toRawType(); // ignore bytes completely - this is probably a FIXME, since these are somewhat
  // breaking for at least online queries - not quite sure wtf is going wrong here

  if (rawType === 'Bytes') {
    return;
  } // the hex values for what we have


  const inHex = (0, _util.u8aToHex)(value);
  const crHex = created.toHex(); // Check equality, based on some different approaches (as decoded)

  const isEqual = inHex === crHex || // raw hex values, quick path
  inHex === created.toHex(true) || // wrapped options
  (0, _util.u8aToHex)(value.reverse()) === crHex; // reverse (for numbers, which are BE)
  // if the hex doesn't match and the value for both is non-empty, complain... bitterly

  if (!isEqual && (u8aHasValue(value) || u8aHasValue(created.toU8a(true)))) {
    console.warn(`${rawType}:: Input doesn't match output, received ${(0, _util.u8aToHex)(value)}, created ${crHex}`);
  }
} // Initializes a type with a value. This also checks for fallbacks and in the cases
// where isPedantic is specified (storage decoding), also check the format/structure


function initType(registry, Type, params = [], isPedantic) {
  const created = new Type(registry, ...params); // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

  const [value] = params;

  if (isPedantic && (0, _util.isU8a)(value)) {
    checkInstance(value, created);
  }

  return created;
} // An unsafe version of the `createType` below. It's unsafe because the `type`
// argument here can be any string, which, when it cannot parse, will yield a
// runtime error.
// eslint-disable-next-line @typescript-eslint/no-unused-vars


function createTypeUnsafe(registry, type, params = [], isPedantic) {
  try {
    // Circle back to isPedantic when it handles all cases 100% - as of now,
    // it provides false warning which is more hinderance than help
    return initType(registry, (0, _createClass.createClass)(registry, type), params); // , isPedantic);
  } catch (error) {
    throw new Error(`createType(${type}):: ${error.message}`);
  }
}
/**
 * Create an instance of a `type` with a given `params`.
 * @param type - A recognizable string representing the type to create an
 * instance from
 * @param params - The value to instantiate the type with
 */


function createType(registry, type, ...params) {
  return createTypeUnsafe(registry, type, params);
}