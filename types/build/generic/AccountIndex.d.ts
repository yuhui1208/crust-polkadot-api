import { AnyNumber, Registry } from '../types';
import BN from 'bn.js';
import U32 from '../primitive/U32';
export declare const ENUMSET_SIZE: BN;
/**
 * @name AccountIndex
 * @description
 * A wrapper around an AccountIndex, which is a shortened, variable-length encoding
 * for an Account. We extends from [[U32]] to provide the number-like properties.
 */
export default class AccountIndex extends U32 {
    constructor(registry: Registry, value?: AnyNumber);
    static calcLength(_value: BN | number): number;
    static readLength(input: Uint8Array): [number, number];
    static writeLength(input: Uint8Array): Uint8Array;
    /**
     * @description Compares the value of the input to see if there is a match
     */
    eq(other?: unknown): boolean;
    /**
     * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
     */
    toHuman(): string;
    /**
     * @description Converts the Object to JSON, typically used for RPC transfers
     */
    toJSON(): string;
    /**
     * @description Returns the string representation of the value
     */
    toString(): string;
    /**
     * @description Returns the base runtime type name for this instance
     */
    toRawType(): string;
}
