import { H256 } from '../interfaces/runtime';
import { AnyJson, Codec, Registry } from '../types';
/**
 * @name AbstractArray
 * @description
 * This manages codec arrays. It is an extension to Array, providing
 * specific encoding/decoding on top of the base type.
 * @noInheritDoc
 */
export default abstract class AbstractArray<T extends Codec> extends Array<T> implements Codec {
    readonly registry: Registry;
    protected constructor(registry: Registry, ...values: T[]);
    /**
     * @description The length of the value when encoded as a Uint8Array
     */
    get encodedLength(): number;
    /**
     * @description returns a hash of the contents
     */
    get hash(): H256;
    /**
     * @description Checks if the value is an empty value
     */
    get isEmpty(): boolean;
    /**
     * @description The length of the value
     */
    get length(): number;
    /**
     * @description Compares the value of the input to see if there is a match
     */
    eq(other?: unknown): boolean;
    /**
     * @description Converts the Object to an standard JavaScript Array
     */
    toArray(): T[];
    /**
     * @description Returns a hex string representation of the value
     */
    toHex(): string;
    /**
     * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
     */
    toHuman(isExtended?: boolean): AnyJson;
    /**
     * @description Converts the Object to JSON, typically used for RPC transfers
     */
    toJSON(): AnyJson;
    /**
     * @description Returns the base runtime type name for this instance
     */
    abstract toRawType(): string;
    /**
     * @description Returns the string representation of the value
     */
    toString(): string;
    /**
     * @description Encodes the value as a Uint8Array as per the SCALE specifications
     * @param isBare true when the value has none of the type-specific prefixes (internal)
     */
    toU8a(isBare?: boolean): Uint8Array;
    /**
     * @description Concatenates two arrays
     */
    concat(other: T[]): T[];
    /**
     * @description Filters the array with the callback
     */
    filter(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: unknown): T[];
    /**
     * @description Maps the array with the callback
     */
    map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: unknown): U[];
    /**
     * @description Checks if the array includes a specific value
     */
    includes(check: unknown): boolean;
}
