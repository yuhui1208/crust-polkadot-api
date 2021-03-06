"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toLatest;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _typesKnown = require("@polkadot/types-known");

var _util = require("@polkadot/util");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// TODO Handle consts as well

/**
 * Find and apply the correct type override
 * @internal
 **/
function setTypeOverride(sectionTypes, type) {
  const override = Object.keys(sectionTypes).find(aliased => type.eq(aliased));

  if (override) {
    type.setOverride(sectionTypes[override]);
  } else {
    // FIXME: NOT happy with this approach, but gets over the initial hump cased by (Vec<Announcement>,BalanceOf)
    const orig = type.toString();
    const alias = Object.entries(sectionTypes).reduce((result, [from, to]) => [['<', '>'], ['<', ','], [',', '>'], ['(', ')'], ['(', ','], [',', ','], [',', ')']].reduce((result, [one, two]) => result.replace(`${one}${from}${two}`, `${one}${to}${two}`), result), orig);

    if (orig !== alias) {
      type.setOverride(alias);
    }
  }
}
/**
 * Apply module-specific type overrides (always be done as part of toLatest)
 * @internal
 **/


function convertCalls(registry, calls, sectionTypes) {
  return calls.map(({
    args,
    documentation,
    name
  }) => {
    args.forEach(({
      type
    }) => setTypeOverride(sectionTypes, type));
    return registry.createType('FunctionMetadataLatest', {
      args,
      documentation,
      name
    });
  });
}
/**
 * Apply module-specific type overrides (always be done as part of toLatest)
 * @internal
 **/


function convertEvents(registry, events, sectionTypes) {
  return events.map(({
    args,
    documentation,
    name
  }) => {
    args.forEach(type => setTypeOverride(sectionTypes, type));
    return registry.createType('EventMetadataLatest', {
      args,
      documentation,
      name
    });
  });
}
/**
 * Apply module-specific storage type overrides (always part of toLatest)
 * @internal
 **/


function convertStorage(registry, {
  items,
  prefix
}, sectionTypes) {
  return registry.createType('StorageMetadataLatest', {
    items: items.map(({
      documentation,
      fallback,
      modifier,
      name,
      type
    }) => {
      let resultType;

      if (type.isMap) {
        resultType = type.asMap.value;
      } else if (type.isDoubleMap) {
        resultType = type.asDoubleMap.value;
      } else {
        resultType = type.asPlain;
      }

      setTypeOverride(sectionTypes, resultType);
      return registry.createType('StorageEntryMetadataLatest', {
        documentation,
        fallback,
        modifier,
        name,
        type
      });
    }),
    prefix
  });
}
/**
 * Convert the Metadata (which is an alias) to latest - effectively this _always_ get applied to the top-level &
 * most-recent metadata, since it allows us a chance to actually apply call and storage specific type aliasses
 * @internal
 **/


function toLatest(registry, {
  extrinsic,
  modules
}) {
  const allIndexes = modules.map(({
    index
  }) => index.toNumber());
  const hasReserved = allIndexes.some(index => index !== 255) && allIndexes.some(index => index === 255);
  (0, _util.assert)(!hasReserved, 'This API implementation only supports module indexes 0-254, index 255 is marked as reserved');
  return registry.createType('MetadataLatest', {
    extrinsic,
    modules: modules.map(mod => {
      const calls = mod.calls.unwrapOr(null);
      const events = mod.events.unwrapOr(null);
      const storage = mod.storage.unwrapOr(null);
      const sectionTypes = (0, _typesKnown.getModuleTypes)(registry, (0, _util.stringCamelCase)(mod.name.toString()));
      return registry.createType('ModuleMetadataLatest', _objectSpread(_objectSpread({}, mod), {}, {
        calls: calls ? convertCalls(registry, calls, sectionTypes) : null,
        events: events ? convertEvents(registry, events, sectionTypes) : null,
        storage: storage ? convertStorage(registry, storage, sectionTypes) : null
      }));
    })
  });
}