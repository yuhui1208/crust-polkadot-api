"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classPrivateFieldLooseBase2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseBase"));

var _classPrivateFieldLooseKey2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseKey"));

var _bn = _interopRequireDefault(require("bn.js"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _apiDerive = _interopRequireDefault(require("@polkadot/api-derive"));

var _util = require("@polkadot/api-derive/util");

var _Decorated = _interopRequireDefault(require("@polkadot/metadata/Decorated"));

var _rpcCore = _interopRequireDefault(require("@polkadot/rpc-core"));

var _rpcProvider = require("@polkadot/rpc-provider");

var _types = require("@polkadot/types");

var _Linkage = require("@polkadot/types/codec/Linkage");

var _constants = require("@polkadot/types/extrinsic/constants");

var _StorageKey = require("@polkadot/types/primitive/StorageKey");

var _util2 = require("@polkadot/util");

var _submittable = require("../submittable");

var _augmentObject = _interopRequireDefault(require("../util/augmentObject"));

var _decorate = require("../util/decorate");

var _validate = require("../util/validate");

var _Events = _interopRequireDefault(require("./Events"));

// Copyright 2017-2020 @polkadot/api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const PAGE_SIZE_KEYS = 256;
const PAGE_SIZE_VALS = PAGE_SIZE_KEYS;
const l = (0, _util2.logger)('api/init');
let instanceCounter = 0;

var _instanceId = (0, _classPrivateFieldLooseKey2.default)("instanceId");

var _registry = (0, _classPrivateFieldLooseKey2.default)("registry");

class Decorate extends _Events.default {
  // HACK Use BN import so decorateDerive works... yes, wtf.

  /**
   * This is the one and only method concrete children classes need to implement.
   * It's a higher-order function, which takes one argument
   * `method: Method extends (...args: any[]) => Observable<any>`
   * (and one optional `options`), and should return the user facing method.
   * For example:
   * - For ApiRx, `decorateMethod` should just be identity, because the input
   * function is already an Observable
   * - For ApiPromise, `decorateMethod` should return a function that takes all
   * the parameters from `method`, adds an optional `callback` argument, and
   * returns a Promise.
   *
   * We could easily imagine other user-facing interfaces, which are simply
   * implemented by transforming the Observable to Stream/Iterator/Kefir/Bacon
   * via `decorateMethod`.
   */

  /**
   * @description Create an instance of the class
   *
   * @param options Options object to create API instance or a Provider instance
   *
   * @example
   * <BR>
   *
   * ```javascript
   * import Api from '@polkadot/api/promise';
   *
   * const api = new Api().isReady();
   *
   * api.rpc.subscribeNewHeads((header) => {
   *   console.log(`new block #${header.number.toNumber()}`);
   * });
   * ```
   */
  constructor(options, type, decorateMethod) {
    var _options$source;

    super();
    Object.defineProperty(this, _instanceId, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _registry, {
      writable: true,
      value: void 0
    });
    this.__phantom = new _bn.default(0);
    this._consts = {};
    this._derive = void 0;
    this._extrinsics = void 0;
    this._extrinsicType = _constants.DEFAULT_VERSION;
    this._genesisHash = void 0;
    this._isConnected = void 0;
    this._isReady = false;
    this._options = void 0;
    this._query = {};
    this._queryMulti = void 0;
    this._rpc = void 0;
    this._rpcCore = void 0;
    this._runtimeChain = void 0;
    this._runtimeMetadata = void 0;
    this._runtimeVersion = void 0;
    this._rx = {
      consts: {},
      query: {},
      tx: {}
    };
    this._type = void 0;
    this._decorateMethod = void 0;

    this._rxDecorateMethod = method => {
      return method;
    };

    (0, _classPrivateFieldLooseBase2.default)(this, _instanceId)[_instanceId] = `${++instanceCounter}`;
    (0, _classPrivateFieldLooseBase2.default)(this, _registry)[_registry] = ((_options$source = options.source) === null || _options$source === void 0 ? void 0 : _options$source.registry) || options.registry || new _types.TypeRegistry();
    const thisProvider = options.source ? options.source._rpcCore.provider.clone() : options.provider || new _rpcProvider.WsProvider();
    this._decorateMethod = decorateMethod;
    this._options = options;
    this._type = type;
    this._rpcCore = new _rpcCore.default((0, _classPrivateFieldLooseBase2.default)(this, _instanceId)[_instanceId], (0, _classPrivateFieldLooseBase2.default)(this, _registry)[_registry], thisProvider, this._options.rpc);
    this._isConnected = new _rxjs.BehaviorSubject(this._rpcCore.provider.isConnected);
    this._rx.hasSubscriptions = this._rpcCore.provider.hasSubscriptions;
    this._rx.registry = (0, _classPrivateFieldLooseBase2.default)(this, _registry)[_registry];
  }
  /**
   * @description Return the current used registry
   */


  get registry() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _registry)[_registry];
  }
  /**
   * @description Creates an instance of a type as registered
   */


  createType(type, ...params) {
    return (0, _classPrivateFieldLooseBase2.default)(this, _registry)[_registry].createType(type, ...params);
  }
  /**
   * @description Register additional user-defined of chain-specific types in the type registry
   */


  registerTypes(types) {
    types && (0, _classPrivateFieldLooseBase2.default)(this, _registry)[_registry].register(types);
  }
  /**
   * @returns `true` if the API operates with subscriptions
   */


  get hasSubscriptions() {
    return this._rpcCore.provider.hasSubscriptions;
  }

  injectMetadata(metadata, fromEmpty, registry) {
    const decoratedMeta = new _Decorated.default(registry || (0, _classPrivateFieldLooseBase2.default)(this, _registry)[_registry], metadata);

    if (fromEmpty || !this._extrinsics) {
      this._extrinsics = this._decorateExtrinsics(decoratedMeta.tx, this._decorateMethod);
      this._rx.tx = this._decorateExtrinsics(decoratedMeta.tx, this._rxDecorateMethod);
    } else {
      (0, _augmentObject.default)('tx', this._decorateExtrinsics(decoratedMeta.tx, this._decorateMethod), this._extrinsics, false);
      (0, _augmentObject.default)(null, this._decorateExtrinsics(decoratedMeta.tx, this._rxDecorateMethod), this._rx.tx, false);
    } // this API


    (0, _augmentObject.default)('query', this._decorateStorage(decoratedMeta.query, this._decorateMethod), this._query, fromEmpty);
    (0, _augmentObject.default)('consts', decoratedMeta.consts, this._consts, fromEmpty); // rx

    (0, _augmentObject.default)(null, this._decorateStorage(decoratedMeta.query, this._rxDecorateMethod), this._rx.query, fromEmpty);
    (0, _augmentObject.default)(null, decoratedMeta.consts, this._rx.consts, fromEmpty);
  }

  _decorateFunctionMeta(input, output) {
    output.meta = input.meta;
    output.method = input.method;
    output.section = input.section;
    output.toJSON = input.toJSON;

    if (input.callIndex) {
      output.callIndex = input.callIndex;
    }

    return output;
  } // Filter all RPC methods based on the results of the rpc_methods call. We do this in the following
  // manner to cater for both old and new:
  //   - when the number of entries are 0, only remove the ones with isOptional (account & contracts)
  //   - when non-zero, remove anything that is not in the array (we don't do this)


  async _filterRpc() {
    let methods;

    try {
      // we ignore the version (adjust as versions change, for now only "1")
      methods = (await this._rpcCore.rpc.methods().toPromise()).methods.map(t => t.toString());
    } catch (error) {
      // the method is not there, we adjust accordingly
      methods = [];
    }

    this._filterRpcMethods(methods);
  }

  _filterRpcMethods(exposed) {
    const hasResults = exposed.length !== 0;
    const allKnown = [...this._rpcCore.mapping.entries()];
    const allKeys = allKnown.reduce((allKeys, [, {
      alias,
      method,
      pubsub,
      section
    }]) => {
      allKeys.push(`${section}_${method}`);

      if (pubsub) {
        allKeys.push(`${section}_${pubsub[1]}`);
        allKeys.push(`${section}_${pubsub[2]}`);
      }

      if (alias) {
        allKeys.push(...alias);
      }

      return allKeys;
    }, []);
    const unknown = exposed.filter(key => !allKeys.includes(key));

    if (unknown.length) {
      l.warn(`RPC methods not decorated: ${unknown.join(', ')}`);
    } // loop through all entries we have (populated in decorate) and filter as required
    // only remove when we have results and method missing, or with no results if optional


    allKnown.filter(([key]) => hasResults ? !exposed.includes(key) && key !== 'rpc_methods' // rpc_methods doesn't appear, v1
    : key === 'rpc_methods' // we didn't find this one, remove
    ) // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .forEach(([_, {
      method,
      section
    }]) => {
      delete this._rpc[section][method];
      delete this._rpcCore[section][method];
      delete this._rx.rpc[section][method];
    });
  }

  _decorateRpc(rpc, decorateMethod) {
    return rpc.sections.reduce((out, _sectionName) => {
      const sectionName = _sectionName; // out and section here are horrors to get right from a typing perspective :(

      out[sectionName] = Object.entries(rpc[sectionName]).reduce((section, [methodName, method]) => {
        //  skip subscriptions where we have a non-subscribe interface
        if (this.hasSubscriptions || !(methodName.startsWith('subscribe') || methodName.startsWith('unsubscribe'))) {
          section[methodName] = decorateMethod(method, {
            methodName
          }); // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access

          section[methodName].raw = decorateMethod(method.raw, {
            methodName
          });
        }

        return section;
      }, {});
      return out;
    }, {});
  }

  _decorateMulti(decorateMethod) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return decorateMethod(calls => this._rpcCore.state.subscribeStorage(calls.map(arg => // the input is a QueryableStorageEntry, convert to StorageEntry
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    Array.isArray(arg) ? [arg[0].creator, ...arg.slice(1)] : [arg.creator])));
  }

  _decorateExtrinsics(extrinsics, decorateMethod) {
    const creator = (0, _submittable.createSubmittable)(this._type, this._rx, decorateMethod);
    return Object.entries(extrinsics).reduce((out, [name, section]) => {
      out[name] = Object.entries(section).reduce((out, [name, method]) => {
        out[name] = this._decorateExtrinsicEntry(method, creator);
        return out;
      }, {});
      return out;
    }, creator);
  }

  _decorateExtrinsicEntry(method, creator) {
    const decorated = (...params) => creator(method(...params)); // eslint-disable-next-line @typescript-eslint/no-unsafe-return


    return this._decorateFunctionMeta(method, decorated);
  }

  _decorateStorage(storage, decorateMethod) {
    return Object.entries(storage).reduce((out, [name, section]) => {
      out[name] = Object.entries(section).reduce((out, [name, method]) => {
        out[name] = this._decorateStorageEntry(method, decorateMethod);
        return out;
      }, {});
      return out;
    }, {});
  }

  _decorateStorageEntry(creator, decorateMethod) {
    // get the storage arguments, with DoubleMap as an array entry, otherwise spread
    const getArgs = (...args) => (0, _validate.extractStorageArgs)(creator, args); // Disable this where it occurs for each field we are decorating

    /* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment */
    // FIXME We probably want to be able to query the full list with non-subs as well


    const decorated = this.hasSubscriptions && creator.iterKey && creator.meta.type.isMap && creator.meta.type.asMap.linked.isTrue ? this._decorateStorageLinked(creator, decorateMethod) : this._decorateStorageCall(creator, decorateMethod);
    decorated.creator = creator;
    decorated.at = decorateMethod((hash, arg1, arg2) => this._rpcCore.state.getStorage(getArgs(arg1, arg2), hash));
    decorated.hash = decorateMethod((arg1, arg2) => this._rpcCore.state.getStorageHash(getArgs(arg1, arg2)));

    decorated.key = (arg1, arg2) => (0, _util2.u8aToHex)((0, _util2.compactStripLength)(creator(creator.meta.type.isDoubleMap ? [arg1, arg2] : arg1))[1]);

    decorated.keyPrefix = key1 => (0, _util2.u8aToHex)(creator.keyPrefix(key1));

    decorated.range = decorateMethod((range, arg1, arg2) => this._decorateStorageRange(decorated, [arg1, arg2], range));
    decorated.size = decorateMethod((arg1, arg2) => this._rpcCore.state.getStorageSize(getArgs(arg1, arg2))); // .keys() & .entries() only available on map types

    if (creator.iterKey && (creator.meta.type.isMap || creator.meta.type.isDoubleMap)) {
      decorated.entries = decorateMethod((0, _util.memo)((0, _classPrivateFieldLooseBase2.default)(this, _instanceId)[_instanceId], doubleMapArg => this._retrieveMapEntries(creator, doubleMapArg)));
      decorated.entriesPaged = decorateMethod((0, _util.memo)((0, _classPrivateFieldLooseBase2.default)(this, _instanceId)[_instanceId], opts => this._retrieveMapEntriesPaged(creator, opts)));
      decorated.keys = decorateMethod((0, _util.memo)((0, _classPrivateFieldLooseBase2.default)(this, _instanceId)[_instanceId], doubleMapArg => this._retrieveMapKeys(creator, doubleMapArg)));
      decorated.keysPaged = decorateMethod((0, _util.memo)((0, _classPrivateFieldLooseBase2.default)(this, _instanceId)[_instanceId], opts => this._retrieveMapKeysPaged(creator, opts)));
    } // only support multi where subs are available


    if (this.hasSubscriptions) {
      // When using double map storage function, user need to pass double map key as an array
      decorated.multi = decorateMethod(args => this._rpcCore.state.subscribeStorage(args.map(arg => [creator, arg])));
    }
    /* eslint-enable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment */


    return this._decorateFunctionMeta(creator, decorated);
  } // Decorate the base storage call. In the case or rxjs or promise-without-callback (await)
  // we make a subscription, alternatively we push this through a single-shot query


  _decorateStorageCall(creator, decorateMethod) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return decorateMethod((...args) => {
      return this.hasSubscriptions ? this._rpcCore.state.subscribeStorage([(0, _validate.extractStorageArgs)(creator, args)]).pipe((0, _operators.map)(([data]) => data) // extract first/only result from list
      ) : this._rpcCore.state.getStorage((0, _validate.extractStorageArgs)(creator, args));
    }, {
      methodName: creator.method,
      overrideNoSub: (...args) => this._rpcCore.state.getStorage((0, _validate.extractStorageArgs)(creator, args))
    });
  }

  _decorateStorageRange(decorated, args, range) {
    const outputType = (0, _StorageKey.unwrapStorageType)(decorated.creator.meta.type, decorated.creator.meta.modifier.isOptional);
    return this._rpcCore.state.queryStorage([decorated.key(...args)], ...range).pipe((0, _operators.map)(result => result.map(([blockHash, [value]]) => [blockHash, this.createType(outputType, value.isSome ? value.unwrap().toHex() : undefined)])));
  } // This is deprecated/removed on substrate - we still have some live chains, eg. Edgeware needing it, so it
  // has not been dropped yet. Slated for removal in API 2.0


  _decorateStorageLinked(creator, decorateMethod) {
    const result = new Map();
    let subject;
    let head = null;
    const iterKey = creator.iterKey;
    (0, _util2.assert)(iterKey, 'iterKey field is missing'); // retrieve a value based on the key, iterating if it has a next entry. Since
    // entries can be re-linked in the middle of a list, we subscribe here to make
    // sure we catch any updates, no matter the list position

    const getNext = key => this._rpcCore.state.getStorage([creator, key]).pipe((0, _operators.switchMap)(_data => {
      const data = creator.meta.modifier.isOptional ? _data.unwrapOr(null) : _data;
      result.set(key, data); // iterate from this key to the linkages, constructing entries for all
      // those found and available

      if (data && data[1].next.isSome) {
        return getNext(data[1].next.unwrap());
      }

      const [keys, vals] = [[], []];
      let nextKey = head; // loop through the results collected, starting at the head an re-creating
      // the list. Our map may have old entries, based on the linking these will
      // not be returned in the final result

      while (nextKey) {
        var _linkage$next;

        const entry = result.get(nextKey);

        if (!entry) {
          break;
        }

        const [item, linkage] = entry;
        keys.push(nextKey);
        vals.push(item);
        nextKey = (_linkage$next = linkage.next) === null || _linkage$next === void 0 ? void 0 : _linkage$next.unwrapOr(null);
      }

      const nextResult = vals.length ? new _Linkage.LinkageResult((0, _classPrivateFieldLooseBase2.default)(this, _registry)[_registry], [keys[0].constructor, keys], [vals[0].constructor, vals]) : new _Linkage.LinkageResult((0, _classPrivateFieldLooseBase2.default)(this, _registry)[_registry], [_types.Null, []], [_types.Null, []]); // we set our result into a subject so we have a single observable for
      // which the value changes over time. Initially create, follow-up next

      if (subject) {
        subject.next(nextResult);
      } else {
        subject = new _rxjs.BehaviorSubject(nextResult);
      }

      return subject;
    })); // this handles the case where the head changes effectively, i.e. a new entry
    // appears at the top of the list, the new getNext gets kicked off
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return


    return decorateMethod((...args) => args.length ? this._rpcCore.state // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    .subscribeStorage([[creator, ...args]]).pipe((0, _operators.map)(([data]) => data)) : this._rpcCore.state.subscribeStorage([iterKey()]).pipe((0, _operators.switchMap)(([key]) => getNext(head = key))));
  }

  _retrieveMapKeys({
    iterKey,
    meta
  }, arg) {
    (0, _util2.assert)(iterKey && (meta.type.isMap || meta.type.isDoubleMap), 'keys can only be retrieved on maps, linked maps and double maps');
    const headKey = iterKey(arg).toHex();
    const startSubject = new _rxjs.BehaviorSubject(headKey);
    return startSubject.pipe((0, _operators.switchMap)(startKey => this._rpcCore.state.getKeysPaged(headKey, PAGE_SIZE_KEYS, startKey).pipe((0, _operators.map)(keys => keys.map(key => key.setMeta(meta))))), (0, _operators.tap)(keys => {
      keys.length === PAGE_SIZE_KEYS ? startSubject.next(keys[PAGE_SIZE_KEYS - 1].toHex()) : startSubject.complete();
    }), (0, _operators.toArray)(), // toArray since we want to startSubject to be completed
    (0, _operators.map)(keysArr => keysArr.reduce((result, keys) => result.concat(keys), [])));
  }

  _retrieveMapKeysPaged({
    iterKey,
    meta
  }, opts) {
    (0, _util2.assert)(iterKey && (meta.type.isMap || meta.type.isDoubleMap), 'keys can only be retrieved on maps, linked maps and double maps');
    const headKey = iterKey(opts.arg).toHex();
    return this._rpcCore.state.getKeysPaged(headKey, opts.pageSize, opts.startKey || headKey).pipe((0, _operators.map)(keys => keys.map(key => key.setMeta(meta))));
  }

  _retrieveMapEntries(entry, arg) {
    return this._retrieveMapKeys(entry, arg).pipe((0, _operators.switchMap)(keys => (0, _rxjs.combineLatest)([(0, _rxjs.of)(keys), ...Array(Math.ceil(keys.length / PAGE_SIZE_VALS)).fill(0).map((_, index) => this._rpcCore.state.queryStorageAt(keys.slice(index * PAGE_SIZE_VALS, index * PAGE_SIZE_VALS + PAGE_SIZE_VALS)))])), (0, _operators.map)(([keys, ...valsArr]) => valsArr.reduce((result, vals) => result.concat(vals), []).map((value, index) => [keys[index], value])));
  }

  _retrieveMapEntriesPaged(entry, opts) {
    return this._retrieveMapKeysPaged(entry, opts).pipe((0, _operators.switchMap)(keys => (0, _rxjs.combineLatest)([(0, _rxjs.of)(keys), this._rpcCore.state.queryStorageAt(keys)])), (0, _operators.map)(([keys, ...valsArr]) => valsArr.reduce((result, vals) => result.concat(vals), []).map((value, index) => [keys[index], value])));
  }

  _decorateDeriveRx(decorateMethod) {
    // Pull in derive from api-derive
    const derive = (0, _apiDerive.default)((0, _classPrivateFieldLooseBase2.default)(this, _instanceId)[_instanceId], this._rx, this._options.derives);
    return (0, _decorate.decorateSections)(derive, decorateMethod);
  }

  _decorateDerive(decorateMethod) {
    return (0, _decorate.decorateSections)(this._rx.derive, decorateMethod);
  }
  /**
   * Put the `this.onCall` function of ApiRx here, because it is needed by
   * `api._rx`.
   */


}

exports.default = Decorate;