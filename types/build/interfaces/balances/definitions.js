"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// order important in structs... :)

/* eslint-disable sort-keys */
var _default = {
  rpc: {},
  types: {
    AccountData: {
      free: 'Balance',
      reserved: 'Balance',
      miscFrozen: 'Balance',
      feeFrozen: 'Balance'
    },
    BalanceLockTo212: {
      id: 'LockIdentifier',
      amount: 'Balance',
      until: 'BlockNumber',
      reasons: 'WithdrawReasons'
    },
    BalanceLock: {
      id: 'LockIdentifier',
      amount: 'Balance',
      reasons: 'Reasons'
    },
    BalanceStatus: {
      _enum: ['Free', 'Reserved']
    },
    Reasons: {
      _enum: ['Fee', 'Misc', 'All']
    },
    VestingSchedule: {
      offset: 'Balance',
      perBlock: 'Balance',
      startingBlock: 'BlockNumber'
    },
    WithdrawReasons: {
      _set: {
        TransactionPayment: 0b00000001,
        Transfer: 0b00000010,
        Reserve: 0b00000100,
        Fee: 0b00001000,
        Tip: 0b00010000
      }
    }
  }
};
exports.default = _default;