import { Storage } from '@polkadot/metadata/Decorated/types';
import { RpcInterface } from '@polkadot/rpc-core/types';
import { Hash, RuntimeVersion } from '@polkadot/types/interfaces';
import { AnyFunction, InterfaceTypes, ModulesWithCalls, Registry, RegistryTypes } from '@polkadot/types/types';
import { ApiInterfaceRx, ApiOptions, ApiTypes, DecorateMethod, DecoratedRpc, QueryableConsts, QueryableStorage, QueryableStorageMulti, SubmittableExtrinsics } from '../types';
import BN from 'bn.js';
import { BehaviorSubject } from 'rxjs';
import { ExactDerive } from '@polkadot/api-derive';
import RpcCore from '@polkadot/rpc-core';
import { Metadata, Text } from '@polkadot/types';
import { DeriveAllSections } from '../util/decorate';
import Events from './Events';
export default abstract class Decorate<ApiType extends ApiTypes> extends Events {
    #private;
    protected __phantom: BN;
    protected _consts: QueryableConsts<ApiType>;
    protected _derive?: ReturnType<Decorate<ApiType>['_decorateDerive']>;
    protected _extrinsics?: SubmittableExtrinsics<ApiType>;
    protected _extrinsicType: number;
    protected _genesisHash?: Hash;
    protected _isConnected: BehaviorSubject<boolean>;
    protected _isReady: boolean;
    protected readonly _options: ApiOptions;
    protected _query: QueryableStorage<ApiType>;
    protected _queryMulti?: QueryableStorageMulti<ApiType>;
    protected _rpc?: DecoratedRpc<ApiType, RpcInterface>;
    protected _rpcCore: RpcCore;
    protected _runtimeChain?: Text;
    protected _runtimeMetadata?: Metadata;
    protected _runtimeVersion?: RuntimeVersion;
    protected _rx: ApiInterfaceRx;
    protected _type: ApiTypes;
    /**
     * This is the one and only method concrete children classes need to implement.
     * It's a higher-order function, which takes one argument
     * `method: Method extends (...args: any[]) => Observable<any>`
     * (and one optional `options`), and should return the user facing method.
     * For example:
     * - For ApiRx, `decorateMethod` should just be identity, because the input
     * function is already an Observable
     * - For ApiPromise, `decorateMethod` should return a function that takes all
     * the parameters from `method`, adds an optional `callback` argument, and
     * returns a Promise.
     *
     * We could easily imagine other user-facing interfaces, which are simply
     * implemented by transforming the Observable to Stream/Iterator/Kefir/Bacon
     * via `decorateMethod`.
     */
    protected _decorateMethod: DecorateMethod<ApiType>;
    /**
     * @description Create an instance of the class
     *
     * @param options Options object to create API instance or a Provider instance
     *
     * @example
     * <BR>
     *
     * ```javascript
     * import Api from '@polkadot/api/promise';
     *
     * const api = new Api().isReady();
     *
     * api.rpc.subscribeNewHeads((header) => {
     *   console.log(`new block #${header.number.toNumber()}`);
     * });
     * ```
     */
    constructor(options: ApiOptions, type: ApiTypes, decorateMethod: DecorateMethod<ApiType>);
    /**
     * @description Return the current used registry
     */
    get registry(): Registry;
    /**
     * @description Creates an instance of a type as registered
     */
    createType<K extends keyof InterfaceTypes>(type: K, ...params: unknown[]): InterfaceTypes[K];
    /**
     * @description Register additional user-defined of chain-specific types in the type registry
     */
    registerTypes(types?: RegistryTypes): void;
    /**
     * @returns `true` if the API operates with subscriptions
     */
    get hasSubscriptions(): boolean;
    injectMetadata(metadata: Metadata, fromEmpty?: boolean, registry?: Registry): void;
    private _decorateFunctionMeta;
    protected _filterRpc(): Promise<void>;
    protected _filterRpcMethods(exposed: string[]): void;
    protected _decorateRpc<ApiType extends ApiTypes>(rpc: RpcCore, decorateMethod: DecorateMethod<ApiType>): DecoratedRpc<ApiType, RpcInterface>;
    protected _decorateMulti<ApiType extends ApiTypes>(decorateMethod: DecorateMethod<ApiType>): QueryableStorageMulti<ApiType>;
    protected _decorateExtrinsics<ApiType extends ApiTypes>(extrinsics: ModulesWithCalls, decorateMethod: DecorateMethod<ApiType>): SubmittableExtrinsics<ApiType>;
    private _decorateExtrinsicEntry;
    protected _decorateStorage<ApiType extends ApiTypes>(storage: Storage, decorateMethod: DecorateMethod<ApiType>): QueryableStorage<ApiType>;
    private _decorateStorageEntry;
    private _decorateStorageCall;
    private _decorateStorageRange;
    private _decorateStorageLinked;
    private _retrieveMapKeys;
    private _retrieveMapKeysPaged;
    private _retrieveMapEntries;
    private _retrieveMapEntriesPaged;
    protected _decorateDeriveRx(decorateMethod: DecorateMethod<ApiType>): DeriveAllSections<'rxjs', ExactDerive>;
    protected _decorateDerive(decorateMethod: DecorateMethod<ApiType>): DeriveAllSections<ApiType, ExactDerive>;
    /**
     * Put the `this.onCall` function of ApiRx here, because it is needed by
     * `api._rx`.
     */
    protected _rxDecorateMethod: <Method extends AnyFunction>(method: Method) => Method;
}
