import { Enum } from '@polkadot/types/codec';
/** @name StorageKind */
export interface StorageKind extends Enum {
    readonly isUnused: boolean;
    readonly isPersistent: boolean;
    readonly isLocal: boolean;
}
export declare type PHANTOM_OFFCHAIN = 'offchain';
