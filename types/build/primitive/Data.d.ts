import { H256 } from '../interfaces/runtime';
import { Registry } from '../types';
import Enum from '../codec/Enum';
import Bytes from './Bytes';
/**
 * @name Data
 * @description
 * A [[Data]] container with node, raw or hashed data
 */
export default class Data extends Enum {
    constructor(registry: Registry, value?: Record<string, any> | Uint8Array | Enum | string);
    get asRaw(): Bytes;
    get asSha256(): H256;
    get isRaw(): boolean;
    get isSha256(): boolean;
    /**
     * @description The encoded length
     */
    get encodedLength(): number;
    /**
     * @description Encodes the value as a Uint8Array as per the SCALE specifications
     */
    toU8a(): Uint8Array;
}
