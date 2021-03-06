import { H256 } from '../interfaces/runtime';
import { Codec, Registry } from '../types';
/**
 * @name Null
 * @description
 * Implements a type that does not contain anything (apart from `null`)
 */
export default class Null implements Codec {
    readonly registry: Registry;
    constructor(registry: Registry);
    /**
     * @description The length of the value when encoded as a Uint8Array
     */
    get encodedLength(): number;
    /**
     * @description returns a hash of the contents
     */
    get hash(): H256;
    /**
     * @description Checks if the value is an empty value (always true)
     */
    get isEmpty(): boolean;
    /**
     * @description Compares the value of the input to see if there is a match
     */
    eq(other?: unknown): boolean;
    /**
     * @description Returns a hex string representation of the value
     */
    toHex(): string;
    /**
     * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
     */
    toHuman(): null;
    /**
     * @description Converts the Object to JSON, typically used for RPC transfers
     */
    toJSON(): null;
    /**
     * @description Returns the base runtime type name for this instance
     */
    toRawType(): string;
    /**
     * @description Returns the string representation of the value
     */
    toString(): string;
    /**
     * @description Encodes the value as a Uint8Array as per the SCALE specifications
     * @param isBare true when the value has none of the type-specific prefixes (internal)
     */
    toU8a(isBare?: boolean): Uint8Array;
}
