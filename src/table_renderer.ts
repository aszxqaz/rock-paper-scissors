import { Table } from "console-table-printer";
import { StyledTextVariant, styledText } from "./styled_text";

export type TableMatrixItem = {
	text: string;
	variant?: StyledTextVariant;
};

export interface ITableRenderer {
	render(title: string, matrix: TableMatrixItem[][]): string;
}

export class TableRenderer implements ITableRenderer {
	public render(title: string, matrix: TableMatrixItem[][]): string {
		const columns = matrix[0].map((item, idx) => ({
			name: idx.toString(),
			title: this.formatItem(item),
		}));

		const rows = matrix
			.slice(1)
			.map((row) =>
				Object.fromEntries(row.map((item, idx) => [idx, this.formatItem(item)])),
			);

		return new Table({
			title,
			columns,
			rows,
		}).render();
	}

	private formatItem(item: TableMatrixItem): string {
		return styledText(item.text, item.variant);
	}
}
