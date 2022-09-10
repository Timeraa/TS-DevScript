import debug from "debug";
import glob from "fast-glob";
import { copy, pathExists, remove } from "fs-extra";
import { basename, extname, join, resolve } from "path";

import { config, name } from "../";

const logger = debug(`${name}:copyTask`);

export default async function copyTask() {
	logger(`Copying files to ${config.out}`);
	const pkgChecks = await Promise.all([
		pathExists("package.json"),
		pathExists("package-lock.json"),
		pathExists("yarn.lock"),
		pathExists("pnpm-lock.yaml")
	]);

	let copyTasks: Promise<void>[] = [];

	if (pkgChecks[0])
		copyTasks.push(copy("package.json", resolve(config.out, `package.json`)));
	if (pkgChecks[1])
		copyTasks.push(
			copy("package-lock.json", resolve(config.out, `package-lock.json`))
		);
	if (pkgChecks[2])
		copyTasks.push(copy("yarn.lock", resolve(config.out, `yarn.lock`)));
	if (pkgChecks[3])
		copyTasks.push(
			copy("pnpm-lock.yaml", resolve(config.out, `pnpm-lock.yaml`))
		);

	//* Copy files from src to dist
	copyTasks.push(
		copy(config.src, config.out, {
			filter: function (path) {
				if (path.includes("/node_modules")) return false;
				return extname(path) !== ".ts";
			}
		})
	);

	if (config.include)
		(await glob(config.include)).forEach((e) =>
			copyTasks.push(copy(e, join(config.out, basename(e))))
		);

	await Promise.all([copyTasks, deleteObsolete()]);
	logger(`Copied files from ${config.src} to ${config.out}`);
}

async function deleteObsolete() {
	if (!config.deleteObsolete || !(await pathExists(resolve(config.out))))
		return;

	logger("Deleting obsolete files…");
	//* Select files
	let dist = await glob("**/*", {
			cwd: config.out,
			onlyFiles: true
		}),
		src = await glob("**/*", {
			cwd: config.src,
			onlyFiles: true
		});

	if (config.include)
		src.push(...(await glob(config.include, { onlyFiles: true })));

	src.push("package.json", "package-lock.json", "yarn.lock", "pnpm-lock.yaml");

	//* Filter file differences
	src = src
		.map((f) => f.split(".")[0])
		.filter((sf) => dist.find((d) => d.split(".")[0] == sf));

	//* Old files, delete
	await Promise.all(
		dist
			.filter(
				(f) =>
					!src.includes(
						(f.startsWith(config.out) ? f.replace(config.out, "") : f).split(
							"."
						)[0]
					)
			)
			.map((f) => remove(resolve(config.out, f)))
	);
	logger("Deleted obsolete files");
}
