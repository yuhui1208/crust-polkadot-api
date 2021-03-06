"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _interopRequireWildcard2 = _interopRequireDefault(require("@babel/runtime/helpers/interopRequireWildcard"));

var _util = require("@polkadot/util");

var _Init = _interopRequireDefault(require("./Init"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

let pkgJson = {
  name: '@polkadot/api',
  version: '-'
};
Promise.resolve().then(() => (0, _interopRequireWildcard2.default)(require('../package.json'))).then(_pkgJson => {
  pkgJson = _pkgJson;
}).catch(() => {// ignore
});

function assertResult(value) {
  (0, _util.assert)(!(0, _util.isUndefined)(value), 'Api needs to be initialized before using, listen on \'ready\'');
  return value;
}

class ApiBase extends _Init.default {
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
  constructor(options = {}, type, decorateMethod) {
    super(options, type, decorateMethod);
  }
  /**
   * @description Contains the parameter types (constants) of all modules.
   *
   * The values are instances of the appropriate type and are accessible using `section`.`constantName`,
   *
   * @example
   * <BR>
   *
   * ```javascript
   * console.log(api.consts.democracy.enactmentPeriod.toString())
   * ```
   */


  get consts() {
    return assertResult(this._consts);
  }
  /**
   * @description Derived results that are injected into the API, allowing for combinations of various query results.
   *
   * @example
   * <BR>
   *
   * ```javascript
   * api.derive.chain.bestNumber((number) => {
   *   console.log('best number', number);
   * });
   * ```
   */


  get derive() {
    return assertResult(this._derive);
  }
  /**
   * @description  Returns the version of extrinsics in-use on this chain
   */


  get extrinsicVersion() {
    return this._extrinsicType;
  }
  /**
   * @description Contains the genesis Hash of the attached chain. Apart from being useful to determine the actual chain, it can also be used to sign immortal transactions.
   */


  get genesisHash() {
    return assertResult(this._genesisHash);
  }
  /**
   * @description `true` when subscriptions are supported
   */


  get hasSubscriptions() {
    return this._rpcCore.provider.hasSubscriptions;
  }
  /**
   * @description true is the underlying provider is connected
   */


  get isConnected() {
    return this._isConnected.getValue();
  }
  /**
   * @description The library information name & version (from package.json)
   */


  get libraryInfo() {
    return `${pkgJson.name} v${pkgJson.version}`;
  }
  /**
   * @description Contains all the chain state modules and their subsequent methods in the API. These are attached dynamically from the runtime metadata.
   *
   * All calls inside the namespace, is denoted by `section`.`method` and may take an optional query parameter. As an example, `api.query.timestamp.now()` (current block timestamp) does not take parameters, while `api.query.system.account(<accountId>)` (retrieving the associated nonce & balances for an account), takes the `AccountId` as a parameter.
   *
   * @example
   * <BR>
   *
   * ```javascript
   * api.query.system.account(<accountId>, ([nonce, balance]) => {
   *   console.log('new free balance', balance.free, 'new nonce', nonce);
   * });
   * ```
   */


  get query() {
    return assertResult(this._query);
  }
  /**
   * @description Allows for the querying of multiple storage entries and the combination thereof into a single result. This is a very optimal way to make multiple queries since it only makes a single connection to the node and retrieves the data over one subscription.
   *
   * @example
   * <BR>
   *
   * ```javascript
   * const unsub = await api.queryMulti(
   *   [
   *     // you can include the storage without any parameters
   *     api.query.balances.totalIssuance,
   *     // or you can pass parameters to the storage query
   *     [api.query.system.account, '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY']
   *   ],
   *   ([existential, [, { free }]]) => {
   *     console.log(`You have ${free.sub(existential)} more than the existential deposit`);
   *
   *     unsub();
   *   }
   * );
   * ```
   */


  get queryMulti() {
    return assertResult(this._queryMulti);
  }
  /**
   * @description Contains all the raw rpc sections and their subsequent methods in the API as defined by the jsonrpc interface definitions. Unlike the dynamic `api.query` and `api.tx` sections, these methods are fixed (although extensible with node upgrades) and not determined by the runtime.
   *
   * RPC endpoints available here allow for the query of chain, node and system information, in addition to providing interfaces for the raw queries of state (using known keys) and the submission of transactions.
   *
   * @example
   * <BR>
   *
   * ```javascript
   * api.rpc.chain.subscribeNewHeads((header) => {
   *   console.log('new header', header);
   * });
   * ```
   */


  get rpc() {
    return assertResult(this._rpc);
  }
  /**
   * @description Contains the chain information for the current node.
   */


  get runtimeChain() {
    return assertResult(this._runtimeChain);
  }
  /**
   * @description Yields the current attached runtime metadata. Generally this is only used to construct extrinsics & storage, but is useful for current runtime inspection.
   */


  get runtimeMetadata() {
    return assertResult(this._runtimeMetadata);
  }
  /**
   * @description Contains the version information for the current runtime.
   */


  get runtimeVersion() {
    return assertResult(this._runtimeVersion);
  }
  /**
   * @description The underlying Rx API interface
   */


  get rx() {
    return assertResult(this._rx);
  }
  /**
   * @description The type of this API instance, either 'rxjs' or 'promise'
   */


  get type() {
    return this._type;
  }
  /**
   * @description Contains all the extrinsic modules and their subsequent methods in the API. It allows for the construction of transactions and the submission thereof. These are attached dynamically from the runtime metadata.
   *
   * @example
   * <BR>
   *
   * ```javascript
   * api.tx.balances
   *   .transfer(<recipientId>, <balance>)
   *   .signAndSend(<keyPair>, ({status}) => {
   *     console.log('tx status', status.asFinalized.toHex());
   *   });
   * ```
   */


  get tx() {
    return assertResult(this._extrinsics);
  }
  /**
   * @description Connect from the underlying provider, halting all network traffic
   */


  connect() {
    return this._rpcCore.connect();
  }
  /**
   * @description Disconnect from the underlying provider, halting all network traffic
   */


  disconnect() {
    return this._rpcCore.disconnect();
  }
  /**
   * @description Finds the definition for a specific [[CallFunction]] based on the index supplied
   */


  findCall(callIndex) {
    return this.registry.findMetaCall((0, _util.u8aToU8a)(callIndex));
  }
  /**
   * @description Finds the definition for a specific [[RegistryError]] based on the index supplied
   */


  findError(errorIndex) {
    return this.registry.findMetaError((0, _util.u8aToU8a)(errorIndex));
  }
  /**
   * @description Set an external signer which will be used to sign extrinsic when account passed in is not KeyringPair
   */


  setSigner(signer) {
    this._rx.signer = signer;
  }
  /**
   * @description Signs a raw signer payload, string or Uint8Array
   */


  async sign(address, data, {
    signer
  } = {}) {
    if ((0, _util.isString)(address)) {
      const _signer = signer || this._rx.signer;

      (0, _util.assert)(_signer === null || _signer === void 0 ? void 0 : _signer.signRaw, 'No signer exists with a signRaw interface');
      return (await _signer.signRaw(_objectSpread(_objectSpread({
        type: 'bytes'
      }, data), {}, {
        address
      }))).signature;
    }

    return (0, _util.u8aToHex)(address.sign((0, _util.u8aToU8a)(data.data)));
  }

}

exports.default = ApiBase;