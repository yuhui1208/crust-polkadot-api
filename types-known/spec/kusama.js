"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// Copyright 2017-2020 @polkadot/types-known authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const sharedTypes = {
  Address: 'AccountId',
  Keys: 'SessionKeys5',
  LookupSource: 'AccountId',
  ProxyType: {
    _enum: ['Any', 'NonTransfer', 'Governance', 'Staking', 'IdentityJudgement']
  }
};
const versioned = [{
  // 1020 is first CC3
  minmax: [1019, 1031],
  types: {
    Address: 'LookupSource',
    BalanceLock: 'BalanceLockTo212',
    CompactAssignments: 'CompactAssignmentsTo257',
    DispatchError: 'DispatchErrorTo198',
    DispatchInfo: 'DispatchInfoTo244',
    Keys: 'SessionKeys5',
    Multiplier: 'Fixed64',
    OpenTip: 'OpenTipTo225',
    ReferendumInfo: 'ReferendumInfoTo239',
    RewardDestination: 'RewardDestinationTo257',
    SlashingSpans: 'SlashingSpansTo204',
    StakingLedger: 'StakingLedgerTo223',
    Votes: 'VotesTo230',
    Weight: 'u32'
  }
}, {
  minmax: [1032, 1042],
  types: {
    Address: 'LookupSource',
    BalanceLock: 'BalanceLockTo212',
    CompactAssignments: 'CompactAssignmentsTo257',
    DispatchInfo: 'DispatchInfoTo244',
    Keys: 'SessionKeys5',
    Multiplier: 'Fixed64',
    OpenTip: 'OpenTipTo225',
    ReferendumInfo: 'ReferendumInfoTo239',
    RewardDestination: 'RewardDestinationTo257',
    SlashingSpans: 'SlashingSpansTo204',
    StakingLedger: 'StakingLedgerTo223',
    Votes: 'VotesTo230',
    Weight: 'u32'
  }
}, {
  // actual at 1045 (1043-1044 is dev)
  minmax: [1043, 1045],
  types: {
    Address: 'LookupSource',
    BalanceLock: 'BalanceLockTo212',
    CompactAssignments: 'CompactAssignmentsTo257',
    DispatchInfo: 'DispatchInfoTo244',
    Keys: 'SessionKeys5',
    Multiplier: 'Fixed64',
    OpenTip: 'OpenTipTo225',
    ReferendumInfo: 'ReferendumInfoTo239',
    RewardDestination: 'RewardDestinationTo257',
    StakingLedger: 'StakingLedgerTo223',
    Votes: 'VotesTo230',
    Weight: 'u32'
  }
}, {
  minmax: [1046, 1054],
  types: _objectSpread(_objectSpread({}, sharedTypes), {}, {
    CompactAssignments: 'CompactAssignmentsTo257',
    DispatchInfo: 'DispatchInfoTo244',
    Multiplier: 'Fixed64',
    OpenTip: 'OpenTipTo225',
    ReferendumInfo: 'ReferendumInfoTo239',
    RewardDestination: 'RewardDestinationTo257',
    StakingLedger: 'StakingLedgerTo240',
    Weight: 'u32'
  })
}, {
  minmax: [1055, 1056],
  types: _objectSpread(_objectSpread({}, sharedTypes), {}, {
    CompactAssignments: 'CompactAssignmentsTo257',
    DispatchInfo: 'DispatchInfoTo244',
    Multiplier: 'Fixed64',
    OpenTip: 'OpenTipTo225',
    RewardDestination: 'RewardDestinationTo257',
    StakingLedger: 'StakingLedgerTo240',
    Weight: 'u32'
  })
}, {
  minmax: [1057, 1061],
  types: _objectSpread(_objectSpread({}, sharedTypes), {}, {
    CompactAssignments: 'CompactAssignmentsTo257',
    DispatchInfo: 'DispatchInfoTo244',
    OpenTip: 'OpenTipTo225',
    RewardDestination: 'RewardDestinationTo257'
  })
}, {
  minmax: [1062, 2012],
  types: _objectSpread(_objectSpread({}, sharedTypes), {}, {
    CompactAssignments: 'CompactAssignmentsTo257',
    OpenTip: 'OpenTipTo225',
    RewardDestination: 'RewardDestinationTo257'
  })
}, {
  minmax: [2013, 2022],
  types: _objectSpread(_objectSpread({}, sharedTypes), {}, {
    CompactAssignments: 'CompactAssignmentsTo257',
    RewardDestination: 'RewardDestinationTo257'
  })
}, {
  minmax: [2023, undefined],
  types: _objectSpread({}, sharedTypes)
}];
var _default = versioned;
exports.default = _default;