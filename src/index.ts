#!/usr/bin/env node

import "source-map-support/register";

import chalk from "chalk";
import { basename } from "path";

import cfg from "./util/configHandler";
import copyTask from "./util/copyTask";
import checkDeps from "./util/depCheck";
import runFileWatcher from "./util/fileWatcher";
import checkTodos from "./util/todoCheck";
import runTSCompiler from "./util/tsCompiler";

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

export const config = cfg();

async function run() {
	if (config.copyOnly) return await copyTask();

	if (!config.silent)
		console.log(
			chalk.green(
				`${chalk.white(dsConsolePrefix)}Launching ${chalk.bold(
					"DevScript"
				)} ${chalk.hex("#bebebe")("(v" + version + ")")} on ${chalk.bold(
					basename(process.cwd())
				)}…`
			)
		);

	runFileWatcher();

	if (config.depCheck) await checkDeps();
	if (!config.silent && config.todoCheck) await checkTodos();

	runTSCompiler();
}

run();
