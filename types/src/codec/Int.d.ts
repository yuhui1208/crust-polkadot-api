import { AnyNumber, Constructor, Registry } from '../types';
import AbstractInt, { UIntBitLength } from './AbstractInt';
/**
 * @name Int
 * @description
 * A generic signed integer codec. For Substrate all numbers are Little Endian encoded,
 * this handles the encoding and decoding of those numbers. Upon construction
 * the bitLength is provided and any additional use keeps the number to this
 * length. This extends `BN`, so all methods available on a normal `BN` object
 * is available here.
 * @noInheritDoc
 */
export default class Int extends AbstractInt {
    constructor(registry: Registry, value?: AnyNumber, bitLength?: UIntBitLength, isHexJson?: boolean);
    static with(bitLength: UIntBitLength, typeName?: string): Constructor<Int>;
}
