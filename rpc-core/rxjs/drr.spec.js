"use strict";

var _rxjs = require("rxjs");

var _drr = require("./drr");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
describe('drr', () => {
  it('should not fire twice the same value', done => {
    let count = 0;
    (0, _rxjs.of)(1, 1).pipe((0, _drr.drr)()).subscribe(() => {
      ++count;
    });
    setTimeout(() => {
      expect(count).toBe(1);
      done();
    }, 50);
  });
  it('should be a ReplaySubject(1)', done => {
    const obs = (0, _rxjs.timer)(0, 100).pipe((0, _drr.drr)()); // Starts at 0, increments every 100ms

    obs.subscribe(); // Fire the observable
    // Subscribe another time after some time, i.e. after the observable has fired

    setTimeout(() => {
      obs.subscribe(value => {
        expect(value > 1).toBe(true);
        done();
      });
    }, 500);
  });
});