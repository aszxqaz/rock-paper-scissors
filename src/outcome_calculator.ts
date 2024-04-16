export type Outcome = "Win" | "Lose" | "Draw";

export class OutcomeCalculator {
	constructor(private readonly total: number) {}

	public calculate(hero: number, other: number): Outcome {
		const p = this.total >> 1;
		const sign = Math.sign(((hero - other + p + this.total) % this.total) - p);

		if (sign > 0) {
			return "Win";
		} else if (sign < 0) {
			return "Lose";
		}

		return "Draw";
	}

	public allCases(): Outcome[][] {
		return Array(this.total)
			.fill(0)
			.map((_, hero) =>
				Array(this.total)
					.fill(0)
					.map((_, other) => this.calculate(hero, other)),
			);
	}
}
