"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classPrivateFieldLooseBase2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseBase"));

var _classPrivateFieldLooseKey2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseKey"));

var _memoizee = _interopRequireDefault(require("memoizee"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _jsonrpc = _interopRequireDefault(require("@polkadot/types/interfaces/jsonrpc"));

var _types = require("@polkadot/types");

var _util = require("@polkadot/util");

var _rxjs2 = require("./rxjs");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const l = (0, _util.logger)('rpc-core');
const EMPTY_META = {
  fallback: undefined,
  modifier: {
    isOptional: true
  },
  type: {
    asMap: {
      linked: {
        isTrue: false
      }
    },
    isMap: false
  }
}; // utility method to create a nicely-formatted error

/** @internal */

function logErrorMessage(method, {
  params,
  type
}, error) {
  const inputs = params.map(({
    isOptional,
    name,
    type
  }) => `${name}${isOptional ? '?' : ''}: ${type}`).join(', ');
  l.error(`${method}(${inputs}): ${type}:: ${error.message}`);
}
/**
 * @name Rpc
 * @summary The API may use a HTTP or WebSockets provider.
 * @description It allows for querying a Polkadot Client Node.
 * WebSockets provider is recommended since HTTP provider only supports basic querying.
 *
 * ```mermaid
 * graph LR;
 *   A[Api] --> |WebSockets| B[WsProvider];
 *   B --> |endpoint| C[ws://127.0.0.1:9944]
 * ```
 *
 * @example
 * <BR>
 *
 * ```javascript
 * import Rpc from '@polkadot/rpc-core';
 * import WsProvider from '@polkadot/rpc-provider/ws';
 *
 * const provider = new WsProvider('ws://127.0.0.1:9944');
 * const rpc = new Rpc(provider);
 * ```
 */


var _instanceId = (0, _classPrivateFieldLooseKey2.default)("instanceId");

var _registryDefault = (0, _classPrivateFieldLooseKey2.default)("registryDefault");

var _getBlockRegistry = (0, _classPrivateFieldLooseKey2.default)("getBlockRegistry");

var _storageCache = (0, _classPrivateFieldLooseKey2.default)("storageCache");

class Rpc {
  // Ok, this is quite horrible - we really should not be using the ! here, but we are actually assigning
  // these via the createInterfaces inside the constructor. However... this is not quite visible. The reason
  // why we don't do for individual assignments is to allow user-defined RPCs to also be defined

  /**
   * @constructor
   * Default constructor for the Api Object
   * @param  {ProviderInterface} provider An API provider using HTTP or WebSocket
   */
  constructor(instanceId, registry, provider, userRpc = {}) {
    Object.defineProperty(this, _instanceId, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _registryDefault, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _getBlockRegistry, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _storageCache, {
      writable: true,
      value: new Map()
    });
    this.mapping = new Map();
    this.provider = void 0;
    this.sections = [];
    this.author = void 0;
    this.babe = void 0;
    this.chain = void 0;
    this.childstate = void 0;
    this.contracts = void 0;
    this.engine = void 0;
    this.grandpa = void 0;
    this.offchain = void 0;
    this.payment = void 0;
    this.rpc = void 0;
    this.state = void 0;
    this.system = void 0;
    // eslint-disable-next-line @typescript-eslint/unbound-method
    (0, _util.assert)(provider && (0, _util.isFunction)(provider.send), 'Expected Provider to API create');
    (0, _classPrivateFieldLooseBase2.default)(this, _instanceId)[_instanceId] = instanceId;
    (0, _classPrivateFieldLooseBase2.default)(this, _registryDefault)[_registryDefault] = registry;
    this.provider = provider;
    const sectionNames = Object.keys(_jsonrpc.default); // these are the base keys (i.e. part of jsonrpc)

    this.sections.push(...sectionNames);
    this.addUserInterfaces(userRpc);
  }
  /**
   * @description Returns the connected status of a provider
   */


  get isConnected() {
    return this.provider.isConnected;
  }
  /**
   * @description Manually connect from the attached provider
   */


  connect() {
    return this.provider.connect();
  }
  /**
   * @description Manually disconnect from the attached provider
   */


  disconnect() {
    return this.provider.disconnect();
  }
  /**
   * @description Sets a registry swap (typically from Api)
   */


  setRegistrySwap(registrySwap) {
    (0, _classPrivateFieldLooseBase2.default)(this, _getBlockRegistry)[_getBlockRegistry] = registrySwap;
  }

  addUserInterfaces(userRpc) {
    // add any extra user-defined sections
    this.sections.push(...Object.keys(userRpc).filter(key => !this.sections.includes(key))); // decorate the sections with base and user methods

    this.sections.forEach(sectionName => {
      if (!this[sectionName]) {
        this[sectionName] = {};
      }

      const section = this[sectionName];
      Object.entries(_objectSpread(_objectSpread({}, this._createInterface(sectionName, _jsonrpc.default[sectionName] || {})), this._createInterface(sectionName, userRpc[sectionName] || {}))).forEach(([key, value]) => {
        // we don't want to clobber existing, i.e. when this is called again after chain is determined
        if (!section[key]) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          section[key] = value;
        }
      });
    });
  }

  _createInterface(section, methods) {
    return Object.keys(methods).filter(method => !this.mapping.has(`${section}_${method}`)).reduce((exposed, method) => {
      const def = methods[method];
      const isSubscription = !!def.pubsub;
      this.mapping.set(`${section}_${method}`, _objectSpread(_objectSpread({}, def), {}, {
        isSubscription,
        jsonrpc: `${section}_${method}`,
        method,
        section
      })); // FIXME Remove any here
      // To do so, remove `RpcInterfaceMethod` from './types.ts', and refactor
      // every method inside this class to take:
      // `<S extends keyof RpcInterface, M extends keyof RpcInterface[S]>`
      // Not doing so, because it makes this class a little bit less readable,
      // and leaving it as-is doesn't harm much

      exposed[method] = isSubscription ? this._createMethodSubscribe(section, method, def) : this._createMethodSend(section, method, def);
      return exposed;
    }, {});
  }

  _createMethodWithRaw(creator) {
    const call = creator(false);
    call.raw = creator(true);
    return call;
  }

  _createMethodSend(section, method, def) {
    const rpcName = `${section}_${method}`;
    const hashIndex = def.params.findIndex(({
      isHistoric
    }) => isHistoric);
    const cacheIndex = def.params.findIndex(({
      isCached
    }) => isCached);
    let memoized = null; // execute the RPC call, doing a registry swap for historic as applicable

    const callWithRegistry = async (isRaw, values) => {
      const hash = hashIndex === -1 ? undefined : values[hashIndex];
      const {
        registry
      } = hash && (0, _classPrivateFieldLooseBase2.default)(this, _getBlockRegistry)[_getBlockRegistry] ? await (0, _classPrivateFieldLooseBase2.default)(this, _getBlockRegistry)[_getBlockRegistry](hash) : {
        registry: (0, _classPrivateFieldLooseBase2.default)(this, _registryDefault)[_registryDefault]
      };

      const params = this._formatInputs(registry, def, values);

      const data = await this.provider.send(rpcName, params.map(param => param.toJSON()));
      return isRaw ? registry.createType('Raw', data) : this._formatOutput(registry, method, def, params, data);
    };

    const creator = isRaw => (...values) => {
      const isDelayed = hashIndex !== -1 && !!values[hashIndex] || cacheIndex !== -1 && !!values[cacheIndex];
      return new _rxjs.Observable(observer => {
        callWithRegistry(isRaw, values).then(value => {
          observer.next(value);
          observer.complete();
        }).catch(error => {
          logErrorMessage(method, def, error);
          observer.error(error);
          observer.complete();
        });
        return () => {
          var _memoized;

          // delete old results from cache
          (_memoized = memoized) === null || _memoized === void 0 ? void 0 : _memoized.delete(...values);
        };
      }).pipe((0, _operators.publishReplay)(1), // create a Replay(1)
      isDelayed ? (0, _rxjs2.refCountDelay)() // Unsubscribe after delay
      : (0, _operators.refCount)());
    };

    memoized = (0, _memoizee.default)(this._createMethodWithRaw(creator), {
      length: false,
      normalizer: args => (0, _classPrivateFieldLooseBase2.default)(this, _instanceId)[_instanceId] + JSON.stringify(args)
    });
    return memoized;
  } // create a subscriptor, it subscribes once and resolves with the id as subscribe


  _createSubscriber({
    paramsJson,
    subName,
    subType,
    update
  }, errorHandler) {
    return new Promise((resolve, reject) => {
      this.provider.subscribe(subType, subName, paramsJson, update).then(resolve).catch(error => {
        errorHandler(error);
        reject(error);
      });
    });
  }

  _createMethodSubscribe(section, method, def) {
    const [updateType, subMethod, unsubMethod] = def.pubsub;
    const subName = `${section}_${subMethod}`;
    const unsubName = `${section}_${unsubMethod}`;
    const subType = `${section}_${updateType}`;
    let memoized = null;

    const creator = isRaw => (...values) => {
      return new _rxjs.Observable(observer => {
        // Have at least an empty promise, as used in the unsubscribe
        let subscriptionPromise = Promise.resolve(null);

        const registry = (0, _classPrivateFieldLooseBase2.default)(this, _registryDefault)[_registryDefault];

        const errorHandler = error => {
          logErrorMessage(method, def, error);
          observer.error(error);
        };

        try {
          const params = this._formatInputs(registry, def, values);

          const paramsJson = params.map(param => param.toJSON());

          const update = (error, result) => {
            if (error) {
              logErrorMessage(method, def, error);
              return;
            }

            try {
              observer.next(isRaw ? registry.createType('Raw', result) : this._formatOutput(registry, method, def, params, result));
            } catch (error) {
              observer.error(error);
            }
          };

          subscriptionPromise = this._createSubscriber({
            paramsJson,
            subName,
            subType,
            update
          }, errorHandler);
        } catch (error) {
          errorHandler(error);
        } // Teardown logic


        return () => {
          var _memoized2;

          // Delete from cache, so old results don't hang around
          (_memoized2 = memoized) === null || _memoized2 === void 0 ? void 0 : _memoized2.delete(...values); // Unsubscribe from provider

          subscriptionPromise.then(subscriptionId => (0, _util.isNull)(subscriptionId) ? Promise.resolve(false) : this.provider.unsubscribe(subType, unsubName, subscriptionId)).catch(error => logErrorMessage(method, def, error));
        };
      }).pipe((0, _rxjs2.drr)());
    };

    memoized = (0, _memoizee.default)(this._createMethodWithRaw(creator), {
      // Dynamic length for argument
      length: false,
      // Normalize args so that different args that should be cached
      // together are cached together.
      // E.g.: `query.my.method('abc') === query.my.method(createType('AccountId', 'abc'));`
      // eslint-disable-next-line @typescript-eslint/unbound-method
      normalizer: args => (0, _classPrivateFieldLooseBase2.default)(this, _instanceId)[_instanceId] + JSON.stringify(args)
    });
    return memoized;
  }

  _formatInputs(registry, def, inputs) {
    const reqArgCount = def.params.filter(({
      isOptional
    }) => !isOptional).length;
    const optText = reqArgCount === def.params.length ? '' : ` (${def.params.length - reqArgCount} optional)`;
    (0, _util.assert)(inputs.length >= reqArgCount && inputs.length <= def.params.length, `Expected ${def.params.length} parameters${optText}, ${inputs.length} found instead`);
    return inputs.map((input, index) => (0, _types.createTypeUnsafe)(registry, def.params[index].type, [input]));
  }

  _treatAsHex(key) {
    // :code is problematic - it does not have the length attached, which is
    // unlike all other storage entries where it is indeed properly encoded
    return ['0x3a636f6465'].includes(key.toHex());
  }

  _formatOutput(registry, method, rpc, params, result) {
    if (rpc.type === 'StorageData') {
      const key = params[0];

      try {
        return this._formatStorageData(registry, key, result);
      } catch (error) {
        console.error(`Unable to decode storage ${key.section || 'unknown'}.${key.method || 'unknown'}:`, error.message);
        throw error;
      }
    } else if (rpc.type === 'StorageChangeSet') {
      const keys = params[0];
      return keys ? this._formatStorageSet(registry, keys, result.changes) : registry.createType('StorageChangeSet', result);
    } else if (rpc.type === 'Vec<StorageChangeSet>') {
      const mapped = result.map(({
        block,
        changes
      }) => [registry.createType('Hash', block), this._formatStorageSet(registry, params[0], changes)]); // we only query at a specific block, not a range - flatten

      return method === 'queryStorageAt' ? mapped[0][1] : mapped;
    }

    return (0, _types.createTypeUnsafe)(registry, rpc.type, [result]);
  }

  _formatStorageData(registry, key, value) {
    // single return value (via state.getStorage), decode the value based on the
    // outputType that we have specified. Fallback to Raw on nothing
    const type = key.outputType || 'Raw';
    const meta = key.meta || EMPTY_META;
    const isEmpty = (0, _util.isNull)(value); // we convert to Uint8Array since it maps to the raw encoding, all
    // data will be correctly encoded (incl. numbers, excl. :code)

    const input = isEmpty ? null : this._treatAsHex(key) ? value : (0, _util.u8aToU8a)(value);

    if (meta.modifier.isOptional) {
      return new _types.Option(registry, (0, _types.createClass)(registry, type), isEmpty ? null : (0, _types.createTypeUnsafe)(registry, type, [input], true));
    }

    return (0, _types.createTypeUnsafe)(registry, type, [isEmpty ? meta.fallback ? (0, _util.hexToU8a)(meta.fallback.toHex()) : undefined : input], true);
  }

  _formatStorageSet(registry, keys, changes) {
    // For StorageChangeSet, the changes has the [key, value] mappings
    const withCache = keys.length !== 1; // multiple return values (via state.storage subscription), decode the values
    // one at a time, all based on the query types. Three values can be returned -
    //   - Codec - There is a valid value, non-empty
    //   - null - The storage key is empty

    return keys.reduce((results, key) => {
      try {
        results.push(this._formatStorageSetEntry(registry, key, changes, withCache));
      } catch (error) {
        console.error(`Unable to decode storage ${key.section || 'unknown'}.${key.method || 'unknown'}:`, error.message);
        throw error;
      }

      return results;
    }, []);
  }

  _formatStorageSetEntry(registry, key, changes, witCache) {
    // Fallback to Raw (i.e. just the encoding) if we don't have a specific type
    const type = key.outputType || 'Raw';
    const hexKey = key.toHex();
    const meta = key.meta || EMPTY_META;
    const found = changes.find(([key]) => key === hexKey); // if we don't find the value, this is our fallback
    //   - in the case of an array of values, fill the hole from the cache
    //   - if a single result value, don't fill - it is not an update hole
    //   - fallback to an empty option in all cases

    const value = (0, _util.isUndefined)(found) ? witCache && (0, _classPrivateFieldLooseBase2.default)(this, _storageCache)[_storageCache].get(hexKey) || null : found[1];
    const isEmpty = (0, _util.isNull)(value);
    const input = isEmpty || this._treatAsHex(key) ? value : (0, _util.u8aToU8a)(value); // store the retrieved result - the only issue with this cache is that there is no
    // clearing of it, so very long running processes (not just a couple of hours, longer)
    // will increase memory beyond what is allowed.

    (0, _classPrivateFieldLooseBase2.default)(this, _storageCache)[_storageCache].set(hexKey, value);

    if (meta.modifier.isOptional) {
      return new _types.Option(registry, (0, _types.createClass)(registry, type), isEmpty ? null : (0, _types.createTypeUnsafe)(registry, type, [input], true));
    }

    return (0, _types.createTypeUnsafe)(registry, type, [isEmpty ? meta.fallback ? (0, _util.hexToU8a)(meta.fallback.toHex()) : undefined : input], true);
  }

}

exports.default = Rpc;