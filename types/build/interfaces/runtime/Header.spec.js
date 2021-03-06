"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _bn = _interopRequireDefault(require("bn.js"));

var _create = require("../../create");

var _Header = _interopRequireDefault(require("../../json/Header.001.json"));

var _Header2 = _interopRequireDefault(require("../../json/Header.002.json"));

var _Header3 = _interopRequireDefault(require("../../json/Header.003.json"));

var _SignedBlock = _interopRequireDefault(require("../../json/SignedBlock.003.00.json"));

var _SignedBlock2 = _interopRequireDefault(require("../../json/SignedBlock.003.01.json"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
describe('Header', () => {
  const registry = new _create.TypeRegistry();
  it('decodes an actual JSON response', () => {
    const header = registry.createType('Header', _Header.default.result);
    expect(header.number.toNumber()).toEqual(0);
    expect(header.extrinsicsRoot.toString()).toEqual('0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0');
    expect(header.parentHash.toString()).toEqual('0x0000000000000000000000000000000000000000000000000000000000000000');
    expect(header.stateRoot.toString()).toEqual('0x294c3470ae3be7555240b9d034ec19c3715ba2c3f20b92441f8cea0cab66ab56');
    expect(header.digest.logs.toString()).toEqual('[]');
  });
  it('parses old-style JSON headers (deprecated)', () => {
    const header = registry.createType('Header', _Header2.default.result);
    expect(header.digest.logs).toHaveLength(1);
  });
  it('creates a valid hash (incl. digest & compact)', () => {
    const header = registry.createType('Header', _Header3.default.result);
    expect(header.hash.toHex()).toEqual('0x464692ad0e225a74274a7ef411e045f1fc7c2639b5f780c7c18f91f4100f5e54');
    expect(header.number.eq(new _bn.default(1650758))).toBe(true);
  });
  it('calculates correct hash, matching with parentHash', () => {
    const blockHash = registry.createType('Header', _SignedBlock.default.result.block.header).hash.toHex();
    expect(blockHash).toEqual(_SignedBlock2.default.result.block.header.parentHash);
  });
});