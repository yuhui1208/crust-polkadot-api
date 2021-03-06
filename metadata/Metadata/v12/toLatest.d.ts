import { MetadataV12, MetadataLatest } from '@polkadot/types/interfaces/metadata';
import { Registry } from '@polkadot/types/types';
/**
 * Convert the Metadata (which is an alias) to latest - effectively this _always_ get applied to the top-level &
 * most-recent metadata, since it allows us a chance to actually apply call and storage specific type aliasses
 * @internal
 **/
export default function toLatest(registry: Registry, { extrinsic, modules }: MetadataV12): MetadataLatest;
