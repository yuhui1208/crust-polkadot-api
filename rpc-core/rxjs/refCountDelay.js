"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.refCountDelay = refCountDelay;

var _rxjs = require("rxjs");

// Copyright 2017-2020 @polkadot/rpc-core authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/** @internal */
function refCountDelay(delay = 1750) {
  return source => {
    // state: 0 = disconnected, 1 = disconnecting, 2 = connecting, 3 = connected
    let [state, refCount, connection, scheduler] = [0, 0, _rxjs.Subscription.EMPTY, _rxjs.Subscription.EMPTY];
    return new _rxjs.Observable(ob => {
      source.subscribe(ob);

      if (refCount++ === 0) {
        if (state === 1) {
          scheduler.unsubscribe();
        } else {
          connection = source.connect();
        }

        state = 3;
      }

      return () => {
        if (--refCount === 0) {
          if (state === 2) {
            state = 0;
            scheduler.unsubscribe();
          } else {
            // state === 3
            state = 1;
            scheduler = _rxjs.asapScheduler.schedule(() => {
              state = 0;
              connection.unsubscribe();
            }, delay);
          }
        }
      };
    });
  };
}