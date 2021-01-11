#!/usr/bin/env node

export const dsConsolePrefix = "● ",
	{
		name,
		description,
		version,
		author,
		contributors
	}: {
		name: string;
		description: string;
		version: string;
		author: string;
		contributors: string[];
	} = require("../package.json");

import { basename } from "path";
import cfg from "./util/configHandler";
import chalk from "chalk";
import checkDeps from "./util/depCheck";
import checkTodos from "./util/todoCheck";
import copyTask from "./util/copyTask";
import runFileWatcher from "./util/fileWatcher";
import runTSCompiler from "./util/tsCompiler";

export const config = cfg();

async function run() {
	if (config.copyOnly) return await copyTask();

	if (!config.silent)
		console.log(
			chalk.green(
				`${chalk.white(dsConsolePrefix)} Launching ${chalk.bold(
					"DevScript"
				)} ${chalk.hex("#bebebe")("(v" + version + ")")} on ${chalk.bold(
					basename(process.cwd())
				)}…`
			)
		);

	runFileWatcher();

	if (config.depCheck) await checkDeps();
	if (config.todoCheck) await checkTodos();

	runTSCompiler();
}

run();
