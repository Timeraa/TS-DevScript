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
var logger = (0, debug_1.default)(__1.name + ":compiler");
function runTSCompiler() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            host = (0, typescript_1.createWatchCompilerHost)(__1.config.tsconfig, {}, typescript_1.sys, typescript_1.createSemanticDiagnosticsBuilderProgram, getDiagnostic, fileChange);
            logger("Created TypeScript watcher.");
            program = (0, typescript_1.createWatchProgram)(host);
            process.once("exit", program.close);
            return [2];
        });
    });
}
exports.default = runTSCompiler;
var diagnosticErrorArray = [], diagnosticsFinished;
function getDiagnostic(diagnostic) {
    var _a;
    if (diagnosticsFinished)
        clearTimeout(diagnosticsFinished);
    diagnosticsFinished = setTimeout(reportDiagnostics, 1);
    if (((_a = diagnostic.file) === null || _a === void 0 ? void 0 : _a.fileName) === undefined)
        return;
    diagnosticErrorArray.push({
        file: diagnostic.file.fileName.replace(host.getCurrentDirectory() + "/", ""),
        diagnosticLine: (0, typescript_1.getLineAndCharacterOfPosition)(diagnostic.file, diagnostic.start),
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
    if (__1.config.silent || !diagnosticErrorArray.length)
        return;
    var result = {};
    logger("Found " + diagnosticErrorArray.length + " errors. Transferring array to object\u2026");
    for (var i = 0; i < diagnosticErrorArray.length; i++) {
        var diagnostic = diagnosticErrorArray[i];
        if (!result[diagnostic.code])
            result[diagnostic.code] = [];
        var fileSrcMsg = chalk_1.default.hex("#bebebe")(chalk_1.default.yellowBright((0, path_1.relative)(process.cwd(), diagnostic.file).replace(/\\/g, "/")) + "(" + (diagnostic.diagnosticLine.line + 1) + "," + (diagnostic.diagnosticLine.character + 1) + ")");
        result[diagnostic.code].push(fileSrcMsg + " \u2022 " + chalk_1.default.hex("#7289DA")(diagnostic.message));
    }
    logger("Transferred array to object, now posting errors by error ID…");
    var sections = [];
    for (var _i = 0, _a = Object.entries(result); _i < _a.length; _i++) {
        var _b = _a[_i], errorCode = _b[0], errorArray = _b[1];
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
                    return [4, (0, copyTask_1.default)()];
                case 1:
                    _a.sent();
                    return [4, (0, childHandler_1.default)()];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNDb21waWxlci5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsidXRpbC90c0NvbXBpbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsZ0RBQTBCO0FBQzFCLGdEQUEwQjtBQUMxQiwrQ0FBNkM7QUFDN0MsNkJBQWdDO0FBQ2hDLHlDQVNvQjtBQUVwQix5QkFBb0Q7QUFDcEQsZ0VBQXNDO0FBQ3RDLHdEQUFrQztBQUNsQyw4RUFBaUQ7QUFFakQsSUFBSSxPQUE2RCxFQUNoRSxJQUFJLEdBQUcsSUFBQSxvQ0FBdUIsRUFDN0IsRUFBRSxFQUNGLEVBQUUsRUFDRixnQkFBRyxFQUNILG9EQUF1QyxFQUN2QyxhQUFhLEVBQ2IsVUFBVSxDQUNWLENBQUM7QUFDSCxJQUFNLE1BQU0sR0FBRyxJQUFBLGVBQUssRUFBSSxRQUFJLGNBQVcsQ0FBQyxDQUFDO0FBRXpDLFNBQThCLGFBQWE7OztZQUMxQyxJQUFJLEdBQUcsSUFBQSxvQ0FBdUIsRUFDN0IsVUFBTSxDQUFDLFFBQVEsRUFDZixFQUFFLEVBQ0YsZ0JBQUcsRUFDSCxvREFBdUMsRUFDdkMsYUFBYSxFQUNiLFVBQVUsQ0FDVixDQUFDO1lBRUYsTUFBTSxDQUFDLDZCQUE2QixDQUFDLENBQUM7WUFDdEMsT0FBTyxHQUFHLElBQUEsK0JBQWtCLEVBQUMsSUFBSSxDQUFDLENBQUM7WUFFbkMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDOzs7O0NBQ3BDO0FBZEQsZ0NBY0M7QUFFRCxJQUFJLG9CQUFvQixHQUtqQixFQUFFLEVBQ1IsbUJBQW1DLENBQUM7QUFDckMsU0FBUyxhQUFhLENBQUMsVUFBc0I7O0lBRTVDLElBQUksbUJBQW1CO1FBQUUsWUFBWSxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDM0QsbUJBQW1CLEdBQUcsVUFBVSxDQUFDLGlCQUFpQixFQUFFLENB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QyxDQUFDLEtBQUssQ0FBQyxDQUFBLEVBRHBFLGNBQ29FO29CQUVwRSxXQUFNLElBQUEsa0JBQVEsR0FBRSxFQUFBOztvQkFBaEIsU0FBZ0IsQ0FBQztvQkFFakIsV0FBTSxJQUFBLHNCQUFRLEdBQUUsRUFBQTs7b0JBQWhCLFNBQWdCLENBQUM7b0JBRWpCLElBQUksQ0FBQyxVQUFNLENBQUMsTUFBTTt3QkFDakIsT0FBTyxDQUFDLEdBQUcsQ0FDVixtQkFBZTs0QkFDZCxlQUFLLENBQUMsS0FBSyxDQUNWLFVBQVUsQ0FBQyxXQUFXO2lDQUNwQixRQUFRLEVBQUU7aUNBQ1YsU0FBUyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQ2xFLENBQ0YsQ0FBQztvQkFDSCxXQUFPOzs7OztDQUlSIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNoYWxrIGZyb20gXCJjaGFsa1wiO1xyXG5pbXBvcnQgZGVidWcgZnJvbSBcImRlYnVnXCI7XHJcbmltcG9ydCB7IEJyYW5jaCwgVHJlZSB9IGZyb20gXCJkaXNwbGF5YXN0cmVlXCI7XHJcbmltcG9ydCB7IHJlbGF0aXZlIH0gZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHtcclxuICBjcmVhdGVTZW1hbnRpY0RpYWdub3N0aWNzQnVpbGRlclByb2dyYW0sXHJcbiAgY3JlYXRlV2F0Y2hDb21waWxlckhvc3QsXHJcbiAgY3JlYXRlV2F0Y2hQcm9ncmFtLFxyXG4gIERpYWdub3N0aWMsXHJcbiAgZ2V0TGluZUFuZENoYXJhY3Rlck9mUG9zaXRpb24sXHJcbiAgU2VtYW50aWNEaWFnbm9zdGljc0J1aWxkZXJQcm9ncmFtLFxyXG4gIHN5cyxcclxuICBXYXRjaE9mQ29uZmlnRmlsZSxcclxufSBmcm9tIFwidHlwZXNjcmlwdFwiO1xyXG5cclxuaW1wb3J0IHsgY29uZmlnLCBkc0NvbnNvbGVQcmVmaXgsIG5hbWUgfSBmcm9tIFwiLi4vXCI7XHJcbmltcG9ydCBydW5DaGlsZCBmcm9tIFwiLi9jaGlsZEhhbmRsZXJcIjtcclxuaW1wb3J0IGNvcHlUYXNrIGZyb20gXCIuL2NvcHlUYXNrXCI7XHJcbmltcG9ydCBvdXRsaW5lIGZyb20gXCIuL2Z1bmN0aW9ucy9vdXRsaW5lU3RyaW5nc1wiO1xyXG5cclxubGV0IHByb2dyYW06IFdhdGNoT2ZDb25maWdGaWxlPFNlbWFudGljRGlhZ25vc3RpY3NCdWlsZGVyUHJvZ3JhbT4sXHJcblx0aG9zdCA9IGNyZWF0ZVdhdGNoQ29tcGlsZXJIb3N0KFxyXG5cdFx0XCJcIixcclxuXHRcdHt9LFxyXG5cdFx0c3lzLFxyXG5cdFx0Y3JlYXRlU2VtYW50aWNEaWFnbm9zdGljc0J1aWxkZXJQcm9ncmFtLFxyXG5cdFx0Z2V0RGlhZ25vc3RpYyxcclxuXHRcdGZpbGVDaGFuZ2VcclxuXHQpO1xyXG5jb25zdCBsb2dnZXIgPSBkZWJ1ZyhgJHtuYW1lfTpjb21waWxlcmApO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gcnVuVFNDb21waWxlcigpIHtcclxuXHRob3N0ID0gY3JlYXRlV2F0Y2hDb21waWxlckhvc3QoXHJcblx0XHRjb25maWcudHNjb25maWcsXHJcblx0XHR7fSxcclxuXHRcdHN5cyxcclxuXHRcdGNyZWF0ZVNlbWFudGljRGlhZ25vc3RpY3NCdWlsZGVyUHJvZ3JhbSxcclxuXHRcdGdldERpYWdub3N0aWMsXHJcblx0XHRmaWxlQ2hhbmdlXHJcblx0KTtcclxuXHJcblx0bG9nZ2VyKFwiQ3JlYXRlZCBUeXBlU2NyaXB0IHdhdGNoZXIuXCIpO1xyXG5cdHByb2dyYW0gPSBjcmVhdGVXYXRjaFByb2dyYW0oaG9zdCk7XHJcblxyXG5cdHByb2Nlc3Mub25jZShcImV4aXRcIiwgcHJvZ3JhbS5jbG9zZSk7XHJcbn1cclxuXHJcbmxldCBkaWFnbm9zdGljRXJyb3JBcnJheToge1xyXG5cdFx0ZmlsZTogc3RyaW5nO1xyXG5cdFx0ZGlhZ25vc3RpY0xpbmU6IHsgbGluZTogbnVtYmVyOyBjaGFyYWN0ZXI6IG51bWJlciB9O1xyXG5cdFx0bWVzc2FnZTogc3RyaW5nO1xyXG5cdFx0Y29kZTogbnVtYmVyO1xyXG5cdH1bXSA9IFtdLFxyXG5cdGRpYWdub3N0aWNzRmluaXNoZWQ6IE5vZGVKUy5UaW1lb3V0O1xyXG5mdW5jdGlvbiBnZXREaWFnbm9zdGljKGRpYWdub3N0aWM6IERpYWdub3N0aWMpIHtcclxuXHQvLyNyZWdpb24gTWFrZSBzdXJlIGRpYWdub3N0aWNzIGFyZSBmaW5pc2hlZFxyXG5cdGlmIChkaWFnbm9zdGljc0ZpbmlzaGVkKSBjbGVhclRpbWVvdXQoZGlhZ25vc3RpY3NGaW5pc2hlZCk7XHJcblx0ZGlhZ25vc3RpY3NGaW5pc2hlZCA9IHNldFRpbWVvdXQocmVwb3J0RGlhZ25vc3RpY3MsIDEpO1xyXG5cdC8vI2VuZHJlZ2lvblxyXG5cclxuXHQvLyogQXBwZW5kIHRvIGRpYWdub3N0aWNFcnJvckFycmF5XHJcblxyXG5cdGlmIChkaWFnbm9zdGljLmZpbGU/LmZpbGVOYW1lID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcblx0ZGlhZ25vc3RpY0Vycm9yQXJyYXkucHVzaCh7XHJcblx0XHRmaWxlOiBkaWFnbm9zdGljLmZpbGUuZmlsZU5hbWUucmVwbGFjZShcclxuXHRcdFx0aG9zdC5nZXRDdXJyZW50RGlyZWN0b3J5KCkgKyBcIi9cIixcclxuXHRcdFx0XCJcIlxyXG5cdFx0KSxcclxuXHRcdGRpYWdub3N0aWNMaW5lOiBnZXRMaW5lQW5kQ2hhcmFjdGVyT2ZQb3NpdGlvbihcclxuXHRcdFx0ZGlhZ25vc3RpYy5maWxlLFxyXG5cdFx0XHRkaWFnbm9zdGljLnN0YXJ0IVxyXG5cdFx0KSxcclxuXHRcdG1lc3NhZ2U6XHJcblx0XHRcdHR5cGVvZiBkaWFnbm9zdGljLm1lc3NhZ2VUZXh0ICE9PSBcInN0cmluZ1wiXHJcblx0XHRcdFx0PyAvL1RPRE8gTWF5YmUgc2hvdyBpdCBpbiBtb3JlIGluZGVudHM/XHJcblx0XHRcdFx0ICBkaWFnbm9zdGljLm1lc3NhZ2VUZXh0Lm1lc3NhZ2VUZXh0XHJcblx0XHRcdFx0OiBkaWFnbm9zdGljLm1lc3NhZ2VUZXh0XHJcblx0XHRcdFx0XHRcdC50b1N0cmluZygpXHJcblx0XHRcdFx0XHRcdC5yZXBsYWNlKGhvc3QuZ2V0Q3VycmVudERpcmVjdG9yeSgpICsgXCIvXCIsIFwiXCIpLFxyXG5cdFx0Y29kZTogZGlhZ25vc3RpYy5jb2RlXHJcblx0fSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlcG9ydERpYWdub3N0aWNzKCkge1xyXG5cdGlmIChjb25maWcuc2lsZW50IHx8ICFkaWFnbm9zdGljRXJyb3JBcnJheS5sZW5ndGgpIHJldHVybjtcclxuXHJcblx0bGV0IHJlc3VsdDoge1xyXG5cdFx0W25hbWU6IG51bWJlcl06IHN0cmluZ1tdO1xyXG5cdH0gPSB7fTtcclxuXHJcblx0Ly8jcmVnaW9uIENvbnZlcnQgYXJyYXkgdG8gZnVsbHkgY29sb3JlZCBvYmplY3RcclxuXHRsb2dnZXIoXHJcblx0XHRgRm91bmQgJHtkaWFnbm9zdGljRXJyb3JBcnJheS5sZW5ndGh9IGVycm9ycy4gVHJhbnNmZXJyaW5nIGFycmF5IHRvIG9iamVjdOKApmBcclxuXHQpO1xyXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgZGlhZ25vc3RpY0Vycm9yQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuXHRcdGNvbnN0IGRpYWdub3N0aWMgPSBkaWFnbm9zdGljRXJyb3JBcnJheVtpXTtcclxuXHRcdC8vKiBFbnN1cmUgY29kZSBleGlzdHMgaW4gb2JqZWN0XHJcblx0XHRpZiAoIXJlc3VsdFtkaWFnbm9zdGljLmNvZGVdKSByZXN1bHRbZGlhZ25vc3RpYy5jb2RlXSA9IFtdO1xyXG5cclxuXHRcdC8vKiBGaWxlIHNyYyBtZXNzYWdlIGNvbG9yaW5nXHJcblx0XHRjb25zdCBmaWxlU3JjTXNnID0gY2hhbGsuaGV4KFwiI2JlYmViZVwiKShcclxuXHRcdFx0YCR7Y2hhbGsueWVsbG93QnJpZ2h0KFxyXG5cdFx0XHRcdHJlbGF0aXZlKHByb2Nlc3MuY3dkKCksIGRpYWdub3N0aWMuZmlsZSkucmVwbGFjZSgvXFxcXC9nLCBcIi9cIilcclxuXHRcdFx0KX0oJHtkaWFnbm9zdGljLmRpYWdub3N0aWNMaW5lLmxpbmUgKyAxfSwke1xyXG5cdFx0XHRcdGRpYWdub3N0aWMuZGlhZ25vc3RpY0xpbmUuY2hhcmFjdGVyICsgMVxyXG5cdFx0XHR9KWBcclxuXHRcdCk7XHJcblxyXG5cdFx0cmVzdWx0W2RpYWdub3N0aWMuY29kZV0ucHVzaChcclxuXHRcdFx0YCR7ZmlsZVNyY01zZ30g4oCiICR7Y2hhbGsuaGV4KFwiIzcyODlEQVwiKShkaWFnbm9zdGljLm1lc3NhZ2UpfWBcclxuXHRcdCk7XHJcblx0fVxyXG5cdGxvZ2dlcihcIlRyYW5zZmVycmVkIGFycmF5IHRvIG9iamVjdCwgbm93IHBvc3RpbmcgZXJyb3JzIGJ5IGVycm9yIElE4oCmXCIpO1xyXG5cdC8vI2VuZHJlZ2lvblxyXG5cclxuXHRjb25zdCBzZWN0aW9uczogQnJhbmNoW10gPSBbXTtcclxuXHRmb3IgKGNvbnN0IFtlcnJvckNvZGUsIGVycm9yQXJyYXldIG9mIE9iamVjdC5lbnRyaWVzKHJlc3VsdCkpIHtcclxuXHRcdC8vKiBTcGFjaW5nIGJldHdlZW4gc3JjIGFuZCBlcnJvciBtZXNzYWdlLlxyXG5cdFx0b3V0bGluZShlcnJvckFycmF5LCBcIuKAolwiKTtcclxuXHRcdHNlY3Rpb25zLnB1c2goXHJcblx0XHRcdG5ldyBCcmFuY2goY2hhbGsuYm9sZChjaGFsay5yZWRCcmlnaHQoXCJUU1wiICsgZXJyb3JDb2RlKSkpLmFkZEJyYW5jaChcclxuXHRcdFx0XHRlcnJvckFycmF5XHJcblx0XHRcdClcclxuXHRcdCk7XHJcblx0fVxyXG5cclxuXHRuZXcgVHJlZShcclxuXHRcdGNoYWxrLmJvbGQoXHJcblx0XHRcdGNoYWxrLmhleChcIiNlODNhM2FcIikoXHJcblx0XHRcdFx0XCJGb3VuZCBcIiArXHJcblx0XHRcdFx0XHRkaWFnbm9zdGljRXJyb3JBcnJheS5sZW5ndGggK1xyXG5cdFx0XHRcdFx0XCIgZXJyb3JcIiArXHJcblx0XHRcdFx0XHQoZGlhZ25vc3RpY0Vycm9yQXJyYXkubGVuZ3RoID09PSAxID8gXCJcIiA6IFwic1wiKSArXHJcblx0XHRcdFx0XHRcIi4gV2F0Y2hpbmcgZm9yIGZpbGUgY2hhbmdlc+KAplwiXHJcblx0XHRcdClcclxuXHRcdCksXHJcblx0XHR7XHJcblx0XHRcdGhlYWRDaGFyOiBkc0NvbnNvbGVQcmVmaXhcclxuXHRcdH1cclxuXHQpXHJcblx0XHQuYWRkQnJhbmNoKHNlY3Rpb25zKVxyXG5cdFx0LmxvZygpO1xyXG5cclxuXHRkaWFnbm9zdGljRXJyb3JBcnJheSA9IFtdO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaWxlQ2hhbmdlKGRpYWdub3N0aWM6IERpYWdub3N0aWMpIHtcclxuXHQvLyogXCJTdGFydGluZyBjb21waWxhdGlvbiBpbiB3YXRjaCBtb2RlLi4uXCJcIlxyXG5cdGlmIChkaWFnbm9zdGljLmNvZGUgPT09IDYwMzEpIHtcclxuXHRcdGlmICghY29uZmlnLnNpbGVudClcclxuXHRcdFx0Y29uc29sZS5sb2coXHJcblx0XHRcdFx0YCR7ZHNDb25zb2xlUHJlZml4fSR7Y2hhbGsuYmx1ZUJyaWdodChcIlN0YXJ0aW5nIFR5cGVTY3JpcHQgY29tcGlsZXLigKZcIil9YFxyXG5cdFx0XHQpO1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0Ly8qIFwiRmlsZSBjaGFuZ2UgZGV0ZWN0ZWQuLi5cIlxyXG5cdGlmIChkaWFnbm9zdGljLmNvZGUgPT09IDYwMzIpIHtcclxuXHRcdGlmICghY29uZmlnLnNpbGVudClcclxuXHRcdFx0Y29uc29sZS5sb2coXHJcblx0XHRcdFx0YCR7ZHNDb25zb2xlUHJlZml4fSR7Y2hhbGsuYmx1ZUJyaWdodChcclxuXHRcdFx0XHRcdGRpYWdub3N0aWMubWVzc2FnZVRleHRcclxuXHRcdFx0XHRcdFx0LnRvU3RyaW5nKClcclxuXHRcdFx0XHRcdFx0LnN1YnN0cmluZygwLCBkaWFnbm9zdGljLm1lc3NhZ2VUZXh0LnRvU3RyaW5nKCkubGVuZ3RoIC0gMykgKyBcIuKAplwiXHJcblx0XHRcdFx0KX1gXHJcblx0XHRcdCk7XHJcblxyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0aWYgKFxyXG5cdFx0Ly8qIEZvdW5kIDAgZXJyb3JzXHJcblx0XHRkaWFnbm9zdGljLmNvZGUgPT09IDYxOTQgJiZcclxuXHRcdHBhcnNlSW50KGRpYWdub3N0aWMubWVzc2FnZVRleHQudG9TdHJpbmcoKS5yZXBsYWNlKC9cXEQvZywgXCJcIikpID09PSAwXHJcblx0KSB7XHJcblx0XHRhd2FpdCBjb3B5VGFzaygpO1xyXG5cdFx0Ly8qIFJlc3RhcnQgY2hpbGRcclxuXHRcdGF3YWl0IHJ1bkNoaWxkKCk7XHJcblxyXG5cdFx0aWYgKCFjb25maWcuc2lsZW50KVxyXG5cdFx0XHRjb25zb2xlLmxvZyhcclxuXHRcdFx0XHRkc0NvbnNvbGVQcmVmaXggK1xyXG5cdFx0XHRcdFx0Y2hhbGsuZ3JlZW4oXHJcblx0XHRcdFx0XHRcdGRpYWdub3N0aWMubWVzc2FnZVRleHRcclxuXHRcdFx0XHRcdFx0XHQudG9TdHJpbmcoKVxyXG5cdFx0XHRcdFx0XHRcdC5zdWJzdHJpbmcoMCwgZGlhZ25vc3RpYy5tZXNzYWdlVGV4dC50b1N0cmluZygpLmxlbmd0aCAtIDEpICsgXCLigKZcIlxyXG5cdFx0XHRcdFx0KVxyXG5cdFx0XHQpO1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0Ly8qIEVycm9ycywgbm8gcmVzdGFydFxyXG59XHJcbiJdfQ==