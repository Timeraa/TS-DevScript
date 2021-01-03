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
        message: diagnostic.messageText
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNDb21waWxlci5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsidXRpbC90c0NvbXBpbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQTBCO0FBQzFCLGtEQUEwQjtBQUMxQiwyQ0FJb0I7QUFFcEIsMkJBQW9EO0FBQ3BELGtFQUFzQztBQUN0QywwREFBa0M7QUFDbEMsZ0ZBQWlEO0FBRWpELElBQUksT0FBNkQsRUFDaEUsSUFBSSxHQUFHLG9DQUF1QixDQUM3QixFQUFFLEVBQ0YsRUFBRSxFQUNGLGdCQUFHLEVBQ0gsb0RBQXVDLEVBQ3ZDLGFBQWEsRUFDYixVQUFVLENBQ1YsQ0FBQztBQUNILE1BQU0sTUFBTSxHQUFHLGVBQUssQ0FBQyxHQUFHLFFBQUksV0FBVyxDQUFDLENBQUM7QUFFMUIsS0FBSyxVQUFVLGFBQWE7SUFDMUMsSUFBSSxHQUFHLG9DQUF1QixDQUM3QixVQUFNLENBQUMsUUFBUSxFQUNmLEVBQUUsRUFDRixnQkFBRyxFQUNILG9EQUF1QyxFQUN2QyxhQUFhLEVBQ2IsVUFBVSxDQUNWLENBQUM7SUFFRixNQUFNLENBQUMsNkJBQTZCLENBQUMsQ0FBQztJQUN0QyxPQUFPLEdBQUcsK0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFbkMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3JDLENBQUM7QUFkRCxnQ0FjQztBQUVELElBQUksb0JBQW9CLEdBS2pCLEVBQUUsRUFDUixtQkFBbUMsQ0FBQztBQUNyQyxTQUFTLGFBQWEsQ0FBQyxVQUFzQjtJQUU1QyxJQUFJLG1CQUFtQjtRQUFFLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQzNELG1CQUFtQixHQUFHLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUl2RCxvQkFBb0IsQ0FBQyxJQUFJLENBQUM7UUFDekIsSUFBSSxFQUFFLFVBQVUsQ0FBQyxJQUFJLENB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Y2hhbGtcIjtcbmltcG9ydCBkZWJ1ZyBmcm9tIFwiZGVidWdcIjtcbmltcG9ydCB7XG5cdGNyZWF0ZVNlbWFudGljRGlhZ25vc3RpY3NCdWlsZGVyUHJvZ3JhbSwgY3JlYXRlV2F0Y2hDb21waWxlckhvc3QsIGNyZWF0ZVdhdGNoUHJvZ3JhbSxcblx0RGlhZ25vc3RpYywgZ2V0TGluZUFuZENoYXJhY3Rlck9mUG9zaXRpb24sIFNlbWFudGljRGlhZ25vc3RpY3NCdWlsZGVyUHJvZ3JhbSwgc3lzLFxuXHRXYXRjaE9mQ29uZmlnRmlsZVxufSBmcm9tIFwidHlwZXNjcmlwdFwiO1xuXG5pbXBvcnQgeyBjb25maWcsIGRzQ29uc29sZVByZWZpeCwgbmFtZSB9IGZyb20gXCIuLi9cIjtcbmltcG9ydCBydW5DaGlsZCBmcm9tIFwiLi9jaGlsZEhhbmRsZXJcIjtcbmltcG9ydCBjb3B5VGFzayBmcm9tIFwiLi9jb3B5VGFza1wiO1xuaW1wb3J0IG91dGxpbmUgZnJvbSBcIi4vZnVuY3Rpb25zL291dGxpbmVTdHJpbmdzXCI7XG5cbmxldCBwcm9ncmFtOiBXYXRjaE9mQ29uZmlnRmlsZTxTZW1hbnRpY0RpYWdub3N0aWNzQnVpbGRlclByb2dyYW0+LFxuXHRob3N0ID0gY3JlYXRlV2F0Y2hDb21waWxlckhvc3QoXG5cdFx0XCJcIixcblx0XHR7fSxcblx0XHRzeXMsXG5cdFx0Y3JlYXRlU2VtYW50aWNEaWFnbm9zdGljc0J1aWxkZXJQcm9ncmFtLFxuXHRcdGdldERpYWdub3N0aWMsXG5cdFx0ZmlsZUNoYW5nZVxuXHQpO1xuY29uc3QgbG9nZ2VyID0gZGVidWcoYCR7bmFtZX06Y29tcGlsZXJgKTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gcnVuVFNDb21waWxlcigpIHtcblx0aG9zdCA9IGNyZWF0ZVdhdGNoQ29tcGlsZXJIb3N0KFxuXHRcdGNvbmZpZy50c2NvbmZpZyxcblx0XHR7fSxcblx0XHRzeXMsXG5cdFx0Y3JlYXRlU2VtYW50aWNEaWFnbm9zdGljc0J1aWxkZXJQcm9ncmFtLFxuXHRcdGdldERpYWdub3N0aWMsXG5cdFx0ZmlsZUNoYW5nZVxuXHQpO1xuXG5cdGxvZ2dlcihcIkNyZWF0ZWQgVHlwZVNjcmlwdCB3YXRjaGVyLlwiKTtcblx0cHJvZ3JhbSA9IGNyZWF0ZVdhdGNoUHJvZ3JhbShob3N0KTtcblxuXHRwcm9jZXNzLm9uY2UoXCJleGl0XCIsIHByb2dyYW0uY2xvc2UpO1xufVxuXG5sZXQgZGlhZ25vc3RpY0Vycm9yQXJyYXk6IHtcblx0XHRmaWxlOiBzdHJpbmc7XG5cdFx0ZGlhZ25vc3RpY0xpbmU6IHsgbGluZTogbnVtYmVyOyBjaGFyYWN0ZXI6IG51bWJlciB9O1xuXHRcdG1lc3NhZ2U6IHN0cmluZztcblx0XHRjb2RlOiBudW1iZXI7XG5cdH1bXSA9IFtdLFxuXHRkaWFnbm9zdGljc0ZpbmlzaGVkOiBOb2RlSlMuVGltZW91dDtcbmZ1bmN0aW9uIGdldERpYWdub3N0aWMoZGlhZ25vc3RpYzogRGlhZ25vc3RpYykge1xuXHQvLyNyZWdpb24gTWFrZSBzdXJlIGRpYWdub3N0aWNzIGFyZSBmaW5pc2hlZFxuXHRpZiAoZGlhZ25vc3RpY3NGaW5pc2hlZCkgY2xlYXJUaW1lb3V0KGRpYWdub3N0aWNzRmluaXNoZWQpO1xuXHRkaWFnbm9zdGljc0ZpbmlzaGVkID0gc2V0VGltZW91dChyZXBvcnREaWFnbm9zdGljcywgMSk7XG5cdC8vI2VuZHJlZ2lvblxuXG5cdC8vKiBBcHBlbmQgdG8gZGlhZ25vc3RpY0Vycm9yQXJyYXlcblx0ZGlhZ25vc3RpY0Vycm9yQXJyYXkucHVzaCh7XG5cdFx0ZmlsZTogZGlhZ25vc3RpYy5maWxlLmZpbGVOYW1lLnJlcGxhY2UoXG5cdFx0XHRob3N0LmdldEN1cnJlbnREaXJlY3RvcnkoKSArIFwiL1wiLFxuXHRcdFx0XCJcIlxuXHRcdCksXG5cdFx0ZGlhZ25vc3RpY0xpbmU6IGdldExpbmVBbmRDaGFyYWN0ZXJPZlBvc2l0aW9uKFxuXHRcdFx0ZGlhZ25vc3RpYy5maWxlLFxuXHRcdFx0ZGlhZ25vc3RpYy5zdGFydCFcblx0XHQpLFxuXHRcdG1lc3NhZ2U6IGRpYWdub3N0aWMubWVzc2FnZVRleHRcblx0XHRcdC50b1N0cmluZygpXG5cdFx0XHQucmVwbGFjZShob3N0LmdldEN1cnJlbnREaXJlY3RvcnkoKSArIFwiL1wiLCBcIlwiKSxcblx0XHRjb2RlOiBkaWFnbm9zdGljLmNvZGVcblx0fSk7XG59XG5cbmZ1bmN0aW9uIHJlcG9ydERpYWdub3N0aWNzKCkge1xuXHRpZiAoY29uZmlnLnNpbGVudCkgcmV0dXJuO1xuXG5cdGxldCByZXN1bHQ6IHtcblx0XHRbbmFtZTogbnVtYmVyXTogc3RyaW5nW107XG5cdH0gPSB7fTtcblxuXHQvLyNyZWdpb24gQ29udmVydCBhcnJheSB0byBmdWxseSBjb2xvcmVkIG9iamVjdFxuXHRsb2dnZXIoXG5cdFx0YEZvdW5kICR7ZGlhZ25vc3RpY0Vycm9yQXJyYXkubGVuZ3RofSBlcnJvcnMuIFRyYW5zZmVycmluZyBhcnJheSB0byBvYmplY3TigKZgXG5cdCk7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgZGlhZ25vc3RpY0Vycm9yQXJyYXkubGVuZ3RoOyBpKyspIHtcblx0XHRjb25zdCBkaWFnbm9zdGljID0gZGlhZ25vc3RpY0Vycm9yQXJyYXlbaV07XG5cdFx0Ly8qIEVuc3VyZSBjb2RlIGV4aXN0cyBpbiBvYmplY3Rcblx0XHRpZiAoIXJlc3VsdFtkaWFnbm9zdGljLmNvZGVdKSByZXN1bHRbZGlhZ25vc3RpYy5jb2RlXSA9IFtdO1xuXG5cdFx0Ly8qIEZpbGUgc3JjIG1lc3NhZ2UgY29sb3Jpbmdcblx0XHRjb25zdCBmaWxlU3JjTXNnID0gY2hhbGsuaGV4KFwiI2JlYmViZVwiKShcblx0XHRcdGAke2NoYWxrLnllbGxvd0JyaWdodChkaWFnbm9zdGljLmZpbGUpfSgke1xuXHRcdFx0XHRkaWFnbm9zdGljLmRpYWdub3N0aWNMaW5lLmxpbmUgKyAxXG5cdFx0XHR9LCR7ZGlhZ25vc3RpYy5kaWFnbm9zdGljTGluZS5jaGFyYWN0ZXIgKyAxfSlgXG5cdFx0KTtcblxuXHRcdHJlc3VsdFtkaWFnbm9zdGljLmNvZGVdLnB1c2goXG5cdFx0XHRgJHtmaWxlU3JjTXNnfSDigKIgJHtjaGFsay5oZXgoXCIjNzI4OURBXCIpKGRpYWdub3N0aWMubWVzc2FnZSl9YFxuXHRcdCk7XG5cdH1cblx0bG9nZ2VyKFwiVHJhbnNmZXJyZWQgYXJyYXkgdG8gb2JqZWN0LCBub3cgcG9zdGluZyBlcnJvcnMgYnkgZXJyb3IgSUTigKZcIik7XG5cdC8vI2VuZHJlZ2lvblxuXG5cdC8vKiBFcnJvciBoZWFkZXJcblx0Y29uc29sZS5sb2coXG5cdFx0YCR7ZHNDb25zb2xlUHJlZml4fSAke2NoYWxrLmJvbGQoXG5cdFx0XHRjaGFsay5oZXgoXCIjZTgzYTNhXCIpKFxuXHRcdFx0XHRcIkZvdW5kIFwiICtcblx0XHRcdFx0XHRkaWFnbm9zdGljRXJyb3JBcnJheS5sZW5ndGggK1xuXHRcdFx0XHRcdFwiIGVycm9yXCIgK1xuXHRcdFx0XHRcdChkaWFnbm9zdGljRXJyb3JBcnJheS5sZW5ndGggPT09IDEgPyBcIlwiIDogXCJzXCIpICtcblx0XHRcdFx0XHRcIi4gV2F0Y2hpbmcgZm9yIGZpbGUgY2hhbmdlc+KAplwiXG5cdFx0XHQpXG5cdFx0KX1gXG5cdCk7XG5cblx0bGV0IGkgPSAwO1xuXHRmb3IgKGNvbnN0IFtlcnJvckNvZGUsIGVycm9yQXJyYXldIG9mIE9iamVjdC5lbnRyaWVzKHJlc3VsdCkpIHtcblx0XHQvLyogU3BhY2luZyBiZXR3ZWVuIHNyYyBhbmQgZXJyb3IgbWVzc2FnZS5cblx0XHRvdXRsaW5lKGVycm9yQXJyYXksIFwi4oCiXCIpO1xuXG5cdFx0aSsrO1xuXHRcdGlmIChPYmplY3Qua2V5cyhyZXN1bHQpLmxlbmd0aCA+IDEpIHtcblx0XHRcdGlmIChPYmplY3Qua2V5cyhyZXN1bHQpLmxlbmd0aCA9PT0gaSkge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhg4pWw4pSAICR7Y2hhbGsuYm9sZChjaGFsay5yZWRCcmlnaHQoXCJUU1wiICsgZXJyb3JDb2RlKSl9YCk7XG5cdFx0XHRcdGRpc3BsYXlBc1RyZWUoZXJyb3JBcnJheSwgXCIgICBcIik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhg4pSc4pSAICR7Y2hhbGsuYm9sZChjaGFsay5yZWRCcmlnaHQoXCJUU1wiICsgZXJyb3JDb2RlKSl9YCk7XG5cdFx0XHRcdGRpc3BsYXlBc1RyZWUoZXJyb3JBcnJheSwgXCLilIIgIFwiKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc29sZS5sb2coYOKVsOKUgCAke2NoYWxrLmJvbGQoY2hhbGsucmVkQnJpZ2h0KFwiVFNcIiArIGVycm9yQ29kZSkpfWApO1xuXHRcdFx0ZGlzcGxheUFzVHJlZShlcnJvckFycmF5LCBcIiAgIFwiKTtcblx0XHR9XG5cdH1cblxuXHRkaWFnbm9zdGljRXJyb3JBcnJheSA9IFtdO1xufVxuXG5mdW5jdGlvbiBkaXNwbGF5QXNUcmVlKFxuXHRjaGlsZHJlbjogc3RyaW5nW10sXG5cdHByZWZpeCA9IFwiXCIsXG5cdGNvbG9yOiBjaGFsay5DaGFsayA9IGNoYWxrLnJlc2V0XG4pIHtcblx0Y29uc29sZS5sb2coXG5cdFx0KGNoaWxkcmVuLmxlbmd0aCA+IDFcblx0XHRcdD8gYCR7cHJlZml4feKUnOKUgCBgICtcblx0XHRcdCAgY2hpbGRyZW5cblx0XHRcdFx0XHQuc2xpY2UoMCwgLTEpXG5cdFx0XHRcdFx0Lm1hcCgocykgPT4gY29sb3IocykpXG5cdFx0XHRcdFx0LmpvaW4oYFxcbiR7cHJlZml4feKUnOKUgCBgKSArXG5cdFx0XHQgIFwiXFxuXCJcblx0XHRcdDogXCJcIikgK1xuXHRcdFx0YCR7cHJlZml4feKVsOKUgCBgICtcblx0XHRcdGNvbG9yKGNoaWxkcmVuLnNsaWNlKC0xKVswXSlcblx0KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZmlsZUNoYW5nZShkaWFnbm9zdGljOiBEaWFnbm9zdGljKSB7XG5cdC8vKiBcIlN0YXJ0aW5nIGNvbXBpbGF0aW9uIGluIHdhdGNoIG1vZGUuLi5cIlwiXG5cdGlmIChkaWFnbm9zdGljLmNvZGUgPT09IDYwMzEpIHtcblx0XHRpZiAoIWNvbmZpZy5zaWxlbnQpXG5cdFx0XHRjb25zb2xlLmxvZyhcblx0XHRcdFx0YCR7ZHNDb25zb2xlUHJlZml4fSAke2NoYWxrLmJsdWVCcmlnaHQoXG5cdFx0XHRcdFx0XCJTdGFydGluZyBUeXBlU2NyaXB0IGNvbXBpbGVy4oCmXCJcblx0XHRcdFx0KX1gXG5cdFx0XHQpO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdC8vKiBcIkZpbGUgY2hhbmdlIGRldGVjdGVkLi4uXCJcblx0aWYgKGRpYWdub3N0aWMuY29kZSA9PT0gNjAzMikge1xuXHRcdGlmICghY29uZmlnLnNpbGVudClcblx0XHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0XHRgJHtkc0NvbnNvbGVQcmVmaXh9ICR7Y2hhbGsuYmx1ZUJyaWdodChcblx0XHRcdFx0XHRkaWFnbm9zdGljLm1lc3NhZ2VUZXh0XG5cdFx0XHRcdFx0XHQudG9TdHJpbmcoKVxuXHRcdFx0XHRcdFx0LnN1YnN0cmluZygwLCBkaWFnbm9zdGljLm1lc3NhZ2VUZXh0LnRvU3RyaW5nKCkubGVuZ3RoIC0gMykgKyBcIuKAplwiXG5cdFx0XHRcdCl9YFxuXHRcdFx0KTtcblxuXHRcdHJldHVybjtcblx0fVxuXG5cdGlmIChcblx0XHQvLyogRm91bmQgMCBlcnJvcnNcblx0XHRkaWFnbm9zdGljLmNvZGUgPT09IDYxOTQgJiZcblx0XHRwYXJzZUludChkaWFnbm9zdGljLm1lc3NhZ2VUZXh0LnRvU3RyaW5nKCkucmVwbGFjZSgvXFxEL2csIFwiXCIpKSA9PT0gMFxuXHQpIHtcblx0XHRhd2FpdCBjb3B5VGFzaygpO1xuXHRcdC8vKiBSZXN0YXJ0IGNoaWxkXG5cdFx0YXdhaXQgcnVuQ2hpbGQoKTtcblxuXHRcdGlmICghY29uZmlnLnNpbGVudClcblx0XHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0XHRkc0NvbnNvbGVQcmVmaXggK1xuXHRcdFx0XHRcdFwiIFwiICtcblx0XHRcdFx0XHRjaGFsay5ncmVlbihcblx0XHRcdFx0XHRcdGRpYWdub3N0aWMubWVzc2FnZVRleHRcblx0XHRcdFx0XHRcdFx0LnRvU3RyaW5nKClcblx0XHRcdFx0XHRcdFx0LnN1YnN0cmluZygwLCBkaWFnbm9zdGljLm1lc3NhZ2VUZXh0LnRvU3RyaW5nKCkubGVuZ3RoIC0gMSkgKyBcIuKAplwiXG5cdFx0XHRcdFx0KVxuXHRcdFx0KTtcblx0XHRyZXR1cm47XG5cdH1cblxuXHQvLyogRXJyb3JzLCBubyByZXN0YXJ0XG59XG4iXX0=