import chalk from "chalk";

export function displayAsTree(
	children: string[],
	prefix = "",
	color: chalk.Chalk = chalk.reset
) {
	console.log(
		(children.length > 1
			? `${prefix}├─ ` +
			  children
					.slice(0, -1)
					.map((s) => color(s))
					.join(`\n${prefix}├─ `) +
			  "\n"
			: "") +
			`${prefix}╰─ ` +
			color(children.slice(-1)[0])
	);
}
