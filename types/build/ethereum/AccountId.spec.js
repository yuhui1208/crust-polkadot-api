"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _create = require("../create");

var _Raw = _interopRequireDefault(require("../codec/Raw"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
describe('EthereumAccountId', () => {
  const registry = new _create.TypeRegistry();
  describe('defaults', () => {
    const id = registry.createType('EthereumAccountId');
    it('has a 20-byte length', () => {
      expect(id).toHaveLength(20);
    });
    it('is empty by default', () => {
      expect(id.isEmpty).toBe(true);
    });
    it('equals the empty address', () => {
      expect(id.eq('0x0000000000000000000000000000000000000000')).toBe(true);
    });
  });
  describe('decoding', () => {
    const testDecode = (type, input, expected) => it(`can decode from ${type}`, () => {
      const a = registry.createType('EthereumAccountId', input);
      expect(a.toString()).toBe(expected);
    });

    testDecode('AccountId', registry.createType('EthereumAccountId', '0x4119b2e6c3Cb618F4f0B93ac77f9BeeC7FF02887'), '0x4119b2e6c3Cb618F4f0B93ac77f9BeeC7FF02887');
    testDecode('hex', '0x4119b2e6c3cb618f4f0B93ac77f9Beec7ff02887', '0x4119b2e6c3Cb618F4f0B93ac77f9BeeC7FF02887');
    testDecode('Raw', new _Raw.default(registry, [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2]), '0x0102030405060708010201020304050607080102');
    testDecode('Uint8Array', Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2]), '0x0102030405060708010201020304050607080102');
  });
  describe('encoding', () => {
    const testEncode = (to, expected, input = '0x4119b2e6c3Cb618F4f0B93ac77f9BeeC7FF02887') => it(`can encode ${to}`, () => {
      const a = registry.createType('EthereumAccountId', input);
      expect(a[to]()).toEqual(expected);
    });

    testEncode('toHex', '0x4119b2e6c3cb618f4f0b93ac77f9beec7ff02887');
    testEncode('toJSON', '0x4119b2e6c3Cb618F4f0B93ac77f9BeeC7FF02887');
    testEncode('toString', '0x4119b2e6c3Cb618F4f0B93ac77f9BeeC7FF02887');
    testEncode('toString', '0x0000000000000000000000000000000000000000', '0x00');
    testEncode('toU8a', Uint8Array.from([0x41, 0x19, 0xb2, 0xe6, 0xc3, 0xcb, 0x61, 0x8f, 0x4f, 0x0b, 0x93, 0xac, 0x77, 0xf9, 0xbe, 0xec, 0x7f, 0xf0, 0x28, 0x87]));
    it('decodes to a non-empty value', () => {
      expect(registry.createType('EthereumAccountId', '0x4119b2e6c3Cb618F4f0B93ac77f9BeeC7FF02887').isEmpty).toBe(false);
    });
  });
});