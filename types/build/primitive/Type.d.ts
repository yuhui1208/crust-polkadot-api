import { Registry } from '../types';
import Text from './Text';
/**
 * @name Type
 * @description
 * This is a extended version of String, specifically to handle types. Here we rely fully
 * on what string provides us, however we also adjust the types received from the runtime,
 * i.e. we remove the `T::` prefixes found in some types for consistency across implementation.
 */
export default class Type extends Text {
    constructor(registry: Registry, value?: Text | Uint8Array | string);
    /**
     * @description Returns the base runtime type name for this instance
     */
    toRawType(): string;
}
