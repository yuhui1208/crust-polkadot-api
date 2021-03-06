import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { DefinitionRpc, DefinitionRpcExt, DefinitionRpcSub, Registry } from '@polkadot/types/types';
import { RpcInterface } from './types';
/**
 * @name Rpc
 * @summary The API may use a HTTP or WebSockets provider.
 * @description It allows for querying a Polkadot Client Node.
 * WebSockets provider is recommended since HTTP provider only supports basic querying.
 *
 * ```mermaid
 * graph LR;
 *   A[Api] --> |WebSockets| B[WsProvider];
 *   B --> |endpoint| C[ws://127.0.0.1:9944]
 * ```
 *
 * @example
 * <BR>
 *
 * ```javascript
 * import Rpc from '@polkadot/rpc-core';
 * import WsProvider from '@polkadot/rpc-provider/ws';
 *
 * const provider = new WsProvider('ws://127.0.0.1:9944');
 * const rpc = new Rpc(provider);
 * ```
 */
export default class Rpc implements RpcInterface {
    #private;
    readonly mapping: Map<string, DefinitionRpcExt>;
    readonly provider: ProviderInterface;
    readonly sections: string[];
    readonly author: RpcInterface['author'];
    readonly babe: RpcInterface['babe'];
    readonly chain: RpcInterface['chain'];
    readonly childstate: RpcInterface['childstate'];
    readonly contracts: RpcInterface['contracts'];
    readonly engine: RpcInterface['engine'];
    readonly grandpa: RpcInterface['grandpa'];
    readonly offchain: RpcInterface['offchain'];
    readonly payment: RpcInterface['payment'];
    readonly rpc: RpcInterface['rpc'];
    readonly state: RpcInterface['state'];
    readonly system: RpcInterface['system'];
    /**
     * @constructor
     * Default constructor for the Api Object
     * @param  {ProviderInterface} provider An API provider using HTTP or WebSocket
     */
    constructor(instanceId: string, registry: Registry, provider: ProviderInterface, userRpc?: Record<string, Record<string, DefinitionRpc | DefinitionRpcSub>>);
    /**
     * @description Returns the connected status of a provider
     */
    get isConnected(): boolean;
    /**
     * @description Manually connect from the attached provider
     */
    connect(): Promise<void>;
    /**
     * @description Manually disconnect from the attached provider
     */
    disconnect(): Promise<void>;
    /**
     * @description Sets a registry swap (typically from Api)
     */
    setRegistrySwap(registrySwap: (blockHash: string | Uint8Array) => Promise<{
        registry: Registry;
    }>): void;
    addUserInterfaces<Section extends keyof RpcInterface>(userRpc: Record<string, Record<string, DefinitionRpc | DefinitionRpcSub>>): void;
    private _createInterface;
    private _createMethodWithRaw;
    private _createMethodSend;
    private _createSubscriber;
    private _createMethodSubscribe;
    private _formatInputs;
    private _treatAsHex;
    private _formatOutput;
    private _formatStorageData;
    private _formatStorageSet;
    private _formatStorageSetEntry;
}
