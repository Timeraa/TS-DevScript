import chalk from "chalk";

/**
 * @param title The title/header of the tree
 * @param children All the arguments in the tree
 * @param color Color of the children (optional)
 */
export default function displayAsTree(
	title: string,
	children: string[],
	color?: chalk.Chalk
) {
	console.log(
		`${title}${
			(children.length > 1
				? "\n├─ " +
				  children
						.slice(0, -1)
						.map((s) => (color ? color(s) : s))
						.join("\n├─ ")
				: "") +
			"\n╰─ " +
			(color ? color(children.slice(-1)[0]) : children.slice(-1)[0])
		}`
	);
}
