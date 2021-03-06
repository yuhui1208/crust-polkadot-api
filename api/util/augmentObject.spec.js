"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _augmentObject = _interopRequireDefault(require("./augmentObject"));

// Copyright 2017-2020 @polkadot/api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
describe('augmentObject', () => {
  let spy;
  beforeEach(() => {
    spy = jest.spyOn(console, 'warn');
  });
  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    spy.mockClear();
  });
  it('logs added/removed sections and methods', () => {
    (0, _augmentObject.default)('test', {
      bar: {
        b: 1
      },
      foo: {
        d: 1,
        f: 1
      },
      new: {
        z: 1
      }
    }, {
      bar: {
        a: 1,
        c: 1
      },
      baz: {
        a: 1
      },
      foo: {
        c: 1,
        f: 1
      }
    });
    expect(spy).toHaveBeenCalledWith(expect.anything(), expect.stringContaining('API/AUGMENT'), 'api.test: Found 1 added and 1 removed modules:\n\t  added: new\n\tremoved: baz');
    expect(spy).toHaveBeenCalledWith(expect.anything(), expect.stringContaining('API/AUGMENT'), 'api.test: Found 2 added and 3 removed calls:\n\t  added: bar.b, foo.d\n\tremoved: bar.a, bar.c, foo.c');
  });
  it('copies sections to the dest', () => {
    const src = {
      bar: {
        b: 1
      },
      foo: {
        a: 1
      }
    };
    expect((0, _augmentObject.default)('test', src, {})).toEqual(src);
  });
  it('adds fields to existing sections', () => {
    const src = {
      bar: {
        b: 1
      },
      foo: {
        a: 1
      }
    };
    const dst = {
      baz: {
        c: 1
      },
      foo: {
        b: 2
      }
    };
    expect((0, _augmentObject.default)('test', src, dst)).toEqual({
      bar: {
        b: 1
      },
      baz: {
        c: 1
      },
      foo: {
        a: 1,
        b: 2
      }
    });
  });
});