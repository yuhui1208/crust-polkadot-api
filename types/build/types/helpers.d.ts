import { Codec } from './codec';
import BN from 'bn.js';
export declare type AnyFunction = (...args: any[]) => any;
export declare type AnyJson = string | number | boolean | null | undefined | AnyJsonArray | {
    [index: string]: AnyJson;
};
interface AnyJsonArray extends Array<AnyJson> {
}
export declare type AnyNumber = BN | BigInt | Uint8Array | number | string;
export declare type AnyString = string | string;
export declare type AnyU8a = Uint8Array | number[] | string;
export declare type ArrayElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<infer ElementType> ? ElementType : never;
export declare type BareOpts = boolean | Record<string, boolean>;
export declare type Callback<T, E = undefined> = E extends Codec ? (result: T, extra: E) => void | Promise<void> : (result: T) => void | Promise<void>;
export {};
