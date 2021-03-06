import { InterfaceTypes } from '../../types';
export declare type ExtTypes = Record<string, keyof InterfaceTypes>;
export declare type ExtInfo = {
    extra: ExtTypes;
    types: ExtTypes;
};
export declare type ExtDef = Record<string, ExtInfo>;
