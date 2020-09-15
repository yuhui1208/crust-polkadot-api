import { Codec, Constructor, InterfaceTypes, Registry } from '../types';
import AbstractArray from './AbstractArray';
/**
 * @name VecFixed
 * @description
 * This manages codec arrays of a fixed length
 */
export default class VecFixed<T extends Codec> extends AbstractArray<T> {
    private _Type;
    constructor(registry: Registry, Type: Constructor<T> | keyof InterfaceTypes, length: number, value?: VecFixed<any> | Uint8Array | string | any[]);
    /** @internal */
    static decodeVecFixed<T extends Codec>(registry: Registry, Type: Constructor<T>, allocLength: number, value: VecFixed<any> | Uint8Array | string | any[]): T[];
    static with<O extends Codec>(Type: Constructor<O> | keyof InterfaceTypes, length: number): Constructor<VecFixed<O>>;
    /**
     * @description The type for the items
     */
    get Type(): string;
    /**
     * @description The length of the value when encoded as a Uint8Array
     */
    get encodedLength(): number;
    toU8a(): Uint8Array;
    /**
     * @description Returns the base runtime type name for this instance
     */
    toRawType(): string;
}
