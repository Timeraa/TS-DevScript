import { Branch, Tree } from "displayastree";
import { config, dsConsolePrefix, name } from "../index";
import { lockData, updateLock, validateLock } from "./lockHandler";

import AutoPM from "autopm";
import chalk from "chalk";
import { compare } from "compare-versions";
import debug from "debug";
import { sync as glob } from "fast-glob";
import inquirer from "inquirer";
import ora from "ora";
import outline from "./functions/outlineStrings";

const logger = debug(`${name}:depcheck`),
	spinnerSettings = {
		interval: 80,
		frames: [
			chalk.hex("#bebebe")(`( ${chalk.white("●")}   )`),
			chalk.hex("#bebebe")(`(  ${chalk.white("●")}  )`),
			chalk.hex("#bebebe")(`(   ${chalk.white("●")} )`),
			chalk.hex("#bebebe")(`(    ${chalk.white("●")})`),
			chalk.hex("#bebebe")(`(   ${chalk.white("●")} )`),
			chalk.hex("#bebebe")(`(  ${chalk.white("●")}  )`),
			chalk.hex("#bebebe")(`( ${chalk.white("●")}   )`),
			chalk.hex("#bebebe")(`(${chalk.white("●")}    )`)
		]
	},
	defaultChoices = [
		"Latest",
		"Don't update (Ignore this session)",
		"Ignore until next MAJOR",
		"Ignore until next MINOR",
		"Ignore until next PATCH",
		new inquirer.Separator("──────────────────────────────────")
	],
	ignoreThisSession: string[] = [];

