import { AccountId } from '../interfaces/runtime';
import BN from 'bn.js';
import Bytes from '../primitive/Bytes';
import U32 from '../primitive/U32';
declare const CID_AURA = 1634891105;
declare const CID_BABE = 1161969986;
declare const CID_GRPA = 1263424070;
export { CID_AURA, CID_BABE, CID_GRPA };
/**
 * @name ConsensusEngineId
 * @description
 * A 4-byte identifier (actually a [u8; 4]) identifying the engine, e.g. for Aura it would be [b'a', b'u', b'r', b'a']
 */
export default class ConsensusEngineId extends U32 {
    static idToString(input: number | BN): string;
    static stringToId(input: string): number;
    /**
     * @description `true` if the engine matches aura
     */
    get isAura(): boolean;
    /**
     * @description `true` is the engine matches babe
     */
    get isBabe(): boolean;
    /**
     * @description `true` is the engine matches grandpa
     */
    get isGrandpa(): boolean;
    private _getAuraAuthor;
    private _getBabeAuthor;
    /**
     * @description From the input bytes, decode into an author
     */
    extractAuthor(bytes: Bytes, sessionValidators: AccountId[]): AccountId | undefined;
    /**
     * @description Override the default toString to return a 4-byte string
     */
    toString(): string;
}
