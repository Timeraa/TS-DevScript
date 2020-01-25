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
const chokidar_1 = __importDefault(require("chokidar"));
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
    const watcher = chokidar_1.default.watch(config.srcDir, {
        ignored: /(\.ts)/g,
        persistent: true,
        ignoreInitial: true
    });
    watcher.on("all", (eventName, path, stats) => {
        console.log(chalk_1.default.blue(`${path_1.basename(path)} changed. Restarting...`));
        copyTask = copyFiles();
        restartChild();
    });
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
        restartChild();
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
async function restartChild() {
    if (child && !child.killed) {
        child.unref();
        child.kill();
    }
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
            child = child_process_1.fork(process.cwd() + "/index.js", [], {
                cwd: config.outDir
            });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUVBLDJCQUE4QztBQUM5QywrQ0FBaUM7QUFDakMsa0RBQTBCO0FBQzFCLGlEQUEwRDtBQUMxRCwwREFBNkI7QUFDN0IsdUNBQWdEO0FBQ2hELCtCQUF5QztBQUV6Qyx3REFBZ0M7QUFFaEMsSUFBSSxNQUFNLEdBQUc7SUFDWCxNQUFNLEVBQUUsS0FBSztJQUNiLE1BQU0sRUFBRSxNQUFNO0lBQ2QsY0FBYyxFQUFFLElBQUk7SUFDcEIsUUFBUSxFQUFFLGVBQWU7SUFDekIsSUFBSSxFQUFFLGVBQWU7Q0FDckIsRUFDRCxLQUFLLEdBQWlCLElBQUksRUFDMUIsUUFBc0IsQ0FBQztBQUV4QixNQUFNLFNBQVMsR0FDZCxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7QUFFcEUsSUFBSSxTQUFTO0lBQ1osT0FBTyxDQUFDLEdBQUcsQ0FDVixlQUFLLENBQUMsTUFBTSxDQUNYLGNBQWMsT0FBTyxDQUFDLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUMvRCxDQUNELENBQUM7QUFFSCxJQUFJLGVBQVUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsa0JBQWtCLENBQUMsRUFBRTtJQUNuRCxJQUFJO1FBQ0gsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQ2xCLGlCQUFZLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxDQUN6RCxDQUFDO0tBQ0Y7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNYLE9BQU8sQ0FBQyxLQUFLLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FB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