import { MetadataLatest, MetadataV0, MetadataV1, MetadataV2, MetadataV3, MetadataV4, MetadataV5, MetadataV6, MetadataV7, MetadataV8, MetadataV9, MetadataV10, MetadataV11 } from '@polkadot/types/interfaces/metadata';
import { Registry } from '@polkadot/types/types';
import Struct from '@polkadot/types/codec/Struct';
import MagicNumber from './MagicNumber';
/**
 * @name MetadataVersioned
 * @description
 * The versioned runtime metadata as a decoded structure
 */
export default class MetadataVersioned extends Struct {
    #private;
    constructor(registry: Registry, value?: unknown);
    private _assertVersion;
    private _getVersion;
    /**
     * @description Returns the wrapped metadata as a limited calls-only (latest) version
     */
    get asCallsOnly(): MetadataVersioned;
    /**
     * @description Returns the wrapped metadata as a V0 object
     */
    get asV0(): MetadataV0;
    /**
     * @description Returns the wrapped values as a V1 object
     */
    get asV1(): MetadataV1;
    /**
     * @description Returns the wrapped values as a V2 object
     */
    get asV2(): MetadataV2;
    /**
     * @description Returns the wrapped values as a V3 object
     */
    get asV3(): MetadataV3;
    /**
     * @description Returns the wrapped values as a V4 object
     */
    get asV4(): MetadataV4;
    /**
     * @description Returns the wrapped values as a V5 object
     */
    get asV5(): MetadataV5;
    /**
     * @description Returns the wrapped values as a V6 object
     */
    get asV6(): MetadataV6;
    /**
     * @description Returns the wrapped values as a V7 object
     */
    get asV7(): MetadataV7;
    /**
     * @description Returns the wrapped values as a V8 object
     */
    get asV8(): MetadataV8;
    /**
     * @description Returns the wrapped values as a V9 object
     */
    get asV9(): MetadataV9;
    /**
     * @description Returns the wrapped values as a V10 object
     */
    get asV10(): MetadataV10;
    /**
     * @description Returns the wrapped values as a V10 object
     */
    get asV11(): MetadataV11;
    /**
     * @description Returns the wrapped values as a V10 object
     */
    get asV12(): MetadataV11;
    /**
     * @description Returns the wrapped values as a latest version object
     */
    get asLatest(): MetadataLatest;
    /**
     * @description
     */
    get magicNumber(): MagicNumber;
    /**
     * @description the metadata wrapped
     */
    private get _metadata();
    /**
     * @description the metadata version this structure represents
     */
    get version(): number;
    getUniqTypes(throwError: boolean): string[];
}
