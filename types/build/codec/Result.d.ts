import { Codec, Constructor, InterfaceTypes, Registry } from '../types';
import Enum from './Enum';
/**
 * @name Result
 * @description
 * A Result maps to the Rust Result type, that can either wrap a success or error value
 */
export default class Result<O extends Codec, E extends Codec> extends Enum {
    constructor(registry: Registry, Ok: Constructor<O> | keyof InterfaceTypes, Error: Constructor<E> | keyof InterfaceTypes, value?: unknown);
    static with<O extends Codec, E extends Codec>(Types: {
        Ok: Constructor<O> | keyof InterfaceTypes;
        Error: Constructor<E> | keyof InterfaceTypes;
    }): Constructor<Result<O, E>>;
    /**
     * @description Returns the wrapper Error value (if isError)
     */
    get asError(): E;
    /**
     * @description Returns the wrapper Ok value (if isOk)
     */
    get asOk(): O;
    /**
     * @description Checks if the Result has no value
     */
    get isEmpty(): boolean;
    /**
     * @description Checks if the Result wraps an Error value
     */
    get isError(): boolean;
    /**
     * @description Checks if the Result wraps an Ok value
     */
    get isOk(): boolean;
    /**
     * @description Returns the base runtime type name for this instance
     */
    toRawType(): string;
}
