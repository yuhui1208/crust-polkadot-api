import { Codec, Registry } from '@polkadot/types/types';
import { Option, Vec } from '@polkadot/types/codec';
import { Text, Type } from '@polkadot/types/primitive';
declare type Arg = {
    type: Type;
} & Codec;
declare type Item = {
    type: {
        isDoubleMap?: boolean;
        isMap: boolean;
        isPlain: boolean;
        asDoubleMap?: {
            key1: Text;
            key2: Text;
            value: Text;
        };
        asMap: {
            key: Text;
            value: Text;
        };
        asPlain: Text;
    };
} & Codec;
declare type Storage = Option<Vec<Item> | {
    functions?: Vec<Item>;
    items?: Vec<Item>;
} & Codec>;
declare type Call = {
    args: Vec<Arg>;
} & Codec;
declare type Calls = Option<Vec<Call>>;
declare type Event = {
    args: Vec<Type>;
} & Codec;
declare type Events = Option<Vec<Event>>;
declare type Module = {
    module?: {
        call: {
            functions: Vec<Call>;
        };
    };
    calls?: Calls;
    constants?: Vec<{
        type: Text;
    } & Codec>;
    events?: Events;
    storage?: Storage;
} & Codec;
interface ExtractionMetadata {
    modules: Vec<Module>;
    outerEvent?: {
        events: Vec<[Text, Vec<Event>] & Codec>;
    };
}
/** @internal */
export default function getUniqTypes(registry: Registry, meta: ExtractionMetadata, throwError: boolean): string[];
export {};
