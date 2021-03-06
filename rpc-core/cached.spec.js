"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _testingPairs = _interopRequireDefault(require("@polkadot/keyring/testingPairs"));

var _mock = _interopRequireDefault(require("@polkadot/rpc-provider/mock"));

var _types = require("@polkadot/types");

var _ = _interopRequireDefault(require("."));

// Copyright 2017-2020 @polkadot/rpc-core authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
describe('Cached Observables', () => {
  const registry = new _types.TypeRegistry();
  let rpc;
  const keyring = (0, _testingPairs.default)();
  beforeEach(() => {
    rpc = new _.default('123', registry, new _mock.default(registry));
  });
  it('creates a single observable for subscriptions (multiple calls)', () => {
    const observable1 = rpc.state.subscribeStorage([123]);
    const observable2 = rpc.state.subscribeStorage([123]);
    expect(observable2).toBe(observable1);
  });
  it('creates a single observable for subscriptions (multiple calls, no arguments)', () => {
    const observable1 = rpc.chain.subscribeNewHeads();
    const observable2 = rpc.chain.subscribeNewHeads();
    expect(observable2).toBe(observable1);
  });
  it('creates a single observable (multiple calls, different arguments that should be cached together)', () => {
    const observable1 = rpc.state.subscribeStorage([keyring.alice.address]);
    const observable2 = rpc.state.subscribeStorage([registry.createType('AccountId', keyring.alice.address)]);
    expect(observable2).toBe(observable1);
  });
  it('creates multiple observables for different values', () => {
    const observable1 = rpc.chain.getBlockHash(123);
    const observable2 = rpc.chain.getBlockHash(456);
    expect(observable2).not.toBe(observable1);
  });
  it('subscribes to the same one if within the period (unbsub delay)', done => {
    const observable1 = rpc.chain.subscribeNewHeads();
    const sub1 = observable1.subscribe();
    sub1.unsubscribe();
    setTimeout(() => {
      const observable2 = rpc.chain.subscribeNewHeads();
      const sub2 = observable2.subscribe();
      expect(observable1).toBe(observable2);
      sub2.unsubscribe();
      done();
    }, 500);
  });
  it('clears cache if there are no more subscribers', done => {
    const observable1 = rpc.chain.subscribeNewHeads();
    const observable2 = rpc.chain.subscribeNewHeads();
    const sub1 = observable1.subscribe();
    const sub2 = observable2.subscribe();
    expect(observable1).toBe(observable2);
    sub1.unsubscribe();
    sub2.unsubscribe();
    setTimeout(() => {
      // No more subscribers, now create a new observable
      const observable3 = rpc.chain.subscribeNewHeads();
      expect(observable3).not.toBe(observable1);
      done();
    }, 3500);
  });
  it('creates different observables for different methods but same arguments', () => {
    // params do not match here
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const observable1 = rpc.chain.subscribeNewHeads([123]);
    const observable2 = rpc.state.subscribeStorage([123]);
    expect(observable2).not.toBe(observable1);
  });
  it('creates single observables for subsequent one-shots', () => {
    const observable1 = rpc.chain.getBlockHash(123);
    const observable2 = rpc.chain.getBlockHash(123);
    expect(observable2).toBe(observable1);
  });
  it('creates multiple observables for subsequent one-shots delayed', done => {
    const observable1 = rpc.chain.getBlockHash(123);
    const sub = observable1.subscribe(() => {
      sub.unsubscribe();
    });
    expect(rpc.chain.getBlockHash(123)).toBe(observable1);
    setTimeout(() => {
      expect(rpc.chain.getBlockHash(123)).not.toBe(observable1);
      done();
    }, 3500);
  });
});