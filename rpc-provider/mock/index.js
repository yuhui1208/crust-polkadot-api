"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bn = _interopRequireDefault(require("bn.js"));

var _eventemitter = _interopRequireDefault(require("eventemitter3"));

var _Decorated = _interopRequireDefault(require("@polkadot/metadata/Decorated"));

var _static = _interopRequireDefault(require("@polkadot/metadata/Metadata/static"));

var _jsonrpc = _interopRequireDefault(require("@polkadot/types/interfaces/jsonrpc"));

var _testing = _interopRequireDefault(require("@polkadot/keyring/testing"));

var _Header = _interopRequireDefault(require("@polkadot/types/json/Header.004.json"));

var _SignedBlock004Immortal = _interopRequireDefault(require("@polkadot/types/json/SignedBlock.004.immortal.json"));

var _util = require("@polkadot/util");

var _utilCrypto = require("@polkadot/util-crypto");

// Copyright 2017-2020 @polkadot/rpc-provider authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable camelcase */
const INTERVAL = 1000;
const SUBSCRIPTIONS = Array.prototype.concat.apply([], Object.values(_jsonrpc.default).map(section => Object.values(section).filter(({
  isSubscription
}) => isSubscription).map(({
  jsonrpc
}) => jsonrpc).concat('chain_subscribeNewHead')));
const keyring = (0, _testing.default)({
  type: 'ed25519'
});
const l = (0, _util.logger)('api-mock');
/**
 * A mock provider mainly used for testing.
 * @return {ProviderInterface} The mock provider
 * @internal
 */

class Mock {
  constructor(registry) {
    this.db = {};
    this.emitter = new _eventemitter.default();
    this.isUpdating = true;
    this.registry = void 0;
    this.prevNumber = new _bn.default(-1);
    this.requests = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-unsafe-member-access
      chain_getBlock: hash => this.registry.createType('SignedBlock', _SignedBlock004Immortal.default.result).toJSON(),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      chain_getBlockHash: blockNumber => '0x1234',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      chain_getFinalizedHead: () => this.registry.createType('Header', _Header.default.result).hash,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      chain_getHeader: () => this.registry.createType('Header', _Header.default.result).toJSON(),
      state_getKeys: () => [],
      state_getKeysPaged: () => [],
      state_getMetadata: () => _static.default,
      state_getRuntimeVersion: () => this.registry.createType('RuntimeVersion').toHex(),
      state_getStorage: (storage, params) => (0, _util.u8aToHex)(storage[params[0]]),
      system_chain: () => 'mockChain',
      system_name: () => 'mockClient',
      system_properties: () => ({
        ss58Format: 42
      }),
      system_version: () => '9.8.7'
    };
    this.subscriptions = SUBSCRIPTIONS.reduce((subs, name) => {
      subs[name] = {
        callbacks: {},
        lastValue: null
      };
      return subs;
    }, {});
    this.subscriptionId = 0;
    this.subscriptionMap = {};
    this.registry = registry;
    this.init();
  }

  get hasSubscriptions() {
    return true;
  }

  clone() {
    throw new Error('Unimplemented');
  }

  async connect() {// noop
  }

  async disconnect() {// noop
  }

  get isConnected() {
    return true;
  }

  on(type, sub) {
    this.emitter.on(type, sub);
    return () => {
      this.emitter.removeListener(type, sub);
    };
  } // eslint-disable-next-line @typescript-eslint/require-await


  async send(method, params) {
    if (!this.requests[method]) {
      throw new Error(`provider.send: Invalid method '${method}'`);
    }

    return this.requests[method](this.db, params);
  } // eslint-disable-next-line @typescript-eslint/require-await


  async subscribe(type, method, ...params) {
    l.debug(() => ['subscribe', method, params]);

    if (this.subscriptions[method]) {
      const callback = params.pop();
      const id = ++this.subscriptionId;
      this.subscriptions[method].callbacks[id] = callback;
      this.subscriptionMap[id] = method;

      if (this.subscriptions[method].lastValue !== null) {
        callback(null, this.subscriptions[method].lastValue);
      }

      return id;
    }

    throw new Error(`provider.subscribe: Invalid method '${method}'`);
  } // eslint-disable-next-line @typescript-eslint/require-await


  async unsubscribe(type, method, id) {
    const sub = this.subscriptionMap[id];
    l.debug(() => ['unsubscribe', id, sub]);

    if (!sub) {
      throw new Error(`Unable to find subscription for ${id}`);
    }

    delete this.subscriptionMap[id];
    delete this.subscriptions[sub].callbacks[id];
    return true;
  }

  init() {
    const emitEvents = ['connected', 'disconnected'];
    let emitIndex = 0;
    let newHead = this.makeBlockHeader();
    let counter = -1;
    const metadata = new _Decorated.default(this.registry, _static.default); // Do something every 1 seconds

    setInterval(() => {
      if (!this.isUpdating) {
        return;
      } // create a new header (next block)


      newHead = this.makeBlockHeader(); // increment the balances and nonce for each account

      keyring.getPairs().forEach(({
        publicKey
      }, index) => {
        this.setStateBn(metadata.query.system.account(publicKey), newHead.number.toBn().addn(index));
      }); // set the timestamp for the current block

      this.setStateBn(metadata.query.timestamp.now(), Math.floor(Date.now() / 1000));
      this.updateSubs('chain_subscribeNewHead', newHead); // We emit connected/disconnected at intervals

      if (++counter % 2 === 1) {
        if (++emitIndex === emitEvents.length) {
          emitIndex = 0;
        }

        this.emitter.emit(emitEvents[emitIndex]);
      }
    }, INTERVAL);
  }

  makeBlockHeader() {
    const blockNumber = this.prevNumber.addn(1);
    const header = this.registry.createType('Header', {
      digest: {
        logs: []
      },
      extrinsicsRoot: (0, _utilCrypto.randomAsU8a)(),
      number: blockNumber,
      parentHash: blockNumber.isZero() ? new Uint8Array(32) : (0, _util.bnToU8a)(this.prevNumber, 256, false),
      stateRoot: (0, _util.bnToU8a)(blockNumber, 256, false)
    });
    this.prevNumber = blockNumber;
    return header;
  }

  setStateBn(key, value) {
    this.db[(0, _util.u8aToHex)(key)] = (0, _util.bnToU8a)(value, 64, true);
  }

  updateSubs(method, value) {
    this.subscriptions[method].lastValue = value;
    Object.values(this.subscriptions[method].callbacks).forEach(cb => {
      try {
        cb(null, value.toJSON());
      } catch (error) {
        console.error(`Error on '${method}' subscription`, error);
      }
    });
  }

}

exports.default = Mock;