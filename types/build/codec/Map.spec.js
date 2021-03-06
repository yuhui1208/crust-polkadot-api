"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _create = require("../create");

var _Text = _interopRequireDefault(require("../primitive/Text"));

var _U = _interopRequireDefault(require("../primitive/U32"));

var _Map = _interopRequireDefault(require("./Map"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const registry = new _create.TypeRegistry();
const mockU32TextMap = new Map();
mockU32TextMap.set(new _Text.default(registry, 'bazzing'), new _U.default(registry, 69));
const mockU32TextMapString = '{"bazzing":69}';
const mockU32TextMapObject = {
  bazzing: 69
};
const mockU32TextMapHexString = '0x041c62617a7a696e6745000000';
const mockU32TextMapUint8Array = Uint8Array.from([4, 28, 98, 97, 122, 122, 105, 110, 103, 69, 0, 0, 0]);
const mockU32U32Map = new Map();
mockU32U32Map.set(new _U.default(registry, 1), new _U.default(registry, 2));
mockU32U32Map.set(new _U.default(registry, 23), new _U.default(registry, 24));
mockU32U32Map.set(new _U.default(registry, 28), new _U.default(registry, 30));
mockU32U32Map.set(new _U.default(registry, 45), new _U.default(registry, 80));
const mockU32U32MapString = '{"1":2,"23":24,"28":30,"45":80}';
const mockU32U32MapObject = {
  1: 2,
  23: 24,
  28: 30,
  45: 80
};
const mockU32U32MapHexString = '0x10043102000000083233180000000832381e00000008343550000000';
const mockU32U32MapUint8Array = Uint8Array.from([16, 4, 49, 2, 0, 0, 0, 8, 50, 51, 24, 0, 0, 0, 8, 50, 56, 30, 0, 0, 0, 8, 52, 53, 80, 0, 0, 0]);
describe('CodecMap', () => {
  describe('decoding', () => {
    const testDecode = (type, input, output) => it(`can decode from ${type}`, () => {
      const s = new _Map.default(registry, 'HashMap', _Text.default, _U.default, input);
      expect(s.toString()).toBe(output);
    });

    testDecode('map', mockU32TextMap, mockU32TextMapString);
    testDecode('hex', mockU32TextMapHexString, mockU32TextMapString);
    testDecode('Uint8Array', mockU32TextMapUint8Array, mockU32TextMapString);
    testDecode('map', mockU32U32Map, mockU32U32MapString);
    testDecode('hex', mockU32U32MapHexString, mockU32U32MapString);
    testDecode('Uint8Array', mockU32U32MapUint8Array, mockU32U32MapString);
  });
  describe('encoding', () => {
    const testEncode = (to, expected) => it(`can encode ${to}`, () => {
      const s = new _Map.default(registry, 'BTreeMap', _Text.default, _U.default, mockU32TextMap);
      expect(s[to]()).toEqual(expected);
    });

    testEncode('toHex', mockU32TextMapHexString);
    testEncode('toJSON', mockU32TextMapObject);
    testEncode('toU8a', mockU32TextMapUint8Array);
    testEncode('toString', mockU32TextMapString);
  });
  describe('encoding muple values', () => {
    const testEncode = (to, expected) => it(`can encode ${to}`, () => {
      const s = new _Map.default(registry, 'BTreeMap', _Text.default, _U.default, mockU32U32Map);
      expect(s[to]()).toEqual(expected);
    });

    testEncode('toHex', mockU32U32MapHexString);
    testEncode('toJSON', mockU32U32MapObject);
    testEncode('toU8a', mockU32U32MapUint8Array);
    testEncode('toString', mockU32U32MapString);
  });
});