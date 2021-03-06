"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classPrivateFieldLooseBase2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseBase"));

var _classPrivateFieldLooseKey2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseKey"));

var _definitions = _interopRequireDefault(require("@polkadot/types/interfaces/runtime/definitions"));

var _types = require("@polkadot/types");

var _util = require("./util");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// We can ignore the properties, added via Struct.with
const _Header = _types.Struct.with(_definitions.default.types.Header);
/**
 * @name HeaderExtended
 * @description
 * A [[Block]] header with an additional `author` field that indicates the block author
 */


var _author = (0, _classPrivateFieldLooseKey2.default)("author");

class HeaderExtended extends _Header {
  constructor(registry, header, sessionValidators) {
    super(registry, header);
    Object.defineProperty(this, _author, {
      writable: true,
      value: void 0
    });
    (0, _classPrivateFieldLooseBase2.default)(this, _author)[_author] = (0, _util.extractAuthor)(this.digest, sessionValidators);
  }
  /**
   * @description Convenience method, returns the author for the block
   */


  get author() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _author)[_author];
  }
  /**
   * @description Creates a human-friendly JSON representation
   */


  toHuman(isExtended) {
    return _objectSpread(_objectSpread({}, super.toHuman(isExtended)), {}, {
      author: this.author ? this.author.toHuman() : undefined
    });
  }
  /**
   * @description Creates the JSON representation
   */


  toJSON() {
    return _objectSpread(_objectSpread({}, super.toJSON()), {}, {
      author: this.author ? this.author.toJSON() : undefined
    });
  }

}

exports.default = HeaderExtended;