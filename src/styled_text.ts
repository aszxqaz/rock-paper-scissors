import chalk from "chalk";

export type StyledTextVariant = "primary" | "secondary" | "danger" | "plain" | "accent";

export function styledText(text: string, variant: StyledTextVariant = "plain") {
	let wrapper = chalk.whiteBright;
	switch (variant) {
		case "primary":
			wrapper = chalk.greenBright;
			break;
		case "secondary":
			wrapper = chalk.grey;
			break;
		case "danger":
			wrapper = chalk.redBright;
			break;
		case "plain":
			wrapper = chalk.whiteBright;
			break;
		case "accent":
			wrapper = chalk.blueBright;
			break;
	}

	return wrapper(text);
}
