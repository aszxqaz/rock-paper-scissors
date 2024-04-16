import assert from "assert";
import { randomInt } from "crypto";
import { CryptoGameEnsurerCiphers, ICryptoGameEnsurer } from "./crypto_ensurer";
import { IDialoguer } from "./dialoguer";
import { HelpScreen } from "./help_screen";
import { Outcome, OutcomeCalculator } from "./outcome_calculator";
import { TableRenderer } from "./table_renderer";

const CHECK_HMAC_URL = "https://www.liavaag.org/English/SHA-Generator/HMAC/";

export type GameplayState =
	| {
			stage: "initial";
	  }
	| {
			stage: "bot moved";
			botMove: number;
			ciphers: CryptoGameEnsurerCiphers;
	  }
	| {
			stage: "hero moved";
			botMove: number;
			ciphers: CryptoGameEnsurerCiphers;
			heroMove: number;
			outcome: Outcome;
	  };

export class GameManager {
	private state: GameplayState;
	private readonly outcomeCalculator: OutcomeCalculator;
	private mainCommands: [string, string][];
	private readonly helpScreen: HelpScreen;

	constructor(
		private readonly moveNames: string[],
		private readonly cryptoEnsurer: ICryptoGameEnsurer,
		private readonly dialoguer: IDialoguer,
	) {
		this.outcomeCalculator = new OutcomeCalculator(this.moveNames.length);
		this.helpScreen = new HelpScreen(
			this.outcomeCalculator,
			this.moveNames,
			new TableRenderer(),
		);
		this.state = { stage: "initial" };
		this.mainCommands = moveNames
			.map((cmd, idx) => [(idx + 1).toString(), cmd] as [string, string])
			.concat([
				["0", "exit"],
				["?", "help"],
			]);
	}

	public async start() {
		const botMove = randomInt(0, this.moveNames.length);
		const ciphers = this.cryptoEnsurer.getCiphers(this.moveNames[botMove]);
		this.state = {
			stage: "bot moved",
			botMove,
			ciphers,
		};
		this.loop();
	}

	private async loop() {
		this.printGameplayInfo();

		const key = await this.loopPrompt(
			"Enter your move: ",
			this.mainCommands.map((t) => t[0]),
		);

		switch (true) {
			case key == "0":
				this.exit();
				break;
			case key == "?":
				this.handleHelp();
				break;
			case key >= "1" && key <= this.moveNames.length.toString():
				this.handleHeroMove(parseInt(key) - 1);
				break;
		}
	}

	private async handleHeroMove(heroMove: number) {
		assert(this.state.stage == "bot moved");

		const outcome = this.outcomeCalculator.calculate(heroMove, this.state.botMove);

		this.state = {
			...this.state,
			stage: "hero moved",
			heroMove,
			outcome,
		};

		this.dialoguer.printOutcome(
			this.moveNames[this.state.heroMove],
			this.moveNames[this.state.botMove],
			outcome,
		);

		this.dialoguer.secondary(
			`HMAC key: ${this.state.ciphers.key}\nCheck at website: ${CHECK_HMAC_URL}`,
		);

		const key = await this.loopPrompt("Type R to restart or 0 to exit: ", ["R", "0"]);

		switch (key.toUpperCase()) {
			case "R":
				this.start();
				break;
			case "0":
				this.exit();
				break;
		}
	}

	private async loopPrompt(question: string, whitelist: string[]): Promise<string> {
		while (true) {
			const key = await this.dialoguer.prompt(question);

			if (!whitelist.includes(key.toUpperCase())) {
				this.dialoguer.danger(`Unknown command: ${key}. Look up the instructions.`);
			} else {
				return key;
			}
		}
	}

	private async handleHelp() {
		console.clear();
		const rulesTable = this.helpScreen.renderRulesTable();
		console.log(rulesTable);
		await this.loopPrompt("Type 0 to go back: ", ["0"]);
		this.loop();
	}

	private printGameplayInfo() {
		assert(this.state.stage == "bot moved");

		console.clear();
		this.dialoguer.secondary(`HMAC: ${this.state.ciphers.encrypted}`);
		this.dialoguer.primary("Available moves:");
		this.dialoguer.plain(this.mainCommands.map((t) => t.join(" - ")).join("\n"));
	}

	private exit() {
		this.dialoguer.primary("Good bye!");
	}
}
