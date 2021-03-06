import { Codec, Registry } from '@polkadot/types/types';
/** @internal */
export declare function decodeLatestSubstrate<Modules extends Codec>(registry: Registry, version: number, rpcData: string, staticSubstrate: Record<string, unknown>): void;
/** @internal */
export declare function toLatest<Modules extends Codec>(registry: Registry, version: number, rpcData: string, withThrow?: boolean): void;
/** @internal */
export declare function defaultValues(registry: Registry, rpcData: string, withThrow?: boolean): void;
