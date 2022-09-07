import { ChildProcess, fork, spawn } from "child_process";
import { config, dsConsolePrefix, name } from "../";

import chalk from "chalk";
import debug from "debug";
import { pathExists } from "fs-extra";
import { resolve } from "path";
import treeKill from "tree-kill";

let currentChild: ChildProcess | null = null;
const logger = debug(`${name}:childHandler`);

export default async function runChild() {
	let projectJSON: any = null;

	try {
		projectJSON = require(resolve(process.cwd(), "package.json"));
	} catch (err) {
		logger("No package.json found");
	}

	await killOldChild();

	if (!config.entry && projectJSON?.scripts?.start) {
		logger("Starting with start script from project.json");
		currentChild = spawn(
			(await pathExists(process.cwd() + "/yarn.lock"))
				? "yarn run --silent start"
				: "npm run --silent start",
			process.argv,
			{
				cwd: process.cwd(),
				argv0: process.argv0,
				env: process.env,
				shell: true,
				stdio: "inherit"
			}
		);

		currentChild.once("exit", onChildDeath);
		return;
	}

	if (
		await pathExists(config.entry ? config.entry : resolve(config.out, "index.js"))
	) {
		logger("Starting with entry index.js");
		currentChild = fork(
			config.entry ? config.entry : resolve(config.out, "index.js"),
			process.argv,
			{
				cwd: config.entry ? process.cwd() : config.out,
			}
		);
		return;
	}

	throw new Error("No entry point found!");
}

function onChildDeath(code: number, signal: NodeJS.Signals) {
	if (!config.silent)
		console.log(
			`${dsConsolePrefix} ${chalk.yellow(
				"Process exit with code " +
					chalk.white(code) +
					", signal: " +
					chalk.white(signal) +
					""
			)}`
		);
}

async function killOldChild() {
	if (currentChild && !currentChild.killed) {
		try {
			currentChild.removeListener("exit", onChildDeath);
			await new Promise<void>((resolve, reject) => 
				treeKill(currentChild!.pid!, "SIGKILL", (err) =>
					err ? reject(err) : resolve()
				)
			);
			logger("Kill old child");
		} catch (err) {
			logger("Failed to kill old child", err);
		}
		currentChild = null;
	}
}
