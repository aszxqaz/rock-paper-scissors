import { hmac } from "@noble/hashes/hmac";
import { sha3_256 } from "@noble/hashes/sha3";
import { randomBytes } from "@noble/hashes/utils";

export type HexString = string;

export type CryptoGameEnsurerCiphers = {
	key: HexString;
	encrypted: HexString;
};

export interface ICryptoGameEnsurer {
	getCiphers(message: string): CryptoGameEnsurerCiphers;
}

export class StdCryptoGameEnsurer implements ICryptoGameEnsurer {
	public getCiphers(message: string): CryptoGameEnsurerCiphers {
		const keyBytes = randomBytes(32);
		const encBytes = hmac(sha3_256, keyBytes, message);

		return {
			key: Buffer.from(keyBytes).toString("hex"),
			encrypted: Buffer.from(encBytes).toString("hex"),
		};
	}
}
