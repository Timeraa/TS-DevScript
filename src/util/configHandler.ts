import {
	author,
	contributors,
	description,
	dsConsolePrefix,
	version
} from "../";

import { Tree } from "displayastree";
import chalk from "chalk";
import cmdArgs from "command-line-args";
import outline from "./functions/outlineStrings";
import { resolve } from "path";

interface config {
	src: string;
	out: string;
	deleteObsolete: boolean;
	tsconfig: string;
	entry: string;
	depCheck: boolean;
	excludeDeps: string;
	autoInstallDep: boolean;
	autoRemoveDep: boolean;
	autoInstallTypes: boolean;
	autoRemoveTypes: boolean;
	autoUpdateOutdated: boolean;
	autoUpdateDeprecated: boolean;
	updateSelector: boolean;
	todoCheck: boolean;
	todoTags: string;
	copyOnly: boolean;
	watch: boolean;
	ignore: string;
	include: string;
	silent: boolean;
}

export type Config = config & Record<string, any>

export default function run(): Config {
	let config: Config;

	if (process.argv.includes("-h") || process.argv.includes("--help")) {
		new Tree(
			chalk.green(
				`${chalk.bold("DevScript")} ${chalk.hex("#bebebe")(
					"(v" + version + ")"
				)}`
			),
			{ headChar: dsConsolePrefix + " " }
		)
			.addBranch([
				chalk.hex("#7289DA")(description),
				chalk.hex("#ebc14d")(`Author: ${chalk.hex("#bebebe")(author)}`),
				chalk.hex("#ebc14d")(
					`Contributor${contributors.length === 1 ? "" : "s"}: ${chalk.hex(
						"#bebebe"
					)(contributors.join(chalk.hex("#ebc14d")(", ")))}`
				)
			])
			.log();
		showAvailableArgs();
		process.exit();
	}

	config = cmdArgs(
		[
			{ name: "src", defaultValue: "src", type: String },
			{ name: "out", defaultValue: "dist", type: String },
			{ name: "deleteObsolete", defaultValue: true, type: String },
			{ name: "tsconfig", defaultValue: "tsconfig.json", type: String },
			{ name: "entry", defaultValue: null, type: String },
			{ name: "depCheck", defaultValue: false, type: String },
			{ name: "excludeDeps", defaultValue: null, type: String },
			{ name: "autoInstallDep", defaultValue: true, type: Boolean },
			{ name: "autoRemoveDep", defaultValue: true, type: Boolean },
			{ name: "autoInstallTypes", defaultValue: true, type: Boolean },
			{ name: "autoRemoveTypes", defaultValue: true, type: Boolean },
			{ name: "autoUpdateOutdated", defaultValue: false, type: Boolean },
			{ name: "autoUpdateDeprecated", defaultValue: false, type: Boolean },
			{ name: "updateSelector", defaultValue: true, type: Boolean },
			{ name: "todoCheck", defaultValue: true, type: String },
			{ name: "todoTags", defaultValue: null, type: String },
			{ name: "copyOnly", defaultValue: false, type: Boolean },
			{ name: "ignore", defaultValue: null, type: String },
			{ name: "include", defaultValue: null, type: String },
			{ name: "silent", alias: "s", defaultValue: false, type: Boolean }
		],
		{ stopAtFirstUnknown: false, partial: true }
	) as any;

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
		excludeDeps: {
			type: "string",
			description:
				"Dependencies to exclude from automatically uninstalling. (String list seperated by commas)"
		},
		autoInstallDep: {
			type: "boolean",
			description:
				"Automatically installs missing dependencies. (Needs depCheck enabled)"
		},
		autoRemoveDep: {
			type: "boolean",
			description:
				"Automatically removes unused dependencies. (Needs depCheck enabled)"
		},
		autoInstallTypes: {
			type: "boolean",
			description:
				"Automatically installs missing dependencies @types/. (Needs depCheck and autoInstallDep enabled)"
		},
		autoRemoveTypes: {
			type: "boolean",
			description:
				"Automatically removes unused dependencies @types/. (Needs depCheck and autoRemoveDep enabled)"
		},
		autoUpdateOutdated: {
			type: "boolean",
			description:
				"Automatically update outdated dependencies to their latest version. (Needs depCheck enabled)"
		},
		autoUpdateDeprecated: {
			type: "boolean",
			description:
				"Automatically update deprecated dependencies to their latest version. (Needs depCheck enabled)"
		},
		updateSelector: {
			type: "boolean",
			description:
				"Whether or not to show the update selector for deprecated or outdated dependencies. (Needs depCheck enabled)"
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
			description: "Whether or not only to copy the files from src to out."
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
	new Tree(chalk.bold(chalk.green("Available arguments")), {
		headChar: dsConsolePrefix + " "
	})
		.addBranch(settings)
		.log();
}
