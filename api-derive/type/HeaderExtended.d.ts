import { AccountId, Header } from '@polkadot/types/interfaces';
import { AnyJson, Constructor, Registry } from '@polkadot/types/types';
declare const _Header: Constructor<Header>;
/**
 * @name HeaderExtended
 * @description
 * A [[Block]] header with an additional `author` field that indicates the block author
 */
export default class HeaderExtended extends _Header {
    #private;
    constructor(registry: Registry, header?: Header, sessionValidators?: AccountId[]);
    /**
     * @description Convenience method, returns the author for the block
     */
    get author(): AccountId | undefined;
    /**
     * @description Creates a human-friendly JSON representation
     */
    toHuman(isExtended?: boolean): AnyJson;
    /**
     * @description Creates the JSON representation
     */
    toJSON(): AnyJson;
}
export {};
