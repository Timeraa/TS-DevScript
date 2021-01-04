"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const debug_1 = __importDefault(require("debug"));
const typescript_1 = require("typescript");
const __1 = require("../");
const childHandler_1 = __importDefault(require("./childHandler"));
const copyTask_1 = __importDefault(require("./copyTask"));
const outlineStrings_1 = __importDefault(require("./functions/outlineStrings"));
let program, host = typescript_1.createWatchCompilerHost("", {}, typescript_1.sys, typescript_1.createSemanticDiagnosticsBuilderProgram, getDiagnostic, fileChange);
const logger = debug_1.default(`${__1.name}:compiler`);
async function runTSCompiler() {
    host = typescript_1.createWatchCompilerHost(__1.config.tsconfig, {}, typescript_1.sys, typescript_1.createSemanticDiagnosticsBuilderProgram, getDiagnostic, fileChange);
    logger("Created TypeScript watcher.");
    program = typescript_1.createWatchProgram(host);
    process.once("exit", program.close);
}
exports.default = runTSCompiler;
let diagnosticErrorArray = [], diagnosticsFinished;
function getDiagnostic(diagnostic) {
    if (diagnosticsFinished)
        clearTimeout(diagnosticsFinished);
    diagnosticsFinished = setTimeout(reportDiagnostics, 1);
    diagnosticErrorArray.push({
        file: diagnostic.file.fileName.replace(host.getCurrentDirectory() + "/", ""),
        diagnosticLine: typescript_1.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start),
        message: typeof diagnostic.messageText !== "string"
            ?
                diagnostic.messageText.messageText
            : diagnostic.messageText
                .toString()
                .replace(host.getCurrentDirectory() + "/", ""),
        code: diagnostic.code
    });
}
function reportDiagnostics() {
    if (__1.config.silent)
        return;
    let result = {};
    logger(`Found ${diagnosticErrorArray.length} errors. Transferring array to object…`);
    for (let i = 0; i < diagnosticErrorArray.length; i++) {
        const diagnostic = diagnosticErrorArray[i];
        if (!result[diagnostic.code])
            result[diagnostic.code] = [];
        const fileSrcMsg = chalk_1.default.hex("#bebebe")(`${chalk_1.default.yellowBright(diagnostic.file)}(${diagnostic.diagnosticLine.line + 1},${diagnostic.diagnosticLine.character + 1})`);
        result[diagnostic.code].push(`${fileSrcMsg} • ${chalk_1.default.hex("#7289DA")(diagnostic.message)}`);
    }
    logger("Transferred array to object, now posting errors by error ID…");
    console.log(`${__1.dsConsolePrefix} ${chalk_1.default.bold(chalk_1.default.hex("#e83a3a")("Found " +
        diagnosticErrorArray.length +
        " error" +
        (diagnosticErrorArray.length === 1 ? "" : "s") +
        ". Watching for file changes…"))}`);
    let i = 0;
    for (const [errorCode, errorArray] of Object.entries(result)) {
        outlineStrings_1.default(errorArray, "•");
        i++;
        if (Object.keys(result).length > 1) {
            if (Object.keys(result).length === i) {
                console.log(`╰─ ${chalk_1.default.bold(chalk_1.default.redBright("TS" + errorCode))}`);
                displayAsTree(errorArray, "   ");
            }
            else {
                console.log(`├─ ${chalk_1.default.bold(chalk_1.default.redBright("TS" + errorCode))}`);
                displayAsTree(errorArray, "│  ");
            }
        }
        else {
            console.log(`╰─ ${chalk_1.default.bold(chalk_1.default.redBright("TS" + errorCode))}`);
            displayAsTree(errorArray, "   ");
        }
    }
    diagnosticErrorArray = [];
}
function displayAsTree(children, prefix = "", color = chalk_1.default.reset) {
    console.log((children.length > 1
        ? `${prefix}├─ ` +
            children
                .slice(0, -1)
                .map((s) => color(s))
                .join(`\n${prefix}├─ `) +
            "\n"
        : "") +
        `${prefix}╰─ ` +
        color(children.slice(-1)[0]));
}
async function fileChange(diagnostic) {
    if (diagnostic.code === 6031) {
        if (!__1.config.silent)
            console.log(`${__1.dsConsolePrefix} ${chalk_1.default.blueBright("Starting TypeScript compiler…")}`);
        return;
    }
    if (diagnostic.code === 6032) {
        if (!__1.config.silent)
            console.log(`${__1.dsConsolePrefix} ${chalk_1.default.blueBright(diagnostic.messageText
                .toString()
                .substring(0, diagnostic.messageText.toString().length - 3) + "…")}`);
        return;
    }
    if (diagnostic.code === 6194 &&
        parseInt(diagnostic.messageText.toString().replace(/\D/g, "")) === 0) {
        await copyTask_1.default();
        await childHandler_1.default();
        if (!__1.config.silent)
            console.log(__1.dsConsolePrefix +
                " " +
                chalk_1.default.green(diagnostic.messageText
                    .toString()
                    .substring(0, diagnostic.messageText.toString().length - 1) + "…"));
        return;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNDb21waWxlci5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsidXRpbC90c0NvbXBpbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQTBCO0FBQzFCLGtEQUEwQjtBQUMxQiwyQ0FTb0I7QUFFcEIsMkJBQW9EO0FBQ3BELGtFQUFzQztBQUN0QywwREFBa0M7QUFDbEMsZ0ZBQWlEO0FBRWpELElBQUksT0FBNkQsRUFDaEUsSUFBSSxHQUFHLG9DQUF1QixDQUM3QixFQUFFLEVBQ0YsRUFBRSxFQUNGLGdCQUFHLEVBQ0gsb0RBQXVDLEVBQ3ZDLGFBQWEsRUFDYixVQUFVLENBQ1YsQ0FBQztBQUNILE1BQU0sTUFBTSxHQUFHLGVBQUssQ0FBQyxHQUFHLFFBQUksV0FBVyxDQUFDLENBQUM7QUFFMUIsS0FBSyxVQUFVLGFBQWE7SUFDMUMsSUFBSSxHQUFHLG9DQUF1QixDQUM3QixVQUFNLENBQUMsUUFBUSxFQUNmLEVBQUUsRUFDRixnQkFBRyxFQUNILG9EQUF1QyxFQUN2QyxhQUFhLEVBQ2IsVUFBVSxDQUNWLENBQUM7SUFFRixNQUFNLENBQUMsNkJBQTZCLENBQUMsQ0FBQztJQUN0QyxPQUFPLEdBQUcsK0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFbkMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3JDLENBQUM7QUFkRCxnQ0FjQztBQUVELElBQUksb0JBQW9CLEdBS2pCLEVBQUUsRUFDUixtQkFBbUMsQ0FBQztBQUNyQyxTQUFTLGFBQWEsQ0FBQyxVQUFzQjtJQUU1QyxJQUFJLG1CQUFtQjtRQUFFLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQzNELG1CQUFtQixHQUFHLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUl2RCxvQkFBb0IsQ0FBQyxJQUFJLENBQUM7UUFDekIsSUFBSSxFQUFFLFVBQVUsQ0FBQyxJQUFJLENB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QUFHLEdBQUcsQ0FDbEUsQ0FDRixDQUFDO1FBQ0gsT0FBTztLQUNQO0FBR0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjaGFsayBmcm9tIFwiY2hhbGtcIjtcbmltcG9ydCBkZWJ1ZyBmcm9tIFwiZGVidWdcIjtcbmltcG9ydCB7XG5cdGNyZWF0ZVNlbWFudGljRGlhZ25vc3RpY3NCdWlsZGVyUHJvZ3JhbSxcblx0Y3JlYXRlV2F0Y2hDb21waWxlckhvc3QsXG5cdGNyZWF0ZVdhdGNoUHJvZ3JhbSxcblx0RGlhZ25vc3RpYyxcblx0Z2V0TGluZUFuZENoYXJhY3Rlck9mUG9zaXRpb24sXG5cdFNlbWFudGljRGlhZ25vc3RpY3NCdWlsZGVyUHJvZ3JhbSxcblx0c3lzLFxuXHRXYXRjaE9mQ29uZmlnRmlsZVxufSBmcm9tIFwidHlwZXNjcmlwdFwiO1xuXG5pbXBvcnQgeyBjb25maWcsIGRzQ29uc29sZVByZWZpeCwgbmFtZSB9IGZyb20gXCIuLi9cIjtcbmltcG9ydCBydW5DaGlsZCBmcm9tIFwiLi9jaGlsZEhhbmRsZXJcIjtcbmltcG9ydCBjb3B5VGFzayBmcm9tIFwiLi9jb3B5VGFza1wiO1xuaW1wb3J0IG91dGxpbmUgZnJvbSBcIi4vZnVuY3Rpb25zL291dGxpbmVTdHJpbmdzXCI7XG5cbmxldCBwcm9ncmFtOiBXYXRjaE9mQ29uZmlnRmlsZTxTZW1hbnRpY0RpYWdub3N0aWNzQnVpbGRlclByb2dyYW0+LFxuXHRob3N0ID0gY3JlYXRlV2F0Y2hDb21waWxlckhvc3QoXG5cdFx0XCJcIixcblx0XHR7fSxcblx0XHRzeXMsXG5cdFx0Y3JlYXRlU2VtYW50aWNEaWFnbm9zdGljc0J1aWxkZXJQcm9ncmFtLFxuXHRcdGdldERpYWdub3N0aWMsXG5cdFx0ZmlsZUNoYW5nZVxuXHQpO1xuY29uc3QgbG9nZ2VyID0gZGVidWcoYCR7bmFtZX06Y29tcGlsZXJgKTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gcnVuVFNDb21waWxlcigpIHtcblx0aG9zdCA9IGNyZWF0ZVdhdGNoQ29tcGlsZXJIb3N0KFxuXHRcdGNvbmZpZy50c2NvbmZpZyxcblx0XHR7fSxcblx0XHRzeXMsXG5cdFx0Y3JlYXRlU2VtYW50aWNEaWFnbm9zdGljc0J1aWxkZXJQcm9ncmFtLFxuXHRcdGdldERpYWdub3N0aWMsXG5cdFx0ZmlsZUNoYW5nZVxuXHQpO1xuXG5cdGxvZ2dlcihcIkNyZWF0ZWQgVHlwZVNjcmlwdCB3YXRjaGVyLlwiKTtcblx0cHJvZ3JhbSA9IGNyZWF0ZVdhdGNoUHJvZ3JhbShob3N0KTtcblxuXHRwcm9jZXNzLm9uY2UoXCJleGl0XCIsIHByb2dyYW0uY2xvc2UpO1xufVxuXG5sZXQgZGlhZ25vc3RpY0Vycm9yQXJyYXk6IHtcblx0XHRmaWxlOiBzdHJpbmc7XG5cdFx0ZGlhZ25vc3RpY0xpbmU6IHsgbGluZTogbnVtYmVyOyBjaGFyYWN0ZXI6IG51bWJlciB9O1xuXHRcdG1lc3NhZ2U6IHN0cmluZztcblx0XHRjb2RlOiBudW1iZXI7XG5cdH1bXSA9IFtdLFxuXHRkaWFnbm9zdGljc0ZpbmlzaGVkOiBOb2RlSlMuVGltZW91dDtcbmZ1bmN0aW9uIGdldERpYWdub3N0aWMoZGlhZ25vc3RpYzogRGlhZ25vc3RpYykge1xuXHQvLyNyZWdpb24gTWFrZSBzdXJlIGRpYWdub3N0aWNzIGFyZSBmaW5pc2hlZFxuXHRpZiAoZGlhZ25vc3RpY3NGaW5pc2hlZCkgY2xlYXJUaW1lb3V0KGRpYWdub3N0aWNzRmluaXNoZWQpO1xuXHRkaWFnbm9zdGljc0ZpbmlzaGVkID0gc2V0VGltZW91dChyZXBvcnREaWFnbm9zdGljcywgMSk7XG5cdC8vI2VuZHJlZ2lvblxuXG5cdC8vKiBBcHBlbmQgdG8gZGlhZ25vc3RpY0Vycm9yQXJyYXlcblx0ZGlhZ25vc3RpY0Vycm9yQXJyYXkucHVzaCh7XG5cdFx0ZmlsZTogZGlhZ25vc3RpYy5maWxlLmZpbGVOYW1lLnJlcGxhY2UoXG5cdFx0XHRob3N0LmdldEN1cnJlbnREaXJlY3RvcnkoKSArIFwiL1wiLFxuXHRcdFx0XCJcIlxuXHRcdCksXG5cdFx0ZGlhZ25vc3RpY0xpbmU6IGdldExpbmVBbmRDaGFyYWN0ZXJPZlBvc2l0aW9uKFxuXHRcdFx0ZGlhZ25vc3RpYy5maWxlLFxuXHRcdFx0ZGlhZ25vc3RpYy5zdGFydCFcblx0XHQpLFxuXHRcdG1lc3NhZ2U6XG5cdFx0XHR0eXBlb2YgZGlhZ25vc3RpYy5tZXNzYWdlVGV4dCAhPT0gXCJzdHJpbmdcIlxuXHRcdFx0XHQ/IC8vVE9ETyBNYXliZSBzaG93IGl0IGluIG1vcmUgaW5kZW50cz9cblx0XHRcdFx0ICBkaWFnbm9zdGljLm1lc3NhZ2VUZXh0Lm1lc3NhZ2VUZXh0XG5cdFx0XHRcdDogZGlhZ25vc3RpYy5tZXNzYWdlVGV4dFxuXHRcdFx0XHRcdFx0LnRvU3RyaW5nKClcblx0XHRcdFx0XHRcdC5yZXBsYWNlKGhvc3QuZ2V0Q3VycmVudERpcmVjdG9yeSgpICsgXCIvXCIsIFwiXCIpLFxuXHRcdGNvZGU6IGRpYWdub3N0aWMuY29kZVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gcmVwb3J0RGlhZ25vc3RpY3MoKSB7XG5cdGlmIChjb25maWcuc2lsZW50KSByZXR1cm47XG5cblx0bGV0IHJlc3VsdDoge1xuXHRcdFtuYW1lOiBudW1iZXJdOiBzdHJpbmdbXTtcblx0fSA9IHt9O1xuXG5cdC8vI3JlZ2lvbiBDb252ZXJ0IGFycmF5IHRvIGZ1bGx5IGNvbG9yZWQgb2JqZWN0XG5cdGxvZ2dlcihcblx0XHRgRm91bmQgJHtkaWFnbm9zdGljRXJyb3JBcnJheS5sZW5ndGh9IGVycm9ycy4gVHJhbnNmZXJyaW5nIGFycmF5IHRvIG9iamVjdOKApmBcblx0KTtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkaWFnbm9zdGljRXJyb3JBcnJheS5sZW5ndGg7IGkrKykge1xuXHRcdGNvbnN0IGRpYWdub3N0aWMgPSBkaWFnbm9zdGljRXJyb3JBcnJheVtpXTtcblx0XHQvLyogRW5zdXJlIGNvZGUgZXhpc3RzIGluIG9iamVjdFxuXHRcdGlmICghcmVzdWx0W2RpYWdub3N0aWMuY29kZV0pIHJlc3VsdFtkaWFnbm9zdGljLmNvZGVdID0gW107XG5cblx0XHQvLyogRmlsZSBzcmMgbWVzc2FnZSBjb2xvcmluZ1xuXHRcdGNvbnN0IGZpbGVTcmNNc2cgPSBjaGFsay5oZXgoXCIjYmViZWJlXCIpKFxuXHRcdFx0YCR7Y2hhbGsueWVsbG93QnJpZ2h0KGRpYWdub3N0aWMuZmlsZSl9KCR7XG5cdFx0XHRcdGRpYWdub3N0aWMuZGlhZ25vc3RpY0xpbmUubGluZSArIDFcblx0XHRcdH0sJHtkaWFnbm9zdGljLmRpYWdub3N0aWNMaW5lLmNoYXJhY3RlciArIDF9KWBcblx0XHQpO1xuXG5cdFx0cmVzdWx0W2RpYWdub3N0aWMuY29kZV0ucHVzaChcblx0XHRcdGAke2ZpbGVTcmNNc2d9IOKAoiAke2NoYWxrLmhleChcIiM3Mjg5REFcIikoZGlhZ25vc3RpYy5tZXNzYWdlKX1gXG5cdFx0KTtcblx0fVxuXHRsb2dnZXIoXCJUcmFuc2ZlcnJlZCBhcnJheSB0byBvYmplY3QsIG5vdyBwb3N0aW5nIGVycm9ycyBieSBlcnJvciBJROKAplwiKTtcblx0Ly8jZW5kcmVnaW9uXG5cblx0Ly8qIEVycm9yIGhlYWRlclxuXHRjb25zb2xlLmxvZyhcblx0XHRgJHtkc0NvbnNvbGVQcmVmaXh9ICR7Y2hhbGsuYm9sZChcblx0XHRcdGNoYWxrLmhleChcIiNlODNhM2FcIikoXG5cdFx0XHRcdFwiRm91bmQgXCIgK1xuXHRcdFx0XHRcdGRpYWdub3N0aWNFcnJvckFycmF5Lmxlbmd0aCArXG5cdFx0XHRcdFx0XCIgZXJyb3JcIiArXG5cdFx0XHRcdFx0KGRpYWdub3N0aWNFcnJvckFycmF5Lmxlbmd0aCA9PT0gMSA/IFwiXCIgOiBcInNcIikgK1xuXHRcdFx0XHRcdFwiLiBXYXRjaGluZyBmb3IgZmlsZSBjaGFuZ2Vz4oCmXCJcblx0XHRcdClcblx0XHQpfWBcblx0KTtcblxuXHRsZXQgaSA9IDA7XG5cdGZvciAoY29uc3QgW2Vycm9yQ29kZSwgZXJyb3JBcnJheV0gb2YgT2JqZWN0LmVudHJpZXMocmVzdWx0KSkge1xuXHRcdC8vKiBTcGFjaW5nIGJldHdlZW4gc3JjIGFuZCBlcnJvciBtZXNzYWdlLlxuXHRcdG91dGxpbmUoZXJyb3JBcnJheSwgXCLigKJcIik7XG5cblx0XHRpKys7XG5cdFx0aWYgKE9iamVjdC5rZXlzKHJlc3VsdCkubGVuZ3RoID4gMSkge1xuXHRcdFx0aWYgKE9iamVjdC5rZXlzKHJlc3VsdCkubGVuZ3RoID09PSBpKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGDilbDilIAgJHtjaGFsay5ib2xkKGNoYWxrLnJlZEJyaWdodChcIlRTXCIgKyBlcnJvckNvZGUpKX1gKTtcblx0XHRcdFx0ZGlzcGxheUFzVHJlZShlcnJvckFycmF5LCBcIiAgIFwiKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGDilJzilIAgJHtjaGFsay5ib2xkKGNoYWxrLnJlZEJyaWdodChcIlRTXCIgKyBlcnJvckNvZGUpKX1gKTtcblx0XHRcdFx0ZGlzcGxheUFzVHJlZShlcnJvckFycmF5LCBcIuKUgiAgXCIpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zb2xlLmxvZyhg4pWw4pSAICR7Y2hhbGsuYm9sZChjaGFsay5yZWRCcmlnaHQoXCJUU1wiICsgZXJyb3JDb2RlKSl9YCk7XG5cdFx0XHRkaXNwbGF5QXNUcmVlKGVycm9yQXJyYXksIFwiICAgXCIpO1xuXHRcdH1cblx0fVxuXG5cdGRpYWdub3N0aWNFcnJvckFycmF5ID0gW107XG59XG5cbmZ1bmN0aW9uIGRpc3BsYXlBc1RyZWUoXG5cdGNoaWxkcmVuOiBzdHJpbmdbXSxcblx0cHJlZml4ID0gXCJcIixcblx0Y29sb3I6IGNoYWxrLkNoYWxrID0gY2hhbGsucmVzZXRcbikge1xuXHRjb25zb2xlLmxvZyhcblx0XHQoY2hpbGRyZW4ubGVuZ3RoID4gMVxuXHRcdFx0PyBgJHtwcmVmaXh94pSc4pSAIGAgK1xuXHRcdFx0ICBjaGlsZHJlblxuXHRcdFx0XHRcdC5zbGljZSgwLCAtMSlcblx0XHRcdFx0XHQubWFwKChzKSA9PiBjb2xvcihzKSlcblx0XHRcdFx0XHQuam9pbihgXFxuJHtwcmVmaXh94pSc4pSAIGApICtcblx0XHRcdCAgXCJcXG5cIlxuXHRcdFx0OiBcIlwiKSArXG5cdFx0XHRgJHtwcmVmaXh94pWw4pSAIGAgK1xuXHRcdFx0Y29sb3IoY2hpbGRyZW4uc2xpY2UoLTEpWzBdKVxuXHQpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBmaWxlQ2hhbmdlKGRpYWdub3N0aWM6IERpYWdub3N0aWMpIHtcblx0Ly8qIFwiU3RhcnRpbmcgY29tcGlsYXRpb24gaW4gd2F0Y2ggbW9kZS4uLlwiXCJcblx0aWYgKGRpYWdub3N0aWMuY29kZSA9PT0gNjAzMSkge1xuXHRcdGlmICghY29uZmlnLnNpbGVudClcblx0XHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0XHRgJHtkc0NvbnNvbGVQcmVmaXh9ICR7Y2hhbGsuYmx1ZUJyaWdodChcblx0XHRcdFx0XHRcIlN0YXJ0aW5nIFR5cGVTY3JpcHQgY29tcGlsZXLigKZcIlxuXHRcdFx0XHQpfWBcblx0XHRcdCk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8qIFwiRmlsZSBjaGFuZ2UgZGV0ZWN0ZWQuLi5cIlxuXHRpZiAoZGlhZ25vc3RpYy5jb2RlID09PSA2MDMyKSB7XG5cdFx0aWYgKCFjb25maWcuc2lsZW50KVxuXHRcdFx0Y29uc29sZS5sb2coXG5cdFx0XHRcdGAke2RzQ29uc29sZVByZWZpeH0gJHtjaGFsay5ibHVlQnJpZ2h0KFxuXHRcdFx0XHRcdGRpYWdub3N0aWMubWVzc2FnZVRleHRcblx0XHRcdFx0XHRcdC50b1N0cmluZygpXG5cdFx0XHRcdFx0XHQuc3Vic3RyaW5nKDAsIGRpYWdub3N0aWMubWVzc2FnZVRleHQudG9TdHJpbmcoKS5sZW5ndGggLSAzKSArIFwi4oCmXCJcblx0XHRcdFx0KX1gXG5cdFx0XHQpO1xuXG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0aWYgKFxuXHRcdC8vKiBGb3VuZCAwIGVycm9yc1xuXHRcdGRpYWdub3N0aWMuY29kZSA9PT0gNjE5NCAmJlxuXHRcdHBhcnNlSW50KGRpYWdub3N0aWMubWVzc2FnZVRleHQudG9TdHJpbmcoKS5yZXBsYWNlKC9cXEQvZywgXCJcIikpID09PSAwXG5cdCkge1xuXHRcdGF3YWl0IGNvcHlUYXNrKCk7XG5cdFx0Ly8qIFJlc3RhcnQgY2hpbGRcblx0XHRhd2FpdCBydW5DaGlsZCgpO1xuXG5cdFx0aWYgKCFjb25maWcuc2lsZW50KVxuXHRcdFx0Y29uc29sZS5sb2coXG5cdFx0XHRcdGRzQ29uc29sZVByZWZpeCArXG5cdFx0XHRcdFx0XCIgXCIgK1xuXHRcdFx0XHRcdGNoYWxrLmdyZWVuKFxuXHRcdFx0XHRcdFx0ZGlhZ25vc3RpYy5tZXNzYWdlVGV4dFxuXHRcdFx0XHRcdFx0XHQudG9TdHJpbmcoKVxuXHRcdFx0XHRcdFx0XHQuc3Vic3RyaW5nKDAsIGRpYWdub3N0aWMubWVzc2FnZVRleHQudG9TdHJpbmcoKS5sZW5ndGggLSAxKSArIFwi4oCmXCJcblx0XHRcdFx0XHQpXG5cdFx0XHQpO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdC8vKiBFcnJvcnMsIG5vIHJlc3RhcnRcbn1cbiJdfQ==