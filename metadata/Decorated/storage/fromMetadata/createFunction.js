"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createFunction;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _codec = require("@polkadot/types/codec");

var _create = require("@polkadot/types/create");

var _util = require("@polkadot/util");

var _utilCrypto = require("@polkadot/util-crypto");

var _getHasher = _interopRequireDefault(require("./getHasher"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const EMPTY_U8A = new Uint8Array([]);

const NULL_HASHER = value => value; // with the prefix, method & options, create both the string & raw keys

/** @internal */


function expandKey({
  method,
  prefix
}, options) {
  return options.key ? options.key : `${prefix} ${method}`;
} // get the hashers, the base (and  in the case of DoubleMap), the second key

/** @internal */


function getHashers({
  meta: {
    type
  }
}) {
  if (type.isDoubleMap) {
    return [(0, _getHasher.default)(type.asDoubleMap.hasher), (0, _getHasher.default)(type.asDoubleMap.key2Hasher)];
  } else if (type.isMap) {
    return [(0, _getHasher.default)(type.asMap.hasher)];
  } // the default


  return [(0, _getHasher.default)()];
} // create a base prefixed key

/** @internal */


function createPrefixedKey({
  method,
  prefix
}) {
  return (0, _util.u8aConcat)((0, _utilCrypto.xxhashAsU8a)(prefix, 128), (0, _utilCrypto.xxhashAsU8a)(method, 128));
} // create a key for a DoubleMap type

/** @internal */


function createKeyDoubleMap(registry, itemFn, stringKey, args, [hasher1, hasher2], metaVersion) {
  const {
    meta: {
      name,
      type
    }
  } = itemFn; // since we are passing an almost-unknown through, trust, but verify

  (0, _util.assert)(Array.isArray(args) && !(0, _util.isUndefined)(args[0]) && !(0, _util.isNull)(args[0]) && !(0, _util.isUndefined)(args[1]) && !(0, _util.isNull)(args[1]), `${(name || 'unknown').toString()} is a DoubleMap and requires two arguments`); // if this fails, we have bigger issues

  (0, _util.assert)(!(0, _util.isUndefined)(hasher2), '2 hashing functions should be defined for DoubleMaps');
  const [key1, key2] = args;
  const map = type.asDoubleMap;
  const val1 = (0, _create.createTypeUnsafe)(registry, map.key1.toString(), [key1]).toU8a();
  const val2 = (0, _create.createTypeUnsafe)(registry, map.key2.toString(), [key2]).toU8a(); // as per createKey, always add the length prefix (underlying it is Bytes)

  return _codec.Compact.addLengthPrefix(metaVersion <= 8 ? (0, _util.u8aConcat)(hasher1((0, _util.u8aConcat)((0, _util.stringToU8a)(stringKey), val1)), hasher2(val2)) : (0, _util.u8aConcat)(createPrefixedKey(itemFn), hasher1(val1), hasher2(val2)));
} // create a key for either a map or a plain value

/** @internal */


function createKey(registry, itemFn, stringKey, arg, hasher, metaVersion) {
  const {
    meta: {
      name,
      type
    }
  } = itemFn;
  let param = EMPTY_U8A;

  if (type.isMap) {
    const map = type.asMap;
    (0, _util.assert)(!(0, _util.isUndefined)(arg) && !(0, _util.isNull)(arg), `${name.toString()} is a Map and requires one argument`);
    param = (0, _create.createTypeUnsafe)(registry, map.key.toString(), [arg]).toU8a();
  } // StorageKey is a Bytes, so is length-prefixed


  return _codec.Compact.addLengthPrefix(metaVersion <= 8 ? hasher((0, _util.u8aConcat)((0, _util.stringToU8a)(stringKey), param)) : (0, _util.u8aConcat)(createPrefixedKey(itemFn), param.length ? hasher(param) : EMPTY_U8A));
} // attach the metadata to expand to a StorageFunction

/** @internal */


function expandWithMeta({
  meta,
  method,
  prefix,
  section
}, storageFn) {
  storageFn.meta = meta;
  storageFn.method = (0, _util.stringLowerFirst)(method);
  storageFn.prefix = prefix;
  storageFn.section = section; // explicitly add the actual method in the toJSON, this gets used to determine caching and without it
  // instances (e.g. collective) will not work since it is only matched on param meta

  storageFn.toJSON = () => _objectSpread(_objectSpread({}, meta.toJSON()), {}, {
    storage: {
      method,
      prefix,
      section
    }
  });

  return storageFn;
}
/** @internal */


function extendHeadMeta(registry, {
  meta: {
    documentation,
    name,
    type
  },
  section
}, {
  method
}, iterFn) {
  const outputType = type.isMap ? type.asMap.key.toString() : type.asDoubleMap.key1.toString(); // metadata with a fallback value using the type of the key, the normal
  // meta fallback only applies to actual entry values, create one for head

  iterFn.meta = registry.createType('StorageEntryMetadataLatest', {
    documentation,
    fallback: registry.createType('Bytes', (0, _create.createTypeUnsafe)(registry, outputType).toHex()),
    modifier: registry.createType('StorageEntryModifierLatest', 1),
    // required
    name,
    type: registry.createType('StorageEntryTypeLatest', registry.createType('PlainTypeLatest', type.isMap ? type.asMap.key : type.asDoubleMap.key1), 0)
  });
  const prefixKey = registry.createType('StorageKey', iterFn, {
    method,
    section
  });
  return arg => !(0, _util.isUndefined)(arg) && !(0, _util.isNull)(arg) ? registry.createType('StorageKey', iterFn(arg), {
    method,
    section
  }) : prefixKey;
} // attach the head key hashing for linked maps

/** @internal */


function extendLinkedMap(registry, itemFn, storageFn, stringKey, hasher, metaVersion) {
  const key = metaVersion <= 8 ? hasher(`head of ${stringKey}`) : (0, _util.u8aConcat)((0, _utilCrypto.xxhashAsU8a)(itemFn.prefix, 128), (0, _utilCrypto.xxhashAsU8a)(`HeadOf${itemFn.method}`, 128));
  storageFn.iterKey = extendHeadMeta(registry, itemFn, storageFn, () => new _codec.Raw(registry, key));
  return storageFn;
} // attach the full list hashing for prefixed maps

/** @internal */


function extendPrefixedMap(registry, itemFn, storageFn) {
  const {
    meta: {
      type
    }
  } = itemFn;
  storageFn.iterKey = extendHeadMeta(registry, itemFn, storageFn, arg => {
    (0, _util.assert)(type.isDoubleMap || (0, _util.isUndefined)(arg), 'Filtering arguments for keys/entries are only valid on double maps');
    return type.isDoubleMap && !(0, _util.isUndefined)(arg) && !(0, _util.isNull)(arg) ? new _codec.Raw(registry, (0, _util.u8aConcat)(createPrefixedKey(itemFn), (0, _getHasher.default)(type.asDoubleMap.hasher)(registry.createType(type.asDoubleMap.key1.toString(), arg).toU8a()))) : new _codec.Raw(registry, createPrefixedKey(itemFn));
  });
  return storageFn;
} // attach the full list hashing for double maps

/** @internal */


function extendDoubleMap(registry, itemFn, storageFn) {
  return extendPrefixedMap(registry, itemFn, storageFn);
}
/** @internal */


function createFunction(registry, itemFn, options) {
  const {
    meta: {
      type
    }
  } = itemFn;
  const stringKey = expandKey(itemFn, options);
  const [hasher, key2Hasher] = getHashers(itemFn); // Can only have zero or one argument:
  //   - storage.system.account(address)
  //   - storage.timestamp.blockPeriod()
  // For doublemap queries the params is passed in as an tuple, [key1, key2]

  const _storageFn = arg => type.isDoubleMap ? createKeyDoubleMap(registry, itemFn, stringKey, arg, [hasher, key2Hasher], options.metaVersion) : createKey(registry, itemFn, stringKey, arg, options.skipHashing ? NULL_HASHER : hasher, options.metaVersion);

  const storageFn = expandWithMeta(itemFn, _storageFn);

  if (type.isMap) {
    const map = type.asMap;

    if (map.linked.isTrue) {
      extendLinkedMap(registry, itemFn, storageFn, stringKey, hasher, options.metaVersion);
    } else {
      extendPrefixedMap(registry, itemFn, storageFn);
    }
  } else if (type.isDoubleMap) {
    extendDoubleMap(registry, itemFn, storageFn);
  }

  storageFn.keyPrefix = arg => storageFn.iterKey && storageFn.iterKey(arg) || (0, _util.compactStripLength)(storageFn())[1];

  return storageFn;
}