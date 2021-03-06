import { FunctionArgumentMetadataLatest, FunctionMetadataLatest } from '../interfaces/metadata';
import { AnyJson, AnyU8a, ArgsDef, Codec, IMethod, Registry } from '../types';
import Struct from '../codec/Struct';
import U8aFixed from '../codec/U8aFixed';
/**
 * @name CallIndex
 * @description
 * A wrapper around the `[sectionIndex, methodIndex]` value that uniquely identifies a method
 */
export declare class CallIndex extends U8aFixed {
    constructor(registry: Registry, value?: AnyU8a);
}
/**
 * @name Call
 * @description
 * Extrinsic function descriptor, as defined in
 * {@link https://github.com/paritytech/wiki/blob/master/Extrinsic.md#the-extrinsic-format-for-node}.
 */
export default class Call extends Struct implements IMethod {
    protected _meta: FunctionMetadataLatest;
    constructor(registry: Registry, value: unknown, meta?: FunctionMetadataLatest);
    static filterOrigin(meta?: FunctionMetadataLatest): FunctionArgumentMetadataLatest[];
    /**
     * @description The arguments for the function call
     */
    get args(): Codec[];
    /**
     * @description The argument definitions
     */
    get argsDef(): ArgsDef;
    /**
     * @description The encoded `[sectionIndex, methodIndex]` identifier
     */
    get callIndex(): Uint8Array;
    /**
     * @description The encoded data
     */
    get data(): Uint8Array;
    /**
     * @description `true` if the `Origin` type is on the method (extrinsic method)
     */
    get hasOrigin(): boolean;
    /**
     * @description The [[FunctionMetadata]]
     */
    get meta(): FunctionMetadataLatest;
    /**
     * @description Returns the name of the method
     */
    get methodName(): string;
    /**
     * @description Returns the name of the method
     */
    get method(): string;
    /**
     * @description Returns the module containing the method
     */
    get sectionName(): string;
    /**
     * @description Returns the module containing the method
     */
    get section(): string;
    /**
     * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
     */
    toHuman(isExpanded?: boolean): AnyJson;
    /**
     * @description Returns the base runtime type name for this instance
     */
    toRawType(): string;
}