export default async function checkDeps(showErrors = true) {
	if (!config.silent)
		console.log(
			`${dsConsolePrefix}${chalk.hex("#ebc14d")("Checking dependencies…")}`
		);

	const jsFiles = glob("**.js"),
		aPM = new AutoPM({
			exclude: config.excludeDeps?.split(",").concat(...jsFiles) || jsFiles
		});
	//! Await recheck since you cant await a new class.
	await aPM.recheck();
	validateLock(aPM.pkgJson.dependencies, aPM.pkgJson.devDependencies || {});
	logger(
		`Dependency check results: ${aPM.unusedModules.length} unused, ${aPM.missingModules.length} missing`
	);

	const sections: Branch[] = [];
	if (!config.silent && aPM.deprecatedModules.length && showErrors) {
		const deprecatedModules = aPM.deprecatedModules.map(
			(m) =>
				`${chalk.hex("#cf47de")(m.module)} • ${chalk.hex("#7289DA")(
					m.deprecatedMessage
				)}`
		);

		//* Spacing between module and deprecated message.
		outline(deprecatedModules, "•");

		sections.push(
			new Branch(
				chalk.hex("#cf47de")(chalk.bold("Deprecated dependencies"))
			).addBranch(deprecatedModules)
		);
	}

	if (!config.silent && aPM.outdatedModules.length && showErrors)
		sections.push(
			new Branch(
				chalk.hex("#3242a8")(chalk.bold("Outdated dependencies"))
			).addBranch(
				aPM.outdatedModules.map((m) => chalk.hex("#6ea2f5")(m.module))
			)
		);

	if (!config.silent && aPM.missingModules.length && showErrors)
		sections.push(
			new Branch(chalk.red(chalk.bold("Missing dependencies"))).addBranch(
				aPM.missingModules.map((c) => chalk.red(c))
			)
		);

	if (!config.silent && aPM.unusedModules.length && showErrors)
		sections.push(
			new Branch(
				chalk.yellowBright(chalk.bold("Unused dependencies"))
			).addBranch(aPM.unusedModules.map((c) => chalk.yellowBright(c)))
		);

	if (sections.length) {
		console.log(
			new Tree("", { headChar: dsConsolePrefix })
				.addBranch(sections)
				.getAsString()
				.split("\n")
				.filter((s) => s !== dsConsolePrefix)
				.join("\n")
		);
	}

	if (config.autoUpdateDeprecated && aPM.deprecatedModules.length) {
		if (config.silent) {
			let updated = false;
			aPM.deprecatedModules.forEach((module) => {
				if (lockData[module.module]) {
					delete lockData[module.module];
					updated = true;
				}
			});
			if (updated) updateLock();
			await aPM.upgradeAllDeprecatedToLatest();
		} else {
			let updated = false;
			aPM.deprecatedModules.forEach((module) => {
				if (lockData[module.module]) {
					delete lockData[module.module];
					updated = true;
				}
			});
			if (updated) updateLock();
			const length = aPM.deprecatedModules.length,
				ies = length === 1 ? "y" : "ies",
				spinner = ora({
					text: chalk.green(
						`Updating ${chalk.bold(length)} deprecated depedenc${ies}…`
					),
					// @ts-expect-error
					color: "bold"
				});
			// @ts-expect-error
			spinner._spinner = spinnerSettings;
			spinner.start();
			await aPM.upgradeAllDeprecatedToLatest();
			spinner.succeed(
				chalk.green(` Updated ${chalk.bold(length)} deprecated depedenc${ies}!`)
			);
		}
	} else if (config.updateSelector && aPM.deprecatedModules.length) {
		await inquirer
			.prompt(
				aPM.deprecatedModules
					//* Filter out ones that are ignored this session.
					.filter((dep) => !ignoreThisSession.includes(dep.module))
					//* Filter out the ones that are in lockdata. Unless their version is higher than they specified.
					.filter((dep) => {
						if (Object.keys(lockData).includes(dep.module)) {
							const ignoredFromVersion = lockData[dep.module].version,
								latestVersion = dep.latestVersion;
							switch (lockData[dep.module].ignoreUntilNext) {
								case "MAJOR": {
									if (
										compare(
											ignoredFromVersion.split(".")[0] + ".0.0",
											latestVersion.split(".")[0] + ".0.0",
											"<"
										)
									) {
										delete lockData[dep.module];
										updateLock();
										return true;
									} else {
										return false;
									}
								}
								case "MINOR": {
									if (
										compare(
											ignoredFromVersion.split(".")[0] +
												"." +
												ignoredFromVersion.split(".")[1] +
												".0",
											latestVersion.split(".")[0] +
												"." +
												latestVersion.split(".")[1] +
												".0",
											"<"
										)
									) {
										delete lockData[dep.module];
										updateLock();
										return true;
									} else {
										return false;
									}
								}
								default: {
									if (compare(ignoredFromVersion, latestVersion, "<")) {
										delete lockData[dep.module];
										updateLock();
										return true;
									} else {
										return false;
									}
								}
							}
						} else {
							return true;
						}
					})
					.map((dep) => {
						return {
							type: "list",
							message: chalk.green(
								`Pick to which version you want to update the ${chalk.hex(
									"#cf47de"
								)("deprecated")} ${chalk.hex("#ebc14d")(dep.module)} module:`
							),
							name: dep.module,
							choices: defaultChoices
								.concat(dep.newerNonDeprecatedVersions)
								.concat([
									new inquirer.Separator("──────────────────────────────────")
								])
								//* add version name to the Latest choice
								.map((choice) =>
									typeof choice === "string" && choice === "Latest"
										? "Latest " +
										  chalk.hex("#bebebe")(`(v${dep.latestVersion})`)
										: choice
								)
								//* Remove the latest version name from choices
								.filter((choice) => choice !== dep.latestVersion)
								//* If there is only Latest and Don't update as choices remove the separator
								.filter((_, index, array) =>
									array.length - 1 === defaultChoices.length &&
									index >= defaultChoices.length - 1
										? false
										: true
								),
							prefix: dsConsolePrefix.trim()
						};
					})
			)
			.then(async (answers: { [key: string]: string }) => {
				const toUpdate: {
					module: string;
					version: string;
				}[] = [];
				for (const [k, v] of Object.entries(answers)) {
					switch (v) {
						case "Ignore until next MAJOR":
							{
								const module = aPM.deprecatedModules.find(
									(m) => m.module === k
								);
								if (!module) continue;
								lockData[k] = {
									version: module.newerNonDeprecatedVersions.length
										? module.newerNonDeprecatedVersions[0]
										: module.currentVersion,
									ignoreUntilNext: "MAJOR"
								};
							}
							break;
						case "Ignore until next MINOR":
							{
								const module = aPM.deprecatedModules.find(
									(m) => m.module === k
								);
								if (!module) continue;
								lockData[k] = {
									version: module.newerNonDeprecatedVersions.length
										? module.newerNonDeprecatedVersions[0]
										: module.currentVersion,
									ignoreUntilNext: "MINOR"
								};
							}
							break;
						case "Ignore until next PATCH":
							{
								const module = aPM.deprecatedModules.find(
									(m) => m.module === k
								);
								if (!module) continue;
								lockData[k] = {
									version: module.newerNonDeprecatedVersions.length
										? module.newerNonDeprecatedVersions[0]
										: module.currentVersion,
									ignoreUntilNext: "PATCH"
								};
							}
							break;
						case "Don't update (Ignore this session)":
							ignoreThisSession.push(k);
							break;
						default: {
							if (v.includes("Latest")) {
								toUpdate.push({ module: k, version: "latest" });
							} else {
								toUpdate.push({ module: k, version: v });
							}
						}
					}
				}
				updateLock();
				if (toUpdate.length) {
					const length = toUpdate.length,
						ies = length === 1 ? "y" : "ies",
						spinner = ora({
							text: chalk.hex("#6ea2f5")(
								`Updating ${chalk.bold(length)} deprecated depedenc${ies}…`
							),
							// @ts-expect-error
							color: "bold"
						});
					// @ts-expect-error
					spinner._spinner = spinnerSettings;
					spinner.start();
					await aPM.upgradeModulesToVersions(
						toUpdate.filter((k) =>
							Object.keys(aPM.pkgJson.dependencies).includes(k.module)
						),
						toUpdate.filter((k) =>
							Object.keys(aPM.pkgJson.devDependencies).includes(k.module)
						)
					);
					spinner.succeed(
						chalk.hex("#6ea2f5")(
							` Updated ${chalk.bold(length)} deprecated depedenc${ies}!`
						)
					);
				}
			})
			.catch((error) => {
				if (error.isTtyError) {
					console.log(
						chalk.red(
							"ERROR | Prompt couldn't be rendered in the current environment."
						)
					);
				} else {
					console.log(
						chalk.red("ERROR | Please report the following error on GitHub!")
					);
					console.log(error);
				}
			});
	}

	if (config.autoUpdateOutdated && aPM.outdatedModules.length) {
		if (config.silent) {
			let updated = false;
			aPM.outdatedModules.forEach((module) => {
				if (lockData[module.module]) {
					delete lockData[module.module];
					updated = true;
				}
			});
			if (updated) updateLock();
			await aPM.upgradeAllOutdatedToLatest();
		} else {
			let updated = false;
			aPM.outdatedModules.forEach((module) => {
				if (lockData[module.module]) {
					delete lockData[module.module];
					updated = true;
				}
			});
			if (updated) updateLock();
			const length = aPM.outdatedModules.length,
				ies = length === 1 ? "y" : "ies",
				spinner = ora({
					text: chalk.green(
						`Updating ${chalk.bold(length)} outdated depedenc${ies}…`
					),
					// @ts-expect-error
					color: "bold"
				});
			// @ts-expect-error
			spinner._spinner = spinnerSettings;
			spinner.start();
			await aPM.upgradeAllOutdatedToLatest();
			spinner.succeed(
				chalk.green(` Updated ${chalk.bold(length)} outdated depedenc${ies}!`)
			);
		}
	} else if (config.updateSelector && aPM.outdatedModules.length) {
		await inquirer
			.prompt(
				aPM.outdatedModules
					//* Filter out ones that are ignored this session.
					.filter((dep) => !ignoreThisSession.includes(dep.module))
					//* Filter out the ones that are in lockdata. Unless their version is higher than they specified.
					.filter((dep) => {
						if (Object.keys(lockData).includes(dep.module)) {
							const ignoredFromVersion = lockData[dep.module].version,
								latestVersion = dep.latestVersion;
							switch (lockData[dep.module].ignoreUntilNext) {
								case "MAJOR": {
									if (
										compare(
											ignoredFromVersion.split(".")[0] + ".0.0",
											latestVersion.split(".")[0] + ".0.0",
											"<"
										)
									) {
										delete lockData[dep.module];
										updateLock();
										return true;
									} else {
										return false;
									}
								}
								case "MINOR": {
									if (
										compare(
											ignoredFromVersion.split(".")[0] +
												"." +
												ignoredFromVersion.split(".")[1] +
												".0",
											latestVersion.split(".")[0] +
												"." +
												latestVersion.split(".")[1] +
												".0",
											"<"
										)
									) {
										delete lockData[dep.module];
										updateLock();
										return true;
									} else {
										return false;
									}
								}
								default: {
									if (compare(ignoredFromVersion, latestVersion, "<")) {
										delete lockData[dep.module];
										updateLock();
										return true;
									} else {
										return false;
									}
								}
							}
						} else {
							return true;
						}
					})
					.map((dep) => {
						return {
							type: "list",
							message: chalk.green(
								`Pick to which version you want to update the ${chalk.hex(
									"#6ea2f5"
								)("outdated")} ${chalk.hex("#ebc14d")(dep.module)} module:`
							),
							name: dep.module,
							choices: defaultChoices
								.concat(dep.newerNonDeprecatedVersions)
								.concat([
									new inquirer.Separator("──────────────────────────────────")
								])
								//* add version name to the Latest choice
								.map((choice) =>
									typeof choice === "string" && choice === "Latest"
										? "Latest " +
										  chalk.hex("#bebebe")(`(v${dep.latestVersion})`)
										: choice
								)
								//* Remove the latest version name from choices
								.filter((choice) => choice !== dep.latestVersion)
								//* If there is only Latest and Don't update as choices remove the separator
								.filter((_, index, array) =>
									array.length - 1 === defaultChoices.length &&
									index >= defaultChoices.length - 1
										? false
										: true
								),
							prefix: dsConsolePrefix.trim()
						};
					})
			)
			.then(async (answers: { [key: string]: string }) => {
				const toUpdate: {
					module: string;
					version: string;
				}[] = [];
				for (const [k, v] of Object.entries(answers)) {
					switch (v) {
						case "Ignore until next MAJOR":
							{
								const module = aPM.outdatedModules.find((m) => m.module === k);
								if (!module) continue;
								lockData[k] = {
									version: module.newerNonDeprecatedVersions.length
										? module.newerNonDeprecatedVersions[0]
										: module.currentVersion,
									ignoreUntilNext: "MAJOR"
								};
							}
							break;
						case "Ignore until next MINOR":
							{
								const module = aPM.outdatedModules.find((m) => m.module === k);
								if (!module) continue;
								lockData[k] = {
									version: module.newerNonDeprecatedVersions.length
										? module.newerNonDeprecatedVersions[0]
										: module.currentVersion,
									ignoreUntilNext: "MINOR"
								};
							}
							break;
						case "Ignore until next PATCH":
							{
								const module = aPM.outdatedModules.find((m) => m.module === k);
								if (!module) continue;
								lockData[k] = {
									version: module.newerNonDeprecatedVersions.length
										? module.newerNonDeprecatedVersions[0]
										: module.currentVersion,
									ignoreUntilNext: "PATCH"
								};
							}
							break;
						case "Don't update (Ignore this session)":
							ignoreThisSession.push(k);
							break;
						default: {
							if (v.includes("Latest")) {
								toUpdate.push({ module: k, version: "latest" });
							} else {
								toUpdate.push({ module: k, version: v });
							}
						}
					}
				}
				updateLock();
				if (toUpdate.length) {
					const length = toUpdate.length,
						ies = length === 1 ? "y" : "ies",
						spinner = ora({
							text: chalk.hex("#6ea2f5")(
								`Updating ${chalk.bold(length)} outdated depedenc${ies}…`
							),
							// @ts-expect-error
							color: "bold"
						});
					// @ts-expect-error
					spinner._spinner = spinnerSettings;
					spinner.start();
					await aPM.upgradeModulesToVersions(
						toUpdate.filter((k) =>
							Object.keys(aPM.pkgJson.dependencies).includes(k.module)
						),
						toUpdate.filter((k) =>
							Object.keys(aPM.pkgJson.devDependencies).includes(k.module)
						)
					);
					spinner.succeed(
						chalk.hex("#6ea2f5")(
							` Updated ${chalk.bold(length)} outdated depedenc${ies}!`
						)
					);
				}
			})
			.catch((error) => {
				if (error.isTtyError) {
					console.log(
						chalk.red(
							"ERROR | Prompt couldn't be rendered in the current environment."
						)
					);
				} else {
					console.log(
						chalk.red("ERROR | Please report the following error on GitHub!")
					);
					console.log(error);
				}
			});
	}

	if (config.autoInstallDep && aPM.missingModules.length) {
		if (config.silent) {
			let updated = false;
			aPM.missingModules.forEach((module) => {
				if (lockData[module]) {
					delete lockData[module];
					updated = true;
				}
			});
			if (updated) updateLock();
			await aPM.installMissing(config.autoInstallTypes);
		} else {
			let updated = false;
			aPM.missingModules.forEach((module) => {
				if (lockData[module]) {
					delete lockData[module];
					updated = true;
				}
			});
			if (updated) updateLock();
			const length = aPM.missingModules.length,
				ies = length === 1 ? "y" : "ies",
				spinner = ora({
					text: chalk.green(
						`Installing ${chalk.bold(length)} missing depedenc${ies}…`
					),
					// @ts-expect-error
					color: "bold"
				});
			// @ts-expect-error
			spinner._spinner = spinnerSettings;
			spinner.start();
			await aPM.installMissing(config.autoInstallTypes);
			spinner.succeed(
				chalk.green(` Installed ${chalk.bold(length)} missing depedenc${ies}!`)
			);
		}
	}

	if (config.autoRemoveDep && aPM.unusedModules.length) {
		if (config.silent) {
			let updated = false;
			aPM.unusedModules.forEach((module) => {
				if (lockData[module]) {
					delete lockData[module];
					updated = true;
				}
			});
			if (updated) updateLock();
			await aPM.uninstallUnused(config.autoRemoveTypes);
		} else {
			let updated = false;
			aPM.unusedModules.forEach((module) => {
				if (lockData[module]) {
					delete lockData[module];
					updated = true;
				}
			});
			if (updated) updateLock();
			const length = aPM.unusedModules.length,
				ies = length === 1 ? "y" : "ies",
				spinner = ora({
					text: chalk.red(
						chalk.bold(
							`Removing ${chalk.reset(chalk.red(length))} ${chalk.red(
								chalk.bold(`unused depedenc${ies}…`)
							)}`
						)
					),
					// @ts-expect-error
					color: "bold"
				});
			// @ts-expect-error
			spinner._spinner = spinnerSettings;
			spinner.start();
			await aPM.uninstallUnused(config.autoRemoveTypes);
			spinner.succeed(
				chalk.red(
					chalk.bold(
						` Removed ${chalk.reset(chalk.red(length))} ${chalk.red(
							chalk.bold(`unused depedenc${ies}!`)
						)}`
					)
				)
			);
		}
	}

	if (aPM.changedModules.length && !config.silent) {
		const installed = aPM.changedModules.filter((m) => m.type === "INSTALLED"),
			updated = aPM.changedModules.filter((m) => m.type === "UPDATED"),
			removed = aPM.changedModules.filter((m) => m.type === "REMOVED"),
			tree = new Tree(chalk.hex("#17E35E")("Summary of dependency changes…"));

		if (installed.length) {
			const stringArray = installed.map(
				(m) =>
					`${chalk.hex("#ebc14d")(m.module)} • ${
						chalk.hex("#bebebe")("Version: ") +
						chalk.green(chalk.bold(m.version.replace("^", "")))
					}${m.devDependency ? " | " + chalk.cyan("devDependency") : ""}`
			);
			outline(stringArray, "•");
			outline(stringArray, "|");
			tree.addBranch([
				new Branch(chalk.green("Installed")).addBranch(
					stringArray.map((m) => m.replace("|", "•"))
				)
			]);
		}

		if (updated.length) {
			const stringArray = updated.map(
				(m) =>
					`${chalk.hex("#ebc14d")(m.module)} • ${chalk.hex("#bebebe")(
						"from: " +
							chalk.green(chalk.bold(m.fromVersion!.replace("^", ""))) +
							"! to: " +
							chalk.green(chalk.bold(m.version.replace("^", "")))
					)}${m.devDependency ? " | " + chalk.cyan("devDependency") : ""}`
			);
			outline(stringArray, "•");
			outline(stringArray, "!");
			outline(stringArray, "|");
			tree.addBranch([
				new Branch(chalk.hex("#6ea2f5")("Updated")).addBranch(
					stringArray.map((m) => m.replace("!", "").replace("|", "•"))
				)
			]);
		}

		if (removed.length) {
			const stringArray = removed.map(
				(m) =>
					`${chalk.hex("#ebc14d")(m.module)} • ${
						chalk.hex("#bebebe")("Version: ") +
						chalk.green(chalk.bold(m.version.replace("^", "")))
					}${m.devDependency ? " | " + chalk.cyan("devDependency") : ""}`
			);
			outline(stringArray, "•");
			outline(stringArray, "|");
			tree.addBranch([
				new Branch(chalk.red("Removed")).addBranch(
					stringArray.map((m) => m.replace("|", "•"))
				)
			]);
		}

		tree.log();
	}

	return aPM.changedModules.length > 0;
}
