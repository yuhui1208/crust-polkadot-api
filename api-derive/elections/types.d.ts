import { AccountId, Balance, BlockNumber, SetIndex, VoteIndex } from '@polkadot/types/interfaces';
import { u32 } from '@polkadot/types';
export interface DeriveElectionsInfo {
    candidates: AccountId[];
    candidateCount: u32;
    candidacyBond?: Balance;
    desiredRunnersUp: u32;
    desiredSeats: u32;
    members: [AccountId, Balance][];
    nextVoterSet?: SetIndex;
    runnersUp: [AccountId, Balance][];
    termDuration: BlockNumber;
    voteCount?: VoteIndex;
    voterCount?: SetIndex;
    votingBond?: Balance;
}
