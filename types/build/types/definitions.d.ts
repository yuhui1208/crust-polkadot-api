export declare type DefinitionTypeType = string;
export declare type DefinitionTypeEnum = {
    _enum: DefinitionTypeType[];
} | {
    _enum: Record<string, DefinitionTypeType | null>;
};
export declare type DefinitionTypeSet = {
    _set: Record<string, number>;
};
export declare type DefinitionTypeStruct = Record<string, DefinitionTypeType> | {
    _alias?: Record<string, DefinitionTypeType>;
} & Record<string, unknown>;
export declare type DefinitionType = string | DefinitionTypeEnum | DefinitionTypeSet | DefinitionTypeStruct;
export interface DefinitionRpcParam {
    isCached?: boolean;
    isHistoric?: boolean;
    isOptional?: boolean;
    name: string;
    type: DefinitionTypeType;
}
export interface DefinitionRpc {
    alias?: string[];
    description: string;
    params: DefinitionRpcParam[];
    type: DefinitionTypeType;
}
export interface DefinitionRpcExt extends DefinitionRpc {
    isSubscription: boolean;
    jsonrpc: string;
    method: string;
    pubsub?: [string, string, string];
    section: string;
}
export interface DefinitionRpcSub extends DefinitionRpc {
    pubsub: [string, string, string];
}
export interface Definitions {
    rpc: Record<string, DefinitionRpc | DefinitionRpcSub>;
    types: Record<string, DefinitionType>;
}
