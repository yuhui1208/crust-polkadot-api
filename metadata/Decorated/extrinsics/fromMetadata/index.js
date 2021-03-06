"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fromMetadata;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _util = require("@polkadot/util");

var _ = _interopRequireDefault(require("../"));

var _createUnchecked = _interopRequireDefault(require("./createUnchecked"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/** @internal */
function fromMetadata(registry, metadata) {
  return metadata.asLatest.modules.filter(({
    calls
  }) => calls.isSome).reduce((result, {
    calls,
    index,
    name
  }, _sectionIndex) => {
    const sectionIndex = index.eqn(255) ? _sectionIndex : index.toNumber();
    const section = (0, _util.stringCamelCase)(name.toString());
    result[section] = calls.unwrap().reduce((newModule, callMetadata, methodIndex) => {
      const method = (0, _util.stringCamelCase)(callMetadata.name.toString());
      newModule[method] = (0, _createUnchecked.default)(registry, section, sectionIndex, methodIndex, callMetadata);
      return newModule;
    }, {});
    return result;
  }, _objectSpread({}, _.default));
}