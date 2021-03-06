"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _ = _interopRequireDefault(require("./"));

var _mockWs = require("../../test/mockWs");

// Copyright 2017-2020 @polkadot/rpc-provider authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
let ws;
let mock;

function createWs(requests, autoConnect = 1000) {
  mock = (0, _mockWs.mockWs)(requests);
  ws = new _.default(_mockWs.TEST_WS_URL, autoConnect);
  return ws;
}

describe('Ws', () => {
  afterEach(() => {
    if (mock) {
      mock.done();
    }
  });
  it('returns the connected state', () => {
    expect(createWs([]).isConnected).toEqual(false);
  });
  it('allows you to initialize the provider with custom headers', () => {
    expect(() => new _.default(_mockWs.TEST_WS_URL, 1000, {
      foo: 'bar'
    })).not.toThrow();
  });
});
describe('Endpoint Parsing', () => {
  it('Succeeds when WsProvider endpoint is a valid string', () => {
    /* eslint-disable no-new */
    new _.default(_mockWs.TEST_WS_URL, 0);
  });
  it('Throws when WsProvider endpoint is an invalid string', () => {
    expect(() => {
      /* eslint-disable no-new */
      new _.default('http://127.0.0.1:9955', 0);
    }).toThrowError(/^Endpoint should start with /);
  });
  it('Succeeds when WsProvider endpoint is a valid array', () => {
    const endpoints = ['ws://127.0.0.1:9955', 'wss://testnet.io:9944', 'ws://mychain.com:9933'];
    /* eslint-disable no-new */

    new _.default(endpoints, 0);
  });
  it('Throws when WsProvider endpoint is an empty array', () => {
    const endpoints = [];
    expect(() => {
      /* eslint-disable no-new */
      new _.default(endpoints, 0);
    }).toThrowError('WsProvider requires at least one Endpoint');
  });
  it('Throws when WsProvider endpoint is an invalid array', () => {
    const endpoints = ['ws://127.0.0.1:9955', 'http://bad.co:9944', 'ws://mychain.com:9933'];
    expect(() => {
      /* eslint-disable no-new */
      new _.default(endpoints, 0);
    }).toThrowError(/^Endpoint should start with /);
  });
});