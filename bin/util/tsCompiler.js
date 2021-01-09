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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var debug_1 = __importDefault(require("debug"));
var typescript_1 = require("typescript");
var __1 = require("../");
var childHandler_1 = __importDefault(require("./childHandler"));
var copyTask_1 = __importDefault(require("./copyTask"));
var outlineStrings_1 = __importDefault(require("./functions/outlineStrings"));
var program, host = typescript_1.createWatchCompilerHost("", {}, typescript_1.sys, typescript_1.createSemanticDiagnosticsBuilderProgram, getDiagnostic, fileChange);
var logger = debug_1.default(__1.name + ":compiler");
function runTSCompiler() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            host = typescript_1.createWatchCompilerHost(__1.config.tsconfig, {}, typescript_1.sys, typescript_1.createSemanticDiagnosticsBuilderProgram, getDiagnostic, fileChange);
            logger("Created TypeScript watcher.");
            program = typescript_1.createWatchProgram(host);
            process.once("exit", program.close);
            return [2];
        });
    });
}
exports.default = runTSCompiler;
var diagnosticErrorArray = [], diagnosticsFinished;
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
    var result = {};
    logger("Found " + diagnosticErrorArray.length + " errors. Transferring array to object\u2026");
    for (var i_1 = 0; i_1 < diagnosticErrorArray.length; i_1++) {
        var diagnostic = diagnosticErrorArray[i_1];
        if (!result[diagnostic.code])
            result[diagnostic.code] = [];
        var fileSrcMsg = chalk_1.default.hex("#bebebe")(chalk_1.default.yellowBright(diagnostic.file) + "(" + (diagnostic.diagnosticLine.line + 1) + "," + (diagnostic.diagnosticLine.character + 1) + ")");
        result[diagnostic.code].push(fileSrcMsg + " \u2022 " + chalk_1.default.hex("#7289DA")(diagnostic.message));
    }
    logger("Transferred array to object, now posting errors by error ID…");
    console.log(__1.dsConsolePrefix + " " + chalk_1.default.bold(chalk_1.default.hex("#e83a3a")("Found " +
        diagnosticErrorArray.length +
        " error" +
        (diagnosticErrorArray.length === 1 ? "" : "s") +
        ". Watching for file changes…")));
    var i = 0;
    for (var _i = 0, _a = Object.entries(result); _i < _a.length; _i++) {
        var _b = _a[_i], errorCode = _b[0], errorArray = _b[1];
        outlineStrings_1.default(errorArray, "•");
        i++;
        if (Object.keys(result).length > 1) {
            if (Object.keys(result).length === i) {
                console.log("\u2570\u2500 " + chalk_1.default.bold(chalk_1.default.redBright("TS" + errorCode)));
                displayAsTree(errorArray, "   ");
            }
            else {
                console.log("\u251C\u2500 " + chalk_1.default.bold(chalk_1.default.redBright("TS" + errorCode)));
                displayAsTree(errorArray, "│  ");
            }
        }
        else {
            console.log("\u2570\u2500 " + chalk_1.default.bold(chalk_1.default.redBright("TS" + errorCode)));
            displayAsTree(errorArray, "   ");
        }
    }
    diagnosticErrorArray = [];
}
function displayAsTree(children, prefix, color) {
    if (prefix === void 0) { prefix = ""; }
    if (color === void 0) { color = chalk_1.default.reset; }
    console.log((children.length > 1
        ? prefix + "\u251C\u2500 " +
            children
                .slice(0, -1)
                .map(function (s) { return color(s); })
                .join("\n" + prefix + "\u251C\u2500 ") +
            "\n"
        : "") +
        (prefix + "\u2570\u2500 ") +
        color(children.slice(-1)[0]));
}
function fileChange(diagnostic) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (diagnostic.code === 6031) {
                        if (!__1.config.silent)
                            console.log(__1.dsConsolePrefix + " " + chalk_1.default.blueBright("Starting TypeScript compiler…"));
                        return [2];
                    }
                    if (diagnostic.code === 6032) {
                        if (!__1.config.silent)
                            console.log(__1.dsConsolePrefix + " " + chalk_1.default.blueBright(diagnostic.messageText
                                .toString()
                                .substring(0, diagnostic.messageText.toString().length - 3) + "…"));
                        return [2];
                    }
                    if (!(diagnostic.code === 6194 &&
                        parseInt(diagnostic.messageText.toString().replace(/\D/g, "")) === 0)) return [3, 3];
                    return [4, copyTask_1.default()];
                case 1:
                    _a.sent();
                    return [4, childHandler_1.default()];
                case 2:
                    _a.sent();
                    if (!__1.config.silent)
                        console.log(__1.dsConsolePrefix +
                            " " +
                            chalk_1.default.green(diagnostic.messageText
                                .toString()
                                .substring(0, diagnostic.messageText.toString().length - 1) + "…"));
                    return [2];
                case 3: return [2];
            }
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNDb21waWxlci5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsidXRpbC90c0NvbXBpbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsZ0RBQTBCO0FBQzFCLGdEQUEwQjtBQUMxQix5Q0FTb0I7QUFFcEIseUJBQW9EO0FBQ3BELGdFQUFzQztBQUN0Qyx3REFBa0M7QUFDbEMsOEVBQWlEO0FBRWpELElBQUksT0FBNkQsRUFDaEUsSUFBSSxHQUFHLG9DQUF1QixDQUM3QixFQUFFLEVBQ0YsRUFBRSxFQUNGLGdCQUFHLEVBQ0gsb0RBQXVDLEVBQ3ZDLGFBQWEsRUFDYixVQUFVLENBQ1YsQ0FBQztBQUNILElBQU0sTUFBTSxHQUFHLGVBQUssQ0FBSSxRQUFJLGNBQVcsQ0FBQyxDQUFDO0FBRXpDLFNBQThCLGFBQWE7OztZQUMxQyxJQUFJLEdBQUcsb0NBQXVCLENBQzdCLFVBQU0sQ0FBQyxRQUFRLEVBQ2YsRUFBRSxFQUNGLGdCQUFHLEVBQ0gsb0RBQXVDLEVBQ3ZDLGFBQWEsRUFDYixVQUFVLENBQ1YsQ0FBQztZQUVGLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1lBQ3RDLE9BQU8sR0FBRywrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVuQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7Ozs7Q0FDcEM7QUFkRCxnQ0FjQztBQUVELElBQUksb0JBQW9CLEdBS2pCLEVBQUUsRUFDUixtQkFBbUMsQ0FBQztBQUNyQyxTQUFTLGFBQWEsQ0FBQyxVQUFzQjtJQUU1QyxJQUFJLG1CQUFtQjtRQUFFLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQzNELG1CQUFtQixHQUFHLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUl2RCxvQkFBb0IsQ0FBQyxJQUFJLENBQUM7UUFDekIs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QUFDLEtBQUssQ0FDVixVQUFVLENBQUMsV0FBVztpQ0FDcEIsUUFBUSxFQUFFO2lDQUNWLFNBQVMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUNsRSxDQUNGLENBQUM7b0JBQ0gsV0FBTzs7Ozs7Q0FJUiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjaGFsayBmcm9tIFwiY2hhbGtcIjtcclxuaW1wb3J0IGRlYnVnIGZyb20gXCJkZWJ1Z1wiO1xyXG5pbXBvcnQge1xyXG5cdGNyZWF0ZVNlbWFudGljRGlhZ25vc3RpY3NCdWlsZGVyUHJvZ3JhbSxcclxuXHRjcmVhdGVXYXRjaENvbXBpbGVySG9zdCxcclxuXHRjcmVhdGVXYXRjaFByb2dyYW0sXHJcblx0RGlhZ25vc3RpYyxcclxuXHRnZXRMaW5lQW5kQ2hhcmFjdGVyT2ZQb3NpdGlvbixcclxuXHRTZW1hbnRpY0RpYWdub3N0aWNzQnVpbGRlclByb2dyYW0sXHJcblx0c3lzLFxyXG5cdFdhdGNoT2ZDb25maWdGaWxlXHJcbn0gZnJvbSBcInR5cGVzY3JpcHRcIjtcclxuXHJcbmltcG9ydCB7IGNvbmZpZywgZHNDb25zb2xlUHJlZml4LCBuYW1lIH0gZnJvbSBcIi4uL1wiO1xyXG5pbXBvcnQgcnVuQ2hpbGQgZnJvbSBcIi4vY2hpbGRIYW5kbGVyXCI7XHJcbmltcG9ydCBjb3B5VGFzayBmcm9tIFwiLi9jb3B5VGFza1wiO1xyXG5pbXBvcnQgb3V0bGluZSBmcm9tIFwiLi9mdW5jdGlvbnMvb3V0bGluZVN0cmluZ3NcIjtcclxuXHJcbmxldCBwcm9ncmFtOiBXYXRjaE9mQ29uZmlnRmlsZTxTZW1hbnRpY0RpYWdub3N0aWNzQnVpbGRlclByb2dyYW0+LFxyXG5cdGhvc3QgPSBjcmVhdGVXYXRjaENvbXBpbGVySG9zdChcclxuXHRcdFwiXCIsXHJcblx0XHR7fSxcclxuXHRcdHN5cyxcclxuXHRcdGNyZWF0ZVNlbWFudGljRGlhZ25vc3RpY3NCdWlsZGVyUHJvZ3JhbSxcclxuXHRcdGdldERpYWdub3N0aWMsXHJcblx0XHRmaWxlQ2hhbmdlXHJcblx0KTtcclxuY29uc3QgbG9nZ2VyID0gZGVidWcoYCR7bmFtZX06Y29tcGlsZXJgKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHJ1blRTQ29tcGlsZXIoKSB7XHJcblx0aG9zdCA9IGNyZWF0ZVdhdGNoQ29tcGlsZXJIb3N0KFxyXG5cdFx0Y29uZmlnLnRzY29uZmlnLFxyXG5cdFx0e30sXHJcblx0XHRzeXMsXHJcblx0XHRjcmVhdGVTZW1hbnRpY0RpYWdub3N0aWNzQnVpbGRlclByb2dyYW0sXHJcblx0XHRnZXREaWFnbm9zdGljLFxyXG5cdFx0ZmlsZUNoYW5nZVxyXG5cdCk7XHJcblxyXG5cdGxvZ2dlcihcIkNyZWF0ZWQgVHlwZVNjcmlwdCB3YXRjaGVyLlwiKTtcclxuXHRwcm9ncmFtID0gY3JlYXRlV2F0Y2hQcm9ncmFtKGhvc3QpO1xyXG5cclxuXHRwcm9jZXNzLm9uY2UoXCJleGl0XCIsIHByb2dyYW0uY2xvc2UpO1xyXG59XHJcblxyXG5sZXQgZGlhZ25vc3RpY0Vycm9yQXJyYXk6IHtcclxuXHRcdGZpbGU6IHN0cmluZztcclxuXHRcdGRpYWdub3N0aWNMaW5lOiB7IGxpbmU6IG51bWJlcjsgY2hhcmFjdGVyOiBudW1iZXIgfTtcclxuXHRcdG1lc3NhZ2U6IHN0cmluZztcclxuXHRcdGNvZGU6IG51bWJlcjtcclxuXHR9W10gPSBbXSxcclxuXHRkaWFnbm9zdGljc0ZpbmlzaGVkOiBOb2RlSlMuVGltZW91dDtcclxuZnVuY3Rpb24gZ2V0RGlhZ25vc3RpYyhkaWFnbm9zdGljOiBEaWFnbm9zdGljKSB7XHJcblx0Ly8jcmVnaW9uIE1ha2Ugc3VyZSBkaWFnbm9zdGljcyBhcmUgZmluaXNoZWRcclxuXHRpZiAoZGlhZ25vc3RpY3NGaW5pc2hlZCkgY2xlYXJUaW1lb3V0KGRpYWdub3N0aWNzRmluaXNoZWQpO1xyXG5cdGRpYWdub3N0aWNzRmluaXNoZWQgPSBzZXRUaW1lb3V0KHJlcG9ydERpYWdub3N0aWNzLCAxKTtcclxuXHQvLyNlbmRyZWdpb25cclxuXHJcblx0Ly8qIEFwcGVuZCB0byBkaWFnbm9zdGljRXJyb3JBcnJheVxyXG5cdGRpYWdub3N0aWNFcnJvckFycmF5LnB1c2goe1xyXG5cdFx0ZmlsZTogZGlhZ25vc3RpYy5maWxlLmZpbGVOYW1lLnJlcGxhY2UoXHJcblx0XHRcdGhvc3QuZ2V0Q3VycmVudERpcmVjdG9yeSgpICsgXCIvXCIsXHJcblx0XHRcdFwiXCJcclxuXHRcdCksXHJcblx0XHRkaWFnbm9zdGljTGluZTogZ2V0TGluZUFuZENoYXJhY3Rlck9mUG9zaXRpb24oXHJcblx0XHRcdGRpYWdub3N0aWMuZmlsZSxcclxuXHRcdFx0ZGlhZ25vc3RpYy5zdGFydCFcclxuXHRcdCksXHJcblx0XHRtZXNzYWdlOlxyXG5cdFx0XHR0eXBlb2YgZGlhZ25vc3RpYy5tZXNzYWdlVGV4dCAhPT0gXCJzdHJpbmdcIlxyXG5cdFx0XHRcdD8gLy9UT0RPIE1heWJlIHNob3cgaXQgaW4gbW9yZSBpbmRlbnRzP1xyXG5cdFx0XHRcdCAgZGlhZ25vc3RpYy5tZXNzYWdlVGV4dC5tZXNzYWdlVGV4dFxyXG5cdFx0XHRcdDogZGlhZ25vc3RpYy5tZXNzYWdlVGV4dFxyXG5cdFx0XHRcdFx0XHQudG9TdHJpbmcoKVxyXG5cdFx0XHRcdFx0XHQucmVwbGFjZShob3N0LmdldEN1cnJlbnREaXJlY3RvcnkoKSArIFwiL1wiLCBcIlwiKSxcclxuXHRcdGNvZGU6IGRpYWdub3N0aWMuY29kZVxyXG5cdH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZXBvcnREaWFnbm9zdGljcygpIHtcclxuXHRpZiAoY29uZmlnLnNpbGVudCkgcmV0dXJuO1xyXG5cclxuXHRsZXQgcmVzdWx0OiB7XHJcblx0XHRbbmFtZTogbnVtYmVyXTogc3RyaW5nW107XHJcblx0fSA9IHt9O1xyXG5cclxuXHQvLyNyZWdpb24gQ29udmVydCBhcnJheSB0byBmdWxseSBjb2xvcmVkIG9iamVjdFxyXG5cdGxvZ2dlcihcclxuXHRcdGBGb3VuZCAke2RpYWdub3N0aWNFcnJvckFycmF5Lmxlbmd0aH0gZXJyb3JzLiBUcmFuc2ZlcnJpbmcgYXJyYXkgdG8gb2JqZWN04oCmYFxyXG5cdCk7XHJcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkaWFnbm9zdGljRXJyb3JBcnJheS5sZW5ndGg7IGkrKykge1xyXG5cdFx0Y29uc3QgZGlhZ25vc3RpYyA9IGRpYWdub3N0aWNFcnJvckFycmF5W2ldO1xyXG5cdFx0Ly8qIEVuc3VyZSBjb2RlIGV4aXN0cyBpbiBvYmplY3RcclxuXHRcdGlmICghcmVzdWx0W2RpYWdub3N0aWMuY29kZV0pIHJlc3VsdFtkaWFnbm9zdGljLmNvZGVdID0gW107XHJcblxyXG5cdFx0Ly8qIEZpbGUgc3JjIG1lc3NhZ2UgY29sb3JpbmdcclxuXHRcdGNvbnN0IGZpbGVTcmNNc2cgPSBjaGFsay5oZXgoXCIjYmViZWJlXCIpKFxyXG5cdFx0XHRgJHtjaGFsay55ZWxsb3dCcmlnaHQoZGlhZ25vc3RpYy5maWxlKX0oJHtcclxuXHRcdFx0XHRkaWFnbm9zdGljLmRpYWdub3N0aWNMaW5lLmxpbmUgKyAxXHJcblx0XHRcdH0sJHtkaWFnbm9zdGljLmRpYWdub3N0aWNMaW5lLmNoYXJhY3RlciArIDF9KWBcclxuXHRcdCk7XHJcblxyXG5cdFx0cmVzdWx0W2RpYWdub3N0aWMuY29kZV0ucHVzaChcclxuXHRcdFx0YCR7ZmlsZVNyY01zZ30g4oCiICR7Y2hhbGsuaGV4KFwiIzcyODlEQVwiKShkaWFnbm9zdGljLm1lc3NhZ2UpfWBcclxuXHRcdCk7XHJcblx0fVxyXG5cdGxvZ2dlcihcIlRyYW5zZmVycmVkIGFycmF5IHRvIG9iamVjdCwgbm93IHBvc3RpbmcgZXJyb3JzIGJ5IGVycm9yIElE4oCmXCIpO1xyXG5cdC8vI2VuZHJlZ2lvblxyXG5cclxuXHQvLyogRXJyb3IgaGVhZGVyXHJcblx0Y29uc29sZS5sb2coXHJcblx0XHRgJHtkc0NvbnNvbGVQcmVmaXh9ICR7Y2hhbGsuYm9sZChcclxuXHRcdFx0Y2hhbGsuaGV4KFwiI2U4M2EzYVwiKShcclxuXHRcdFx0XHRcIkZvdW5kIFwiICtcclxuXHRcdFx0XHRcdGRpYWdub3N0aWNFcnJvckFycmF5Lmxlbmd0aCArXHJcblx0XHRcdFx0XHRcIiBlcnJvclwiICtcclxuXHRcdFx0XHRcdChkaWFnbm9zdGljRXJyb3JBcnJheS5sZW5ndGggPT09IDEgPyBcIlwiIDogXCJzXCIpICtcclxuXHRcdFx0XHRcdFwiLiBXYXRjaGluZyBmb3IgZmlsZSBjaGFuZ2Vz4oCmXCJcclxuXHRcdFx0KVxyXG5cdFx0KX1gXHJcblx0KTtcclxuXHJcblx0bGV0IGkgPSAwO1xyXG5cdGZvciAoY29uc3QgW2Vycm9yQ29kZSwgZXJyb3JBcnJheV0gb2YgT2JqZWN0LmVudHJpZXMocmVzdWx0KSkge1xyXG5cdFx0Ly8qIFNwYWNpbmcgYmV0d2VlbiBzcmMgYW5kIGVycm9yIG1lc3NhZ2UuXHJcblx0XHRvdXRsaW5lKGVycm9yQXJyYXksIFwi4oCiXCIpO1xyXG5cclxuXHRcdGkrKztcclxuXHRcdGlmIChPYmplY3Qua2V5cyhyZXN1bHQpLmxlbmd0aCA+IDEpIHtcclxuXHRcdFx0aWYgKE9iamVjdC5rZXlzKHJlc3VsdCkubGVuZ3RoID09PSBpKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYOKVsOKUgCAke2NoYWxrLmJvbGQoY2hhbGsucmVkQnJpZ2h0KFwiVFNcIiArIGVycm9yQ29kZSkpfWApO1xyXG5cdFx0XHRcdGRpc3BsYXlBc1RyZWUoZXJyb3JBcnJheSwgXCIgICBcIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYOKUnOKUgCAke2NoYWxrLmJvbGQoY2hhbGsucmVkQnJpZ2h0KFwiVFNcIiArIGVycm9yQ29kZSkpfWApO1xyXG5cdFx0XHRcdGRpc3BsYXlBc1RyZWUoZXJyb3JBcnJheSwgXCLilIIgIFwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y29uc29sZS5sb2coYOKVsOKUgCAke2NoYWxrLmJvbGQoY2hhbGsucmVkQnJpZ2h0KFwiVFNcIiArIGVycm9yQ29kZSkpfWApO1xyXG5cdFx0XHRkaXNwbGF5QXNUcmVlKGVycm9yQXJyYXksIFwiICAgXCIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZGlhZ25vc3RpY0Vycm9yQXJyYXkgPSBbXTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGlzcGxheUFzVHJlZShcclxuXHRjaGlsZHJlbjogc3RyaW5nW10sXHJcblx0cHJlZml4ID0gXCJcIixcclxuXHRjb2xvcjogY2hhbGsuQ2hhbGsgPSBjaGFsay5yZXNldFxyXG4pIHtcclxuXHRjb25zb2xlLmxvZyhcclxuXHRcdChjaGlsZHJlbi5sZW5ndGggPiAxXHJcblx0XHRcdD8gYCR7cHJlZml4feKUnOKUgCBgICtcclxuXHRcdFx0ICBjaGlsZHJlblxyXG5cdFx0XHRcdFx0LnNsaWNlKDAsIC0xKVxyXG5cdFx0XHRcdFx0Lm1hcCgocykgPT4gY29sb3IocykpXHJcblx0XHRcdFx0XHQuam9pbihgXFxuJHtwcmVmaXh94pSc4pSAIGApICtcclxuXHRcdFx0ICBcIlxcblwiXHJcblx0XHRcdDogXCJcIikgK1xyXG5cdFx0XHRgJHtwcmVmaXh94pWw4pSAIGAgK1xyXG5cdFx0XHRjb2xvcihjaGlsZHJlbi5zbGljZSgtMSlbMF0pXHJcblx0KTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsZUNoYW5nZShkaWFnbm9zdGljOiBEaWFnbm9zdGljKSB7XHJcblx0Ly8qIFwiU3RhcnRpbmcgY29tcGlsYXRpb24gaW4gd2F0Y2ggbW9kZS4uLlwiXCJcclxuXHRpZiAoZGlhZ25vc3RpYy5jb2RlID09PSA2MDMxKSB7XHJcblx0XHRpZiAoIWNvbmZpZy5zaWxlbnQpXHJcblx0XHRcdGNvbnNvbGUubG9nKFxyXG5cdFx0XHRcdGAke2RzQ29uc29sZVByZWZpeH0gJHtjaGFsay5ibHVlQnJpZ2h0KFxyXG5cdFx0XHRcdFx0XCJTdGFydGluZyBUeXBlU2NyaXB0IGNvbXBpbGVy4oCmXCJcclxuXHRcdFx0XHQpfWBcclxuXHRcdFx0KTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdC8vKiBcIkZpbGUgY2hhbmdlIGRldGVjdGVkLi4uXCJcclxuXHRpZiAoZGlhZ25vc3RpYy5jb2RlID09PSA2MDMyKSB7XHJcblx0XHRpZiAoIWNvbmZpZy5zaWxlbnQpXHJcblx0XHRcdGNvbnNvbGUubG9nKFxyXG5cdFx0XHRcdGAke2RzQ29uc29sZVByZWZpeH0gJHtjaGFsay5ibHVlQnJpZ2h0KFxyXG5cdFx0XHRcdFx0ZGlhZ25vc3RpYy5tZXNzYWdlVGV4dFxyXG5cdFx0XHRcdFx0XHQudG9TdHJpbmcoKVxyXG5cdFx0XHRcdFx0XHQuc3Vic3RyaW5nKDAsIGRpYWdub3N0aWMubWVzc2FnZVRleHQudG9TdHJpbmcoKS5sZW5ndGggLSAzKSArIFwi4oCmXCJcclxuXHRcdFx0XHQpfWBcclxuXHRcdFx0KTtcclxuXHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHRpZiAoXHJcblx0XHQvLyogRm91bmQgMCBlcnJvcnNcclxuXHRcdGRpYWdub3N0aWMuY29kZSA9PT0gNjE5NCAmJlxyXG5cdFx0cGFyc2VJbnQoZGlhZ25vc3RpYy5tZXNzYWdlVGV4dC50b1N0cmluZygpLnJlcGxhY2UoL1xcRC9nLCBcIlwiKSkgPT09IDBcclxuXHQpIHtcclxuXHRcdGF3YWl0IGNvcHlUYXNrKCk7XHJcblx0XHQvLyogUmVzdGFydCBjaGlsZFxyXG5cdFx0YXdhaXQgcnVuQ2hpbGQoKTtcclxuXHJcblx0XHRpZiAoIWNvbmZpZy5zaWxlbnQpXHJcblx0XHRcdGNvbnNvbGUubG9nKFxyXG5cdFx0XHRcdGRzQ29uc29sZVByZWZpeCArXHJcblx0XHRcdFx0XHRcIiBcIiArXHJcblx0XHRcdFx0XHRjaGFsay5ncmVlbihcclxuXHRcdFx0XHRcdFx0ZGlhZ25vc3RpYy5tZXNzYWdlVGV4dFxyXG5cdFx0XHRcdFx0XHRcdC50b1N0cmluZygpXHJcblx0XHRcdFx0XHRcdFx0LnN1YnN0cmluZygwLCBkaWFnbm9zdGljLm1lc3NhZ2VUZXh0LnRvU3RyaW5nKCkubGVuZ3RoIC0gMSkgKyBcIuKAplwiXHJcblx0XHRcdFx0XHQpXHJcblx0XHRcdCk7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHQvLyogRXJyb3JzLCBubyByZXN0YXJ0XHJcbn1cclxuIl19