#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
const chokidar_1 = __importDefault(require("chokidar"));
const fast_glob_1 = __importDefault(require("fast-glob"));
const fs_1 = require("fs");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const typescript_1 = __importDefault(require("typescript"));
let config = {
    srcDir: "src",
    outDir: "dist",
    deleteObsolete: true,
    tsconfig: "tsconfig.json",
    file: ""
}, child = null, copyTask;
const silentRun = !process.argv.includes("-s") && !process.argv.includes("--silent"), tsConsolePrefix = chalk_1.default.bgBlue(chalk_1.default.bold(chalk_1.default.white(" TS "))) + " ", dsConsolePrefix = chalk_1.default.yellow("</>  ");
if (silentRun)
    console.log(chalk_1.default.yellowBright(`${dsConsolePrefix}DevScript • v${require(__dirname + "/../package.json").version}`));
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
    getCanonicalFileName: (path) => path,
    getCurrentDirectory: typescript_1.default.sys.getCurrentDirectory,
    getNewLine: () => ""
};
const createProgram = typescript_1.default.createSemanticDiagnosticsBuilderProgram;
if (process.argv.includes("--copyOnly")) {
    copyFiles();
}
else {
    const watcher = chokidar_1.default.watch(config.srcDir, {
        ignored: /(\.ts)/g,
        persistent: true,
        ignoreInitial: true
    });
    watcher.on("all", (path) => {
        console.log(dsConsolePrefix +
            chalk_1.default.yellowBright(`${chalk_1.default.cyan(path_1.basename(path))} updated, restarting...`));
        copyTask = copyFiles();
        restartChild();
    });
    const host = typescript_1.default.createWatchCompilerHost(`${process.cwd()}/${config.tsconfig}`, {}, typescript_1.default.sys, createProgram, reportDiagnostic, fileChange);
    typescript_1.default.createWatchProgram(host);
}
function reportDiagnostic(diagnostic) {
    if (silentRun)
        console.log(tsConsolePrefix +
            chalk_1.default.redBright(typescript_1.default.formatDiagnostic(diagnostic, formatHost)));
}
async function fileChange(diagnostic) {
    if ([6031, 6032].includes(diagnostic.code)) {
        if (silentRun)
            console.log(tsConsolePrefix + chalk_1.default.cyan(diagnostic.messageText.toString()));
        copyTask = copyFiles();
    }
    else if (diagnostic.code === 6194 &&
        parseInt(diagnostic.messageText.toString().replace(/\D/g, "")) === 0) {
        if (silentRun)
            console.log(tsConsolePrefix + chalk_1.default.green(diagnostic.messageText.toString()));
        restartChild();
    }
    else if (silentRun) {
        if ([6193, 6194].includes(diagnostic.code)) {
            console.log();
            console.log(tsConsolePrefix +
                chalk_1.default.bold(chalk_1.default.redBright(diagnostic.messageText.toString())));
        }
    }
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
    let nDist = dist.map((f) => [f.replace(config.outDir, ""), f]);
    src = src
        .map((f) => f.replace(config.srcDir, "").split(".")[0])
        .filter((sf) => nDist.find((d) => d[0].split(".")[0] == sf));
    dist
        .filter((f) => !src.includes(f.replace(config.outDir, "").split(".")[0]))
        .map((f) => fs_extra_1.removeSync(f));
}
async function restartChild() {
    if (child && !child.killed) {
        child.kill("SIGINT");
    }
    await copyTask;
    if (fs_1.existsSync(process.cwd() + "/" + config.outDir + "/" + "index.js")) {
        if (config.file) {
            child = child_process_1.fork(process.cwd() + "/" + config.file, [], {
                cwd: config.outDir
            });
            return;
        }
        else if (fs_1.existsSync(process.cwd() + "/package.json")) {
            const pjson = require(process.cwd() + "/package.json");
            if (pjson.scripts && pjson.scripts.start) {
                child = child_process_1.spawn(fs_1.existsSync(process.cwd() + "/yarn.lock")
                    ? "yarn run --silent start"
                    : "npm run --silent start", {
                    shell: true,
                    stdio: "inherit"
                });
                return;
            }
        }
        child = child_process_1.fork(process.cwd() + "/" + config.outDir + "/index.js", [], {
            cwd: config.outDir
        });
        child.on("exit", (code) => {
            if (code === null)
                return;
            console.log(dsConsolePrefix +
                chalk_1.default.yellowBright(`Process exited with exit code ${chalk_1.default.yellow(chalk_1.default.cyan(code))}, waiting for changes...`));
            child = null;
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290Ijoic3JjLyIsInNvdXJjZXMiOlsiaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0Esa0RBQTBCO0FBQzFCLGlEQUEwRDtBQUMxRCx3REFBZ0M7QUFDaEMsMERBQTZCO0FBQzdCLDJCQUE4QztBQUM5Qyx1Q0FBZ0Q7QUFDaEQsK0JBQXlDO0FBQ3pDLDREQUE0QjtBQUk1QixJQUFJLE1BQU0sR0FBRztJQUNYLE1BQU0sRUFBRSxLQUFLO0lBQ2IsTUFBTSxFQUFFLE1BQU07SUFDZCxjQUFjLEVBQUUsSUFBSTtJQUNwQixRQUFRLEVBQUUsZUFBZTtJQUN6QixJQUFJLEVBQUUsRUFBRTtDQUNSLEVBQ0QsS0FBSyxHQUFpQixJQUFJLEVBQzFCLFFBQXNCLENBQUM7QUFFeEIsTUFBTSxTQUFTLEdBQ2IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUNuRSxlQUFlLEdBQUcsZUFBSyxDQUFDLE1BQU0sQ0FBQyxlQUFLLENBQUMsSUFBSSxDQUFDLGVBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFDckUsZUFBZSxHQUFHLGVBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFFekMsSUFBSSxTQUFTO0lBQ1osT0FBTyxDQUFDLEdBQUcsQ0FDVixlQUFLLENBQUMsWUFBWSxDQUNqQixHQUFHLGVBQWUsZ0JBQ2pCLE9BQU8sQ0FBQyxTQUFTLEdBQUcsa0JBQWtCLENBQUMsQ0FBQyxPQUN6QyxFQUFFLENBQ0YsQ0FDRCxDQUFDO0FBRUgsSUFBSSxlQUFVLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLGtCQUFrQixDQUFDLEVBQUU7SUFDbkQsSUFBSTtRQUNILE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUNsQixpQkFB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WixlQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLFlBQVksQ0FBQztvQkFDdkMsQ0FBQyxDQUFDLHlCQUF5QjtvQkFDM0IsQ0FBQyxDQUFDLHdCQUF3QixFQUMzQjtvQkFDQyxLQUFLLEVBQUUsSUFBSTtvQkFDWCxLQUFLLEVBQUUsU0FBUztpQkFDaEIsQ0FDRCxDQUFDO2dCQUNGLE9BQU87YUFDUDtTQUNEO1FBRUQsS0FBSyxHQUFHLG9CQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLFdBQVcsRUFBRSxFQUFFLEVBQUU7WUFDbkUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxNQUFNO1NBQ2xCLENBQUMsQ0FBQztRQUVILEtBQUssQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDekIsSUFBSSxJQUFJLEtBQUssSUFBSTtnQkFBRSxPQUFPO1lBRTFCLE9BQU8sQ0FBQyxHQUFHLENBQ1YsZUFBZTtnQkFDZCxlQUFLLENBQUMsWUFBWSxDQUNqQixpQ0FBaUMsZUFBSyxDQUFDLE1BQU0sQ0FDNUMsZUFBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDaEIsMEJBQTBCLENBQzNCLENBQ0YsQ0FBQztZQUNGLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDZCxDQUFDLENBQUMsQ0FBQztLQUNIO0FBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcclxuaW1wb3J0IGNoYWxrIGZyb20gXCJjaGFsa1wiO1xyXG5pbXBvcnQgeyBDaGlsZFByb2Nlc3MsIGZvcmssIHNwYXduIH0gZnJvbSBcImNoaWxkX3Byb2Nlc3NcIjtcclxuaW1wb3J0IGNob2tpZGFyIGZyb20gXCJjaG9raWRhclwiO1xyXG5pbXBvcnQgZ2xvYiBmcm9tIFwiZmFzdC1nbG9iXCI7XHJcbmltcG9ydCB7IGV4aXN0c1N5bmMsIHJlYWRGaWxlU3luYyB9IGZyb20gXCJmc1wiO1xyXG5pbXBvcnQgeyBjb3B5U3luYywgcmVtb3ZlU3luYyB9IGZyb20gXCJmcy1leHRyYVwiO1xyXG5pbXBvcnQgeyBiYXNlbmFtZSwgZXh0bmFtZSB9IGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB0cyBmcm9tIFwidHlwZXNjcmlwdFwiO1xyXG5cclxuLy9UT0RPIEFkZCBydW4gYW55d2F5cyBvcHRpb24gaWYgZXJyb3JzIGhhcHBlblxyXG5cclxubGV0IGNvbmZpZyA9IHtcclxuXHRcdHNyY0RpcjogXCJzcmNcIixcclxuXHRcdG91dERpcjogXCJkaXN0XCIsXHJcblx0XHRkZWxldGVPYnNvbGV0ZTogdHJ1ZSxcclxuXHRcdHRzY29uZmlnOiBcInRzY29uZmlnLmpzb25cIixcclxuXHRcdGZpbGU6IFwiXCJcclxuXHR9LFxyXG5cdGNoaWxkOiBDaGlsZFByb2Nlc3MgPSBudWxsLFxyXG5cdGNvcHlUYXNrOiBQcm9taXNlPGFueT47XHJcblxyXG5jb25zdCBzaWxlbnRSdW4gPVxyXG5cdFx0IXByb2Nlc3MuYXJndi5pbmNsdWRlcyhcIi1zXCIpICYmICFwcm9jZXNzLmFyZ3YuaW5jbHVkZXMoXCItLXNpbGVudFwiKSxcclxuXHR0c0NvbnNvbGVQcmVmaXggPSBjaGFsay5iZ0JsdWUoY2hhbGsuYm9sZChjaGFsay53aGl0ZShcIiBUUyBcIikpKSArIFwiIFwiLFxyXG5cdGRzQ29uc29sZVByZWZpeCA9IGNoYWxrLnllbGxvdyhcIjwvPiAgXCIpO1xyXG5cclxuaWYgKHNpbGVudFJ1bilcclxuXHRjb25zb2xlLmxvZyhcclxuXHRcdGNoYWxrLnllbGxvd0JyaWdodChcclxuXHRcdFx0YCR7ZHNDb25zb2xlUHJlZml4fURldlNjcmlwdCDigKIgdiR7XHJcblx0XHRcdFx0cmVxdWlyZShfX2Rpcm5hbWUgKyBcIi8uLi9wYWNrYWdlLmpzb25cIikudmVyc2lvblxyXG5cdFx0XHR9YFxyXG5cdFx0KVxyXG5cdCk7XHJcblxyXG5pZiAoZXhpc3RzU3luYyhgJHtwcm9jZXNzLmN3ZCgpfS8uZGV2U2NyaXB0Lmpzb25gKSkge1xyXG5cdHRyeSB7XHJcblx0XHRjb25maWcgPSBKU09OLnBhcnNlKFxyXG5cdFx0XHRyZWFkRmlsZVN5bmMoYCR7cHJvY2Vzcy5jd2QoKX0vLmRldlNjcmlwdC5qc29uYCwgXCJ1dGYtOFwiKVxyXG5cdFx0KTtcclxuXHR9IGNhdGNoIChlKSB7XHJcblx0XHRjb25zb2xlLmVycm9yKFwiSW52YWxpZCBTeW50YXg6XCIsIGUubWVzc2FnZSk7XHJcblx0XHRwcm9jZXNzLmV4aXQoKTtcclxuXHR9XHJcbn1cclxuXHJcbmlmICghY29uZmlnLnNyY0RpcikgY29uZmlnLnNyY0RpciA9IFwic3JjXCI7XHJcbmlmICghY29uZmlnLm91dERpcikgY29uZmlnLm91dERpciA9IFwiZGlzdFwiO1xyXG5pZiAoIWNvbmZpZy5kZWxldGVPYnNvbGV0ZSkgY29uZmlnLmRlbGV0ZU9ic29sZXRlID0gdHJ1ZTtcclxuaWYgKCFjb25maWcudHNjb25maWcpIGNvbmZpZy50c2NvbmZpZyA9IFwidHNjb25maWcuanNvblwiO1xyXG5cclxuY29uc3QgZm9ybWF0SG9zdDogdHMuRm9ybWF0RGlhZ25vc3RpY3NIb3N0ID0ge1xyXG5cdGdldENhbm9uaWNhbEZpbGVOYW1lOiAocGF0aCkgPT4gcGF0aCxcclxuXHRnZXRDdXJyZW50RGlyZWN0b3J5OiB0cy5zeXMuZ2V0Q3VycmVudERpcmVjdG9yeSxcclxuXHRnZXROZXdMaW5lOiAoKSA9PiBcIlwiXHJcbn07XHJcblxyXG4vLyogQ3JlYXRlIHRzIHByb2dyYW1cclxuY29uc3QgY3JlYXRlUHJvZ3JhbSA9IHRzLmNyZWF0ZVNlbWFudGljRGlhZ25vc3RpY3NCdWlsZGVyUHJvZ3JhbTtcclxuXHJcbmlmIChwcm9jZXNzLmFyZ3YuaW5jbHVkZXMoXCItLWNvcHlPbmx5XCIpKSB7XHJcblx0Y29weUZpbGVzKCk7XHJcbn0gZWxzZSB7XHJcblx0Y29uc3Qgd2F0Y2hlciA9IGNob2tpZGFyLndhdGNoKGNvbmZpZy5zcmNEaXIsIHtcclxuXHRcdGlnbm9yZWQ6IC8oXFwudHMpL2csXHJcblx0XHRwZXJzaXN0ZW50OiB0cnVlLFxyXG5cdFx0aWdub3JlSW5pdGlhbDogdHJ1ZVxyXG5cdH0pO1xyXG5cclxuXHR3YXRjaGVyLm9uKFwiYWxsXCIsIChwYXRoKSA9PiB7XHJcblx0XHRjb25zb2xlLmxvZyhcclxuXHRcdFx0ZHNDb25zb2xlUHJlZml4ICtcclxuXHRcdFx0XHRjaGFsay55ZWxsb3dCcmlnaHQoXHJcblx0XHRcdFx0XHRgJHtjaGFsay5jeWFuKGJhc2VuYW1lKHBhdGgpKX0gdXBkYXRlZCwgcmVzdGFydGluZy4uLmBcclxuXHRcdFx0XHQpXHJcblx0XHQpO1xyXG5cdFx0Y29weVRhc2sgPSBjb3B5RmlsZXMoKTtcclxuXHJcblx0XHRyZXN0YXJ0Q2hpbGQoKTtcclxuXHR9KTtcclxuXHQvLyogQ3JlYXRlIFdhdGNoIGNvbXBvaWxlIGhvc3RcclxuXHRjb25zdCBob3N0ID0gdHMuY3JlYXRlV2F0Y2hDb21waWxlckhvc3QoXHJcblx0XHRgJHtwcm9jZXNzLmN3ZCgpfS8ke2NvbmZpZy50c2NvbmZpZ31gLFxyXG5cdFx0e30sXHJcblx0XHR0cy5zeXMsXHJcblx0XHRjcmVhdGVQcm9ncmFtLFxyXG5cdFx0cmVwb3J0RGlhZ25vc3RpYyxcclxuXHRcdGZpbGVDaGFuZ2VcclxuXHQpO1xyXG5cdHRzLmNyZWF0ZVdhdGNoUHJvZ3JhbShob3N0KTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVwb3J0RGlhZ25vc3RpYyhkaWFnbm9zdGljOiB0cy5EaWFnbm9zdGljKSB7XHJcblx0aWYgKHNpbGVudFJ1bilcclxuXHRcdGNvbnNvbGUubG9nKFxyXG5cdFx0XHR0c0NvbnNvbGVQcmVmaXggK1xyXG5cdFx0XHRcdGNoYWxrLnJlZEJyaWdodCh0cy5mb3JtYXREaWFnbm9zdGljKGRpYWdub3N0aWMsIGZvcm1hdEhvc3QpKVxyXG5cdFx0KTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsZUNoYW5nZShkaWFnbm9zdGljOiB0cy5EaWFnbm9zdGljKSB7XHJcblx0aWYgKFs2MDMxLCA2MDMyXS5pbmNsdWRlcyhkaWFnbm9zdGljLmNvZGUpKSB7XHJcblx0XHRpZiAoc2lsZW50UnVuKVxyXG5cdFx0XHRjb25zb2xlLmxvZyhcclxuXHRcdFx0XHR0c0NvbnNvbGVQcmVmaXggKyBjaGFsay5jeWFuKGRpYWdub3N0aWMubWVzc2FnZVRleHQudG9TdHJpbmcoKSlcclxuXHRcdFx0KTtcclxuXHRcdGNvcHlUYXNrID0gY29weUZpbGVzKCk7XHJcblx0fSBlbHNlIGlmIChcclxuXHRcdGRpYWdub3N0aWMuY29kZSA9PT0gNjE5NCAmJlxyXG5cdFx0cGFyc2VJbnQoZGlhZ25vc3RpYy5tZXNzYWdlVGV4dC50b1N0cmluZygpLnJlcGxhY2UoL1xcRC9nLCBcIlwiKSkgPT09IDBcclxuXHQpIHtcclxuXHRcdGlmIChzaWxlbnRSdW4pXHJcblx0XHRcdGNvbnNvbGUubG9nKFxyXG5cdFx0XHRcdHRzQ29uc29sZVByZWZpeCArIGNoYWxrLmdyZWVuKGRpYWdub3N0aWMubWVzc2FnZVRleHQudG9TdHJpbmcoKSlcclxuXHRcdFx0KTtcclxuXHJcblx0XHRyZXN0YXJ0Q2hpbGQoKTtcclxuXHR9IGVsc2UgaWYgKHNpbGVudFJ1bikge1xyXG5cdFx0aWYgKFs2MTkzLCA2MTk0XS5pbmNsdWRlcyhkaWFnbm9zdGljLmNvZGUpKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCk7XHJcblx0XHRcdGNvbnNvbGUubG9nKFxyXG5cdFx0XHRcdHRzQ29uc29sZVByZWZpeCArXHJcblx0XHRcdFx0XHRjaGFsay5ib2xkKGNoYWxrLnJlZEJyaWdodChkaWFnbm9zdGljLm1lc3NhZ2VUZXh0LnRvU3RyaW5nKCkpKVxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gY29weUZpbGVzKCkge1xyXG5cdGlmIChjb25maWcuZGVsZXRlT2Jzb2xldGUpIGF3YWl0IGRlbGV0ZU9ic29sZXRlKCk7XHJcblxyXG5cdGlmIChleGlzdHNTeW5jKFwicGFja2FnZS5qc29uXCIpKVxyXG5cdFx0Y29weVN5bmMoXCJwYWNrYWdlLmpzb25cIiwgYCR7Y29uZmlnLm91dERpcn0vcGFja2FnZS5qc29uYCk7XHJcblx0aWYgKGV4aXN0c1N5bmMoXCJwYWNrYWdlLWxvY2suanNvblwiKSlcclxuXHRcdGNvcHlTeW5jKFwicGFja2FnZS1sb2NrLmpzb25cIiwgYCR7Y29uZmlnLm91dERpcn0vcGFja2FnZS1sb2NrLmpzb25gKTtcclxuXHRpZiAoZXhpc3RzU3luYyhcInlhcm4ubG9ja1wiKSlcclxuXHRcdGNvcHlTeW5jKFwieWFybi5sb2NrXCIsIGAke2NvbmZpZy5vdXREaXJ9L3lhcm4ubG9ja2ApO1xyXG5cclxuXHQvLyogQ29weSBmaWxlcyBmcm9tIHNyYyB0byBkaXN0XHJcblx0Y29weVN5bmMoXCJzcmNcIiwgY29uZmlnLm91dERpciwge1xyXG5cdFx0ZmlsdGVyOiBmdW5jdGlvbiAocGF0aCkge1xyXG5cdFx0XHRpZiAocGF0aC5pbmNsdWRlcyhcIi9ub2RlX21vZHVsZXNcIikpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0cmV0dXJuIGV4dG5hbWUocGF0aCkgIT09IFwiLnRzXCI7XHJcblx0XHR9XHJcblx0fSk7XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGRlbGV0ZU9ic29sZXRlKCkge1xyXG5cdC8vKiBTZWxlY3QgZmlsZXNcclxuXHRsZXQgZGlzdCA9IGF3YWl0IGdsb2IoY29uZmlnLm91dERpciArIFwiLyoqLypcIiwge1xyXG5cdFx0XHRvbmx5RmlsZXM6IHRydWVcclxuXHRcdH0pLFxyXG5cdFx0c3JjID0gYXdhaXQgZ2xvYihjb25maWcuc3JjRGlyICsgXCIvKiovKlwiLCB7XHJcblx0XHRcdG9ubHlGaWxlczogdHJ1ZVxyXG5cdFx0fSk7XHJcblxyXG5cdC8vKiBGaWx0ZXIgZmlsZSBkaWZmZXJlbmNlc1xyXG5cdGxldCBuRGlzdCA9IGRpc3QubWFwKChmKSA9PiBbZi5yZXBsYWNlKGNvbmZpZy5vdXREaXIsIFwiXCIpLCBmXSk7XHJcblx0c3JjID0gc3JjXHJcblx0XHQubWFwKChmKSA9PiBmLnJlcGxhY2UoY29uZmlnLnNyY0RpciwgXCJcIikuc3BsaXQoXCIuXCIpWzBdKVxyXG5cdFx0LmZpbHRlcigoc2YpID0+IG5EaXN0LmZpbmQoKGQpID0+IGRbMF0uc3BsaXQoXCIuXCIpWzBdID09IHNmKSk7XHJcblxyXG5cdC8vKiBPbGQgZmlsZXMsIGRlbGV0ZVxyXG5cdGRpc3RcclxuXHRcdC5maWx0ZXIoKGYpID0+ICFzcmMuaW5jbHVkZXMoZi5yZXBsYWNlKGNvbmZpZy5vdXREaXIsIFwiXCIpLnNwbGl0KFwiLlwiKVswXSkpXHJcblx0XHQubWFwKChmKSA9PiByZW1vdmVTeW5jKGYpKTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gcmVzdGFydENoaWxkKCkge1xyXG5cdC8vKiBLaWxsIG9sZCBjaGlsZFxyXG5cdC8vKiBTcGF3biBuZXcgY2hpbGRcclxuXHRpZiAoY2hpbGQgJiYgIWNoaWxkLmtpbGxlZCkge1xyXG5cdFx0Y2hpbGQua2lsbChcIlNJR0lOVFwiKTtcclxuXHR9XHJcblxyXG5cdGF3YWl0IGNvcHlUYXNrO1xyXG5cclxuXHRpZiAoZXhpc3RzU3luYyhwcm9jZXNzLmN3ZCgpICsgXCIvXCIgKyBjb25maWcub3V0RGlyICsgXCIvXCIgKyBcImluZGV4LmpzXCIpKSB7XHJcblx0XHRpZiAoY29uZmlnLmZpbGUpIHtcclxuXHRcdFx0Y2hpbGQgPSBmb3JrKHByb2Nlc3MuY3dkKCkgKyBcIi9cIiArIGNvbmZpZy5maWxlLCBbXSwge1xyXG5cdFx0XHRcdGN3ZDogY29uZmlnLm91dERpclxyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fSBlbHNlIGlmIChleGlzdHNTeW5jKHByb2Nlc3MuY3dkKCkgKyBcIi9wYWNrYWdlLmpzb25cIikpIHtcclxuXHRcdFx0Y29uc3QgcGpzb24gPSByZXF1aXJlKHByb2Nlc3MuY3dkKCkgKyBcIi9wYWNrYWdlLmpzb25cIik7XHJcblxyXG5cdFx0XHRpZiAocGpzb24uc2NyaXB0cyAmJiBwanNvbi5zY3JpcHRzLnN0YXJ0KSB7XHJcblx0XHRcdFx0Y2hpbGQgPSBzcGF3bihcclxuXHRcdFx0XHRcdGV4aXN0c1N5bmMocHJvY2Vzcy5jd2QoKSArIFwiL3lhcm4ubG9ja1wiKVxyXG5cdFx0XHRcdFx0XHQ/IFwieWFybiBydW4gLS1zaWxlbnQgc3RhcnRcIlxyXG5cdFx0XHRcdFx0XHQ6IFwibnBtIHJ1biAtLXNpbGVudCBzdGFydFwiLFxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRzaGVsbDogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0c3RkaW86IFwiaW5oZXJpdFwiXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRjaGlsZCA9IGZvcmsocHJvY2Vzcy5jd2QoKSArIFwiL1wiICsgY29uZmlnLm91dERpciArIFwiL2luZGV4LmpzXCIsIFtdLCB7XHJcblx0XHRcdGN3ZDogY29uZmlnLm91dERpclxyXG5cdFx0fSk7XHJcblxyXG5cdFx0Y2hpbGQub24oXCJleGl0XCIsIChjb2RlKSA9PiB7XHJcblx0XHRcdGlmIChjb2RlID09PSBudWxsKSByZXR1cm47XHJcblxyXG5cdFx0XHRjb25zb2xlLmxvZyhcclxuXHRcdFx0XHRkc0NvbnNvbGVQcmVmaXggK1xyXG5cdFx0XHRcdFx0Y2hhbGsueWVsbG93QnJpZ2h0KFxyXG5cdFx0XHRcdFx0XHRgUHJvY2VzcyBleGl0ZWQgd2l0aCBleGl0IGNvZGUgJHtjaGFsay55ZWxsb3coXHJcblx0XHRcdFx0XHRcdFx0Y2hhbGsuY3lhbihjb2RlKVxyXG5cdFx0XHRcdFx0XHQpfSwgd2FpdGluZyBmb3IgY2hhbmdlcy4uLmBcclxuXHRcdFx0XHRcdClcclxuXHRcdFx0KTtcclxuXHRcdFx0Y2hpbGQgPSBudWxsO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcbiJdfQ==