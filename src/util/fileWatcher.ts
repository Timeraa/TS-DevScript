import chalk from "chalk";
import chokidar from "chokidar";
import { basename } from "path";

import { config, dsConsolePrefix } from "../";
import runChild from "./childHandler";
import copyTask from "./copyTask";

export default async function runFileWatcher() {
	const watcher = chokidar.watch(config.src, {
		ignored: ["**/*.ts", config.ignore],
		persistent: true,
		cwd: process.cwd(),
		ignoreInitial: true
	});

	if (config.include)
		chokidar
			.watch(config.include, { persistent: true, ignoreInitial: true })
			.on("all", (e, p) => watcher.emit("all", e, p));

	watcher.on("all", async (event, path) => {
		let fileEvent: string = "changed";
		switch (event) {
			case "add":
				fileEvent = "added";
				break;
			case "unlink":
				fileEvent = "deleted";
				break;
		}

		if (!config.silent)
			console.log(
				dsConsolePrefix +
					chalk.yellowBright(
						` ${chalk.cyan(basename(path))} ${fileEvent}, restarting…`
					)
			);

		await copyTask();
		runChild();
	});
}
