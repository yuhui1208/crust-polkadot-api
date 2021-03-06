import { Registry } from '@polkadot/types/types';
import { ProviderInterface, ProviderInterfaceEmitted, ProviderInterfaceEmitCb } from '../types';
import { MockStateSubscriptions } from './types';
/**
 * A mock provider mainly used for testing.
 * @return {ProviderInterface} The mock provider
 * @internal
 */
export default class Mock implements ProviderInterface {
    private db;
    private emitter;
    isUpdating: boolean;
    private registry;
    private prevNumber;
    private requests;
    subscriptions: MockStateSubscriptions;
    private subscriptionId;
    private subscriptionMap;
    constructor(registry: Registry);
    get hasSubscriptions(): boolean;
    clone(): Mock;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    get isConnected(): boolean;
    on(type: ProviderInterfaceEmitted, sub: ProviderInterfaceEmitCb): () => void;
    send(method: string, params: any[]): Promise<unknown>;
    subscribe(type: string, method: string, ...params: unknown[]): Promise<number>;
    unsubscribe(type: string, method: string, id: number): Promise<boolean>;
    private init;
    private makeBlockHeader;
    private setStateBn;
    private updateSubs;
}
