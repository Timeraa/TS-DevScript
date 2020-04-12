#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fs_1 = require("fs");
var ts = require("typescript");
var chalk = require("chalk");
// eslint-disable-next-line no-unused-vars
var child_process_1 = require("child_process");
var glob = require("fast-glob");
var fs_extra_1 = require("fs-extra");
var path_1 = require("path");
var chokidar = require("chokidar");
var config = {
    srcDir: "src",
    outDir: "dist",
    deleteObsolete: true,
    tsconfig: "tsconfig.json",
    file: "dist/index.js"
}, child = null, copyTask;
var silentRun = !process.argv.includes("-s") && !process.argv.includes("--silent");
if (silentRun)
    console.log(chalk.yellow("DevScript v" + require(__dirname + "/../package.json").version));
if (fs_1.existsSync(process.cwd() + "/.devScript.json")) {
    try {
        config = JSON.parse(fs_1.readFileSync(process.cwd() + "/.devScript.json", "utf-8"));
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
var formatHost = {
    getCanonicalFileName: function (path) { return path; },
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: function () { return ts.sys.newLine; }
};
//* Create ts program
var createProgram = ts.createSemanticDiagnosticsBuilderProgram;
if (process.argv.includes("--copyOnly")) {
    copyFiles();
}
else {
    var watcher = chokidar.watch(config.srcDir, {
        ignored: /(\.ts)/g,
        persistent: true,
        ignoreInitial: true
    });
    watcher.on("all", function (path) {
        console.log(chalk.blue(path_1.basename(path) + " changed. Restarting..."));
        copyTask = copyFiles();
        restartChild();
    });
    //* Create Watch compoile host
    var host = ts.createWatchCompilerHost(process.cwd() + "/" + config.tsconfig, {}, ts.sys, createProgram, reportDiagnostic, fileChange);
    ts.createWatchProgram(host);
}
function reportDiagnostic(diagnostic) {
    if (silentRun)
        console.log(chalk.redBright(ts.formatDiagnostic(diagnostic, formatHost)));
}
function fileChange(diagnostic) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ([6031, 6032].includes(diagnostic.code)) {
                if (silentRun)
                    console.log(chalk.blue(diagnostic.messageText.toString()));
                copyTask = copyFiles();
            }
            else if ([6194].includes(diagnostic.code)) {
                if (silentRun)
                    console.log(chalk.green(diagnostic.messageText.toString()));
                restartChild();
            }
            else if (silentRun)
                console.log(chalk.yellow(diagnostic.messageText.toString()));
            return [2 /*return*/];
        });
    });
}
function copyFiles() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!config.deleteObsolete) return [3 /*break*/, 2];
                    return [4 /*yield*/, deleteObsolete()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (fs_1.existsSync("package.json"))
                        fs_extra_1.copySync("package.json", config.outDir + "/package.json");
                    if (fs_1.existsSync("package-lock.json"))
                        fs_extra_1.copySync("package-lock.json", config.outDir + "/package-lock.json");
                    if (fs_1.existsSync("yarn.lock"))
                        fs_extra_1.copySync("yarn.lock", config.outDir + "/yarn.lock");
                    //* Copy files from src to dist
                    fs_extra_1.copySync("src", config.outDir, {
                        filter: function (path) {
                            if (path.includes("/node_modules"))
                                return false;
                            return path_1.extname(path) !== ".ts";
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function deleteObsolete() {
    return __awaiter(this, void 0, void 0, function () {
        var dist, src, nDist;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, glob(config.outDir + "/**/*", {
                        onlyFiles: true
                    })];
                case 1:
                    dist = _a.sent();
                    return [4 /*yield*/, glob(config.srcDir + "/**/*", {
                            onlyFiles: true
                        })];
                case 2:
                    src = _a.sent();
                    nDist = dist.map(function (f) { return [f.replace(config.outDir, ""), f]; });
                    src = src
                        .map(function (f) { return f.replace(config.srcDir, "").split(".")[0]; })
                        .filter(function (sf) { return nDist.find(function (d) { return d[0].split(".")[0] == sf; }); });
                    //* Old files, delete
                    dist
                        .filter(function (f) { return !src.includes(f.replace(config.outDir, "").split(".")[0]); })
                        .map(function (f) { return fs_extra_1.removeSync(f); });
                    return [2 /*return*/];
            }
        });
    });
}
function restartChild() {
    return __awaiter(this, void 0, void 0, function () {
        var pjson;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    //* Kill old child
                    //* Spawn new child
                    if (child && !child.killed) {
                        child.unref();
                        child.kill("SIGKILL");
                    }
                    return [4 /*yield*/, copyTask];
                case 1:
                    _a.sent();
                    if (fs_1.existsSync(process.cwd() + "/" + config.outDir + "/" + "index.js")) {
                        if (config.file)
                            child = child_process_1.fork(process.cwd() + "/" + config.file, [], {
                                cwd: config.outDir
                            });
                        else if (fs_1.existsSync(process.cwd() + "/package.json")) {
                            pjson = require(process.cwd() + "/package.json");
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
                    return [2 /*return*/];
            }
        });
    });
}
