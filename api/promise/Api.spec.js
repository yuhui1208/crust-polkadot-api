"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _pair = _interopRequireDefault(require("@polkadot/keyring/pair"));

var _testing = _interopRequireDefault(require("@polkadot/keyring/testing"));

var _index = _interopRequireDefault(require("@polkadot/rpc-provider/mock/index"));

var _types = require("@polkadot/types");

var _util = require("@polkadot/util");

var _util2 = require("../../test/util");

var _Api = _interopRequireDefault(require("./Api"));

// Copyright 2017-2020 @polkadot/api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const TRANSFER_SIG = '0x7a10e5ed9a14284eca7bea53f81631981dddda5a3d2dee973b136475947264801465726e4829ae3994d9058df638d959d4e043c7f1924299546790dda1dea20a';
describe('ApiPromise', () => {
  const registry = new _types.TypeRegistry();
  const keyring = (0, _testing.default)({
    type: 'ed25519'
  });
  const aliceEd = keyring.addPair( // eslint-disable-next-line @typescript-eslint/unbound-method
  (0, _pair.default)({
    toSS58: keyring.encodeAddress,
    type: 'ed25519'
  }, {
    publicKey: (0, _util.hexToU8a)('0x88dc3417d5058ec4b4503e0c12ea1a0a89be200fe98922423d4334014fa6b0ee'),
    secretKey: (0, _util.hexToU8a)('0xabf8e5bdbe30c65656c0a3cbd181ff8a56294a69dfedd27982aace4a7690911588dc3417d5058ec4b4503e0c12ea1a0a89be200fe98922423d4334014fa6b0ee')
  }));
  let provider;

  async function createTransfer() {
    provider.subscriptions.state_subscribeStorage.lastValue = {
      changes: [['0x26aa394eea5630e07c48ae0c9558cef79c2f82b23e5fd031fb54c292794b4cc4d560eb8d00e57357cf76492334e43bb2ecaa9f28df6a8c4426d7b6090f7ad3c9', '0x00']]
    };
    const signer = new _util2.SingleAccountSigner(registry, aliceEd);
    const api = await _Api.default.create({
      provider,
      registry,
      signer
    });
    const transfer = api.tx.balances.transfer(keyring.getPair('0xe659a7a1628cdd93febc04a4e0646ea20e9f5f0ce097d9a05290d4a9e054df4e').address, 321564789876512345n);
    return {
      api,
      transfer: await transfer.signAsync(aliceEd.address, {})
    };
  }

  beforeEach(() => {
    jest.setTimeout(3000000);
    provider = new _index.default(registry);
  });
  describe('initialization', () => {
    it('Create API instance with metadata map and makes the runtime, rpc, state & extrinsics available', async () => {
      const rpcData = await provider.send('state_getMetadata', []);
      const genesisHash = registry.createType('Hash', await provider.send('chain_getBlockHash', [])).toHex();
      const specVersion = 0;
      const metadata = {};
      const key = `${genesisHash}-${specVersion}`; // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access

      metadata[key] = rpcData; // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

      const api = await _Api.default.create({
        metadata,
        provider,
        registry
      });
      expect(api.genesisHash).toBeDefined();
      expect(api.runtimeMetadata).toBeDefined();
      expect(api.runtimeVersion).toBeDefined();
      expect(api.rpc).toBeDefined();
      expect(api.query).toBeDefined();
      expect(api.tx).toBeDefined();
      expect(api.derive).toBeDefined();
    });
    it('Create API instance without metadata and makes the runtime, rpc, state & extrinsics available', async () => {
      const metadata = {};
      const api = await _Api.default.create({
        metadata,
        provider,
        registry
      });
      expect(api.genesisHash).toBeDefined();
      expect(api.runtimeMetadata).toBeDefined();
      expect(api.runtimeVersion).toBeDefined();
      expect(api.rpc).toBeDefined();
      expect(api.query).toBeDefined();
      expect(api.tx).toBeDefined();
      expect(api.derive).toBeDefined();
    });
    it('Create API instance will error on failure to await ready', async () => {
      class ErrorApiPromise extends _Api.default {
        constructor() {
          super({
            provider
          });
        }

        _loadMeta() {
          throw new Error('Simulate failure to load meta');
        }

      }

      try {
        await new ErrorApiPromise().isReadyOrError;
        fail('Expected an error but none occurred.');
      } catch {// Pass
      }
    });
  });
  describe('api.sign', () => {
    const ADDR = '5FA9nQDVg267DEd8m1ZypXLBnvN7SFxYwV7ndqSYGiN9TTpu';
    const TEST = {
      data: '0x0102030405060708090a0b0c0d0e0f112233445566778899aabbccddeeff'
    };
    const SIG = '0x659effefbbe5ab4d7136ebb5084b959eb424e32b862307371be4721ac2c46334245af4f1476c36c5e5aff04396c2fdd2ce561ec90382821d4aa071b559b1db0f';
    it('signs data using a specified keyring', async () => {
      const api = new _Api.default({
        provider,
        registry
      });
      expect(await api.sign(aliceEd, TEST)).toEqual(SIG);
    });
    it('signs data using an external signer', async () => {
      const api = new _Api.default({
        provider,
        registry,
        signer: new _util2.SingleAccountSigner(registry, aliceEd)
      });
      expect(await api.sign(ADDR, TEST)).toEqual(SIG);
    });
  });
  describe('decorator.signAsync', () => {
    it('signs a transfer using an external signer', async () => {
      const {
        transfer
      } = await createTransfer();
      expect(transfer.signature.toHex()).toEqual(TRANSFER_SIG);
    });
  });
  describe('api.tx(...)', () => {
    it('allows construction from existing extrinsic', async () => {
      const {
        api,
        transfer
      } = await createTransfer();
      expect(api.tx(transfer.toHex()).signature.toHex()).toEqual(TRANSFER_SIG);
      expect(api.tx(transfer).signature.toHex()).toEqual(TRANSFER_SIG);
    });
  });
});