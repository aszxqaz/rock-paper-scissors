import { StdCryptoGameEnsurer } from "./crypto_ensurer";
import { Dialoguer } from "./dialoguer";
import { GameManager } from "./game_manager";

main();

async function main() {
	const moveNames = process.argv.slice(2);

	const error = validateMoveNames(moveNames);
	if (error != undefined) {
		console.error(`Error: ${error}`);
		process.exit(1);
	}

	const dialoguer = new Dialoguer();
	const ensurer = new StdCryptoGameEnsurer();

	const game = new GameManager(moveNames, ensurer, dialoguer);

	await game.start();
}

function validateMoveNames(list: string[]): string | undefined {
	if (list.length != new Set(list).size) {
		return "Duplicates are not acceptable";
	}

	if (list.length < 3) {
		return "Move variants count is too small. Provide min. 3 variants.";
	}

	if (list.length % 2 != 1) {
		return "Move variants count should be odd (3, 5, 7, etc.)";
	}
}
