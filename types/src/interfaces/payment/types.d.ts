import { Struct } from '@polkadot/types/codec';
import { Balance, Weight } from '@polkadot/types/interfaces/runtime';
import { DispatchClass } from '@polkadot/types/interfaces/system';
/** @name RuntimeDispatchInfo */
export interface RuntimeDispatchInfo extends Struct {
    readonly weight: Weight;
    readonly class: DispatchClass;
    readonly partialFee: Balance;
}
export declare type PHANTOM_PAYMENT = 'payment';
