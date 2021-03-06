"use strict";

var _types = require("./types");

var _ = require(".");

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
describe('getTypeDef', () => {
  it('does not allow invalid tuples, end )', () => {
    expect(() => (0, _.getTypeDef)('(u64, u32')).toThrow(/Expected '\(' closing with '\)'/);
  });
  it('does not allow invalid vectors, end >', () => {
    expect(() => (0, _.getTypeDef)('Vec<u64')).toThrow(/Unable to find closing matching/);
  });
  it('maps empty tuples to empty tuple', () => {
    expect((0, _.getTypeDef)('()')).toEqual({
      info: _types.TypeDefInfo.Tuple,
      sub: [],
      type: '()'
    });
  });
  it('properly decodes a BTreeMap<u32, Text>', () => {
    expect((0, _.getTypeDef)('BTreeMap<u32, Text>')).toEqual({
      info: _types.TypeDefInfo.BTreeMap,
      sub: [{
        info: _types.TypeDefInfo.Plain,
        type: 'u32'
      }, {
        info: _types.TypeDefInfo.Plain,
        type: 'Text'
      }],
      type: 'BTreeMap<u32,Text>'
    });
  });
  it('properly decodes a BTreeSet<Text>', () => {
    expect((0, _.getTypeDef)('BTreeSet<Text>')).toEqual({
      info: _types.TypeDefInfo.BTreeSet,
      sub: {
        info: _types.TypeDefInfo.Plain,
        type: 'Text'
      },
      type: 'BTreeSet<Text>'
    });
  });
  it('properly decodes a Result<u32, Text>', () => {
    expect((0, _.getTypeDef)('Result<u32, Text>')).toEqual({
      info: _types.TypeDefInfo.Result,
      sub: [{
        info: _types.TypeDefInfo.Plain,
        type: 'u32'
      }, {
        info: _types.TypeDefInfo.Plain,
        type: 'Text'
      }],
      type: 'Result<u32,Text>'
    });
  });
  it('properly decodes a Result<Result<(), u32>, Text>', () => {
    expect((0, _.getTypeDef)('Result<Result<Null,u32>,Text>')).toEqual({
      info: _types.TypeDefInfo.Result,
      sub: [{
        info: _types.TypeDefInfo.Result,
        sub: [{
          info: _types.TypeDefInfo.Plain,
          type: 'Null'
        }, {
          info: _types.TypeDefInfo.Plain,
          type: 'u32'
        }],
        type: 'Result<Null,u32>'
      }, {
        info: _types.TypeDefInfo.Plain,
        type: 'Text'
      }],
      type: 'Result<Result<Null,u32>,Text>'
    });
  });
  it('returns a type structure', () => {
    expect((0, _.getTypeDef)('(u32, Compact<u32>, Vec<u64>, Option<u128>, (Text,Vec<(Bool,u128)>))')).toEqual({
      info: _types.TypeDefInfo.Tuple,
      sub: [{
        info: _types.TypeDefInfo.Plain,
        type: 'u32'
      }, {
        info: _types.TypeDefInfo.Compact,
        sub: {
          info: _types.TypeDefInfo.Plain,
          type: 'u32'
        },
        type: 'Compact<u32>'
      }, {
        info: _types.TypeDefInfo.Vec,
        sub: {
          info: _types.TypeDefInfo.Plain,
          type: 'u64'
        },
        type: 'Vec<u64>'
      }, {
        info: _types.TypeDefInfo.Option,
        sub: {
          info: _types.TypeDefInfo.Plain,
          type: 'u128'
        },
        type: 'Option<u128>'
      }, {
        info: _types.TypeDefInfo.Tuple,
        sub: [{
          info: _types.TypeDefInfo.Plain,
          type: 'Text'
        }, {
          info: _types.TypeDefInfo.Vec,
          sub: {
            info: _types.TypeDefInfo.Tuple,
            sub: [{
              info: _types.TypeDefInfo.Plain,
              type: 'Bool'
            }, {
              info: _types.TypeDefInfo.Plain,
              type: 'u128'
            }],
            type: '(Bool,u128)'
          },
          type: 'Vec<(Bool,u128)>'
        }],
        type: '(Text,Vec<(Bool,u128)>)'
      }],
      type: '(u32,Compact<u32>,Vec<u64>,Option<u128>,(Text,Vec<(Bool,u128)>))'
    });
  });
  it('returns a type structure (sanitized)', () => {
    expect((0, _.getTypeDef)('Vec<(Box<PropIndex>, Proposal,Lookup::Target)>')).toEqual({
      info: _types.TypeDefInfo.Vec,
      sub: {
        info: _types.TypeDefInfo.Tuple,
        sub: [{
          info: _types.TypeDefInfo.Plain,
          type: 'PropIndex'
        }, {
          info: _types.TypeDefInfo.Plain,
          type: 'Proposal'
        }, {
          info: _types.TypeDefInfo.Plain,
          type: 'LookupTarget'
        }],
        type: '(PropIndex,Proposal,LookupTarget)'
      },
      type: 'Vec<(PropIndex,Proposal,LookupTarget)>'
    });
  });
  it('returns a type structure (actual)', () => {
    expect((0, _.getTypeDef)('Vec<(PropIndex, Proposal, AccountId)>')).toEqual({
      info: _types.TypeDefInfo.Vec,
      sub: {
        info: _types.TypeDefInfo.Tuple,
        sub: [{
          info: _types.TypeDefInfo.Plain,
          type: 'PropIndex'
        }, {
          info: _types.TypeDefInfo.Plain,
          type: 'Proposal'
        }, {
          info: _types.TypeDefInfo.Plain,
          type: 'AccountId'
        }],
        type: '(PropIndex,Proposal,AccountId)'
      },
      type: 'Vec<(PropIndex,Proposal,AccountId)>'
    });
  });
  it('returns an actual Struct', () => {
    expect((0, _.getTypeDef)('{"balance":"Balance","account_id":"AccountId","log":"(u64, Signature)"}')).toEqual({
      info: _types.TypeDefInfo.Struct,
      sub: [{
        info: _types.TypeDefInfo.Plain,
        name: 'balance',
        type: 'Balance'
      }, {
        info: _types.TypeDefInfo.Plain,
        name: 'account_id',
        type: 'AccountId'
      }, {
        info: _types.TypeDefInfo.Tuple,
        name: 'log',
        sub: [{
          info: _types.TypeDefInfo.Plain,
          type: 'u64'
        }, {
          info: _types.TypeDefInfo.Plain,
          type: 'Signature'
        }],
        type: '(u64,Signature)'
      }],
      type: '{"balance":"Balance","account_id":"AccountId","log":"(u64,Signature)"}'
    });
  }); // FIXME - not handled atm

  it.skip('creates a nested fixed vec', () => {
    expect((0, _.getTypeDef)('[[u8;32];3]')).toEqual({
      ext: {
        length: 3,
        type: '[u8;32]'
      },
      info: _types.TypeDefInfo.VecFixed,
      sub: {
        ext: {
          length: 32
        },
        info: _types.TypeDefInfo.VecFixed,
        sub: {
          info: _types.TypeDefInfo.Plain,
          type: 'u8'
        },
        type: '[u8;32]'
      },
      type: '[[u8;32];3]'
    });
  });
  it('creates recursive structures', () => {
    const registry = new _.TypeRegistry();
    registry.register({
      Recursive: {
        data: 'Vec<Recursive>'
      }
    });
    const raw = registry.createType('Recursive').toRawType();
    expect((0, _.getTypeDef)(raw)).toEqual({
      info: _types.TypeDefInfo.Struct,
      sub: [{
        info: _types.TypeDefInfo.Vec,
        name: 'data',
        sub: {
          info: _types.TypeDefInfo.Plain,
          type: 'Recursive'
        },
        type: 'Vec<Recursive>'
      }],
      type: '{"data":"Vec<Recursive>"}'
    });
  });
});