"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.proposals = proposals;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _util = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function parseResult(_api, {
  allIds,
  allProposals,
  approvalIds,
  councilProposals,
  proposalCount
}) {
  const approvals = [];
  const proposals = [];
  const councilTreasury = councilProposals.filter(({
    proposal: {
      methodName,
      sectionName
    }
  }) => sectionName === 'treasury' && ['approveProposal', 'rejectProposal'].includes(methodName));
  allIds.forEach((id, index) => {
    if (allProposals[index].isSome) {
      const council = councilTreasury.filter(({
        proposal
      }) => id.eq(proposal.args[0])).sort((a, b) => a.proposal.methodName.localeCompare(b.proposal.methodName));
      const isApproval = approvalIds.some(approvalId => approvalId.eq(id));
      const derived = {
        council,
        id,
        proposal: allProposals[index].unwrap()
      };

      if (isApproval) {
        approvals.push(derived);
      } else {
        proposals.push(derived);
      }
    }
  });
  return {
    approvals,
    proposalCount,
    proposals
  };
}

function retrieveProposals(api, proposalCount, approvalIds) {
  const proposalIds = [];
  const count = proposalCount.toNumber();

  for (let index = 0; index < count; index++) {
    const isApproval = approvalIds.some(id => id.eqn(index));

    if (!isApproval) {
      proposalIds.push(api.registry.createType('ProposalIndex', index));
    }
  }

  const allIds = [...proposalIds, ...approvalIds];
  return (0, _rxjs.combineLatest)([api.query.treasury.proposals.multi(allIds), api.derive.council.proposals()]).pipe((0, _operators.map)(([allProposals, councilProposals]) => parseResult(api, {
    allIds,
    allProposals,
    approvalIds,
    councilProposals,
    proposalCount
  })));
}
/**
 * @description Retrieve all active and approved treasury proposals, along with their info
 */


function proposals(instanceId, api) {
  return (0, _util.memo)(instanceId, () => api.query.treasury ? (0, _rxjs.combineLatest)([api.query.treasury.proposalCount(), api.query.treasury.approvals()]).pipe((0, _operators.switchMap)(([proposalCount, approvalIds]) => retrieveProposals(api, proposalCount, approvalIds))) : (0, _rxjs.of)({
    approvals: [],
    proposalCount: api.registry.createType('ProposalIndex'),
    proposals: []
  }));
}