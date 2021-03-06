import { Codec, InterfaceTypes, Registry } from '../types';
export declare function createTypeUnsafe<T extends Codec = Codec, K extends string = string>(registry: Registry, type: K, params?: any[], isPedantic?: boolean): T;
/**
 * Create an instance of a `type` with a given `params`.
 * @param type - A recognizable string representing the type to create an
 * instance from
 * @param params - The value to instantiate the type with
 */
export declare function createType<K extends keyof InterfaceTypes>(registry: Registry, type: K, ...params: any[]): InterfaceTypes[K];
