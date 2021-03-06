"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _create = require("../../create");

var _Header = _interopRequireDefault(require("../../json/Header.003.json"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
describe('Digest', () => {
  const registry = new _create.TypeRegistry();
  it('has the correct JSON representation', () => {
    const digest = registry.createType('Digest', _Header.default.result.digest);
    expect(digest.logs.map(l => l.toHex())).toEqual(_Header.default.result.digest.logs);
  });
  it('decodes logs with consensus', () => {
    const digest = registry.createType('Digest', _Header.default.result.digest);
    expect(digest.logs.length).toEqual(1);
    const log = digest.logs[0];
    expect(log.type).toBe('Consensus');
    expect(log.value.toJSON()).toEqual([1634891105, '0x69c97e0f00000000479c09f7ace12ed3e1af2dba6cca6831e257e80feef56c7474d6c69bae6f4e8a6e0045a87afe14296992c38b7d55abcbe617c441cd35e8667abbcb1678f31802']);
  });
});