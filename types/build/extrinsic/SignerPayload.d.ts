import { Address, Balance, BlockNumber, Call, ExtrinsicEra, Hash, Index, RuntimeVersion } from '../interfaces';
import { Codec, Constructor, ISignerPayload, SignerPayloadJSON, SignerPayloadRaw } from '../types';
import Compact from '../codec/Compact';
import Vec from '../codec/Vec';
import Text from '../primitive/Text';
import u8 from '../primitive/U8';
export interface SignerPayloadType extends Codec {
    address: Address;
    blockHash: Hash;
    blockNumber: BlockNumber;
    era: ExtrinsicEra;
    genesisHash: Hash;
    method: Call;
    nonce: Compact<Index>;
    runtimeVersion: RuntimeVersion;
    signedExtensions: Vec<Text>;
    tip: Compact<Balance>;
    version: u8;
}
declare const _Payload: Constructor<SignerPayloadType>;
/**
 * @name SignerPayload
 * @description
 * A generic signer payload that can be used for serialization between API and signer
 */
export default class SignerPayload extends _Payload implements ISignerPayload {
    /**
     * @description Creates an representation of the structure as an ISignerPayload JSON
     */
    toPayload(): SignerPayloadJSON;
    /**
     * @description Creates a representation of the payload in raw Exrinsic form
     */
    toRaw(): SignerPayloadRaw;
}
export {};
