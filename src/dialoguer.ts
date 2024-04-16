import chalk from "chalk";
import { createInterface, Interface } from "readline/promises";
import { Outcome } from "./outcome_calculator";
import { styledText } from "./styled_text";

export interface IDialoguer {
	accent(s: string): void;
	danger(s: string): void;
	plain(s: string): void;
	primary(s: string): void;
	secondary(s: string): void;
	printOutcome(heroMove: string, botMove: string, outcome: Outcome): void;
	prompt(text: string): Promise<string>;
}

export class Dialoguer implements IDialoguer {
	private rl?: Interface;

	public accent(text: string): void {
		console.log(styledText(text, "accent"));
	}

	public plain(text: string): void {
		console.log(styledText(text, "plain"));
	}

	public secondary(text: string): void {
		console.log(styledText(text, "secondary"));
	}

	public primary(text: string): void {
		console.log(styledText(text, "primary"));
	}

	public danger(text: string): void {
		console.log(styledText(text, "danger"));
	}

	public printOutcome(heroMove: string, botMove: string, outcome: Outcome): void {
		let result = `Your move: ${heroMove}\n` + `Computer move: ${botMove}\n`;

		switch (outcome) {
			case "Draw":
				result += chalk.blue(`It's a draw!`);
				break;
			case "Win":
				result += chalk.greenBright(`Congrats, you win!`);
				break;
			case "Lose":
				result += chalk.redBright(`Ha-ha, bot was better!`);
				break;
		}

		console.log(result);
	}

	public async prompt(text: string): Promise<string> {
		if (this.rl === undefined) {
			this.rl = createInterface({
				input: process.stdin,
				output: process.stdout,
				terminal: false,
			});
		}
		const key = await this.rl.question(chalk.blueBright(`➤ ${text}`));
		this.rl.pause();
		return key;
	}
}
