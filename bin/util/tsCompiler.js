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
var displayastree_1 = require("displayastree");
var path_1 = require("path");
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
    for (var i = 0; i < diagnosticErrorArray.length; i++) {
        var diagnostic = diagnosticErrorArray[i];
        if (!result[diagnostic.code])
            result[diagnostic.code] = [];
        var fileSrcMsg = chalk_1.default.hex("#bebebe")(chalk_1.default.yellowBright(path_1.relative(process.cwd(), diagnostic.file).replace(/\\/g, "/")) + "(" + (diagnostic.diagnosticLine.line + 1) + "," + (diagnostic.diagnosticLine.character + 1) + ")");
        result[diagnostic.code].push(fileSrcMsg + " \u2022 " + chalk_1.default.hex("#7289DA")(diagnostic.message));
    }
    logger("Transferred array to object, now posting errors by error ID…");
    var sections = [];
    for (var _i = 0, _a = Object.entries(result); _i < _a.length; _i++) {
        var _b = _a[_i], errorCode = _b[0], errorArray = _b[1];
        outlineStrings_1.default(errorArray, "•");
        sections.push(new displayastree_1.TreeSection(chalk_1.default.bold(chalk_1.default.redBright("TS" + errorCode))).addSection(errorArray));
    }
    new displayastree_1.DisplayAsTree(chalk_1.default.bold(chalk_1.default.hex("#e83a3a")("Found " +
        diagnosticErrorArray.length +
        " error" +
        (diagnosticErrorArray.length === 1 ? "" : "s") +
        ". Watching for file changes…")), {
        startChar: __1.dsConsolePrefix
    })
        .addSection(sections)
        .log();
    diagnosticErrorArray = [];
}
function fileChange(diagnostic) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (diagnostic.code === 6031) {
                        if (!__1.config.silent)
                            console.log("" + __1.dsConsolePrefix + chalk_1.default.blueBright("Starting TypeScript compiler…"));
                        return [2];
                    }
                    if (diagnostic.code === 6032) {
                        if (!__1.config.silent)
                            console.log("" + __1.dsConsolePrefix + chalk_1.default.blueBright(diagnostic.messageText
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
                            chalk_1.default.green(diagnostic.messageText
                                .toString()
                                .substring(0, diagnostic.messageText.toString().length - 1) + "…"));
                    return [2];
                case 3: return [2];
            }
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNDb21waWxlci5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsidXRpbC90c0NvbXBpbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsZ0RBQTBCO0FBQzFCLGdEQUEwQjtBQUMxQiwrQ0FBMkQ7QUFDM0QsNkJBQWdDO0FBQ2hDLHlDQVNvQjtBQUVwQix5QkFBb0Q7QUFDcEQsZ0VBQXNDO0FBQ3RDLHdEQUFrQztBQUNsQyw4RUFBaUQ7QUFFakQsSUFBSSxPQUE2RCxFQUNoRSxJQUFJLEdBQUcsb0NBQXVCLENBQzdCLEVBQUUsRUFDRixFQUFFLEVBQ0YsZ0JBQUcsRUFDSCxvREFBdUMsRUFDdkMsYUFBYSxFQUNiLFVBQVUsQ0FDVixDQUFDO0FBQ0gsSUFBTSxNQUFNLEdBQUcsZUFBSyxDQUFJLFFBQUksY0FBVyxDQUFDLENBQUM7QUFFekMsU0FBOEIsYUFBYTs7O1lBQzFDLElBQUksR0FBRyxvQ0FBdUIsQ0FDN0IsVUFBTSxDQUFDLFFBQVEsRUFDZixFQUFFLEVBQ0YsZ0JBQUcsRUFDSCxvREFBdUMsRUFDdkMsYUFBYSxFQUNiLFVBQVUsQ0FDVixDQUFDO1lBRUYsTUFBTSxDQUFDLDZCQUE2QixDQUFDLENBQUM7WUFDdEMsT0FBTyxHQUFHLCtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBRW5DLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzs7OztDQUNwQztBQWRELGdDQWNDO0FBRUQsSUFBSSxvQkFBb0IsR0FLakIsRUFBRSxFQUNSLG1CQUFtQyxDQUFDO0FBQ3JDLFNBQVMsYUFBYSxDQUFDLFVBQXNCO0lBRTVDLElBQUksbUJBQW1CO1FBQUUsWUFBWSxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDM0QsbUJBQW1CLEdBQUcsVUFBVSxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxDQUFDO0lBSXZELG9C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b0JBRWpCLElBQUksQ0FBQyxVQUFNLENBQUMsTUFBTTt3QkFDakIsT0FBTyxDQUFDLEdBQUcsQ0FDVixtQkFBZTs0QkFDZCxlQUFLLENBQUMsS0FBSyxDQUNWLFVBQVUsQ0FBQyxXQUFXO2lDQUNwQixRQUFRLEVBQUU7aUNBQ1YsU0FBUyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQ2xFLENBQ0YsQ0FBQztvQkFDSCxXQUFPOzs7OztDQUlSIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNoYWxrIGZyb20gXCJjaGFsa1wiO1xyXG5pbXBvcnQgZGVidWcgZnJvbSBcImRlYnVnXCI7XHJcbmltcG9ydCB7IERpc3BsYXlBc1RyZWUsIFRyZWVTZWN0aW9uIH0gZnJvbSBcImRpc3BsYXlhc3RyZWVcIjtcclxuaW1wb3J0IHsgcmVsYXRpdmUgfSBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQge1xyXG5cdGNyZWF0ZVNlbWFudGljRGlhZ25vc3RpY3NCdWlsZGVyUHJvZ3JhbSxcclxuXHRjcmVhdGVXYXRjaENvbXBpbGVySG9zdCxcclxuXHRjcmVhdGVXYXRjaFByb2dyYW0sXHJcblx0RGlhZ25vc3RpYyxcclxuXHRnZXRMaW5lQW5kQ2hhcmFjdGVyT2ZQb3NpdGlvbixcclxuXHRTZW1hbnRpY0RpYWdub3N0aWNzQnVpbGRlclByb2dyYW0sXHJcblx0c3lzLFxyXG5cdFdhdGNoT2ZDb25maWdGaWxlXHJcbn0gZnJvbSBcInR5cGVzY3JpcHRcIjtcclxuXHJcbmltcG9ydCB7IGNvbmZpZywgZHNDb25zb2xlUHJlZml4LCBuYW1lIH0gZnJvbSBcIi4uL1wiO1xyXG5pbXBvcnQgcnVuQ2hpbGQgZnJvbSBcIi4vY2hpbGRIYW5kbGVyXCI7XHJcbmltcG9ydCBjb3B5VGFzayBmcm9tIFwiLi9jb3B5VGFza1wiO1xyXG5pbXBvcnQgb3V0bGluZSBmcm9tIFwiLi9mdW5jdGlvbnMvb3V0bGluZVN0cmluZ3NcIjtcclxuXHJcbmxldCBwcm9ncmFtOiBXYXRjaE9mQ29uZmlnRmlsZTxTZW1hbnRpY0RpYWdub3N0aWNzQnVpbGRlclByb2dyYW0+LFxyXG5cdGhvc3QgPSBjcmVhdGVXYXRjaENvbXBpbGVySG9zdChcclxuXHRcdFwiXCIsXHJcblx0XHR7fSxcclxuXHRcdHN5cyxcclxuXHRcdGNyZWF0ZVNlbWFudGljRGlhZ25vc3RpY3NCdWlsZGVyUHJvZ3JhbSxcclxuXHRcdGdldERpYWdub3N0aWMsXHJcblx0XHRmaWxlQ2hhbmdlXHJcblx0KTtcclxuY29uc3QgbG9nZ2VyID0gZGVidWcoYCR7bmFtZX06Y29tcGlsZXJgKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHJ1blRTQ29tcGlsZXIoKSB7XHJcblx0aG9zdCA9IGNyZWF0ZVdhdGNoQ29tcGlsZXJIb3N0KFxyXG5cdFx0Y29uZmlnLnRzY29uZmlnLFxyXG5cdFx0e30sXHJcblx0XHRzeXMsXHJcblx0XHRjcmVhdGVTZW1hbnRpY0RpYWdub3N0aWNzQnVpbGRlclByb2dyYW0sXHJcblx0XHRnZXREaWFnbm9zdGljLFxyXG5cdFx0ZmlsZUNoYW5nZVxyXG5cdCk7XHJcblxyXG5cdGxvZ2dlcihcIkNyZWF0ZWQgVHlwZVNjcmlwdCB3YXRjaGVyLlwiKTtcclxuXHRwcm9ncmFtID0gY3JlYXRlV2F0Y2hQcm9ncmFtKGhvc3QpO1xyXG5cclxuXHRwcm9jZXNzLm9uY2UoXCJleGl0XCIsIHByb2dyYW0uY2xvc2UpO1xyXG59XHJcblxyXG5sZXQgZGlhZ25vc3RpY0Vycm9yQXJyYXk6IHtcclxuXHRcdGZpbGU6IHN0cmluZztcclxuXHRcdGRpYWdub3N0aWNMaW5lOiB7IGxpbmU6IG51bWJlcjsgY2hhcmFjdGVyOiBudW1iZXIgfTtcclxuXHRcdG1lc3NhZ2U6IHN0cmluZztcclxuXHRcdGNvZGU6IG51bWJlcjtcclxuXHR9W10gPSBbXSxcclxuXHRkaWFnbm9zdGljc0ZpbmlzaGVkOiBOb2RlSlMuVGltZW91dDtcclxuZnVuY3Rpb24gZ2V0RGlhZ25vc3RpYyhkaWFnbm9zdGljOiBEaWFnbm9zdGljKSB7XHJcblx0Ly8jcmVnaW9uIE1ha2Ugc3VyZSBkaWFnbm9zdGljcyBhcmUgZmluaXNoZWRcclxuXHRpZiAoZGlhZ25vc3RpY3NGaW5pc2hlZCkgY2xlYXJUaW1lb3V0KGRpYWdub3N0aWNzRmluaXNoZWQpO1xyXG5cdGRpYWdub3N0aWNzRmluaXNoZWQgPSBzZXRUaW1lb3V0KHJlcG9ydERpYWdub3N0aWNzLCAxKTtcclxuXHQvLyNlbmRyZWdpb25cclxuXHJcblx0Ly8qIEFwcGVuZCB0byBkaWFnbm9zdGljRXJyb3JBcnJheVxyXG5cdGRpYWdub3N0aWNFcnJvckFycmF5LnB1c2goe1xyXG5cdFx0ZmlsZTogZGlhZ25vc3RpYy5maWxlLmZpbGVOYW1lLnJlcGxhY2UoXHJcblx0XHRcdGhvc3QuZ2V0Q3VycmVudERpcmVjdG9yeSgpICsgXCIvXCIsXHJcblx0XHRcdFwiXCJcclxuXHRcdCksXHJcblx0XHRkaWFnbm9zdGljTGluZTogZ2V0TGluZUFuZENoYXJhY3Rlck9mUG9zaXRpb24oXHJcblx0XHRcdGRpYWdub3N0aWMuZmlsZSxcclxuXHRcdFx0ZGlhZ25vc3RpYy5zdGFydCFcclxuXHRcdCksXHJcblx0XHRtZXNzYWdlOlxyXG5cdFx0XHR0eXBlb2YgZGlhZ25vc3RpYy5tZXNzYWdlVGV4dCAhPT0gXCJzdHJpbmdcIlxyXG5cdFx0XHRcdD8gLy9UT0RPIE1heWJlIHNob3cgaXQgaW4gbW9yZSBpbmRlbnRzP1xyXG5cdFx0XHRcdCAgZGlhZ25vc3RpYy5tZXNzYWdlVGV4dC5tZXNzYWdlVGV4dFxyXG5cdFx0XHRcdDogZGlhZ25vc3RpYy5tZXNzYWdlVGV4dFxyXG5cdFx0XHRcdFx0XHQudG9TdHJpbmcoKVxyXG5cdFx0XHRcdFx0XHQucmVwbGFjZShob3N0LmdldEN1cnJlbnREaXJlY3RvcnkoKSArIFwiL1wiLCBcIlwiKSxcclxuXHRcdGNvZGU6IGRpYWdub3N0aWMuY29kZVxyXG5cdH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZXBvcnREaWFnbm9zdGljcygpIHtcclxuXHRpZiAoY29uZmlnLnNpbGVudCkgcmV0dXJuO1xyXG5cclxuXHRsZXQgcmVzdWx0OiB7XHJcblx0XHRbbmFtZTogbnVtYmVyXTogc3RyaW5nW107XHJcblx0fSA9IHt9O1xyXG5cclxuXHQvLyNyZWdpb24gQ29udmVydCBhcnJheSB0byBmdWxseSBjb2xvcmVkIG9iamVjdFxyXG5cdGxvZ2dlcihcclxuXHRcdGBGb3VuZCAke2RpYWdub3N0aWNFcnJvckFycmF5Lmxlbmd0aH0gZXJyb3JzLiBUcmFuc2ZlcnJpbmcgYXJyYXkgdG8gb2JqZWN04oCmYFxyXG5cdCk7XHJcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkaWFnbm9zdGljRXJyb3JBcnJheS5sZW5ndGg7IGkrKykge1xyXG5cdFx0Y29uc3QgZGlhZ25vc3RpYyA9IGRpYWdub3N0aWNFcnJvckFycmF5W2ldO1xyXG5cdFx0Ly8qIEVuc3VyZSBjb2RlIGV4aXN0cyBpbiBvYmplY3RcclxuXHRcdGlmICghcmVzdWx0W2RpYWdub3N0aWMuY29kZV0pIHJlc3VsdFtkaWFnbm9zdGljLmNvZGVdID0gW107XHJcblxyXG5cdFx0Ly8qIEZpbGUgc3JjIG1lc3NhZ2UgY29sb3JpbmdcclxuXHRcdGNvbnN0IGZpbGVTcmNNc2cgPSBjaGFsay5oZXgoXCIjYmViZWJlXCIpKFxyXG5cdFx0XHRgJHtjaGFsay55ZWxsb3dCcmlnaHQoXHJcblx0XHRcdFx0cmVsYXRpdmUocHJvY2Vzcy5jd2QoKSwgZGlhZ25vc3RpYy5maWxlKS5yZXBsYWNlKC9cXFxcL2csIFwiL1wiKVxyXG5cdFx0XHQpfSgke2RpYWdub3N0aWMuZGlhZ25vc3RpY0xpbmUubGluZSArIDF9LCR7XHJcblx0XHRcdFx0ZGlhZ25vc3RpYy5kaWFnbm9zdGljTGluZS5jaGFyYWN0ZXIgKyAxXHJcblx0XHRcdH0pYFxyXG5cdFx0KTtcclxuXHJcblx0XHRyZXN1bHRbZGlhZ25vc3RpYy5jb2RlXS5wdXNoKFxyXG5cdFx0XHRgJHtmaWxlU3JjTXNnfSDigKIgJHtjaGFsay5oZXgoXCIjNzI4OURBXCIpKGRpYWdub3N0aWMubWVzc2FnZSl9YFxyXG5cdFx0KTtcclxuXHR9XHJcblx0bG9nZ2VyKFwiVHJhbnNmZXJyZWQgYXJyYXkgdG8gb2JqZWN0LCBub3cgcG9zdGluZyBlcnJvcnMgYnkgZXJyb3IgSUTigKZcIik7XHJcblx0Ly8jZW5kcmVnaW9uXHJcblxyXG5cdGNvbnN0IHNlY3Rpb25zOiBUcmVlU2VjdGlvbltdID0gW107XHJcblx0Zm9yIChjb25zdCBbZXJyb3JDb2RlLCBlcnJvckFycmF5XSBvZiBPYmplY3QuZW50cmllcyhyZXN1bHQpKSB7XHJcblx0XHQvLyogU3BhY2luZyBiZXR3ZWVuIHNyYyBhbmQgZXJyb3IgbWVzc2FnZS5cclxuXHRcdG91dGxpbmUoZXJyb3JBcnJheSwgXCLigKJcIik7XHJcblx0XHRzZWN0aW9ucy5wdXNoKFxyXG5cdFx0XHRuZXcgVHJlZVNlY3Rpb24oY2hhbGsuYm9sZChjaGFsay5yZWRCcmlnaHQoXCJUU1wiICsgZXJyb3JDb2RlKSkpLmFkZFNlY3Rpb24oXHJcblx0XHRcdFx0ZXJyb3JBcnJheVxyXG5cdFx0XHQpXHJcblx0XHQpO1xyXG5cdH1cclxuXHJcblx0bmV3IERpc3BsYXlBc1RyZWUoXHJcblx0XHRjaGFsay5ib2xkKFxyXG5cdFx0XHRjaGFsay5oZXgoXCIjZTgzYTNhXCIpKFxyXG5cdFx0XHRcdFwiRm91bmQgXCIgK1xyXG5cdFx0XHRcdFx0ZGlhZ25vc3RpY0Vycm9yQXJyYXkubGVuZ3RoICtcclxuXHRcdFx0XHRcdFwiIGVycm9yXCIgK1xyXG5cdFx0XHRcdFx0KGRpYWdub3N0aWNFcnJvckFycmF5Lmxlbmd0aCA9PT0gMSA/IFwiXCIgOiBcInNcIikgK1xyXG5cdFx0XHRcdFx0XCIuIFdhdGNoaW5nIGZvciBmaWxlIGNoYW5nZXPigKZcIlxyXG5cdFx0XHQpXHJcblx0XHQpLFxyXG5cdFx0e1xyXG5cdFx0XHRzdGFydENoYXI6IGRzQ29uc29sZVByZWZpeFxyXG5cdFx0fVxyXG5cdClcclxuXHRcdC5hZGRTZWN0aW9uKHNlY3Rpb25zKVxyXG5cdFx0LmxvZygpO1xyXG5cclxuXHRkaWFnbm9zdGljRXJyb3JBcnJheSA9IFtdO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxlQ2hhbmdlKGRpYWdub3N0aWM6IERpYWdub3N0aWMpIHtcclxuXHQvLyogXCJTdGFydGluZyBjb21waWxhdGlvbiBpbiB3YXRjaCBtb2RlLi4uXCJcIlxyXG5cdGlmIChkaWFnbm9zdGljLmNvZGUgPT09IDYwMzEpIHtcclxuXHRcdGlmICghY29uZmlnLnNpbGVudClcclxuXHRcdFx0Y29uc29sZS5sb2coXHJcblx0XHRcdFx0YCR7ZHNDb25zb2xlUHJlZml4fSR7Y2hhbGsuYmx1ZUJyaWdodChcIlN0YXJ0aW5nIFR5cGVTY3JpcHQgY29tcGlsZXLigKZcIil9YFxyXG5cdFx0XHQpO1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0Ly8qIFwiRmlsZSBjaGFuZ2UgZGV0ZWN0ZWQuLi5cIlxyXG5cdGlmIChkaWFnbm9zdGljLmNvZGUgPT09IDYwMzIpIHtcclxuXHRcdGlmICghY29uZmlnLnNpbGVudClcclxuXHRcdFx0Y29uc29sZS5sb2coXHJcblx0XHRcdFx0YCR7ZHNDb25zb2xlUHJlZml4fSR7Y2hhbGsuYmx1ZUJyaWdodChcclxuXHRcdFx0XHRcdGRpYWdub3N0aWMubWVzc2FnZVRleHRcclxuXHRcdFx0XHRcdFx0LnRvU3RyaW5nKClcclxuXHRcdFx0XHRcdFx0LnN1YnN0cmluZygwLCBkaWFnbm9zdGljLm1lc3NhZ2VUZXh0LnRvU3RyaW5nKCkubGVuZ3RoIC0gMykgKyBcIuKAplwiXHJcblx0XHRcdFx0KX1gXHJcblx0XHRcdCk7XHJcblxyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0aWYgKFxyXG5cdFx0Ly8qIEZvdW5kIDAgZXJyb3JzXHJcblx0XHRkaWFnbm9zdGljLmNvZGUgPT09IDYxOTQgJiZcclxuXHRcdHBhcnNlSW50KGRpYWdub3N0aWMubWVzc2FnZVRleHQudG9TdHJpbmcoKS5yZXBsYWNlKC9cXEQvZywgXCJcIikpID09PSAwXHJcblx0KSB7XHJcblx0XHRhd2FpdCBjb3B5VGFzaygpO1xyXG5cdFx0Ly8qIFJlc3RhcnQgY2hpbGRcclxuXHRcdGF3YWl0IHJ1bkNoaWxkKCk7XHJcblxyXG5cdFx0aWYgKCFjb25maWcuc2lsZW50KVxyXG5cdFx0XHRjb25zb2xlLmxvZyhcclxuXHRcdFx0XHRkc0NvbnNvbGVQcmVmaXggK1xyXG5cdFx0XHRcdFx0Y2hhbGsuZ3JlZW4oXHJcblx0XHRcdFx0XHRcdGRpYWdub3N0aWMubWVzc2FnZVRleHRcclxuXHRcdFx0XHRcdFx0XHQudG9TdHJpbmcoKVxyXG5cdFx0XHRcdFx0XHRcdC5zdWJzdHJpbmcoMCwgZGlhZ25vc3RpYy5tZXNzYWdlVGV4dC50b1N0cmluZygpLmxlbmd0aCAtIDEpICsgXCLigKZcIlxyXG5cdFx0XHRcdFx0KVxyXG5cdFx0XHQpO1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0Ly8qIEVycm9ycywgbm8gcmVzdGFydFxyXG59XHJcbiJdfQ==