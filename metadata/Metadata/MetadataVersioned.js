"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classPrivateFieldLooseBase2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseBase"));

var _classPrivateFieldLooseKey2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseKey"));

var _Struct = _interopRequireDefault(require("@polkadot/types/codec/Struct"));

var _util = require("@polkadot/util");

var _MagicNumber = _interopRequireDefault(require("./MagicNumber"));

var _toV = _interopRequireDefault(require("./v0/toV1"));

var _toV2 = _interopRequireDefault(require("./v1/toV2"));

var _toV3 = _interopRequireDefault(require("./v2/toV3"));

var _toV4 = _interopRequireDefault(require("./v3/toV4"));

var _toV5 = _interopRequireDefault(require("./v4/toV5"));

var _toV6 = _interopRequireDefault(require("./v5/toV6"));

var _toV7 = _interopRequireDefault(require("./v6/toV7"));

var _toV8 = _interopRequireDefault(require("./v7/toV8"));

var _toV9 = _interopRequireDefault(require("./v8/toV9"));

var _toV10 = _interopRequireDefault(require("./v9/toV10"));

var _toV11 = _interopRequireDefault(require("./v10/toV11"));

var _toV12 = _interopRequireDefault(require("./v11/toV12"));

var _toLatest = _interopRequireDefault(require("./v12/toLatest"));

var _util2 = require("./util");

// Copyright 2017-2020 @polkadot/metadata authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
var _converted = (0, _classPrivateFieldLooseKey2.default)("converted");

/**
 * @name MetadataVersioned
 * @description
 * The versioned runtime metadata as a decoded structure
 */
class MetadataVersioned extends _Struct.default {
  constructor(registry, value) {
    super(registry, {
      magicNumber: _MagicNumber.default,
      metadata: 'MetadataAll'
    }, value);
    Object.defineProperty(this, _converted, {
      writable: true,
      value: new Map()
    });
    registry.setMetadata(this);
  }

  _assertVersion(version) {
    (0, _util.assert)(this.version <= version, `Cannot convert metadata from v${this.version} to v${version}`);
    return this.version === version;
  }

  _getVersion(version, fromPrev) {
    const asCurr = `asV${version}`;
    const asPrev = `asV${version - 1}`;

    if (this._assertVersion(version)) {
      return this._metadata[asCurr];
    }

    if (!(0, _classPrivateFieldLooseBase2.default)(this, _converted)[_converted].has(version)) {
      (0, _classPrivateFieldLooseBase2.default)(this, _converted)[_converted].set(version, fromPrev(this.registry, this[asPrev]));
    }

    return (0, _classPrivateFieldLooseBase2.default)(this, _converted)[_converted].get(version);
  }
  /**
   * @description Returns the wrapped metadata as a limited calls-only (latest) version
   */


  get asCallsOnly() {
    return new MetadataVersioned(this.registry, {
      magicNumber: this.magicNumber,
      metadata: this.registry.createType('MetadataAll', (0, _util2.toCallsOnly)(this.registry, this.asLatest), this.version)
    });
  }
  /**
   * @description Returns the wrapped metadata as a V0 object
   */


  get asV0() {
    this._assertVersion(0);

    return this._metadata.asV0;
  }
  /**
   * @description Returns the wrapped values as a V1 object
   */


  get asV1() {
    return this._getVersion(1, _toV.default);
  }
  /**
   * @description Returns the wrapped values as a V2 object
   */


  get asV2() {
    return this._getVersion(2, _toV2.default);
  }
  /**
   * @description Returns the wrapped values as a V3 object
   */


  get asV3() {
    return this._getVersion(3, _toV3.default);
  }
  /**
   * @description Returns the wrapped values as a V4 object
   */


  get asV4() {
    return this._getVersion(4, _toV4.default);
  }
  /**
   * @description Returns the wrapped values as a V5 object
   */


  get asV5() {
    return this._getVersion(5, _toV5.default);
  }
  /**
   * @description Returns the wrapped values as a V6 object
   */


  get asV6() {
    return this._getVersion(6, _toV6.default);
  }
  /**
   * @description Returns the wrapped values as a V7 object
   */


  get asV7() {
    return this._getVersion(7, _toV7.default);
  }
  /**
   * @description Returns the wrapped values as a V8 object
   */


  get asV8() {
    return this._getVersion(8, _toV8.default);
  }
  /**
   * @description Returns the wrapped values as a V9 object
   */


  get asV9() {
    return this._getVersion(9, _toV9.default);
  }
  /**
   * @description Returns the wrapped values as a V10 object
   */


  get asV10() {
    return this._getVersion(10, _toV10.default);
  }
  /**
   * @description Returns the wrapped values as a V10 object
   */


  get asV11() {
    return this._getVersion(11, _toV11.default);
  }
  /**
   * @description Returns the wrapped values as a V10 object
   */


  get asV12() {
    return this._getVersion(12, _toV12.default);
  }
  /**
   * @description Returns the wrapped values as a latest version object
   */


  get asLatest() {
    // This is non-existent & latest - applied here to do the module-specific type conversions
    return this._getVersion(13, _toLatest.default);
  }
  /**
   * @description
   */


  get magicNumber() {
    return this.get('magicNumber');
  }
  /**
   * @description the metadata wrapped
   */


  get _metadata() {
    return this.get('metadata');
  }
  /**
   * @description the metadata version this structure represents
   */


  get version() {
    return this._metadata.index;
  }

  getUniqTypes(throwError) {
    return (0, _util2.getUniqTypes)(this.registry, this.asLatest, throwError);
  }

}

exports.default = MetadataVersioned;