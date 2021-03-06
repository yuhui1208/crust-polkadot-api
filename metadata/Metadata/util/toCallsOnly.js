"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toCallsOnly;

// Copyright 2017-2020 @polkadot/metadata authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function trimDocs(documentation) {
  const strings = documentation.map(doc => doc.toString().trim());
  const firstEmpty = strings.findIndex(doc => !doc.length);
  return firstEmpty === -1 ? strings : strings.slice(0, firstEmpty);
}

function mapCalls(registry, _calls) {
  const calls = _calls.unwrapOr(null);

  return registry.createType('Option<Vec<FunctionMetadataLatest>>', calls ? calls.map(({
    args,
    documentation,
    name
  }) => registry.createType('FunctionMetadataLatest', {
    args,
    documentation: trimDocs(documentation),
    name
  })) : null);
}
/** @internal */


function toCallsOnly(registry, {
  extrinsic,
  modules
}) {
  return registry.createType('MetadataLatest', {
    extrinsic,
    modules: modules.map(({
      calls,
      index,
      name
    }) => ({
      calls: mapCalls(registry, calls),
      index,
      name
    }))
  }).toJSON();
}