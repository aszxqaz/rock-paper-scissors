import { OutcomeCalculator } from "./outcome_calculator";
import { StyledTextVariant } from "./styled_text";
import { ITableRenderer, TableMatrixItem } from "./table_renderer";

export class HelpScreen {
	constructor(
		private readonly outcomeCalculator: OutcomeCalculator,
		private readonly moveNames: string[],
		private readonly tableRenderer: ITableRenderer,
	) {}

	public renderRulesTable(): string {
		const header = ["v PC / User >", ...this.moveNames].map((text) => ({
			text,
			variant: "primary" as StyledTextVariant,
		}));

		const rows = this.moveNames.map((name, row) => [
			{
				text: name,
				variant: "primary",
			} as TableMatrixItem,
			...this.moveNames.map((_, col) => {
				const outcome = this.outcomeCalculator.calculate(col, row);
				switch (outcome) {
					case "Win":
						return {
							text: "✓ Win",
							variant: "accent",
						} as TableMatrixItem;

					case "Lose":
						return {
							text: "💀 Lose",
							variant: "danger",
						} as TableMatrixItem;

					case "Draw":
						return {
							text: "✗ Draw",
							variant: "secondary",
						} as TableMatrixItem;
				}
			}),
		]);

		return this.tableRenderer.render("Comparison Rules", [header, ...rows]);
	}
}
