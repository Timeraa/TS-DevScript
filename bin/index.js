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
function fileChange(diagnostic) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
function copyFiles() {
    return __awaiter(this, void 0, void 0, function* () {
        if (config.deleteObsolete)
            yield deleteObsolete();
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
    });
}
function deleteObsolete() {
    return __awaiter(this, void 0, void 0, function* () {
        let dist = yield glob(config.outDir + "/**/*", {
            onlyFiles: true
        }), src = yield glob(config.srcDir + "/**/*", {
            onlyFiles: true
        });
        let nDist = dist.map((f) => [f.replace(config.outDir, ""), f]);
        src = src
            .map((f) => f.replace(config.srcDir, "").split(".")[0])
            .filter((sf) => nDist.find((d) => d[0].split(".")[0] == sf));
        dist
            .filter((f) => !src.includes(f.replace(config.outDir, "").split(".")[0]))
            .map((f) => fs_extra_1.removeSync(f));
    });
}
function restartChild() {
    return __awaiter(this, void 0, void 0, function* () {
        if (child && !child.killed) {
            child.unref();
            child.kill("SIGKILL");
        }
        yield copyTask;
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
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290Ijoic3JjLyIsInNvdXJjZXMiOlsiaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsd0RBQWdDO0FBQ2hDLDREQUE0QjtBQUM1QiwrQkFBeUM7QUFDekMsaURBQTBEO0FBQzFELHVDQUFnRDtBQUNoRCwyQkFBOEM7QUFFOUMsa0NBQW1DO0FBRW5DLElBQUksTUFBTSxHQUFHO0lBQ1gsTUFBTSxFQUFFLEtBQUs7SUFDYixNQUFNLEVBQUUsTUFBTTtJQUNkLGNBQWMsRUFBRSxJQUFJO0lBQ3BCLFFBQVEsRUFBRSxlQUFlO0lBQ3pCLElBQUksRUFBRSxlQUFlO0NBQ3JCLEVBQ0QsS0FBSyxHQUFpQixJQUFJLEVBQzFCLFFBQXNCLENBQUM7QUFFeEIsTUFBTSxTQUFTLEdBQ2QsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRXBFLElBQUksU0FBUztJQUNaLE9BQU8sQ0FBQyxHQUFHLENBQ1YsZUFBSyxDQUFDLE1BQU0sQ0FDWCxjQUFjLE9BQU8sQ0FBQyxTQUFTLEdBQUcsa0JBQWtCLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FDL0QsQ0FDRCxDQUFDO0FBRUgsSUFBSSxlQUFVLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLGtCQUFrQixDQUFDLEVBQUU7SUFDbkQsSUFBSTtRQUNILE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUNsQixpQkFBWSxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxrQkFBa0IsRUFBRSxPQUFPLENBQUMsQ0FDekQsQ0FBQztLQUNGO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDWCxPQUFPLENBQUMsS0FBSyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM1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RWYsSUFBSSxlQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsR0FBRyxVQUFVLENBQUMsRUFBRTtZQUN2RSxJQUFJLE1BQU0sQ0FBQyxJQUFJO2dCQUNkLEtBQUssR0FBRyxvQkFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUU7b0JBQ25ELEdBQUcsRUFBRSxNQUFNLENBQUMsTUFBTTtpQkFDbEIsQ0FBQyxDQUFDO2lCQUNDLElBQUksZUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxlQUFlLENBQUMsRUFBRTtnQkFDckQsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxlQUFlLENBQUMsQ0FBQztnQkFFdkQsSUFBSSxLQUFLLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSztvQkFDdkMsS0FBSyxHQUFHLHFCQUFLLENBQ1osZUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxZQUFZLENBQUM7d0JBQ3ZDLENBQUMsQ0FBQyx5QkFBeUI7d0JBQzNCLENBQUMsQ0FBQyx3QkFBd0IsRUFDM0I7d0JBQ0MsS0FBSyxFQUFFLElBQUk7d0JBQ1gsS0FBSyxFQUFFLFNBQVM7cUJBQ2hCLENBQ0QsQ0FBQzthQUNIOztnQkFDQSxLQUFLLEdBQUcsb0JBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxFQUFFLEVBQUUsRUFBRTtvQkFDN0MsR0FBRyxFQUFFLE1BQU0sQ0FBQyxNQUFNO2lCQUNsQixDQUFDLENBQUM7U0FDSjtJQUNGLENBQUM7Q0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjaGFsayBmcm9tIFwiY2hhbGtcIjtcclxuaW1wb3J0IGNob2tpZGFyIGZyb20gXCJjaG9raWRhclwiO1xyXG5pbXBvcnQgdHMgZnJvbSBcInR5cGVzY3JpcHRcIjtcclxuaW1wb3J0IHsgYmFzZW5hbWUsIGV4dG5hbWUgfSBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgeyBDaGlsZFByb2Nlc3MsIGZvcmssIHNwYXduIH0gZnJvbSBcImNoaWxkX3Byb2Nlc3NcIjtcclxuaW1wb3J0IHsgY29weVN5bmMsIHJlbW92ZVN5bmMgfSBmcm9tIFwiZnMtZXh0cmFcIjtcclxuaW1wb3J0IHsgZXhpc3RzU3luYywgcmVhZEZpbGVTeW5jIH0gZnJvbSBcImZzXCI7XHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xyXG5pbXBvcnQgZ2xvYiA9IHJlcXVpcmUoXCJmYXN0LWdsb2JcIik7XHJcblxyXG5sZXQgY29uZmlnID0ge1xyXG5cdFx0c3JjRGlyOiBcInNyY1wiLFxyXG5cdFx0b3V0RGlyOiBcImRpc3RcIixcclxuXHRcdGRlbGV0ZU9ic29sZXRlOiB0cnVlLFxyXG5cdFx0dHNjb25maWc6IFwidHNjb25maWcuanNvblwiLFxyXG5cdFx0ZmlsZTogXCJkaXN0L2luZGV4LmpzXCJcclxuXHR9LFxyXG5cdGNoaWxkOiBDaGlsZFByb2Nlc3MgPSBudWxsLFxyXG5cdGNvcHlUYXNrOiBQcm9taXNlPGFueT47XHJcblxyXG5jb25zdCBzaWxlbnRSdW4gPVxyXG5cdCFwcm9jZXNzLmFyZ3YuaW5jbHVkZXMoXCItc1wiKSAmJiAhcHJvY2Vzcy5hcmd2LmluY2x1ZGVzKFwiLS1zaWxlbnRcIik7XHJcblxyXG5pZiAoc2lsZW50UnVuKVxyXG5cdGNvbnNvbGUubG9nKFxyXG5cdFx0Y2hhbGsueWVsbG93KFxyXG5cdFx0XHRgRGV2U2NyaXB0IHYke3JlcXVpcmUoX19kaXJuYW1lICsgXCIvLi4vcGFja2FnZS5qc29uXCIpLnZlcnNpb259YFxyXG5cdFx0KVxyXG5cdCk7XHJcblxyXG5pZiAoZXhpc3RzU3luYyhgJHtwcm9jZXNzLmN3ZCgpfS8uZGV2U2NyaXB0Lmpzb25gKSkge1xyXG5cdHRyeSB7XHJcblx0XHRjb25maWcgPSBKU09OLnBhcnNlKFxyXG5cdFx0XHRyZWFkRmlsZVN5bmMoYCR7cHJvY2Vzcy5jd2QoKX0vLmRldlNjcmlwdC5qc29uYCwgXCJ1dGYtOFwiKVxyXG5cdFx0KTtcclxuXHR9IGNhdGNoIChlKSB7XHJcblx0XHRjb25zb2xlLmVycm9yKFwiSW52YWxpZCBTeW50YXg6XCIsIGUubWVzc2FnZSk7XHJcblx0XHRwcm9jZXNzLmV4aXQoKTtcclxuXHR9XHJcbn1cclxuXHJcbmlmICghY29uZmlnLnNyY0RpcikgY29uZmlnLnNyY0RpciA9IFwic3JjXCI7XHJcbmlmICghY29uZmlnLm91dERpcikgY29uZmlnLm91dERpciA9IFwiZGlzdFwiO1xyXG5pZiAoIWNvbmZpZy5kZWxldGVPYnNvbGV0ZSkgY29uZmlnLmRlbGV0ZU9ic29sZXRlID0gdHJ1ZTtcclxuaWYgKCFjb25maWcudHNjb25maWcpIGNvbmZpZy50c2NvbmZpZyA9IFwidHNjb25maWcuanNvblwiO1xyXG5cclxuY29uc3QgZm9ybWF0SG9zdDogdHMuRm9ybWF0RGlhZ25vc3RpY3NIb3N0ID0ge1xyXG5cdGdldENhbm9uaWNhbEZpbGVOYW1lOiAocGF0aCkgPT4gcGF0aCxcclxuXHRnZXRDdXJyZW50RGlyZWN0b3J5OiB0cy5zeXMuZ2V0Q3VycmVudERpcmVjdG9yeSxcclxuXHRnZXROZXdMaW5lOiAoKSA9PiB0cy5zeXMubmV3TGluZVxyXG59O1xyXG5cclxuLy8qIENyZWF0ZSB0cyBwcm9ncmFtXHJcbmNvbnN0IGNyZWF0ZVByb2dyYW0gPSB0cy5jcmVhdGVTZW1hbnRpY0RpYWdub3N0aWNzQnVpbGRlclByb2dyYW07XHJcblxyXG5pZiAocHJvY2Vzcy5hcmd2LmluY2x1ZGVzKFwiLS1jb3B5T25seVwiKSkge1xyXG5cdGNvcHlGaWxlcygpO1xyXG59IGVsc2Uge1xyXG5cdGNvbnN0IHdhdGNoZXIgPSBjaG9raWRhci53YXRjaChjb25maWcuc3JjRGlyLCB7XHJcblx0XHRpZ25vcmVkOiAvKFxcLnRzKS9nLFxyXG5cdFx0cGVyc2lzdGVudDogdHJ1ZSxcclxuXHRcdGlnbm9yZUluaXRpYWw6IHRydWVcclxuXHR9KTtcclxuXHJcblx0d2F0Y2hlci5vbihcImFsbFwiLCAocGF0aCkgPT4ge1xyXG5cdFx0Y29uc29sZS5sb2coY2hhbGsuYmx1ZShgJHtiYXNlbmFtZShwYXRoKX0gY2hhbmdlZC4gUmVzdGFydGluZy4uLmApKTtcclxuXHRcdGNvcHlUYXNrID0gY29weUZpbGVzKCk7XHJcblxyXG5cdFx0cmVzdGFydENoaWxkKCk7XHJcblx0fSk7XHJcblx0Ly8qIENyZWF0ZSBXYXRjaCBjb21wb2lsZSBob3N0XHJcblx0Y29uc3QgaG9zdCA9IHRzLmNyZWF0ZVdhdGNoQ29tcGlsZXJIb3N0KFxyXG5cdFx0YCR7cHJvY2Vzcy5jd2QoKX0vJHtjb25maWcudHNjb25maWd9YCxcclxuXHRcdHt9LFxyXG5cdFx0dHMuc3lzLFxyXG5cdFx0Y3JlYXRlUHJvZ3JhbSxcclxuXHRcdHJlcG9ydERpYWdub3N0aWMsXHJcblx0XHRmaWxlQ2hhbmdlXHJcblx0KTtcclxuXHR0cy5jcmVhdGVXYXRjaFByb2dyYW0oaG9zdCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlcG9ydERpYWdub3N0aWMoZGlhZ25vc3RpYzogdHMuRGlhZ25vc3RpYykge1xyXG5cdGlmIChzaWxlbnRSdW4pXHJcblx0XHRjb25zb2xlLmxvZyhjaGFsay5yZWRCcmlnaHQodHMuZm9ybWF0RGlhZ25vc3RpYyhkaWFnbm9zdGljLCBmb3JtYXRIb3N0KSkpO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxlQ2hhbmdlKGRpYWdub3N0aWM6IHRzLkRpYWdub3N0aWMpIHtcclxuXHRpZiAoWzYwMzEsIDYwMzJdLmluY2x1ZGVzKGRpYWdub3N0aWMuY29kZSkpIHtcclxuXHRcdGlmIChzaWxlbnRSdW4pIGNvbnNvbGUubG9nKGNoYWxrLmJsdWUoZGlhZ25vc3RpYy5tZXNzYWdlVGV4dC50b1N0cmluZygpKSk7XHJcblx0XHRjb3B5VGFzayA9IGNvcHlGaWxlcygpO1xyXG5cdH0gZWxzZSBpZiAoWzYxOTRdLmluY2x1ZGVzKGRpYWdub3N0aWMuY29kZSkpIHtcclxuXHRcdGlmIChzaWxlbnRSdW4pIGNvbnNvbGUubG9nKGNoYWxrLmdyZWVuKGRpYWdub3N0aWMubWVzc2FnZVRleHQudG9TdHJpbmcoKSkpO1xyXG5cclxuXHRcdHJlc3RhcnRDaGlsZCgpO1xyXG5cdH0gZWxzZSBpZiAoc2lsZW50UnVuKVxyXG5cdFx0Y29uc29sZS5sb2coY2hhbGsueWVsbG93KGRpYWdub3N0aWMubWVzc2FnZVRleHQudG9TdHJpbmcoKSkpO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBjb3B5RmlsZXMoKSB7XHJcblx0aWYgKGNvbmZpZy5kZWxldGVPYnNvbGV0ZSkgYXdhaXQgZGVsZXRlT2Jzb2xldGUoKTtcclxuXHJcblx0aWYgKGV4aXN0c1N5bmMoXCJwYWNrYWdlLmpzb25cIikpXHJcblx0XHRjb3B5U3luYyhcInBhY2thZ2UuanNvblwiLCBgJHtjb25maWcub3V0RGlyfS9wYWNrYWdlLmpzb25gKTtcclxuXHRpZiAoZXhpc3RzU3luYyhcInBhY2thZ2UtbG9jay5qc29uXCIpKVxyXG5cdFx0Y29weVN5bmMoXCJwYWNrYWdlLWxvY2suanNvblwiLCBgJHtjb25maWcub3V0RGlyfS9wYWNrYWdlLWxvY2suanNvbmApO1xyXG5cdGlmIChleGlzdHNTeW5jKFwieWFybi5sb2NrXCIpKVxyXG5cdFx0Y29weVN5bmMoXCJ5YXJuLmxvY2tcIiwgYCR7Y29uZmlnLm91dERpcn0veWFybi5sb2NrYCk7XHJcblxyXG5cdC8vKiBDb3B5IGZpbGVzIGZyb20gc3JjIHRvIGRpc3RcclxuXHRjb3B5U3luYyhcInNyY1wiLCBjb25maWcub3V0RGlyLCB7XHJcblx0XHRmaWx0ZXI6IGZ1bmN0aW9uIChwYXRoKSB7XHJcblx0XHRcdGlmIChwYXRoLmluY2x1ZGVzKFwiL25vZGVfbW9kdWxlc1wiKSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRyZXR1cm4gZXh0bmFtZShwYXRoKSAhPT0gXCIudHNcIjtcclxuXHRcdH1cclxuXHR9KTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZGVsZXRlT2Jzb2xldGUoKSB7XHJcblx0Ly8qIFNlbGVjdCBmaWxlc1xyXG5cdGxldCBkaXN0ID0gYXdhaXQgZ2xvYihjb25maWcub3V0RGlyICsgXCIvKiovKlwiLCB7XHJcblx0XHRcdG9ubHlGaWxlczogdHJ1ZVxyXG5cdFx0fSksXHJcblx0XHRzcmMgPSBhd2FpdCBnbG9iKGNvbmZpZy5zcmNEaXIgKyBcIi8qKi8qXCIsIHtcclxuXHRcdFx0b25seUZpbGVzOiB0cnVlXHJcblx0XHR9KTtcclxuXHJcblx0Ly8qIEZpbHRlciBmaWxlIGRpZmZlcmVuY2VzXHJcblx0bGV0IG5EaXN0ID0gZGlzdC5tYXAoKGYpID0+IFtmLnJlcGxhY2UoY29uZmlnLm91dERpciwgXCJcIiksIGZdKTtcclxuXHRzcmMgPSBzcmNcclxuXHRcdC5tYXAoKGYpID0+IGYucmVwbGFjZShjb25maWcuc3JjRGlyLCBcIlwiKS5zcGxpdChcIi5cIilbMF0pXHJcblx0XHQuZmlsdGVyKChzZikgPT4gbkRpc3QuZmluZCgoZCkgPT4gZFswXS5zcGxpdChcIi5cIilbMF0gPT0gc2YpKTtcclxuXHJcblx0Ly8qIE9sZCBmaWxlcywgZGVsZXRlXHJcblx0ZGlzdFxyXG5cdFx0LmZpbHRlcigoZikgPT4gIXNyYy5pbmNsdWRlcyhmLnJlcGxhY2UoY29uZmlnLm91dERpciwgXCJcIikuc3BsaXQoXCIuXCIpWzBdKSlcclxuXHRcdC5tYXAoKGYpID0+IHJlbW92ZVN5bmMoZikpO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiByZXN0YXJ0Q2hpbGQoKSB7XHJcblx0Ly8qIEtpbGwgb2xkIGNoaWxkXHJcblx0Ly8qIFNwYXduIG5ldyBjaGlsZFxyXG5cdGlmIChjaGlsZCAmJiAhY2hpbGQua2lsbGVkKSB7XHJcblx0XHRjaGlsZC51bnJlZigpO1xyXG5cdFx0Y2hpbGQua2lsbChcIlNJR0tJTExcIik7XHJcblx0fVxyXG5cclxuXHRhd2FpdCBjb3B5VGFzaztcclxuXHJcblx0aWYgKGV4aXN0c1N5bmMocHJvY2Vzcy5jd2QoKSArIFwiL1wiICsgY29uZmlnLm91dERpciArIFwiL1wiICsgXCJpbmRleC5qc1wiKSkge1xyXG5cdFx0aWYgKGNvbmZpZy5maWxlKVxyXG5cdFx0XHRjaGlsZCA9IGZvcmsocHJvY2Vzcy5jd2QoKSArIFwiL1wiICsgY29uZmlnLmZpbGUsIFtdLCB7XHJcblx0XHRcdFx0Y3dkOiBjb25maWcub3V0RGlyXHJcblx0XHRcdH0pO1xyXG5cdFx0ZWxzZSBpZiAoZXhpc3RzU3luYyhwcm9jZXNzLmN3ZCgpICsgXCIvcGFja2FnZS5qc29uXCIpKSB7XHJcblx0XHRcdGNvbnN0IHBqc29uID0gcmVxdWlyZShwcm9jZXNzLmN3ZCgpICsgXCIvcGFja2FnZS5qc29uXCIpO1xyXG5cclxuXHRcdFx0aWYgKHBqc29uLnNjcmlwdHMgJiYgcGpzb24uc2NyaXB0cy5zdGFydClcclxuXHRcdFx0XHRjaGlsZCA9IHNwYXduKFxyXG5cdFx0XHRcdFx0ZXhpc3RzU3luYyhwcm9jZXNzLmN3ZCgpICsgXCIveWFybi5sb2NrXCIpXHJcblx0XHRcdFx0XHRcdD8gXCJ5YXJuIHJ1biAtLXNpbGVudCBzdGFydFwiXHJcblx0XHRcdFx0XHRcdDogXCJucG0gcnVuIC0tc2lsZW50IHN0YXJ0XCIsXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHNoZWxsOiB0cnVlLFxyXG5cdFx0XHRcdFx0XHRzdGRpbzogXCJpbmhlcml0XCJcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHQpO1xyXG5cdFx0fSBlbHNlXHJcblx0XHRcdGNoaWxkID0gZm9yayhwcm9jZXNzLmN3ZCgpICsgXCIvaW5kZXguanNcIiwgW10sIHtcclxuXHRcdFx0XHRjd2Q6IGNvbmZpZy5vdXREaXJcclxuXHRcdFx0fSk7XHJcblx0fVxyXG59XHJcbiJdfQ==