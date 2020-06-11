#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const chokidar_1 = __importDefault(require("chokidar"));
const typescript_1 = __importDefault(require("typescript"));
const path_1 = require("path");
const child_process_1 = require("child_process");
const fs_extra_1 = require("fs-extra");
const fs_1 = require("fs");
const glob = require("fast-glob");
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
    getCanonicalFileName: (path) => path,
    getCurrentDirectory: typescript_1.default.sys.getCurrentDirectory,
    getNewLine: () => typescript_1.default.sys.newLine
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
        console.log(chalk_1.default.blue(`${path_1.basename(path)} changed. Restarting...`));
        copyTask = copyFiles();
        restartChild();
    });
    const host = typescript_1.default.createWatchCompilerHost(`${process.cwd()}/${config.tsconfig}`, {}, typescript_1.default.sys, createProgram, reportDiagnostic, fileChange);
    typescript_1.default.createWatchProgram(host);
}
function reportDiagnostic(diagnostic) {
    if (silentRun)
        console.log(chalk_1.default.redBright(typescript_1.default.formatDiagnostic(diagnostic, formatHost)));
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
    let dist = await glob(config.outDir + "/**/*", {
        onlyFiles: true
    }), src = await glob(config.srcDir + "/**/*", {
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
        child.unref();
        child.kill("SIGKILL");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290Ijoic3JjLyIsInNvdXJjZXMiOlsiaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0Esa0RBQTBCO0FBQzFCLHdEQUFnQztBQUNoQyw0REFBNEI7QUFDNUIsK0JBQXlDO0FBQ3pDLGlEQUEwRDtBQUMxRCx1Q0FBZ0Q7QUFDaEQsMkJBQThDO0FBRzlDLGtDQUFtQztBQUVuQyxJQUFJLE1BQU0sR0FBRztJQUNYLE1BQU0sRUFBRSxLQUFLO0lBQ2IsTUFBTSxFQUFFLE1BQU07SUFDZCxjQUFjLEVBQUUsSUFBSTtJQUNwQixRQUFRLEVBQUUsZUFBZTtJQUN6QixJQUFJLEVBQUUsZUFBZTtDQUNyQixFQUNELEtBQUssR0FBaUIsSUFBSSxFQUMxQixRQUFzQixDQUFDO0FBRXhCLE1BQU0sU0FBUyxHQUNkLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUVwRSxJQUFJLFNBQVM7SUFDWixPQUFPLENBQUMsR0FBRyxDQUNWLGVBQUssQ0FBQyxNQUFNLENBQ1gsY0FBYyxPQUFPLENBQUMsU0FBUyxHQUFHLGtCQUFrQixDQUFDLENBQUMsT0FBTyxFQUFFLENBQy9ELENBQ0QsQ0FBQztBQUVILElBQUksZUFBVSxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxrQkFBa0IsQ0FBQyxFQUFFO0lBQ25ELElBQUk7UUFDSCxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FDbEIsaUJBQVksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLENBQ3pELENBQUM7S0FDRjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1gsT0FBTyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDNUMsT0FBTyxD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QUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0QsR0FBRyxHQUFHLEdBQUc7U0FDUCxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDdEQsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFHOUQsSUFBSTtTQUNGLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN4RSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLHFCQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QixDQUFDO0FBRUQsS0FBSyxVQUFVLFlBQVk7SUFHMUIsSUFBSSxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO1FBQzNCLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNkLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDdEI7SUFFRCxNQUFNLFFBQVEsQ0FBQztJQUVmLElBQUksZUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLEdBQUcsVUFBVSxDQUFDLEVBQUU7UUFDdkUsSUFBSSxNQUFNLENBQUMsSUFBSTtZQUNkLEtBQUssR0FBRyxvQkFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUU7Z0JBQ25ELEdBQUcsRUFBRSxNQUFNLENBQUMsTUFBTTthQUNsQixDQUFDLENBQUM7YUFDQyxJQUFJLGVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsZUFBZSxDQUFDLEVBQUU7WUFDckQsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxlQUFlLENBQUMsQ0FBQztZQUV2RCxJQUFJLEtBQUssQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLO2dCQUN2QyxLQUFLLEdBQUcscUJBQUssQ0FDWixlQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLFlBQVksQ0FBQztvQkFDdkMsQ0FBQyxDQUFDLHlCQUF5QjtvQkFDM0IsQ0FBQyxDQUFDLHdCQUF3QixFQUMzQjtvQkFDQyxLQUFLLEVBQUUsSUFBSTtvQkFDWCxLQUFLLEVBQUUsU0FBUztpQkFDaEIsQ0FDRCxDQUFDO1NBQ0g7O1lBQ0EsS0FBSyxHQUFHLG9CQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxFQUFFLEVBQUU7Z0JBQzdDLEdBQUcsRUFBRSxNQUFNLENBQUMsTUFBTTthQUNsQixDQUFDLENBQUM7S0FDSjtBQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXHJcbmltcG9ydCBjaGFsayBmcm9tIFwiY2hhbGtcIjtcclxuaW1wb3J0IGNob2tpZGFyIGZyb20gXCJjaG9raWRhclwiO1xyXG5pbXBvcnQgdHMgZnJvbSBcInR5cGVzY3JpcHRcIjtcclxuaW1wb3J0IHsgYmFzZW5hbWUsIGV4dG5hbWUgfSBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgeyBDaGlsZFByb2Nlc3MsIGZvcmssIHNwYXduIH0gZnJvbSBcImNoaWxkX3Byb2Nlc3NcIjtcclxuaW1wb3J0IHsgY29weVN5bmMsIHJlbW92ZVN5bmMgfSBmcm9tIFwiZnMtZXh0cmFcIjtcclxuaW1wb3J0IHsgZXhpc3RzU3luYywgcmVhZEZpbGVTeW5jIH0gZnJvbSBcImZzXCI7XHJcblxyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcclxuaW1wb3J0IGdsb2IgPSByZXF1aXJlKFwiZmFzdC1nbG9iXCIpO1xyXG5cclxubGV0IGNvbmZpZyA9IHtcclxuXHRcdHNyY0RpcjogXCJzcmNcIixcclxuXHRcdG91dERpcjogXCJkaXN0XCIsXHJcblx0XHRkZWxldGVPYnNvbGV0ZTogdHJ1ZSxcclxuXHRcdHRzY29uZmlnOiBcInRzY29uZmlnLmpzb25cIixcclxuXHRcdGZpbGU6IFwiZGlzdC9pbmRleC5qc1wiXHJcblx0fSxcclxuXHRjaGlsZDogQ2hpbGRQcm9jZXNzID0gbnVsbCxcclxuXHRjb3B5VGFzazogUHJvbWlzZTxhbnk+O1xyXG5cclxuY29uc3Qgc2lsZW50UnVuID1cclxuXHQhcHJvY2Vzcy5hcmd2LmluY2x1ZGVzKFwiLXNcIikgJiYgIXByb2Nlc3MuYXJndi5pbmNsdWRlcyhcIi0tc2lsZW50XCIpO1xyXG5cclxuaWYgKHNpbGVudFJ1bilcclxuXHRjb25zb2xlLmxvZyhcclxuXHRcdGNoYWxrLnllbGxvdyhcclxuXHRcdFx0YERldlNjcmlwdCB2JHtyZXF1aXJlKF9fZGlybmFtZSArIFwiLy4uL3BhY2thZ2UuanNvblwiKS52ZXJzaW9ufWBcclxuXHRcdClcclxuXHQpO1xyXG5cclxuaWYgKGV4aXN0c1N5bmMoYCR7cHJvY2Vzcy5jd2QoKX0vLmRldlNjcmlwdC5qc29uYCkpIHtcclxuXHR0cnkge1xyXG5cdFx0Y29uZmlnID0gSlNPTi5wYXJzZShcclxuXHRcdFx0cmVhZEZpbGVTeW5jKGAke3Byb2Nlc3MuY3dkKCl9Ly5kZXZTY3JpcHQuanNvbmAsIFwidXRmLThcIilcclxuXHRcdCk7XHJcblx0fSBjYXRjaCAoZSkge1xyXG5cdFx0Y29uc29sZS5lcnJvcihcIkludmFsaWQgU3ludGF4OlwiLCBlLm1lc3NhZ2UpO1xyXG5cdFx0cHJvY2Vzcy5leGl0KCk7XHJcblx0fVxyXG59XHJcblxyXG5pZiAoIWNvbmZpZy5zcmNEaXIpIGNvbmZpZy5zcmNEaXIgPSBcInNyY1wiO1xyXG5pZiAoIWNvbmZpZy5vdXREaXIpIGNvbmZpZy5vdXREaXIgPSBcImRpc3RcIjtcclxuaWYgKCFjb25maWcuZGVsZXRlT2Jzb2xldGUpIGNvbmZpZy5kZWxldGVPYnNvbGV0ZSA9IHRydWU7XHJcbmlmICghY29uZmlnLnRzY29uZmlnKSBjb25maWcudHNjb25maWcgPSBcInRzY29uZmlnLmpzb25cIjtcclxuXHJcbmNvbnN0IGZvcm1hdEhvc3Q6IHRzLkZvcm1hdERpYWdub3N0aWNzSG9zdCA9IHtcclxuXHRnZXRDYW5vbmljYWxGaWxlTmFtZTogKHBhdGgpID0+IHBhdGgsXHJcblx0Z2V0Q3VycmVudERpcmVjdG9yeTogdHMuc3lzLmdldEN1cnJlbnREaXJlY3RvcnksXHJcblx0Z2V0TmV3TGluZTogKCkgPT4gdHMuc3lzLm5ld0xpbmVcclxufTtcclxuXHJcbi8vKiBDcmVhdGUgdHMgcHJvZ3JhbVxyXG5jb25zdCBjcmVhdGVQcm9ncmFtID0gdHMuY3JlYXRlU2VtYW50aWNEaWFnbm9zdGljc0J1aWxkZXJQcm9ncmFtO1xyXG5cclxuaWYgKHByb2Nlc3MuYXJndi5pbmNsdWRlcyhcIi0tY29weU9ubHlcIikpIHtcclxuXHRjb3B5RmlsZXMoKTtcclxufSBlbHNlIHtcclxuXHRjb25zdCB3YXRjaGVyID0gY2hva2lkYXIud2F0Y2goY29uZmlnLnNyY0Rpciwge1xyXG5cdFx0aWdub3JlZDogLyhcXC50cykvZyxcclxuXHRcdHBlcnNpc3RlbnQ6IHRydWUsXHJcblx0XHRpZ25vcmVJbml0aWFsOiB0cnVlXHJcblx0fSk7XHJcblxyXG5cdHdhdGNoZXIub24oXCJhbGxcIiwgKHBhdGgpID0+IHtcclxuXHRcdGNvbnNvbGUubG9nKGNoYWxrLmJsdWUoYCR7YmFzZW5hbWUocGF0aCl9IGNoYW5nZWQuIFJlc3RhcnRpbmcuLi5gKSk7XHJcblx0XHRjb3B5VGFzayA9IGNvcHlGaWxlcygpO1xyXG5cclxuXHRcdHJlc3RhcnRDaGlsZCgpO1xyXG5cdH0pO1xyXG5cdC8vKiBDcmVhdGUgV2F0Y2ggY29tcG9pbGUgaG9zdFxyXG5cdGNvbnN0IGhvc3QgPSB0cy5jcmVhdGVXYXRjaENvbXBpbGVySG9zdChcclxuXHRcdGAke3Byb2Nlc3MuY3dkKCl9LyR7Y29uZmlnLnRzY29uZmlnfWAsXHJcblx0XHR7fSxcclxuXHRcdHRzLnN5cyxcclxuXHRcdGNyZWF0ZVByb2dyYW0sXHJcblx0XHRyZXBvcnREaWFnbm9zdGljLFxyXG5cdFx0ZmlsZUNoYW5nZVxyXG5cdCk7XHJcblx0dHMuY3JlYXRlV2F0Y2hQcm9ncmFtKGhvc3QpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZXBvcnREaWFnbm9zdGljKGRpYWdub3N0aWM6IHRzLkRpYWdub3N0aWMpIHtcclxuXHRpZiAoc2lsZW50UnVuKVxyXG5cdFx0Y29uc29sZS5sb2coY2hhbGsucmVkQnJpZ2h0KHRzLmZvcm1hdERpYWdub3N0aWMoZGlhZ25vc3RpYywgZm9ybWF0SG9zdCkpKTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsZUNoYW5nZShkaWFnbm9zdGljOiB0cy5EaWFnbm9zdGljKSB7XHJcblx0aWYgKFs2MDMxLCA2MDMyXS5pbmNsdWRlcyhkaWFnbm9zdGljLmNvZGUpKSB7XHJcblx0XHRpZiAoc2lsZW50UnVuKSBjb25zb2xlLmxvZyhjaGFsay5ibHVlKGRpYWdub3N0aWMubWVzc2FnZVRleHQudG9TdHJpbmcoKSkpO1xyXG5cdFx0Y29weVRhc2sgPSBjb3B5RmlsZXMoKTtcclxuXHR9IGVsc2UgaWYgKFs2MTk0XS5pbmNsdWRlcyhkaWFnbm9zdGljLmNvZGUpKSB7XHJcblx0XHRpZiAoc2lsZW50UnVuKSBjb25zb2xlLmxvZyhjaGFsay5ncmVlbihkaWFnbm9zdGljLm1lc3NhZ2VUZXh0LnRvU3RyaW5nKCkpKTtcclxuXHJcblx0XHRyZXN0YXJ0Q2hpbGQoKTtcclxuXHR9IGVsc2UgaWYgKHNpbGVudFJ1bilcclxuXHRcdGNvbnNvbGUubG9nKGNoYWxrLnllbGxvdyhkaWFnbm9zdGljLm1lc3NhZ2VUZXh0LnRvU3RyaW5nKCkpKTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gY29weUZpbGVzKCkge1xyXG5cdGlmIChjb25maWcuZGVsZXRlT2Jzb2xldGUpIGF3YWl0IGRlbGV0ZU9ic29sZXRlKCk7XHJcblxyXG5cdGlmIChleGlzdHNTeW5jKFwicGFja2FnZS5qc29uXCIpKVxyXG5cdFx0Y29weVN5bmMoXCJwYWNrYWdlLmpzb25cIiwgYCR7Y29uZmlnLm91dERpcn0vcGFja2FnZS5qc29uYCk7XHJcblx0aWYgKGV4aXN0c1N5bmMoXCJwYWNrYWdlLWxvY2suanNvblwiKSlcclxuXHRcdGNvcHlTeW5jKFwicGFja2FnZS1sb2NrLmpzb25cIiwgYCR7Y29uZmlnLm91dERpcn0vcGFja2FnZS1sb2NrLmpzb25gKTtcclxuXHRpZiAoZXhpc3RzU3luYyhcInlhcm4ubG9ja1wiKSlcclxuXHRcdGNvcHlTeW5jKFwieWFybi5sb2NrXCIsIGAke2NvbmZpZy5vdXREaXJ9L3lhcm4ubG9ja2ApO1xyXG5cclxuXHQvLyogQ29weSBmaWxlcyBmcm9tIHNyYyB0byBkaXN0XHJcblx0Y29weVN5bmMoXCJzcmNcIiwgY29uZmlnLm91dERpciwge1xyXG5cdFx0ZmlsdGVyOiBmdW5jdGlvbiAocGF0aCkge1xyXG5cdFx0XHRpZiAocGF0aC5pbmNsdWRlcyhcIi9ub2RlX21vZHVsZXNcIikpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0cmV0dXJuIGV4dG5hbWUocGF0aCkgIT09IFwiLnRzXCI7XHJcblx0XHR9XHJcblx0fSk7XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGRlbGV0ZU9ic29sZXRlKCkge1xyXG5cdC8vKiBTZWxlY3QgZmlsZXNcclxuXHRsZXQgZGlzdCA9IGF3YWl0IGdsb2IoY29uZmlnLm91dERpciArIFwiLyoqLypcIiwge1xyXG5cdFx0XHRvbmx5RmlsZXM6IHRydWVcclxuXHRcdH0pLFxyXG5cdFx0c3JjID0gYXdhaXQgZ2xvYihjb25maWcuc3JjRGlyICsgXCIvKiovKlwiLCB7XHJcblx0XHRcdG9ubHlGaWxlczogdHJ1ZVxyXG5cdFx0fSk7XHJcblxyXG5cdC8vKiBGaWx0ZXIgZmlsZSBkaWZmZXJlbmNlc1xyXG5cdGxldCBuRGlzdCA9IGRpc3QubWFwKChmKSA9PiBbZi5yZXBsYWNlKGNvbmZpZy5vdXREaXIsIFwiXCIpLCBmXSk7XHJcblx0c3JjID0gc3JjXHJcblx0XHQubWFwKChmKSA9PiBmLnJlcGxhY2UoY29uZmlnLnNyY0RpciwgXCJcIikuc3BsaXQoXCIuXCIpWzBdKVxyXG5cdFx0LmZpbHRlcigoc2YpID0+IG5EaXN0LmZpbmQoKGQpID0+IGRbMF0uc3BsaXQoXCIuXCIpWzBdID09IHNmKSk7XHJcblxyXG5cdC8vKiBPbGQgZmlsZXMsIGRlbGV0ZVxyXG5cdGRpc3RcclxuXHRcdC5maWx0ZXIoKGYpID0+ICFzcmMuaW5jbHVkZXMoZi5yZXBsYWNlKGNvbmZpZy5vdXREaXIsIFwiXCIpLnNwbGl0KFwiLlwiKVswXSkpXHJcblx0XHQubWFwKChmKSA9PiByZW1vdmVTeW5jKGYpKTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gcmVzdGFydENoaWxkKCkge1xyXG5cdC8vKiBLaWxsIG9sZCBjaGlsZFxyXG5cdC8vKiBTcGF3biBuZXcgY2hpbGRcclxuXHRpZiAoY2hpbGQgJiYgIWNoaWxkLmtpbGxlZCkge1xyXG5cdFx0Y2hpbGQudW5yZWYoKTtcclxuXHRcdGNoaWxkLmtpbGwoXCJTSUdLSUxMXCIpO1xyXG5cdH1cclxuXHJcblx0YXdhaXQgY29weVRhc2s7XHJcblxyXG5cdGlmIChleGlzdHNTeW5jKHByb2Nlc3MuY3dkKCkgKyBcIi9cIiArIGNvbmZpZy5vdXREaXIgKyBcIi9cIiArIFwiaW5kZXguanNcIikpIHtcclxuXHRcdGlmIChjb25maWcuZmlsZSlcclxuXHRcdFx0Y2hpbGQgPSBmb3JrKHByb2Nlc3MuY3dkKCkgKyBcIi9cIiArIGNvbmZpZy5maWxlLCBbXSwge1xyXG5cdFx0XHRcdGN3ZDogY29uZmlnLm91dERpclxyXG5cdFx0XHR9KTtcclxuXHRcdGVsc2UgaWYgKGV4aXN0c1N5bmMocHJvY2Vzcy5jd2QoKSArIFwiL3BhY2thZ2UuanNvblwiKSkge1xyXG5cdFx0XHRjb25zdCBwanNvbiA9IHJlcXVpcmUocHJvY2Vzcy5jd2QoKSArIFwiL3BhY2thZ2UuanNvblwiKTtcclxuXHJcblx0XHRcdGlmIChwanNvbi5zY3JpcHRzICYmIHBqc29uLnNjcmlwdHMuc3RhcnQpXHJcblx0XHRcdFx0Y2hpbGQgPSBzcGF3bihcclxuXHRcdFx0XHRcdGV4aXN0c1N5bmMocHJvY2Vzcy5jd2QoKSArIFwiL3lhcm4ubG9ja1wiKVxyXG5cdFx0XHRcdFx0XHQ/IFwieWFybiBydW4gLS1zaWxlbnQgc3RhcnRcIlxyXG5cdFx0XHRcdFx0XHQ6IFwibnBtIHJ1biAtLXNpbGVudCBzdGFydFwiLFxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRzaGVsbDogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0c3RkaW86IFwiaW5oZXJpdFwiXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0KTtcclxuXHRcdH0gZWxzZVxyXG5cdFx0XHRjaGlsZCA9IGZvcmsocHJvY2Vzcy5jd2QoKSArIFwiL2luZGV4LmpzXCIsIFtdLCB7XHJcblx0XHRcdFx0Y3dkOiBjb25maWcub3V0RGlyXHJcblx0XHRcdH0pO1xyXG5cdH1cclxufVxyXG4iXX0=