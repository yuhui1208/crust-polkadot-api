"use strict";

var _registry = require("@polkadot/types/create/registry");

var _ = require("./");

// Copyright 2017-2020 @polkadot/types-known authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const registry = new _registry.TypeRegistry();
registry.setKnownTypes({
  typesAlias: {
    identity: {
      Id: 'IdentityId'
    },
    testModule: {
      Proposal: 'TestProposal'
    },
    treasury: {
      Proposal: 'TreasuryProposals2'
    }
  }
});
describe('getModuleTypes', () => {
  it('collects the pre-defined types for contracts', () => {
    expect((0, _.getModuleTypes)(registry, 'contracts')).toEqual({
      StorageKey: 'ContractStorageKey'
    });
  });
  it('collects the user-defined types for testModule', () => {
    expect((0, _.getModuleTypes)(registry, 'testModule')).toEqual({
      Proposal: 'TestProposal'
    });
  });
  it('overrides pre-defined with user-defined for treasury', () => {
    expect((0, _.getModuleTypes)(registry, 'treasury')).toEqual({
      Proposal: 'TreasuryProposals2'
    });
  });
  it('merges pre-defined and user-defined for identity', () => {
    expect((0, _.getModuleTypes)(registry, 'identity')).toEqual({
      Id: 'IdentityId',
      Judgement: 'IdentityJudgement'
    });
  });
});