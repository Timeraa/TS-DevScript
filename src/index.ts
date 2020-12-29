#!/usr/bin/env node
import chalk from "chalk";
import { ChildProcess, fork, spawn } from "child_process";
import chokidar from "chokidar";
import glob from "fast-glob";
import { existsSync, readFileSync } from "fs";
import { copySync, removeSync } from "fs-extra";
import { basename, extname } from "path";
import ts from "typescript";

//TODO Add run anyways option if errors happen

let config = {
		srcDir: "src",
		outDir: "dist",
		deleteObsolete: true,
		tsconfig: "tsconfig.json",
		file: ""
	},
	child: ChildProcess = null,
	copyTask: Promise<any>;

const silentRun =
		!process.argv.includes("-s") && !process.argv.includes("--silent"),
	tsConsolePrefix = chalk.bgBlue(chalk.bold(chalk.white(" TS "))) + " ",
	dsConsolePrefix = chalk.yellow("</>  ");

if (silentRun)
	console.log(
		chalk.yellowBright(
			`${dsConsolePrefix}DevScript • v${
				require(__dirname + "/../package.json").version
			}`
		)
	);

if (existsSync(`${process.cwd()}/.devScript.json`)) {
	try {
		config = JSON.parse(
			readFileSync(`${process.cwd()}/.devScript.json`, "utf-8")
		);
	} catch (e) {
		console.error("Invalid Syntax:", e.message);
		process.exit();
	}
}

if (!config.srcDir) config.srcDir = "src";
if (!config.outDir) config.outDir = "dist";
if (!config.deleteObsolete) config.deleteObsolete = true;
if (!config.tsconfig) config.tsconfig = "tsconfig.json";

const formatHost: ts.FormatDiagnosticsHost = {
	getCanonicalFileName: (path) => path,
	getCurrentDirectory: ts.sys.getCurrentDirectory,
	getNewLine: () => ""
};

//* Create ts program
const createProgram = ts.createSemanticDiagnosticsBuilderProgram;

if (process.argv.includes("--copyOnly")) {
	copyFiles();
} else {
	const watcher = chokidar.watch(config.srcDir, {
		ignored: /(\.ts)/g,
		persistent: true,
		ignoreInitial: true
	});

	watcher.on("all", (path) => {
		console.log(
			dsConsolePrefix +
				chalk.yellowBright(
					`${chalk.cyan(basename(path))} updated, restarting...`
				)
		);
		copyTask = copyFiles();

		restartChild();
	});
	//* Create Watch compoile host
	const host = ts.createWatchCompilerHost(
		`${process.cwd()}/${config.tsconfig}`,
		{},
		ts.sys,
		createProgram,
		reportDiagnostic,
		fileChange
	);
	ts.createWatchProgram(host);
}

function reportDiagnostic(diagnostic: ts.Diagnostic) {
	if (silentRun)
		console.log(
			tsConsolePrefix +
				chalk.redBright(ts.formatDiagnostic(diagnostic, formatHost))
		);
}

async function fileChange(diagnostic: ts.Diagnostic) {
	if ([6031, 6032].includes(diagnostic.code)) {
		if (silentRun)
			console.log(
				tsConsolePrefix + chalk.cyan(diagnostic.messageText.toString())
			);
		copyTask = copyFiles();
	} else if (
		diagnostic.code === 6194 &&
		parseInt(diagnostic.messageText.toString().replace(/\D/g, "")) === 0
	) {
		if (silentRun)
			console.log(
				tsConsolePrefix + chalk.green(diagnostic.messageText.toString())
			);

		restartChild();
	} else if (silentRun) {
		if ([6193, 6194].includes(diagnostic.code)) {
			console.log();
			console.log(
				tsConsolePrefix +
					chalk.bold(chalk.redBright(diagnostic.messageText.toString()))
			);
		}
	}
}

async function copyFiles() {
	if (config.deleteObsolete) await deleteObsolete();

	if (existsSync("package.json"))
		copySync("package.json", `${config.outDir}/package.json`);
	if (existsSync("package-lock.json"))
		copySync("package-lock.json", `${config.outDir}/package-lock.json`);
	if (existsSync("yarn.lock"))
		copySync("yarn.lock", `${config.outDir}/yarn.lock`);

	//* Copy files from src to dist
	copySync("src", config.outDir, {
		filter: function (path) {
			if (path.includes("/node_modules")) return false;
			return extname(path) !== ".ts";
		}
	});
}

async function deleteObsolete() {
	//* Select files
	let dist = await glob(config.outDir + "/**/*", {
			onlyFiles: true
		}),
		src = await glob(config.srcDir + "/**/*", {
			onlyFiles: true
		});

	//* Filter file differences
	let nDist = dist.map((f) => [f.replace(config.outDir, ""), f]);
	src = src
		.map((f) => f.replace(config.srcDir, "").split(".")[0])
		.filter((sf) => nDist.find((d) => d[0].split(".")[0] == sf));

	//* Old files, delete
	dist
		.filter((f) => !src.includes(f.replace(config.outDir, "").split(".")[0]))
		.map((f) => removeSync(f));
}

async function restartChild() {
	//* Kill old child
	//* Spawn new child
	if (child && !child.killed) {
		child.unref();
		child.kill("SIGKILL");
	}

	await copyTask;

	if (existsSync(process.cwd() + "/" + config.outDir + "/" + "index.js")) {
		if (config.file) {
			child = fork(process.cwd() + "/" + config.file, [], {
				cwd: config.outDir
			});
			return;
		} else if (existsSync(process.cwd() + "/package.json")) {
			const pjson = require(process.cwd() + "/package.json");

			if (pjson.scripts && pjson.scripts.start) {
				child = spawn(
					existsSync(process.cwd() + "/yarn.lock")
						? "yarn run --silent start"
						: "npm run --silent start",
					{
						shell: true,
						stdio: "inherit"
					}
				);
				return;
			}
		}

		child = fork(process.cwd() + "/" + config.outDir + "/index.js", [], {
			cwd: config.outDir
		});

		child.on("exit", (code) => {
			if (code === null) return;

			console.log(
				dsConsolePrefix +
					chalk.yellowBright(
						`Process exited with exit code ${chalk.yellow(
							chalk.cyan(code)
						)}, waiting for changes...`
					)
			);
			child = null;
		});
	}
}
