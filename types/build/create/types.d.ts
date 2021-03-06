import { Codec, InterfaceTypes } from '../types';
export declare type FromReg<T extends Codec, K extends string> = K extends keyof InterfaceTypes ? InterfaceTypes[K] : T;
export declare enum TypeDefInfo {
    BTreeMap = 0,
    BTreeSet = 1,
    Compact = 2,
    Enum = 3,
    Linkage = 4,
    Option = 5,
    Plain = 6,
    Result = 7,
    Set = 8,
    Struct = 9,
    Tuple = 10,
    Vec = 11,
    VecFixed = 12,
    HashMap = 13,
    Int = 14,
    UInt = 15,
    DoNotConstruct = 16,
    Null = 17
}
export interface TypeDefExtEnumDiscriminant {
    discriminant: number;
}
export interface TypeDef {
    alias?: Map<string, string>;
    info: TypeDefInfo;
    index?: number;
    displayName?: string;
    ext?: TypeDefExtEnumDiscriminant;
    length?: number;
    name?: string;
    namespace?: string;
    params?: TypeDef[];
    type: string;
    sub?: TypeDef | TypeDef[];
}
export declare type TypeIndex = number;
export declare type StringIndex = number;
export declare enum MetaTypeInfo {
    BuiltinPlain = 0,
    BuiltinTuple = 1,
    BuiltinVec = 2,
    BuiltinVecFixed = 3,
    Enum = 4,
    ClikeEnum = 5,
    Struct = 6,
    TupleStruct = 7,
    Null = 8
}
export declare type MetaTypeIdPrimitive = string;
export declare type MetaTypeIdTuple = TypeIndex[];
export interface MetaTypeIdCustom {
    'custom.name': StringIndex;
    'custom.namespace'?: StringIndex[];
    'custom.params'?: TypeIndex[];
}
export interface MetaTypeIdVec {
    'slice.type': TypeIndex;
}
export interface MetaTypeIdVecFixed {
    'array.len': number;
    'array.type': TypeIndex;
}
export declare type MetaTypeId = MetaTypeIdPrimitive | MetaTypeIdTuple | MetaTypeIdVec | MetaTypeIdVecFixed | MetaTypeIdCustom;
export interface MetaTypeDefClikeEnumVariant {
    name: StringIndex;
    discriminant: number;
}
export interface MetaTypeDefClikeEnum {
    'clike_enum.variants': MetaTypeDefClikeEnumVariant[];
}
export declare type MetaTypeDefBuiltIn = 'builtin';
export interface MetaTypeDefEnumVariantUnit {
    'unit_variant.name': StringIndex;
}
export interface MetaTypeDefEnumVariantTupleStruct {
    'tuple_struct_variant.name': StringIndex;
    'tuple_struct_variant.types': TypeIndex[];
}
export interface MetaTypeDefStructField {
    name: StringIndex;
    type: TypeIndex;
}
export interface MetaTypeDefEnumVariantStruct {
    'struct_variant.name': StringIndex;
    'struct_variant.fields': MetaTypeDefStructField[];
}
export declare type MetaTypeDefEnumVariant = MetaTypeDefEnumVariantUnit | MetaTypeDefEnumVariantTupleStruct | MetaTypeDefEnumVariantStruct;
export interface MetaTypeDefEnum {
    'enum.variants': MetaTypeDefEnumVariant[];
}
export declare type MetaTypeDefUnionField = MetaTypeDefStructField;
export interface MetaTypeDefStruct {
    'struct.fields': MetaTypeDefStructField[];
}
export interface MetaTypeDefTupleStruct {
    'tuple_struct.types': TypeIndex[];
}
export interface MetaTypeDefUnion {
    'union.fields': MetaTypeDefUnionField[];
}
export declare type MetaTypeDef = MetaTypeDefBuiltIn | MetaTypeDefClikeEnum | MetaTypeDefEnum | MetaTypeDefStruct | MetaTypeDefTupleStruct | MetaTypeDefUnion;
export interface MetaType {
    def: MetaTypeDef;
    id: MetaTypeId | null;
}
export declare enum MetaRegistryItem {
    String = 0,
    Type = 1,
    TypeDef = 2
}
export interface MetaRegistryJson {
    registry: {
        strings: string[];
        types: MetaType[];
    };
}
