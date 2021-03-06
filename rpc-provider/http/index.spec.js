"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _mockHttp = require("../../test/mockHttp");

var _ = _interopRequireDefault(require("./"));

// Copyright 2017-2020 @polkadot/rpc-provider authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
describe('Http', () => {
  let http;
  beforeEach(() => {
    http = new _.default(_mockHttp.TEST_HTTP_URL);
  });
  it('requires an http:// prefixed endpoint', () => {
    expect(() => new _.default('ws://')).toThrow(/with 'http/);
  });
  it('allows https:// endpoints', () => {
    expect(() => new _.default('https://')).not.toThrow();
  });
  it('allows custom headers', () => {
    expect(() => new _.default('https://', {
      foo: 'bar'
    })).not.toThrow();
  });
  it('always returns isConnected true', () => {
    expect(http.isConnected).toEqual(true);
  });
  it('does not (yet) support subscribe', () => {
    return http.subscribe('', '', [], cb => {
      expect(cb).toEqual(expect.anything());
    }).catch(error => {
      expect(error.message).toMatch(/does not have subscriptions/);
    });
  });
  it('does not (yet) support unsubscribe', () => {
    return http.unsubscribe('', '', 0).catch(error => {
      expect(error.message).toMatch(/does not have subscriptions/);
    });
  });
});