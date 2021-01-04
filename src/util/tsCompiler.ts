import chalk from "chalk";
import debug from "debug";
import {
	createSemanticDiagnosticsBuilderProgram,
	createWatchCompilerHost,
	createWatchProgram,
	Diagnostic,
	getLineAndCharacterOfPosition,
	SemanticDiagnosticsBuilderProgram,
	sys,
	WatchOfConfigFile
} from "typescript";

import { config, dsConsolePrefix, name } from "../";
import runChild from "./childHandler";
import copyTask from "./copyTask";
import outline from "./functions/outlineStrings";

let program: WatchOfConfigFile<SemanticDiagnosticsBuilderProgram>,
	host = createWatchCompilerHost(
		"",
		{},
		sys,
		createSemanticDiagnosticsBuilderProgram,
		getDiagnostic,
		fileChange
	);
const logger = debug(`${name}:compiler`);

export default async function runTSCompiler() {
	host = createWatchCompilerHost(
		config.tsconfig,
		{},
		sys,
		createSemanticDiagnosticsBuilderProgram,
		getDiagnostic,
		fileChange
	);

	logger("Created TypeScript watcher.");
	program = createWatchProgram(host);

	process.once("exit", program.close);
}

let diagnosticErrorArray: {
		file: string;
		diagnosticLine: { line: number; character: number };
		message: string;
		code: number;
	}[] = [],
	diagnosticsFinished: NodeJS.Timeout;
function getDiagnostic(diagnostic: Diagnostic) {
	//#region Make sure diagnostics are finished
	if (diagnosticsFinished) clearTimeout(diagnosticsFinished);
	diagnosticsFinished = setTimeout(reportDiagnostics, 1);
	//#endregion

	//* Append to diagnosticErrorArray
	diagnosticErrorArray.push({
		file: diagnostic.file.fileName.replace(
			host.getCurrentDirectory() + "/",
			""
		),
		diagnosticLine: getLineAndCharacterOfPosition(
			diagnostic.file,
			diagnostic.start!
		),
		message:
			typeof diagnostic.messageText !== "string"
				? //TODO Maybe show it in more indents?
				  diagnostic.messageText.messageText
				: diagnostic.messageText
						.toString()
						.replace(host.getCurrentDirectory() + "/", ""),
		code: diagnostic.code
	});
}

function reportDiagnostics() {
	if (config.silent) return;

	let result: {
		[name: number]: string[];
	} = {};

	//#region Convert array to fully colored object
	logger(
		`Found ${diagnosticErrorArray.length} errors. Transferring array to object…`
	);
	for (let i = 0; i < diagnosticErrorArray.length; i++) {
		const diagnostic = diagnosticErrorArray[i];
		//* Ensure code exists in object
		if (!result[diagnostic.code]) result[diagnostic.code] = [];

		//* File src message coloring
		const fileSrcMsg = chalk.hex("#bebebe")(
			`${chalk.yellowBright(diagnostic.file)}(${
				diagnostic.diagnosticLine.line + 1
			},${diagnostic.diagnosticLine.character + 1})`
		);

		result[diagnostic.code].push(
			`${fileSrcMsg} • ${chalk.hex("#7289DA")(diagnostic.message)}`
		);
	}
	logger("Transferred array to object, now posting errors by error ID…");
	//#endregion

	//* Error header
	console.log(
		`${dsConsolePrefix} ${chalk.bold(
			chalk.hex("#e83a3a")(
				"Found " +
					diagnosticErrorArray.length +
					" error" +
					(diagnosticErrorArray.length === 1 ? "" : "s") +
					". Watching for file changes…"
			)
		)}`
	);

	let i = 0;
	for (const [errorCode, errorArray] of Object.entries(result)) {
		//* Spacing between src and error message.
		outline(errorArray, "•");

		i++;
		if (Object.keys(result).length > 1) {
			if (Object.keys(result).length === i) {
				console.log(`╰─ ${chalk.bold(chalk.redBright("TS" + errorCode))}`);
				displayAsTree(errorArray, "   ");
			} else {
				console.log(`├─ ${chalk.bold(chalk.redBright("TS" + errorCode))}`);
				displayAsTree(errorArray, "│  ");
			}
		} else {
			console.log(`╰─ ${chalk.bold(chalk.redBright("TS" + errorCode))}`);
			displayAsTree(errorArray, "   ");
		}
	}

	diagnosticErrorArray = [];
}

function displayAsTree(
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

async function fileChange(diagnostic: Diagnostic) {
	//* "Starting compilation in watch mode...""
	if (diagnostic.code === 6031) {
		if (!config.silent)
			console.log(
				`${dsConsolePrefix} ${chalk.blueBright(
					"Starting TypeScript compiler…"
				)}`
			);
		return;
	}

	//* "File change detected..."
	if (diagnostic.code === 6032) {
		if (!config.silent)
			console.log(
				`${dsConsolePrefix} ${chalk.blueBright(
					diagnostic.messageText
						.toString()
						.substring(0, diagnostic.messageText.toString().length - 3) + "…"
				)}`
			);

		return;
	}

	if (
		//* Found 0 errors
		diagnostic.code === 6194 &&
		parseInt(diagnostic.messageText.toString().replace(/\D/g, "")) === 0
	) {
		await copyTask();
		//* Restart child
		await runChild();

		if (!config.silent)
			console.log(
				dsConsolePrefix +
					" " +
					chalk.green(
						diagnostic.messageText
							.toString()
							.substring(0, diagnostic.messageText.toString().length - 1) + "…"
					)
			);
		return;
	}

	//* Errors, no restart
}
