import * as leasot from "leasot";

import { basename, extname, join } from "path";
import chalk, { hex } from "chalk";
import { config, dsConsolePrefix, name } from "../index";

import debug from "debug";
import { displayAsTree } from "./functions/displayAsTreePrefix";
import glob from "fast-glob";
import outline from "./functions/outlineStrings";
import { readFileSync } from "fs";

const logger = debug(`${name}:todocheck`);

export default async function checkTodos() {
	logger("Running TODO check...");
	const files = (
			await glob("**/*.ts", { cwd: process.cwd(), onlyFiles: true })
		).filter((f) => !f.startsWith("node_modules")),
		todos: {
			[name: string]: {
				line: number;
				ref: string;
				text: string;
				tag: string;
				path: string;
			}[];
		} = {};
	let count = 0;

	for (const file of files) {
		const fileTodos = leasot.parse(
			readFileSync(join(process.cwd(), file), "utf-8"),
			{
				extension: extname(file),
				filename: basename(file),
				customTags: config.todoTags.split(",")
			}
		);

		fileTodos.forEach((todo) => {
			count++;
			if (todos[todo.file]) {
				todos[todo.file].push({
					line: todo.line,
					ref: todo.ref,
					text: todo.text,
					tag: todo.tag,
					path: join(process.cwd(), file)
				});
			} else {
				todos[todo.file] = [
					{
						line: todo.line,
						ref: todo.ref,
						text: todo.text,
						tag: todo.tag,
						path: join(process.cwd(), file)
					}
				];
			}
		});
	}

	Object.keys(todos).forEach((file) => {
		todos[file].sort((a, b) => a.line - b.line);
	});

	const finalObj: {
		[name: string]: string[];
	} = {};
	Object.keys(todos).forEach((file) => {
		finalObj[file] = todos[file].map(
			(todo) =>
				`${chalk.yellowBright(todo.path)}${chalk.hex("#bebebe")(
					"(" + todo.line + ")"
				)} • ${
					todo.tag === "TODO"
						? chalk.hex("#FF8C00")(todo.tag)
						: todo.tag === "FIXME"
						? chalk.hex("#FF2D00")(todo.tag)
						: chalk.hex("#98C379")(todo.tag)
				} ${chalk.hex("#7289DA")(todo.text)}${
					todo.ref ? " • " + chalk.green("Ref: " + todo.ref) : ""
				}`
		);
	});

	logger(`TODO check finished. Found ${count} TODO's.`);

	if (Object.keys(finalObj).length > 0) {
		console.log(
			`${dsConsolePrefix} ${chalk.hex("#FF8C00")(
				"Found " + count + " TODO's…"
			)}`
		);
		let i = 0;
		for (const [fileName, todoArray] of Object.entries(finalObj)) {
			//* Spacing between src and error message.
			outline(todoArray, "•");

			i++;
			if (Object.keys(finalObj).length > 1) {
				if (Object.keys(finalObj).length === i) {
					console.log(`╰─ ${chalk.bold(chalk.cyan(fileName))}`);
					displayAsTree(todoArray, "   ");
				} else {
					console.log(`├─ ${chalk.bold(chalk.cyan(fileName))}`);
					displayAsTree(todoArray, "│  ");
				}
			} else {
				console.log(`╰─ ${chalk.bold(chalk.cyan(fileName))}`);
				displayAsTree(todoArray, "   ");
			}
		}
	}
}
