import type { Observable } from 'rxjs';
import { AnyFunction, Callback, Codec, CodecArg } from '@polkadot/types/types';
export declare type Cons<V, T extends any[]> = ((v: V, ...t: T) => void) extends ((...r: infer R) => void) ? R : never;
export declare type Push<T extends any[], V> = ((Cons<any, Required<T>> extends infer R ? {
    [K in keyof R]: K extends keyof T ? T[K] : V;
} : never) extends infer P ? P extends any[] ? P : never : never);
export declare type ApiTypes = 'promise' | 'rxjs';
export declare type ObsInnerType<O extends Observable<any>> = O extends Observable<infer U> ? U : never;
export declare type VoidFn = () => void;
export declare type UnsubscribePromise = Promise<VoidFn>;
export declare type PromiseOrObs<ApiType extends ApiTypes, T> = ApiType extends 'rxjs' ? Observable<T> : Promise<T>;
export interface RxResult<F extends AnyFunction> {
    (...args: Parameters<F>): Observable<ObsInnerType<ReturnType<F>>>;
    <T>(...args: Parameters<F>): Observable<T>;
}
export interface PromiseResult<F extends AnyFunction> {
    (...args: Parameters<F>): Promise<ObsInnerType<ReturnType<F>>>;
    (...args: Push<Parameters<F>, Callback<ObsInnerType<ReturnType<F>>>>): UnsubscribePromise;
    <T extends Codec | Codec[]>(...args: Parameters<F>): Promise<T>;
    <T extends Codec | Codec[]>(...args: Push<Parameters<F>, Callback<T>>): UnsubscribePromise;
}
export declare type MethodResult<ApiType extends ApiTypes, F extends AnyFunction> = ApiType extends 'rxjs' ? RxResult<F> : PromiseResult<F>;
export interface DecorateMethodOptions {
    methodName?: string;
    overrideNoSub?: (...args: unknown[]) => Observable<Codec>;
}
export declare type DecorateFn<T extends Codec> = (...args: any[]) => Observable<T>;
export interface PaginationOptions<ArgType = CodecArg> {
    arg?: ArgType;
    pageSize: number;
    startKey?: string;
}
export declare type DecorateMethod<ApiType extends ApiTypes> = <Method extends (...args: any[]) => Observable<any>>(method: Method, options?: DecorateMethodOptions) => any;
