#!/usr/bin/env node
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const ts = __importStar(require("typescript"));
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
const fast_glob_1 = __importDefault(require("fast-glob"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
let config = {
    srcDir: "src",
    outDir: "dist",
    deleteObsolete: true,
    tsconfig: "tsconfig.json",
    file: "dist/index.js"
}, child = null, copyTask;
const silentRun = !process.argv.includes("-s") && !process.argv.includes("--silent");
if (silentRun)
    console.log(chalk_1.default.yellow(`DevScript v${require(__dirname + "/../package.json").version}`));
if (fs_1.existsSync(`${process.cwd()}/.devScript.json`)) {
    try {
        config = JSON.parse(fs_1.readFileSync(`${process.cwd()}/.devScript.json`, "utf-8"));
    }
    catch (e) {
        console.error("Invalid Syntax:", e.message);
        process.exit();
    }
}
if (!config.srcDir)
    config.srcDir = "src";
if (!config.outDir)
    config.outDir = "dist";
if (!config.deleteObsolete)
    config.deleteObsolete = true;
if (!config.tsconfig)
    config.tsconfig = "tsconfig.json";
const formatHost = {
    getCanonicalFileName: path => path,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine
};
const createProgram = ts.createSemanticDiagnosticsBuilderProgram;
if (process.argv.includes("--copyOnly")) {
    copyFiles();
}
else {
    const host = ts.createWatchCompilerHost(`${process.cwd()}/${config.tsconfig}`, {}, ts.sys, createProgram, reportDiagnostic, fileChange);
    ts.createWatchProgram(host);
}
function reportDiagnostic(diagnostic) {
    if (silentRun)
        console.log(chalk_1.default.redBright(ts.formatDiagnostic(diagnostic, formatHost)));
}
async function fileChange(diagnostic) {
    if ([6031, 6032].includes(diagnostic.code)) {
        if (silentRun)
            console.log(chalk_1.default.blue(diagnostic.messageText.toString()));
        copyTask = copyFiles();
    }
    else if ([6194].includes(diagnostic.code)) {
        if (silentRun)
            console.log(chalk_1.default.green(diagnostic.messageText.toString()));
        if (child && !child.killed)
            child.kill("SIGINT");
        await copyTask;
        if (fs_1.existsSync(process.cwd() + "/" + config.outDir + "/" + "index.js")) {
            if (config.file)
                child = child_process_1.fork(process.cwd() + "/" + config.file, [], {
                    cwd: config.outDir
                });
            else if (fs_1.existsSync(process.cwd() + "/package.json")) {
                const pjson = require(process.cwd() + "/package.json");
                if (pjson.scripts && pjson.scripts.start)
                    child = child_process_1.spawn(fs_1.existsSync(process.cwd() + "/yarn.lock")
                        ? "yarn run --silent start"
                        : "npm run --silent start", {
                        shell: true,
                        stdio: "inherit"
                    });
            }
            else
                child_process_1.fork(process.cwd() + "/index.js", [], {
                    cwd: config.outDir
                });
        }
    }
    else if (silentRun)
        console.log(chalk_1.default.yellow(diagnostic.messageText.toString()));
}
async function copyFiles() {
    if (config.deleteObsolete)
        await deleteObsolete();
    if (fs_1.existsSync("package.json"))
        fs_extra_1.copySync("package.json", `${config.outDir}/package.json`);
    if (fs_1.existsSync("package-lock.json"))
        fs_extra_1.copySync("package-lock.json", `${config.outDir}/package-lock.json`);
    if (fs_1.existsSync("yarn.lock"))
        fs_extra_1.copySync("yarn.lock", `${config.outDir}/yarn.lock`);
    fs_extra_1.copySync("src", config.outDir, {
        filter: function (path) {
            if (path.includes("/node_modules"))
                return false;
            return path_1.extname(path) !== ".ts";
        }
    });
}
async function deleteObsolete() {
    let dist = await fast_glob_1.default(config.outDir + "/**/*", {
        onlyFiles: true
    }), src = await fast_glob_1.default(config.srcDir + "/**/*", {
        onlyFiles: true
    });
    let nDist = dist.map(f => [f.replace(config.outDir, ""), f]);
    src = src
        .map(f => f.replace(config.srcDir, "").split(".")[0])
        .filter(sf => nDist.find(d => d[0].split(".")[0] == sf));
    Promise.all(dist
        .filter(f => !src.includes(f.replace(config.outDir, "").split(".")[0]))
        .map(f => fs_extra_1.removeSync(f)));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUVBLDJCQUE4QztBQUM5QywrQ0FBaUM7QUFDakMsa0RBQTBCO0FBQzFCLGlEQUEwRDtBQUMxRCwwREFBNkI7QUFDN0IsdUNBQWdEO0FBQ2hELCtCQUErQjtBQUUvQixJQUFJLE1BQU0sR0FBRztJQUNULE1BQU0sRUFBRSxLQUFLO0lBQ2IsTUFBTSxFQUFFLE1BQU07SUFDZCxjQUFjLEVBQUUsSUFBSTtJQUNwQixRQUFRLEVBQUUsZUFBZTtJQUN6QixJQUFJLEVBQUUsZUFBZTtDQUN0QixFQUNELEtBQUssR0FBaUIsSUFBSSxFQUMxQixRQUFzQixDQUFDO0FBQ3pCLE1BQU0sU0FBUyxHQUNiLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUVyRSxJQUFJLFNBQVM7SUFDWCxPQUFPLENBQUMsR0FBRyxDQUNULGVBQUssQ0FBQyxNQUFNLENBQ1YsY0FBYyxPQUFPLENBQUMsU0FBUyxHQUFHLGtCQUFrQixDQUFDLENBQUMsT0FBTyxFQUFFLENBQ2hFLENBQ0YsQ0FBQztBQUVKLElBQUksZUFBVSxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxrQkFBa0IsQ0FBQyxFQUFFO0lBQ2xELElBQUk7UUFDRixNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FDakIsaUJBQVksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLENBQzFELENBQUM7S0FDSDtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsT0FBTyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDNUMsT0FBTyxDQUFD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