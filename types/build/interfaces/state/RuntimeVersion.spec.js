"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _create = require("../../create");

var _RuntimeVersion = _interopRequireDefault(require("../../json/RuntimeVersion.002.json"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
describe('RuntimeVersion', () => {
  const registry = new _create.TypeRegistry();
  let version;
  beforeEach(() => {
    version = registry.createType('RuntimeVersion', _RuntimeVersion.default.result);
  });
  it('has the correct authoring', () => {
    expect(version.authoringVersion.toNumber()).toEqual(10);
  });
  it('has the apis', () => {
    const [apiId, apiVersion] = version.apis[0];
    expect(apiId.toHex()).toEqual('0xdf6acb689907609b');
    expect(apiVersion.toNumber()).toEqual(2);
  });
  it('has the correct implementation', () => {
    expect(version.implName.toString()).toEqual('substrate-node');
    expect(version.implVersion.toNumber()).toEqual(60);
  });
  it('has the correct spec', () => {
    expect(version.specName.toString()).toEqual('node');
    expect(version.specVersion.toNumber()).toEqual(60);
  });
});