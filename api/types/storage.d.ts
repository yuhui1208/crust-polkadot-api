import { Observable } from 'rxjs';
import { u64 } from '@polkadot/types';
import { Hash } from '@polkadot/types/interfaces';
import { AnyFunction, Callback, Codec, CodecArg } from '@polkadot/types/types';
import StorageKey, { StorageEntry } from '@polkadot/types/primitive/StorageKey';
import { ApiTypes, MethodResult, ObsInnerType, PaginationOptions, PromiseOrObs, UnsubscribePromise } from './base';
interface StorageEntryObservableMulti {
    <T extends Codec>(args: (CodecArg[] | CodecArg)[]): Observable<T[]>;
}
interface StorageEntryPromiseMulti {
    <T extends Codec>(args: (CodecArg[] | CodecArg)[]): Promise<T[]>;
    <T extends Codec>(args: (CodecArg[] | CodecArg)[], callback: Callback<T[]>): UnsubscribePromise;
}
export interface StorageEntryPromiseOverloads {
    (arg1?: CodecArg, arg2?: CodecArg): Promise<Codec>;
    <T extends Codec>(arg1?: CodecArg, arg2?: CodecArg): Promise<T>;
    <T extends Codec>(callback: Callback<T>): UnsubscribePromise;
    <T extends Codec>(arg: CodecArg, callback: Callback<T>): UnsubscribePromise;
    <T extends Codec>(arg1: CodecArg, arg2: CodecArg, callback: Callback<T>): UnsubscribePromise;
}
declare type GenericStorageEntryFunction = (arg1?: CodecArg, arg2?: CodecArg) => Observable<Codec>;
export declare type QueryableStorageEntry<ApiType extends ApiTypes> = ApiType extends 'rxjs' ? AugmentedQuery<'rxjs', GenericStorageEntryFunction> : AugmentedQuery<'promise', GenericStorageEntryFunction> & StorageEntryPromiseOverloads;
export interface StorageEntryBase<ApiType extends ApiTypes, F extends AnyFunction> {
    at: <T extends Codec | any = ObsInnerType<ReturnType<F>>>(hash: Hash | Uint8Array | string, ...args: Parameters<F>) => PromiseOrObs<ApiType, T>;
    creator: StorageEntry;
    entries: <T extends Codec | any = ObsInnerType<ReturnType<F>>>(arg?: Parameters<F>[0]) => PromiseOrObs<ApiType, [StorageKey, T][]>;
    entriesPaged: <T extends Codec | any = ObsInnerType<ReturnType<F>>>(opts: PaginationOptions<Parameters<F>[0]>) => PromiseOrObs<ApiType, [StorageKey, T][]>;
    hash: (...args: Parameters<F>) => PromiseOrObs<ApiType, Hash>;
    key: (...args: Parameters<F>) => string;
    keyPrefix: () => string;
    keys: (arg?: any) => PromiseOrObs<ApiType, StorageKey[]>;
    keysPaged: (opts: PaginationOptions<Parameters<F>[0]>) => PromiseOrObs<ApiType, StorageKey[]>;
    range: <T extends Codec | any = ObsInnerType<ReturnType<F>>>([from, to]: [Hash | Uint8Array | string, Hash | Uint8Array | string | undefined] | [Hash | Uint8Array | string], ...args: Parameters<F>) => PromiseOrObs<ApiType, [Hash, T][]>;
    size: (...args: Parameters<F>) => PromiseOrObs<ApiType, u64>;
    multi: ApiType extends 'rxjs' ? StorageEntryObservableMulti : StorageEntryPromiseMulti;
}
export interface QueryableModuleStorage<ApiType extends ApiTypes> {
    [index: string]: QueryableStorageEntry<ApiType>;
}
export declare type QueryableStorageMultiArg<ApiType extends ApiTypes> = QueryableStorageEntry<ApiType> | [
    QueryableStorageEntry<ApiType>,
    ...CodecArg[]
];
export interface QueryableStorageMultiBase<ApiType extends ApiTypes> {
    <T extends Codec[]>(calls: QueryableStorageMultiArg<ApiType>[]): Observable<T>;
}
export interface QueryableStorageMultiPromise<ApiType extends ApiTypes> {
    <T extends Codec[]>(calls: QueryableStorageMultiArg<ApiType>[], callback: Callback<T>): UnsubscribePromise;
    <T extends Codec[]>(calls: QueryableStorageMultiArg<ApiType>[]): Promise<T>;
}
export declare type QueryableStorageMulti<ApiType extends ApiTypes> = ApiType extends 'rxjs' ? QueryableStorageMultiBase<ApiType> : QueryableStorageMultiPromise<ApiType>;
export interface AugmentedQueries<ApiType extends ApiTypes> {
}
export interface StorageEntryDoubleMap<ApiType extends ApiTypes, F extends AnyFunction> extends StorageEntryBase<ApiType, F> {
    keyPrefix: (key1?: Parameters<F>[0]) => string;
}
export declare type AugmentedQuery<ApiType extends ApiTypes, F extends AnyFunction> = MethodResult<ApiType, F> & StorageEntryBase<ApiType, F>;
export declare type AugmentedQueryDoubleMap<ApiType extends ApiTypes, F extends AnyFunction> = MethodResult<ApiType, F> & StorageEntryDoubleMap<ApiType, F>;
export {};
