import { ModuleConstantMetadataLatest } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';
import { ApiTypes } from './base';
export interface AugmentedConsts<ApiType extends ApiTypes> {
}
export interface AugmentedConst<ApiType extends ApiTypes> {
    meta: ModuleConstantMetadataLatest;
}
export interface QueryableModuleConsts {
    [key: string]: Codec;
}
