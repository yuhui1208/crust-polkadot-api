"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _create = require("../../create");

var _U = _interopRequireDefault(require("../../primitive/U32"));

var _compareArray = _interopRequireDefault(require("./compareArray"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
describe('compareArray', () => {
  const registry = new _create.TypeRegistry();
  const a = [new _U.default(registry, 123), new _U.default(registry, 456), new _U.default(registry, 789)];
  it('returns false when second param is a non-array', () => {
    expect((0, _compareArray.default)(a, 123)).toBe(false);
  });
  it('compares array of codec agains primitive', () => {
    expect((0, _compareArray.default)(a, [123, 456, 789])).toBe(true);
  });
  it('compares array of codec agains codec', () => {
    expect((0, _compareArray.default)(a, [new _U.default(registry, 123), new _U.default(registry, 456), new _U.default(registry, 789)])).toBe(true);
  });
  it('compares primitive against primitive', () => {
    expect((0, _compareArray.default)([123, 456], [123, 456])).toBe(true);
  });
  it('returns false when lengths are not matching', () => {
    expect((0, _compareArray.default)(a, [123])).toBe(false);
  });
  it('returns false when value mismatches', () => {
    expect((0, _compareArray.default)(a, [123, 456, 999])).toBe(false);
  });
});