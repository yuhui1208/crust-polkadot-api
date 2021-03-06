"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _create = require("@polkadot/types/create");

var _util = require("@polkadot/util");

var _Decorated = _interopRequireDefault(require("./Decorated"));

var _static = _interopRequireDefault(require("../Metadata/static"));

// Copyright 2017-2020 @polkadot/metadata authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const registry = new _create.TypeRegistry();
const decorated = new _Decorated.default(registry, _static.default);
describe('Decorated', () => {
  it('should correctly get Alice\'s nonce storage key (u8a)', () => {
    expect((0, _util.u8aToHex)(decorated.query.system.account('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'))).toEqual('0x410126aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9de1e86a9a8c739864cf3cc5ec2bea59fd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d');
  });
  it('should return properly-encoded transactions', () => {
    expect(registry.createType('Extrinsic', decorated.tx.timestamp.set([10101])).toU8a()).toEqual(new Uint8Array([// length (encoded)
    4 << 2, // version, no signature
    1, // index
    3, 0, // values, Compact<Moment>
    116]));
  });
  it('should return constants with the correct type and value', () => {
    expect(decorated.consts.democracy.cooloffPeriod).toBeInstanceOf(registry.createClass('BlockNumber'));
    expect(decorated.consts.democracy.cooloffPeriod.toHex()).toEqual('0x000c4e00');
  });
});