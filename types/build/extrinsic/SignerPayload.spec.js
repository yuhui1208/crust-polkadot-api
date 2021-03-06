"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Metadata = _interopRequireDefault(require("@polkadot/metadata/Metadata"));

var _static = _interopRequireDefault(require("@polkadot/metadata/Metadata/static"));

var _create = require("../create");

var _SignerPayload = _interopRequireDefault(require("./SignerPayload"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const registry = new _create.TypeRegistry(); // eslint-disable-next-line no-new

new _Metadata.default(registry, _static.default);
describe('SignerPayload', () => {
  const TEST = {
    address: '5DTestUPts3kjeXSTMyerHihn1uwMfLj8vU8sqF7qYrFabHE',
    blockHash: '0xde8f69eeb5e065e18c6950ff708d7e551f68dc9bf59a07c52367c0280f805ec7',
    blockNumber: '0x00231d30',
    era: '0x0703',
    genesisHash: '0xdcd1346701ca8396496e52aa2785b1748deb6db09551b72159dcb3e08991025b',
    method: '0x0600ffd7568e5f0a7eda67a82691ff379ac4bba4f9c9b859fe779b5d46363b61ad2db9e56c',
    nonce: '0x00001234',
    signedExtensions: ['CheckNonce', 'CheckWeight'],
    specVersion: '0x00000006',
    tip: '0x00000000000000000000000000005678',
    transactionVersion: '0x00000007',
    version: 3
  };
  it('creates a valid JSON output', () => {
    expect(new _SignerPayload.default(registry, {
      address: '5DTestUPts3kjeXSTMyerHihn1uwMfLj8vU8sqF7qYrFabHE',
      blockHash: '0xde8f69eeb5e065e18c6950ff708d7e551f68dc9bf59a07c52367c0280f805ec7',
      blockNumber: '0x231d30',
      era: registry.createType('ExtrinsicEra', {
        current: 2301232,
        period: 200
      }),
      genesisHash: '0xdcd1346701ca8396496e52aa2785b1748deb6db09551b72159dcb3e08991025b',
      method: registry.createType('Call', '0x0600ffd7568e5f0a7eda67a82691ff379ac4bba4f9c9b859fe779b5d46363b61ad2db9e56c'),
      nonce: 0x1234,
      signedExtensions: ['CheckNonce'],
      tip: 0x5678,
      version: 3
    }).toPayload()).toEqual({
      address: '5DTestUPts3kjeXSTMyerHihn1uwMfLj8vU8sqF7qYrFabHE',
      blockHash: '0xde8f69eeb5e065e18c6950ff708d7e551f68dc9bf59a07c52367c0280f805ec7',
      blockNumber: '0x00231d30',
      era: '0x0703',
      genesisHash: '0xdcd1346701ca8396496e52aa2785b1748deb6db09551b72159dcb3e08991025b',
      method: '0x0600ffd7568e5f0a7eda67a82691ff379ac4bba4f9c9b859fe779b5d46363b61ad2db9e56c',
      nonce: '0x00001234',
      signedExtensions: ['CheckNonce'],
      specVersion: '0x00000000',
      tip: '0x00000000000000000000000000005678',
      transactionVersion: '0x00000000',
      version: 3
    });
  });
  it('re-constructs from JSON', () => {
    expect(new _SignerPayload.default(registry, _objectSpread(_objectSpread({}, TEST), {}, {
      runtimeVersion: {
        specVersion: 0x06,
        transactionVersion: 0x07
      }
    })).toPayload()).toEqual(TEST);
  });
  it('re-constructs from itself', () => {
    expect(new _SignerPayload.default(registry, new _SignerPayload.default(registry, _objectSpread(_objectSpread({}, TEST), {}, {
      runtimeVersion: {
        specVersion: 0x06,
        transactionVersion: 0x07
      }
    }))).toPayload()).toEqual(TEST);
  });
  it('can be used as a feed to ExtrinsicPayload', () => {
    const signer = new _SignerPayload.default(registry, TEST).toPayload();
    const payload = registry.createType('ExtrinsicPayload', signer, {
      version: signer.version
    });
    expect(payload.era.toHex()).toEqual(TEST.era);
    expect(payload.method.toHex()).toEqual(TEST.method);
    expect(payload.blockHash.toHex()).toEqual(TEST.blockHash);
    expect(payload.nonce.eq(TEST.nonce)).toBe(true);
    expect(payload.tip.eq(TEST.tip)).toBe(true);
  });
});