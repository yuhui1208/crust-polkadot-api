import { ApiInterfaceRx } from '@polkadot/api/types';
import { EraIndex } from '@polkadot/types/interfaces';
import { DeriveEraPoints, DeriveEraPrefs, DeriveEraRewards, DeriveStakerReward } from '../types';
import BN from 'bn.js';
import { Observable } from 'rxjs';
declare type ErasResult = [{
    unwrapOr: (value: BN) => BN;
}, DeriveEraPoints[], DeriveEraPrefs[], DeriveEraRewards[]];
export declare function _stakerRewardsEras(instanceId: string, api: ApiInterfaceRx): (eras: EraIndex[], withActive: boolean) => Observable<ErasResult>;
export declare function _stakerRewards(instanceId: string, api: ApiInterfaceRx): (accountId: Uint8Array | string, eras: EraIndex[], withActive: boolean) => Observable<DeriveStakerReward[]>;
export declare function stakerRewards(instanceId: string, api: ApiInterfaceRx): (accountId: Uint8Array | string, withActive?: boolean) => Observable<DeriveStakerReward[]>;
export declare function stakerRewardsMultiEras(instanceId: string, api: ApiInterfaceRx): (accountIds: (Uint8Array | string)[], eras: EraIndex[]) => Observable<DeriveStakerReward[][]>;
export declare function stakerRewardsMulti(instanceId: string, api: ApiInterfaceRx): (accountIds: (Uint8Array | string)[], withActive?: boolean) => Observable<DeriveStakerReward[][]>;
export {};
