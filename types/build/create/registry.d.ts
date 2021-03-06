import { ChainProperties, DispatchErrorModule } from '../interfaces/types';
import { CallFunction, Codec, Constructor, InterfaceTypes, RegistryError, RegistryTypes, Registry, RegistryMetadata, RegisteredTypes } from '../types';
import { EventData } from '../generic/Event';
export declare class TypeRegistry implements Registry {
    #private;
    constructor();
    get chainDecimals(): number;
    get chainSS58(): number | undefined;
    get chainToken(): string;
    get knownTypes(): RegisteredTypes;
    get signedExtensions(): string[];
    /**
     * @describe Creates an instance of the class
     */
    createClass<K extends keyof InterfaceTypes>(type: K): Constructor<InterfaceTypes[K]>;
    /**
     * @description Creates an instance of a type as registered
     */
    createType<K extends keyof InterfaceTypes>(type: K, ...params: unknown[]): InterfaceTypes[K];
    findMetaCall(callIndex: Uint8Array): CallFunction;
    findMetaError(errorIndex: Uint8Array | DispatchErrorModule): RegistryError;
    findMetaEvent(eventIndex: Uint8Array): Constructor<EventData>;
    get<T extends Codec = Codec>(name: string, withUnknown?: boolean): Constructor<T> | undefined;
    getChainProperties(): ChainProperties | undefined;
    getClassName(clazz: Constructor): string | undefined;
    getDefinition(name: string): string | undefined;
    getOrThrow<T extends Codec = Codec>(name: string, msg?: string): Constructor<T>;
    getOrUnknown<T extends Codec = Codec>(name: string): Constructor<T>;
    getSignedExtensionExtra(): Record<string, keyof InterfaceTypes>;
    getSignedExtensionTypes(): Record<string, keyof InterfaceTypes>;
    hasClass(name: string): boolean;
    hasDef(name: string): boolean;
    hasType(name: string): boolean;
    hash(data: Uint8Array): Uint8Array;
    register(type: Constructor | RegistryTypes): void;
    register(name: string, type: Constructor): void;
    private _registerObject;
    setChainProperties(properties?: ChainProperties): void;
    setHasher(hasher?: (data: Uint8Array) => Uint8Array): void;
    setKnownTypes(knownTypes: RegisteredTypes): void;
    setMetadata(metadata: RegistryMetadata, signedExtensions?: string[]): void;
    setSignedExtensions(signedExtensions?: string[]): void;
}
