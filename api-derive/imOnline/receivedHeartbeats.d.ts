import { DeriveHeartbeats } from '../types';
import { Observable } from 'rxjs';
import { ApiInterfaceRx } from '@polkadot/api/types';
/**
 * @description Return a boolean array indicating whether the passed accounts had received heartbeats in the current session
 */
export declare function receivedHeartbeats(instanceId: string, api: ApiInterfaceRx): () => Observable<DeriveHeartbeats>;
