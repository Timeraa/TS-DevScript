import {
	author,
	contributors,
	description,
	dsConsolePrefix,
	version
} from "../";

import chalk from "chalk";
import cmdArgs from "command-line-args";
import displayAsTree from "./functions/displayAsTree";
import outline from "./functions/outlineStrings";
import { resolve } from "path";

interface config {
	src: string;
	out: string;
	deleteObsolete: boolean;
	tsconfig: string;
	entry: string;
	depCheck: boolean;
	todoCheck: boolean;
	todoTags: string;
	copyOnly: boolean;
	watch: boolean;
	ignore: string;
	include: string;
	silent: boolean;
}

export default function run() {
	let config: config;

	try {
		if (process.argv.includes("-h") || process.argv.includes("--help")) {
			displayAsTree(
				dsConsolePrefix +
					" " +
					chalk.green(
						`${chalk.bold("DevScript")} ${chalk.hex("#bebebe")(
							"(v" + version + ")"
						)}`
					),
				[
					chalk.hex("#7289DA")(description),
					chalk.hex("#ebc14d")(`Author: ${chalk.hex("#bebebe")(author)}`),
					chalk.hex("#ebc14d")(
						`Contributor${contributors.length === 1 ? "" : "s"}: ${chalk.hex(
							"#bebebe"
						)(contributors.join(chalk.hex("#ebc14d")(", ")))}`
					)
				]
			);
			showAvailableArgs();
			process.exit();
		}

		config = cmdArgs([
			{ name: "src", defaultValue: "src", type: String },
			{ name: "out", defaultValue: "dist", type: String },
			{ name: "deleteObsolete", defaultValue: true, type: String },
			{ name: "tsconfig", defaultValue: "tsconfig.json", type: String },
			{ name: "entry", defaultValue: null, type: String },
			{ name: "depCheck", defaultValue: true, type: String },
			{ name: "todoCheck", defaultValue: true, type: String },
			{ name: "todoTags", defaultValue: null, type: String },
			{ name: "copyOnly", defaultValue: false, type: Boolean },
			{ name: "ignore", defaultValue: null, type: String },
			{ name: "include", defaultValue: null, type: String },
			{ name: "silent", alias: "s", defaultValue: false, type: Boolean }
		]) as any;

		if (typeof config.depCheck === "string")
			config.depCheck = Boolean(config.depCheck);
		if (typeof config.deleteObsolete === "string")
			config.deleteObsolete = Boolean(config.deleteObsolete);

		//* Take possible config values from package.json of project
		try {
			const pkgJson = require(resolve(process.cwd(), "package.json"));

			if (pkgJson.devScript) {
				for (let key in pkgJson.devScript) {
					if (config[key]) config[key] = pkgJson.devScript[key];
				}
			}
		} catch (e) {}
	} catch (e) {
		console.log(
			`${dsConsolePrefix} ${chalk.hex("#e83a3a")(
				`Unknown argument "${chalk.bold(e.optionName)}"…`
			)}`
		);
		showAvailableArgs();
		process.exit();
	}

	return config;
}

function showAvailableArgs(): void {
	const configDescriptions: {
		[name: string]: {
			type: string;
			description: string;
		};
	} = {
		src: {
			type: "string",
			description: "Directory containing the source code."
		},
		out: {
			type: "string",
			description: "Directory that will contain the output."
		},
		deleteObsolete: {
			type: "boolean",
			description:
				"Whether or not to delete files from out that are not in the src."
		},
		tsconfig: {
			type: "string",
			description: "Path to a valid tsconfig.json file."
		},
		entry: {
			type: "string",
			description: "Entry file to be executed after compilation."
		},
		depCheck: {
			type: "boolean",
			description: "Whether or not to check the dependencies."
		},
		todoCheck: {
			type: "boolean",
			description: "Whether or not to check for TODO's."
		},
		todoTags: {
			type: "string",
			description:
				"Custom tags to include in the TODO check. (String list seperated by commas)"
		},
		copyOnly: {
			type: "boolean",
			description: "Whether or not only to copy the files from src to out"
		},
		ignore: {
			type: "string",
			description:
				"Files that should be ignored when watching files. (glob pattern)"
		},
		include: {
			type: "string",
			description:
				"Files that should be included when watching files. (glob pattern)"
		},
		silent: {
			type: "boolean",
			description: "Whether or not to print console logs."
		}
	};
	let settings: string[] = [];
	for (const [k, v] of Object.entries(configDescriptions)) {
		settings.push(
			`${chalk.yellowBright("--" + k)} ${chalk.underline(
				chalk.hex("#bebebe")(v.type)
			)} • ${chalk.hex("#7289DA")(v.description)}`
		);
	}
	outline(settings, "•");
	displayAsTree(
		`${dsConsolePrefix} ${chalk.bold(chalk.green("Available arguments"))}`,
		settings
	);
}
