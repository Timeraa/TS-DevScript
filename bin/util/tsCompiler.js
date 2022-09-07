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
var program, host = (0, typescript_1.createWatchCompilerHost)("", {}, typescript_1.sys, typescript_1.createSemanticDiagnosticsBuilderProgram, getDiagnostic, fileChange);
var logger = (0, debug_1.default)("".concat(__1.name, ":compiler"));
function runTSCompiler() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            host = (0, typescript_1.createWatchCompilerHost)(__1.config.tsconfig, {}, typescript_1.sys, typescript_1.createSemanticDiagnosticsBuilderProgram, getDiagnostic, fileChange);
            logger("Created TypeScript watcher.");
            program = (0, typescript_1.createWatchProgram)(host);
            process.once("exit", program.close);
            return [2 /*return*/];
        });
    });
}
exports.default = runTSCompiler;
var diagnosticErrorArray = [], diagnosticsFinished;
function getDiagnostic(diagnostic) {
    var _a;
    //#region Make sure diagnostics are finished
    if (diagnosticsFinished)
        clearTimeout(diagnosticsFinished);
    diagnosticsFinished = setTimeout(reportDiagnostics, 1);
    //#endregion
    //* Append to diagnosticErrorArray
    if (((_a = diagnostic.file) === null || _a === void 0 ? void 0 : _a.fileName) === undefined)
        return;
    diagnosticErrorArray.push({
        file: diagnostic.file.fileName.replace(host.getCurrentDirectory() + "/", ""),
        diagnosticLine: (0, typescript_1.getLineAndCharacterOfPosition)(diagnostic.file, diagnostic.start),
        message: typeof diagnostic.messageText !== "string"
            ? //TODO Maybe show it in more indents?
                diagnostic.messageText.messageText
            : diagnostic.messageText
                .toString()
                .replace(host.getCurrentDirectory() + "/", ""),
        code: diagnostic.code
    });
}
function reportDiagnostics() {
    if (__1.config.silent || !diagnosticErrorArray.length)
        return;
    var result = {};
    //#region Convert array to fully colored object
    logger("Found ".concat(diagnosticErrorArray.length, " errors. Transferring array to object\u2026"));
    for (var i = 0; i < diagnosticErrorArray.length; i++) {
        var diagnostic = diagnosticErrorArray[i];
        //* Ensure code exists in object
        if (!result[diagnostic.code])
            result[diagnostic.code] = [];
        //* File src message coloring
        var fileSrcMsg = chalk_1.default.hex("#bebebe")("".concat(chalk_1.default.yellowBright((0, path_1.relative)(process.cwd(), diagnostic.file).replace(/\\/g, "/")), "(").concat(diagnostic.diagnosticLine.line + 1, ",").concat(diagnostic.diagnosticLine.character + 1, ")"));
        result[diagnostic.code].push("".concat(fileSrcMsg, " \u2022 ").concat(chalk_1.default.hex("#7289DA")(diagnostic.message)));
    }
    logger("Transferred array to object, now posting errors by error ID…");
    //#endregion
    var sections = [];
    for (var _i = 0, _a = Object.entries(result); _i < _a.length; _i++) {
        var _b = _a[_i], errorCode = _b[0], errorArray = _b[1];
        //* Spacing between src and error message.
        (0, outlineStrings_1.default)(errorArray, "•");
        sections.push(new displayastree_1.Branch(chalk_1.default.bold(chalk_1.default.redBright("TS" + errorCode))).addBranch(errorArray));
    }
    new displayastree_1.Tree(chalk_1.default.bold(chalk_1.default.hex("#e83a3a")("Found " +
        diagnosticErrorArray.length +
        " error" +
        (diagnosticErrorArray.length === 1 ? "" : "s") +
        ". Watching for file changes…")), {
        headChar: __1.dsConsolePrefix
    })
        .addBranch(sections)
        .log();
    diagnosticErrorArray = [];
}
function fileChange(diagnostic) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    //* "Starting compilation in watch mode...""
                    if (diagnostic.code === 6031) {
                        if (!__1.config.silent)
                            console.log("".concat(__1.dsConsolePrefix).concat(chalk_1.default.blueBright("Starting TypeScript compiler…")));
                        return [2 /*return*/];
                    }
                    //* "File change detected..."
                    if (diagnostic.code === 6032) {
                        if (!__1.config.silent)
                            console.log("".concat(__1.dsConsolePrefix).concat(chalk_1.default.blueBright(diagnostic.messageText
                                .toString()
                                .substring(0, diagnostic.messageText.toString().length - 3) + "…")));
                        return [2 /*return*/];
                    }
                    if (!
                    //* Found 0 errors
                    (diagnostic.code === 6194 &&
                        parseInt(diagnostic.messageText.toString().replace(/\D/g, "")) === 0)) 
                    //* Found 0 errors
                    return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, copyTask_1.default)()];
                case 1:
                    _a.sent();
                    //* Restart child
                    return [4 /*yield*/, (0, childHandler_1.default)()];
                case 2:
                    //* Restart child
                    _a.sent();
                    if (!__1.config.silent)
                        console.log(__1.dsConsolePrefix +
                            chalk_1.default.green(diagnostic.messageText
                                .toString()
                                .substring(0, diagnostic.messageText.toString().length - 1) + "…"));
                    return [2 /*return*/];
                case 3: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNDb21waWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL3RzQ29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxnREFBMEI7QUFDMUIsZ0RBQTBCO0FBQzFCLCtDQUE2QztBQUM3Qyw2QkFBZ0M7QUFDaEMseUNBU29CO0FBRXBCLHlCQUFvRDtBQUNwRCxnRUFBc0M7QUFDdEMsd0RBQWtDO0FBQ2xDLDhFQUFpRDtBQUVqRCxJQUFJLE9BQTZELEVBQ2hFLElBQUksR0FBRyxJQUFBLG9DQUF1QixFQUM3QixFQUFFLEVBQ0YsRUFBRSxFQUNGLGdCQUFHLEVBQ0gsb0RBQXVDLEVBQ3ZDLGFBQWEsRUFDYixVQUFVLENBQ1YsQ0FBQztBQUNILElBQU0sTUFBTSxHQUFHLElBQUEsZUFBSyxFQUFDLFVBQUcsUUFBSSxjQUFXLENBQUMsQ0FBQztBQUV6QyxTQUE4QixhQUFhOzs7WUFDMUMsSUFBSSxHQUFHLElBQUEsb0NBQXVCLEVBQzdCLFVBQU0sQ0FBQyxRQUFRLEVBQ2YsRUFBRSxFQUNGLGdCQUFHLEVBQ0gsb0RBQXVDLEVBQ3ZDLGFBQWEsRUFDYixVQUFVLENBQ1YsQ0FBQztZQUVGLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1lBQ3RDLE9BQU8sR0FBRyxJQUFBLCtCQUFrQixFQUFDLElBQUksQ0FBQyxDQUFDO1lBRW5DLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzs7OztDQUNwQztBQWRELGdDQWNDO0FBRUQsSUFBSSxvQkFBb0IsR0FLakIsRUFBRSxFQUNSLG1CQUFtQyxDQUFDO0FBQ3JDLFNBQVMsYUFBYSxDQUFDLFVBQXNCOztJQUM1Qyw0Q0FBNEM7SUFDNUMsSUFBSSxtQkFBbUI7UUFBRSxZQUFZLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUMzRCxtQkFBbUIsR0FB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R0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQ2xFLENBQUUsQ0FDSCxDQUFDO3dCQUVILHNCQUFPO3FCQUNQOztvQkFHQSxrQkFBa0I7b0JBQ2xCLENBQUEsVUFBVSxDQUFDLElBQUksS0FBSyxJQUFJO3dCQUN4QixRQUFRLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFBO29CQUZwRSxrQkFBa0I7b0JBQ2xCLHdCQUNvRTtvQkFFcEUscUJBQU0sSUFBQSxrQkFBUSxHQUFFLEVBQUE7O29CQUFoQixTQUFnQixDQUFDO29CQUNqQixpQkFBaUI7b0JBQ2pCLHFCQUFNLElBQUEsc0JBQVEsR0FBRSxFQUFBOztvQkFEaEIsaUJBQWlCO29CQUNqQixTQUFnQixDQUFDO29CQUVqQixJQUFJLENBQUMsVUFBTSxDQUFDLE1BQU07d0JBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQ1YsbUJBQWU7NEJBQ2QsZUFBSyxDQUFDLEtBQUssQ0FDVixVQUFVLENBQUMsV0FBVztpQ0FDcEIsUUFBUSxFQUFFO2lDQUNWLFNBQVMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUNsRSxDQUNGLENBQUM7b0JBQ0gsc0JBQU87Ozs7O0NBSVIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2hhbGsgZnJvbSBcImNoYWxrXCI7XHJcbmltcG9ydCBkZWJ1ZyBmcm9tIFwiZGVidWdcIjtcclxuaW1wb3J0IHsgQnJhbmNoLCBUcmVlIH0gZnJvbSBcImRpc3BsYXlhc3RyZWVcIjtcclxuaW1wb3J0IHsgcmVsYXRpdmUgfSBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQge1xyXG5cdGNyZWF0ZVNlbWFudGljRGlhZ25vc3RpY3NCdWlsZGVyUHJvZ3JhbSxcclxuXHRjcmVhdGVXYXRjaENvbXBpbGVySG9zdCxcclxuXHRjcmVhdGVXYXRjaFByb2dyYW0sXHJcblx0RGlhZ25vc3RpYyxcclxuXHRnZXRMaW5lQW5kQ2hhcmFjdGVyT2ZQb3NpdGlvbixcclxuXHRTZW1hbnRpY0RpYWdub3N0aWNzQnVpbGRlclByb2dyYW0sXHJcblx0c3lzLFxyXG5cdFdhdGNoT2ZDb25maWdGaWxlXHJcbn0gZnJvbSBcInR5cGVzY3JpcHRcIjtcclxuXHJcbmltcG9ydCB7IGNvbmZpZywgZHNDb25zb2xlUHJlZml4LCBuYW1lIH0gZnJvbSBcIi4uL1wiO1xyXG5pbXBvcnQgcnVuQ2hpbGQgZnJvbSBcIi4vY2hpbGRIYW5kbGVyXCI7XHJcbmltcG9ydCBjb3B5VGFzayBmcm9tIFwiLi9jb3B5VGFza1wiO1xyXG5pbXBvcnQgb3V0bGluZSBmcm9tIFwiLi9mdW5jdGlvbnMvb3V0bGluZVN0cmluZ3NcIjtcclxuXHJcbmxldCBwcm9ncmFtOiBXYXRjaE9mQ29uZmlnRmlsZTxTZW1hbnRpY0RpYWdub3N0aWNzQnVpbGRlclByb2dyYW0+LFxyXG5cdGhvc3QgPSBjcmVhdGVXYXRjaENvbXBpbGVySG9zdChcclxuXHRcdFwiXCIsXHJcblx0XHR7fSxcclxuXHRcdHN5cyxcclxuXHRcdGNyZWF0ZVNlbWFudGljRGlhZ25vc3RpY3NCdWlsZGVyUHJvZ3JhbSxcclxuXHRcdGdldERpYWdub3N0aWMsXHJcblx0XHRmaWxlQ2hhbmdlXHJcblx0KTtcclxuY29uc3QgbG9nZ2VyID0gZGVidWcoYCR7bmFtZX06Y29tcGlsZXJgKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHJ1blRTQ29tcGlsZXIoKSB7XHJcblx0aG9zdCA9IGNyZWF0ZVdhdGNoQ29tcGlsZXJIb3N0KFxyXG5cdFx0Y29uZmlnLnRzY29uZmlnLFxyXG5cdFx0e30sXHJcblx0XHRzeXMsXHJcblx0XHRjcmVhdGVTZW1hbnRpY0RpYWdub3N0aWNzQnVpbGRlclByb2dyYW0sXHJcblx0XHRnZXREaWFnbm9zdGljLFxyXG5cdFx0ZmlsZUNoYW5nZVxyXG5cdCk7XHJcblxyXG5cdGxvZ2dlcihcIkNyZWF0ZWQgVHlwZVNjcmlwdCB3YXRjaGVyLlwiKTtcclxuXHRwcm9ncmFtID0gY3JlYXRlV2F0Y2hQcm9ncmFtKGhvc3QpO1xyXG5cclxuXHRwcm9jZXNzLm9uY2UoXCJleGl0XCIsIHByb2dyYW0uY2xvc2UpO1xyXG59XHJcblxyXG5sZXQgZGlhZ25vc3RpY0Vycm9yQXJyYXk6IHtcclxuXHRcdGZpbGU6IHN0cmluZztcclxuXHRcdGRpYWdub3N0aWNMaW5lOiB7IGxpbmU6IG51bWJlcjsgY2hhcmFjdGVyOiBudW1iZXIgfTtcclxuXHRcdG1lc3NhZ2U6IHN0cmluZztcclxuXHRcdGNvZGU6IG51bWJlcjtcclxuXHR9W10gPSBbXSxcclxuXHRkaWFnbm9zdGljc0ZpbmlzaGVkOiBOb2RlSlMuVGltZW91dDtcclxuZnVuY3Rpb24gZ2V0RGlhZ25vc3RpYyhkaWFnbm9zdGljOiBEaWFnbm9zdGljKSB7XHJcblx0Ly8jcmVnaW9uIE1ha2Ugc3VyZSBkaWFnbm9zdGljcyBhcmUgZmluaXNoZWRcclxuXHRpZiAoZGlhZ25vc3RpY3NGaW5pc2hlZCkgY2xlYXJUaW1lb3V0KGRpYWdub3N0aWNzRmluaXNoZWQpO1xyXG5cdGRpYWdub3N0aWNzRmluaXNoZWQgPSBzZXRUaW1lb3V0KHJlcG9ydERpYWdub3N0aWNzLCAxKTtcclxuXHQvLyNlbmRyZWdpb25cclxuXHJcblx0Ly8qIEFwcGVuZCB0byBkaWFnbm9zdGljRXJyb3JBcnJheVxyXG5cclxuXHRpZiAoZGlhZ25vc3RpYy5maWxlPy5maWxlTmFtZSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG5cdGRpYWdub3N0aWNFcnJvckFycmF5LnB1c2goe1xyXG5cdFx0ZmlsZTogZGlhZ25vc3RpYy5maWxlLmZpbGVOYW1lLnJlcGxhY2UoXHJcblx0XHRcdGhvc3QuZ2V0Q3VycmVudERpcmVjdG9yeSgpICsgXCIvXCIsXHJcblx0XHRcdFwiXCJcclxuXHRcdCksXHJcblx0XHRkaWFnbm9zdGljTGluZTogZ2V0TGluZUFuZENoYXJhY3Rlck9mUG9zaXRpb24oXHJcblx0XHRcdGRpYWdub3N0aWMuZmlsZSxcclxuXHRcdFx0ZGlhZ25vc3RpYy5zdGFydCFcclxuXHRcdCksXHJcblx0XHRtZXNzYWdlOlxyXG5cdFx0XHR0eXBlb2YgZGlhZ25vc3RpYy5tZXNzYWdlVGV4dCAhPT0gXCJzdHJpbmdcIlxyXG5cdFx0XHRcdD8gLy9UT0RPIE1heWJlIHNob3cgaXQgaW4gbW9yZSBpbmRlbnRzP1xyXG5cdFx0XHRcdCAgZGlhZ25vc3RpYy5tZXNzYWdlVGV4dC5tZXNzYWdlVGV4dFxyXG5cdFx0XHRcdDogZGlhZ25vc3RpYy5tZXNzYWdlVGV4dFxyXG5cdFx0XHRcdFx0XHQudG9TdHJpbmcoKVxyXG5cdFx0XHRcdFx0XHQucmVwbGFjZShob3N0LmdldEN1cnJlbnREaXJlY3RvcnkoKSArIFwiL1wiLCBcIlwiKSxcclxuXHRcdGNvZGU6IGRpYWdub3N0aWMuY29kZVxyXG5cdH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZXBvcnREaWFnbm9zdGljcygpIHtcclxuXHRpZiAoY29uZmlnLnNpbGVudCB8fCAhZGlhZ25vc3RpY0Vycm9yQXJyYXkubGVuZ3RoKSByZXR1cm47XHJcblxyXG5cdGxldCByZXN1bHQ6IHtcclxuXHRcdFtuYW1lOiBudW1iZXJdOiBzdHJpbmdbXTtcclxuXHR9ID0ge307XHJcblxyXG5cdC8vI3JlZ2lvbiBDb252ZXJ0IGFycmF5IHRvIGZ1bGx5IGNvbG9yZWQgb2JqZWN0XHJcblx0bG9nZ2VyKFxyXG5cdFx0YEZvdW5kICR7ZGlhZ25vc3RpY0Vycm9yQXJyYXkubGVuZ3RofSBlcnJvcnMuIFRyYW5zZmVycmluZyBhcnJheSB0byBvYmplY3TigKZgXHJcblx0KTtcclxuXHRmb3IgKGxldCBpID0gMDsgaSA8IGRpYWdub3N0aWNFcnJvckFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRjb25zdCBkaWFnbm9zdGljID0gZGlhZ25vc3RpY0Vycm9yQXJyYXlbaV07XHJcblx0XHQvLyogRW5zdXJlIGNvZGUgZXhpc3RzIGluIG9iamVjdFxyXG5cdFx0aWYgKCFyZXN1bHRbZGlhZ25vc3RpYy5jb2RlXSkgcmVzdWx0W2RpYWdub3N0aWMuY29kZV0gPSBbXTtcclxuXHJcblx0XHQvLyogRmlsZSBzcmMgbWVzc2FnZSBjb2xvcmluZ1xyXG5cdFx0Y29uc3QgZmlsZVNyY01zZyA9IGNoYWxrLmhleChcIiNiZWJlYmVcIikoXHJcblx0XHRcdGAke2NoYWxrLnllbGxvd0JyaWdodChcclxuXHRcdFx0XHRyZWxhdGl2ZShwcm9jZXNzLmN3ZCgpLCBkaWFnbm9zdGljLmZpbGUpLnJlcGxhY2UoL1xcXFwvZywgXCIvXCIpXHJcblx0XHRcdCl9KCR7ZGlhZ25vc3RpYy5kaWFnbm9zdGljTGluZS5saW5lICsgMX0sJHtcclxuXHRcdFx0XHRkaWFnbm9zdGljLmRpYWdub3N0aWNMaW5lLmNoYXJhY3RlciArIDFcclxuXHRcdFx0fSlgXHJcblx0XHQpO1xyXG5cclxuXHRcdHJlc3VsdFtkaWFnbm9zdGljLmNvZGVdLnB1c2goXHJcblx0XHRcdGAke2ZpbGVTcmNNc2d9IOKAoiAke2NoYWxrLmhleChcIiM3Mjg5REFcIikoZGlhZ25vc3RpYy5tZXNzYWdlKX1gXHJcblx0XHQpO1xyXG5cdH1cclxuXHRsb2dnZXIoXCJUcmFuc2ZlcnJlZCBhcnJheSB0byBvYmplY3QsIG5vdyBwb3N0aW5nIGVycm9ycyBieSBlcnJvciBJROKAplwiKTtcclxuXHQvLyNlbmRyZWdpb25cclxuXHJcblx0Y29uc3Qgc2VjdGlvbnM6IEJyYW5jaFtdID0gW107XHJcblx0Zm9yIChjb25zdCBbZXJyb3JDb2RlLCBlcnJvckFycmF5XSBvZiBPYmplY3QuZW50cmllcyhyZXN1bHQpKSB7XHJcblx0XHQvLyogU3BhY2luZyBiZXR3ZWVuIHNyYyBhbmQgZXJyb3IgbWVzc2FnZS5cclxuXHRcdG91dGxpbmUoZXJyb3JBcnJheSwgXCLigKJcIik7XHJcblx0XHRzZWN0aW9ucy5wdXNoKFxyXG5cdFx0XHRuZXcgQnJhbmNoKGNoYWxrLmJvbGQoY2hhbGsucmVkQnJpZ2h0KFwiVFNcIiArIGVycm9yQ29kZSkpKS5hZGRCcmFuY2goXHJcblx0XHRcdFx0ZXJyb3JBcnJheVxyXG5cdFx0XHQpXHJcblx0XHQpO1xyXG5cdH1cclxuXHJcblx0bmV3IFRyZWUoXHJcblx0XHRjaGFsay5ib2xkKFxyXG5cdFx0XHRjaGFsay5oZXgoXCIjZTgzYTNhXCIpKFxyXG5cdFx0XHRcdFwiRm91bmQgXCIgK1xyXG5cdFx0XHRcdFx0ZGlhZ25vc3RpY0Vycm9yQXJyYXkubGVuZ3RoICtcclxuXHRcdFx0XHRcdFwiIGVycm9yXCIgK1xyXG5cdFx0XHRcdFx0KGRpYWdub3N0aWNFcnJvckFycmF5Lmxlbmd0aCA9PT0gMSA/IFwiXCIgOiBcInNcIikgK1xyXG5cdFx0XHRcdFx0XCIuIFdhdGNoaW5nIGZvciBmaWxlIGNoYW5nZXPigKZcIlxyXG5cdFx0XHQpXHJcblx0XHQpLFxyXG5cdFx0e1xyXG5cdFx0XHRoZWFkQ2hhcjogZHNDb25zb2xlUHJlZml4XHJcblx0XHR9XHJcblx0KVxyXG5cdFx0LmFkZEJyYW5jaChzZWN0aW9ucylcclxuXHRcdC5sb2coKTtcclxuXHJcblx0ZGlhZ25vc3RpY0Vycm9yQXJyYXkgPSBbXTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsZUNoYW5nZShkaWFnbm9zdGljOiBEaWFnbm9zdGljKSB7XHJcblx0Ly8qIFwiU3RhcnRpbmcgY29tcGlsYXRpb24gaW4gd2F0Y2ggbW9kZS4uLlwiXCJcclxuXHRpZiAoZGlhZ25vc3RpYy5jb2RlID09PSA2MDMxKSB7XHJcblx0XHRpZiAoIWNvbmZpZy5zaWxlbnQpXHJcblx0XHRcdGNvbnNvbGUubG9nKFxyXG5cdFx0XHRcdGAke2RzQ29uc29sZVByZWZpeH0ke2NoYWxrLmJsdWVCcmlnaHQoXCJTdGFydGluZyBUeXBlU2NyaXB0IGNvbXBpbGVy4oCmXCIpfWBcclxuXHRcdFx0KTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdC8vKiBcIkZpbGUgY2hhbmdlIGRldGVjdGVkLi4uXCJcclxuXHRpZiAoZGlhZ25vc3RpYy5jb2RlID09PSA2MDMyKSB7XHJcblx0XHRpZiAoIWNvbmZpZy5zaWxlbnQpXHJcblx0XHRcdGNvbnNvbGUubG9nKFxyXG5cdFx0XHRcdGAke2RzQ29uc29sZVByZWZpeH0ke2NoYWxrLmJsdWVCcmlnaHQoXHJcblx0XHRcdFx0XHRkaWFnbm9zdGljLm1lc3NhZ2VUZXh0XHJcblx0XHRcdFx0XHRcdC50b1N0cmluZygpXHJcblx0XHRcdFx0XHRcdC5zdWJzdHJpbmcoMCwgZGlhZ25vc3RpYy5tZXNzYWdlVGV4dC50b1N0cmluZygpLmxlbmd0aCAtIDMpICsgXCLigKZcIlxyXG5cdFx0XHRcdCl9YFxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdGlmIChcclxuXHRcdC8vKiBGb3VuZCAwIGVycm9yc1xyXG5cdFx0ZGlhZ25vc3RpYy5jb2RlID09PSA2MTk0ICYmXHJcblx0XHRwYXJzZUludChkaWFnbm9zdGljLm1lc3NhZ2VUZXh0LnRvU3RyaW5nKCkucmVwbGFjZSgvXFxEL2csIFwiXCIpKSA9PT0gMFxyXG5cdCkge1xyXG5cdFx0YXdhaXQgY29weVRhc2soKTtcclxuXHRcdC8vKiBSZXN0YXJ0IGNoaWxkXHJcblx0XHRhd2FpdCBydW5DaGlsZCgpO1xyXG5cclxuXHRcdGlmICghY29uZmlnLnNpbGVudClcclxuXHRcdFx0Y29uc29sZS5sb2coXHJcblx0XHRcdFx0ZHNDb25zb2xlUHJlZml4ICtcclxuXHRcdFx0XHRcdGNoYWxrLmdyZWVuKFxyXG5cdFx0XHRcdFx0XHRkaWFnbm9zdGljLm1lc3NhZ2VUZXh0XHJcblx0XHRcdFx0XHRcdFx0LnRvU3RyaW5nKClcclxuXHRcdFx0XHRcdFx0XHQuc3Vic3RyaW5nKDAsIGRpYWdub3N0aWMubWVzc2FnZVRleHQudG9TdHJpbmcoKS5sZW5ndGggLSAxKSArIFwi4oCmXCJcclxuXHRcdFx0XHRcdClcclxuXHRcdFx0KTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdC8vKiBFcnJvcnMsIG5vIHJlc3RhcnRcclxufVxyXG4iXX0=