import { H256 } from '../interfaces/runtime';
import { AnyNumber, Codec, Registry } from '../types';
import BN from 'bn.js';
export declare type UIntBitLength = 8 | 16 | 32 | 64 | 128 | 256;
export declare const DEFAULT_UINT_BITS = 64;
/**
 * @name AbstractInt
 * @ignore
 * @noInheritDoc
 */
export default abstract class AbstractInt extends BN implements Codec {
    #private;
    readonly registry: Registry;
    protected constructor(registry: Registry, isSigned: boolean, value?: AnyNumber, bitLength?: UIntBitLength, isHexJson?: boolean);
    /**
     * @description The length of the value when encoded as a Uint8Array
     */
    get encodedLength(): number;
    /**
     * @description returns a hash of the contents
     */
    get hash(): H256;
    /**
     * @description Checks if the value is a zero value (align elsewhere)
     */
    get isEmpty(): boolean;
    /**
     * @description Checks if the value is an unsigned type
     */
    get isUnsigned(): boolean;
    /**
     * @description Returns the number of bits in the value
     */
    bitLength(): number;
    /**
     * @description Compares the value of the input to see if there is a match
     */
    eq(other?: unknown): boolean;
    /**
     * @description True if this value is the max of the type
     */
    isMax(): boolean;
    /**
     * @description Returns a BigInt representation of the number
     */
    toBigInt(): BigInt;
    /**
     * @description Returns the BN representation of the number. (Compatibility)
     */
    toBn(): BN;
    /**
     * @description Returns a hex string representation of the value
     */
    toHex(isLe?: boolean): string;
    /**
     * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
     */
    toHuman(isExpanded?: boolean): string;
    /**
     * @description Converts the Object to JSON, typically used for RPC transfers
     */
    toJSON(): any;
    /**
     * @description Returns the base runtime type name for this instance
     */
    toRawType(): string;
    /**
     * @description Returns the string representation of the value
     * @param base The base to use for the conversion
     */
    toString(base?: number): string;
    /**
     * @description Encodes the value as a Uint8Array as per the SCALE specifications
     * @param isBare true when the value has none of the type-specific prefixes (internal)
     */
    toU8a(isBare?: boolean): Uint8Array;
}
