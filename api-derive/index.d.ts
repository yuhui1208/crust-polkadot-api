import { ApiInterfaceRx } from '@polkadot/api/types';
import { AnyFunction } from '@polkadot/types/types';
import { Observable } from 'rxjs';
import * as accounts from './accounts';
import * as balances from './balances';
import * as chain from './chain';
import * as contracts from './contracts';
import * as council from './council';
import * as democracy from './democracy';
import * as elections from './elections';
import * as imOnline from './imOnline';
import * as parachains from './parachains';
import * as session from './session';
import * as society from './society';
import * as staking from './staking';
import * as technicalCommittee from './technicalCommittee';
import * as treasury from './treasury';
import * as tx from './tx';
export * from './type';
export declare const derive: {
    accounts: typeof accounts;
    balances: typeof balances;
    chain: typeof chain;
    contracts: typeof contracts;
    council: typeof council;
    democracy: typeof democracy;
    elections: typeof elections;
    imOnline: typeof imOnline;
    parachains: typeof parachains;
    session: typeof session;
    society: typeof society;
    staking: typeof staking;
    technicalCommittee: typeof technicalCommittee;
    treasury: typeof treasury;
    tx: typeof tx;
};
declare type DeriveSection<Section> = {
    [Method in keyof Section]: Section[Method] extends AnyFunction ? ReturnType<Section[Method]> : never;
};
declare type DeriveAllSections<AllSections> = {
    [Section in keyof AllSections]: DeriveSection<AllSections[Section]>;
};
export declare type DeriveCustom = Record<string, Record<string, (instanceId: string, api: ApiInterfaceRx) => (...args: any[]) => Observable<any>>>;
export declare type ExactDerive = DeriveAllSections<typeof derive>;
/** @internal */
export default function decorateDerive(instanceId: string, api: ApiInterfaceRx, custom?: DeriveCustom): ExactDerive;
