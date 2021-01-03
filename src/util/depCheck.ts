import chalk from "chalk";
import debug from "debug";
import depcheck from "depcheck";

import { config, dsConsolePrefix, name } from "../index";
import displayAsTree from "./functions/displayAsTree";

const logger = debug(`${name}:depcheck`);

export default async function checkDeps() {
	console.log(
		`${dsConsolePrefix} ${chalk.hex("#ebc14d")("Checking dependencies…")}`
	);
	logger("Running dependency check...");
	const deps = await depcheck(process.cwd(), { ignoreDirs: [config.out] });
	logger(
		`Dependency check finished. ${
			deps.dependencies.length + deps.devDependencies.length
		} unused, ${Object.keys(deps.missing).length} missing`
	);

	if (Object.keys(deps.missing).length > 0)
		displayAsTree(
			`${dsConsolePrefix} ${chalk.red(chalk.bold("Missing dependencies"))}`,
			Object.keys(deps.missing),
			chalk.red
		);

	if (deps.dependencies.length > 0)
		displayAsTree(
			`${dsConsolePrefix} ${chalk.bold(
				chalk.yellowBright("Unused dependencies")
			)}`,
			deps.dependencies,
			chalk.yellowBright
		);

	if (deps.devDependencies.length > 0)
		displayAsTree(
			`${dsConsolePrefix} ${chalk.hex("#ea5e00")(
				chalk.bold("Unused devDependencies")
			)}`,
			deps.devDependencies,
			chalk.hex("#e8811c")
		);
}
