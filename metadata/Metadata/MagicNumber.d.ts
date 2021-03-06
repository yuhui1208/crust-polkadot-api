import { AnyNumber, Registry } from '@polkadot/types/types';
import U32 from '@polkadot/types/primitive/U32';
export declare const MAGIC_NUMBER = 1635018093;
export default class MagicNumber extends U32 {
    constructor(registry: Registry, value?: AnyNumber);
}
