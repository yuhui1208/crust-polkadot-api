"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _rxjs = require("rxjs");

var _mock = _interopRequireDefault(require("@polkadot/rpc-provider/mock"));

var _types = require("@polkadot/types");

var _ = _interopRequireDefault(require("."));

// Copyright 2017-2020 @polkadot/rpc-core authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
describe('replay', () => {
  const registry = new _types.TypeRegistry();
  let rpc;
  beforeEach(() => {
    rpc = new _.default('653', registry, new _mock.default(registry));
  });
  it('subscribes via the rpc section', done => {
    // we don't honor types or number of params here
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    rpc.chain.getBlockHash = jest.fn(() => (0, _rxjs.of)(1)); // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access

    rpc.chain.getBlockHash(123, false).subscribe(() => {
      expect( // eslint-disable-next-line @typescript-eslint/unbound-method
      rpc.chain.getBlockHash).toHaveBeenCalledWith(123, false);
      done();
    });
  });
  it('returns the observable value', done => {
    rpc.system.chain().subscribe(value => {
      if (value) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        expect(value.toString()).toEqual('mockChain'); // Defined in MockProvider

        done();
      }
    });
  });
  it('replay(1) works as expected', done => {
    const observable = rpc.system.chain();
    let a;
    observable.subscribe(value => {
      a = value;
    });
    setTimeout(() => {
      // Subscribe again to the same observable, it should fire value immediately
      observable.subscribe(value => {
        expect(value).toEqual(a);
        done();
      });
    }, 1000);
  });
  it('unsubscribes as required', done => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    rpc.provider.unsubscribe = jest.fn();
    const subscription = rpc.chain.subscribeNewHeads().subscribe(() => {
      subscription.unsubscribe(); // There's a promise inside .unsubscribe(), wait a bit (> 2s)

      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(rpc.provider.unsubscribe).toHaveBeenCalled();
        done();
      }, 3500);
    });
  });
});