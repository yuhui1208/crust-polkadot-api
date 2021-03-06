"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _create = require("../create");

var _Set = _interopRequireDefault(require("./Set"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */
// TODO actually import these from definitions, don't re-define here
const SET_FIELDS = {
  header: 0b00000001,
  body: 0b00000010,
  receipt: 0b00000100,
  messageQueue: 0b00001000,
  justification: 0b00010000
};
const SET_ROLES = {
  none: 0b00000000,
  full: 0b00000001,
  light: 0b00000010,
  authority: 0b00000100
};
const SET_WITHDRAW = {
  TransactionPayment: 0b00000001,
  Transfer: 0b00000010,
  Reserve: 0b00000100,
  Fee: 0b00001000
};
describe('Set', () => {
  const registry = new _create.TypeRegistry();
  it('constructs via an string[]', () => {
    const set = new _Set.default(registry, SET_ROLES, ['full', 'authority']);
    expect(set.isEmpty).toEqual(false);
    expect(set.toString()).toEqual('[full, authority]');
  });
  it('throws with invalid values', () => {
    expect(() => new _Set.default(registry, SET_ROLES, ['full', 'authority', 'invalid'])).toThrow(/Invalid key 'invalid'/);
  });
  it('throws with add on invalid', () => {
    expect(() => new _Set.default(registry, SET_ROLES, []).add('invalid')).toThrow(/Invalid key 'invalid'/);
  });
  it('allows construction via number', () => {
    expect(new _Set.default(registry, SET_WITHDRAW, 15).eq(['TransactionPayment', 'Transfer', 'Reserve', 'Fee'])).toBe(true);
  });
  it('does not allow invalid number', () => {
    expect(() => new _Set.default(registry, SET_WITHDRAW, 31)).toThrow(/Mismatch decoding '31', computed as '15'/);
  });
  it('hash a valid encoding', () => {
    const set = new _Set.default(registry, SET_FIELDS, ['header', 'body', 'justification']);
    expect(set.toU8a()).toEqual(new Uint8Array([19]));
  });
  describe('utils', () => {
    const set = new _Set.default(registry, SET_ROLES, ['full', 'authority']);
    it('compares against string array', () => {
      expect(set.eq(['authority', 'full'])).toBe(true);
    });
    it('compares against number (encoded)', () => {
      expect(set.eq(SET_ROLES.full | SET_ROLES.authority)).toBe(true);
    });
    it('compares against other sets', () => {
      expect(set.eq(new _Set.default(registry, SET_ROLES, ['authority', 'full']))).toBe(true);
    });
    it('returns false on other values', () => {
      expect(set.eq('full')).toBe(false);
    });
  });
  it('has a sane toRawType representation', () => {
    expect(new _Set.default(registry, {
      a: 1,
      b: 2,
      c: 345
    }).toRawType()).toEqual(JSON.stringify({
      _set: {
        a: 1,
        b: 2,
        c: 345
      }
    }));
  });
});