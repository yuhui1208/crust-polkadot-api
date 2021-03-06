import type BN from 'bn.js';
import { Hash } from '@polkadot/types/interfaces';
import { ChainUpgradeVersion, DefinitionRpc, DefinitionRpcSub, Registry, RegistryTypes, OverrideModuleType } from '@polkadot/types/types';
import { Text } from '@polkadot/types';
/**
 * @description Based on the metadata version, return the registry types
 */
export declare function getMetadataTypes(_registry: Registry, specVersion: number): RegistryTypes;
/**
 * @description Get types for specific modules (metadata override)
 */
export declare function getModuleTypes({ knownTypes }: Registry, section: string): OverrideModuleType;
/**
 * @description Based on the chain and runtimeVersion, get the applicable types (ready for registration)
 */
export declare function getSpecTypes({ knownTypes }: Registry, chainName: Text | string, specName: Text | string, specVersion: BigInt | BN | number): RegistryTypes;
/**
 * @description Based on the chain and runtimeVersion, get the applicable rpc definitions (ready for registration)
 */
export declare function getSpecRpc({ knownTypes }: Registry, chainName: Text | string, specName: Text | string): Record<string, Record<string, DefinitionRpc | DefinitionRpcSub>>;
/**
 * @description Based on the chain and runtimeVersion, get the applicable alias definitions (ready for registration)
 */
export declare function getSpecAlias({ knownTypes }: Registry, chainName: Text | string, specName: Text | string): Record<string, OverrideModuleType>;
/**
 * @description Returns a version record for known chains where upgrades are being tracked
 */
export declare function getUpgradeVersion(genesisHash: Hash, blockNumber: BN): [ChainUpgradeVersion | undefined, ChainUpgradeVersion | undefined];
