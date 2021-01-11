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
var typescript_1 = require("typescript");
var __1 = require("../");
var path_1 = require("path");
var chalk_1 = __importDefault(require("chalk"));
var copyTask_1 = __importDefault(require("./copyTask"));
var debug_1 = __importDefault(require("debug"));
var displayAsTreePrefix_1 = require("./functions/displayAsTreePrefix");
var outlineStrings_1 = __importDefault(require("./functions/outlineStrings"));
var childHandler_1 = __importDefault(require("./childHandler"));
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
        var fileSrcMsg = chalk_1.default.hex("#bebebe")(chalk_1.default.yellowBright(path_1.relative(process.cwd(), diagnostic.file).replace(/\\/g, "/")) + "(" + (diagnostic.diagnosticLine.line + 1) + "," + (diagnostic.diagnosticLine.character + 1) + ")");
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
                displayAsTreePrefix_1.displayAsTree(errorArray, "   ");
            }
            else {
                console.log("\u251C\u2500 " + chalk_1.default.bold(chalk_1.default.redBright("TS" + errorCode)));
                displayAsTreePrefix_1.displayAsTree(errorArray, "│  ");
            }
        }
        else {
            console.log("\u2570\u2500 " + chalk_1.default.bold(chalk_1.default.redBright("TS" + errorCode)));
            displayAsTreePrefix_1.displayAsTree(errorArray, "   ");
        }
    }
    diagnosticErrorArray = [];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNDb21waWxlci5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsidXRpbC90c0NvbXBpbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUNBU29CO0FBQ3BCLHlCQUFvRDtBQUNwRCw2QkFBeUM7QUFFekMsZ0RBQTBCO0FBQzFCLHdEQUFrQztBQUNsQyxnREFBMEI7QUFDMUIsdUVBQWdFO0FBQ2hFLDhFQUFpRDtBQUNqRCxnRUFBc0M7QUFFdEMsSUFBSSxPQUE2RCxFQUNoRSxJQUFJLEdBQUcsb0NBQXVCLENBQzdCLEVBQUUsRUFDRixFQUFFLEVBQ0YsZ0JBQUcsRUFDSCxvREFBdUMsRUFDdkMsYUFBYSxFQUNiLFVBQVUsQ0FDVixDQUFDO0FBQ0gsSUFBTSxNQUFNLEdBQUcsZUFBSyxDQUFJLFFBQUksY0FBVyxDQUFDLENBQUM7QUFFekMsU0FBOEIsYUFBYTs7O1lBQzFDLElBQUksR0FBRyxvQ0FBdUIsQ0FDN0IsVUFBTSxDQUFDLFFBQVEsRUFDZixFQUFFLEVBQ0YsZ0JBQUcsRUFDSCxvREFBdUMsRUFDdkMsYUFBYSxFQUNiLFVBQVUsQ0FDVixDQUFDO1lBRUYsTUFBTSxDQUFDLDZCQUE2QixDQUFDLENBQUM7WUFDdEMsT0FBTyxHQUFHLCtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBRW5DLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzs7OztDQUNwQztBQWRELGdDQWNDO0FBRUQsSUFBSSxvQkFBb0IsR0FLakIsRUFBRSxFQUNSLG1CQUFtQyxDQUFDO0FBQ3JDLFNBQVMsYUFBYSxDQUFDLFVBQXNCO0lBRTVDLElBQUksbUJBQW1CO1FBQUUsWUFBWSxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDM0QsbUJBQW1CLEdBQUcsVUFBVSxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxDQUFDO0lBSXZELG9C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SyxDQUFDLFVBQVUsQ0FDckMsVUFBVSxDQUFDLFdBQVc7aUNBQ3BCLFFBQVEsRUFBRTtpQ0FDVixTQUFTLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FDaEUsQ0FDSCxDQUFDO3dCQUVILFdBQU87cUJBQ1A7eUJBSUEsQ0FBQSxVQUFVLENBQUMsSUFBSSxLQUFLLElBQUk7d0JBQ3hCLFFBQVEsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUEsRUFEcEUsY0FDb0U7b0JBRXBFLFdBQU0sa0JBQVEsRUFBRSxFQUFBOztvQkFBaEIsU0FBZ0IsQ0FBQztvQkFFakIsV0FBTSxzQkFBUSxFQUFFLEVBQUE7O29CQUFoQixTQUFnQixDQUFDO29CQUVqQixJQUFJLENBQUMsVUFBTSxDQUFDLE1BQU07d0JBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQ1YsbUJBQWU7NEJBQ2QsR0FBRzs0QkFDSCxlQUFLLENBQUMsS0FBSyxDQUNWLFVBQVUsQ0FBQyxXQUFXO2lDQUNwQixRQUFRLEVBQUU7aUNBQ1YsU0FBUyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQ2xFLENBQ0YsQ0FBQztvQkFDSCxXQUFPOzs7OztDQUlSIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuXHREaWFnbm9zdGljLFxyXG5cdFNlbWFudGljRGlhZ25vc3RpY3NCdWlsZGVyUHJvZ3JhbSxcclxuXHRXYXRjaE9mQ29uZmlnRmlsZSxcclxuXHRjcmVhdGVTZW1hbnRpY0RpYWdub3N0aWNzQnVpbGRlclByb2dyYW0sXHJcblx0Y3JlYXRlV2F0Y2hDb21waWxlckhvc3QsXHJcblx0Y3JlYXRlV2F0Y2hQcm9ncmFtLFxyXG5cdGdldExpbmVBbmRDaGFyYWN0ZXJPZlBvc2l0aW9uLFxyXG5cdHN5c1xyXG59IGZyb20gXCJ0eXBlc2NyaXB0XCI7XHJcbmltcG9ydCB7IGNvbmZpZywgZHNDb25zb2xlUHJlZml4LCBuYW1lIH0gZnJvbSBcIi4uL1wiO1xyXG5pbXBvcnQgeyBkaXJuYW1lLCByZWxhdGl2ZSB9IGZyb20gXCJwYXRoXCI7XHJcblxyXG5pbXBvcnQgY2hhbGsgZnJvbSBcImNoYWxrXCI7XHJcbmltcG9ydCBjb3B5VGFzayBmcm9tIFwiLi9jb3B5VGFza1wiO1xyXG5pbXBvcnQgZGVidWcgZnJvbSBcImRlYnVnXCI7XHJcbmltcG9ydCB7IGRpc3BsYXlBc1RyZWUgfSBmcm9tIFwiLi9mdW5jdGlvbnMvZGlzcGxheUFzVHJlZVByZWZpeFwiO1xyXG5pbXBvcnQgb3V0bGluZSBmcm9tIFwiLi9mdW5jdGlvbnMvb3V0bGluZVN0cmluZ3NcIjtcclxuaW1wb3J0IHJ1bkNoaWxkIGZyb20gXCIuL2NoaWxkSGFuZGxlclwiO1xyXG5cclxubGV0IHByb2dyYW06IFdhdGNoT2ZDb25maWdGaWxlPFNlbWFudGljRGlhZ25vc3RpY3NCdWlsZGVyUHJvZ3JhbT4sXHJcblx0aG9zdCA9IGNyZWF0ZVdhdGNoQ29tcGlsZXJIb3N0KFxyXG5cdFx0XCJcIixcclxuXHRcdHt9LFxyXG5cdFx0c3lzLFxyXG5cdFx0Y3JlYXRlU2VtYW50aWNEaWFnbm9zdGljc0J1aWxkZXJQcm9ncmFtLFxyXG5cdFx0Z2V0RGlhZ25vc3RpYyxcclxuXHRcdGZpbGVDaGFuZ2VcclxuXHQpO1xyXG5jb25zdCBsb2dnZXIgPSBkZWJ1ZyhgJHtuYW1lfTpjb21waWxlcmApO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gcnVuVFNDb21waWxlcigpIHtcclxuXHRob3N0ID0gY3JlYXRlV2F0Y2hDb21waWxlckhvc3QoXHJcblx0XHRjb25maWcudHNjb25maWcsXHJcblx0XHR7fSxcclxuXHRcdHN5cyxcclxuXHRcdGNyZWF0ZVNlbWFudGljRGlhZ25vc3RpY3NCdWlsZGVyUHJvZ3JhbSxcclxuXHRcdGdldERpYWdub3N0aWMsXHJcblx0XHRmaWxlQ2hhbmdlXHJcblx0KTtcclxuXHJcblx0bG9nZ2VyKFwiQ3JlYXRlZCBUeXBlU2NyaXB0IHdhdGNoZXIuXCIpO1xyXG5cdHByb2dyYW0gPSBjcmVhdGVXYXRjaFByb2dyYW0oaG9zdCk7XHJcblxyXG5cdHByb2Nlc3Mub25jZShcImV4aXRcIiwgcHJvZ3JhbS5jbG9zZSk7XHJcbn1cclxuXHJcbmxldCBkaWFnbm9zdGljRXJyb3JBcnJheToge1xyXG5cdFx0ZmlsZTogc3RyaW5nO1xyXG5cdFx0ZGlhZ25vc3RpY0xpbmU6IHsgbGluZTogbnVtYmVyOyBjaGFyYWN0ZXI6IG51bWJlciB9O1xyXG5cdFx0bWVzc2FnZTogc3RyaW5nO1xyXG5cdFx0Y29kZTogbnVtYmVyO1xyXG5cdH1bXSA9IFtdLFxyXG5cdGRpYWdub3N0aWNzRmluaXNoZWQ6IE5vZGVKUy5UaW1lb3V0O1xyXG5mdW5jdGlvbiBnZXREaWFnbm9zdGljKGRpYWdub3N0aWM6IERpYWdub3N0aWMpIHtcclxuXHQvLyNyZWdpb24gTWFrZSBzdXJlIGRpYWdub3N0aWNzIGFyZSBmaW5pc2hlZFxyXG5cdGlmIChkaWFnbm9zdGljc0ZpbmlzaGVkKSBjbGVhclRpbWVvdXQoZGlhZ25vc3RpY3NGaW5pc2hlZCk7XHJcblx0ZGlhZ25vc3RpY3NGaW5pc2hlZCA9IHNldFRpbWVvdXQocmVwb3J0RGlhZ25vc3RpY3MsIDEpO1xyXG5cdC8vI2VuZHJlZ2lvblxyXG5cclxuXHQvLyogQXBwZW5kIHRvIGRpYWdub3N0aWNFcnJvckFycmF5XHJcblx0ZGlhZ25vc3RpY0Vycm9yQXJyYXkucHVzaCh7XHJcblx0XHRmaWxlOiBkaWFnbm9zdGljLmZpbGUuZmlsZU5hbWUucmVwbGFjZShcclxuXHRcdFx0aG9zdC5nZXRDdXJyZW50RGlyZWN0b3J5KCkgKyBcIi9cIixcclxuXHRcdFx0XCJcIlxyXG5cdFx0KSxcclxuXHRcdGRpYWdub3N0aWNMaW5lOiBnZXRMaW5lQW5kQ2hhcmFjdGVyT2ZQb3NpdGlvbihcclxuXHRcdFx0ZGlhZ25vc3RpYy5maWxlLFxyXG5cdFx0XHRkaWFnbm9zdGljLnN0YXJ0IVxyXG5cdFx0KSxcclxuXHRcdG1lc3NhZ2U6XHJcblx0XHRcdHR5cGVvZiBkaWFnbm9zdGljLm1lc3NhZ2VUZXh0ICE9PSBcInN0cmluZ1wiXHJcblx0XHRcdFx0PyAvL1RPRE8gTWF5YmUgc2hvdyBpdCBpbiBtb3JlIGluZGVudHM/XHJcblx0XHRcdFx0ICBkaWFnbm9zdGljLm1lc3NhZ2VUZXh0Lm1lc3NhZ2VUZXh0XHJcblx0XHRcdFx0OiBkaWFnbm9zdGljLm1lc3NhZ2VUZXh0XHJcblx0XHRcdFx0XHRcdC50b1N0cmluZygpXHJcblx0XHRcdFx0XHRcdC5yZXBsYWNlKGhvc3QuZ2V0Q3VycmVudERpcmVjdG9yeSgpICsgXCIvXCIsIFwiXCIpLFxyXG5cdFx0Y29kZTogZGlhZ25vc3RpYy5jb2RlXHJcblx0fSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlcG9ydERpYWdub3N0aWNzKCkge1xyXG5cdGlmIChjb25maWcuc2lsZW50KSByZXR1cm47XHJcblxyXG5cdGxldCByZXN1bHQ6IHtcclxuXHRcdFtuYW1lOiBudW1iZXJdOiBzdHJpbmdbXTtcclxuXHR9ID0ge307XHJcblxyXG5cdC8vI3JlZ2lvbiBDb252ZXJ0IGFycmF5IHRvIGZ1bGx5IGNvbG9yZWQgb2JqZWN0XHJcblx0bG9nZ2VyKFxyXG5cdFx0YEZvdW5kICR7ZGlhZ25vc3RpY0Vycm9yQXJyYXkubGVuZ3RofSBlcnJvcnMuIFRyYW5zZmVycmluZyBhcnJheSB0byBvYmplY3TigKZgXHJcblx0KTtcclxuXHRmb3IgKGxldCBpID0gMDsgaSA8IGRpYWdub3N0aWNFcnJvckFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRjb25zdCBkaWFnbm9zdGljID0gZGlhZ25vc3RpY0Vycm9yQXJyYXlbaV07XHJcblx0XHQvLyogRW5zdXJlIGNvZGUgZXhpc3RzIGluIG9iamVjdFxyXG5cdFx0aWYgKCFyZXN1bHRbZGlhZ25vc3RpYy5jb2RlXSkgcmVzdWx0W2RpYWdub3N0aWMuY29kZV0gPSBbXTtcclxuXHJcblx0XHQvLyogRmlsZSBzcmMgbWVzc2FnZSBjb2xvcmluZ1xyXG5cdFx0Y29uc3QgZmlsZVNyY01zZyA9IGNoYWxrLmhleChcIiNiZWJlYmVcIikoXHJcblx0XHRcdGAke2NoYWxrLnllbGxvd0JyaWdodChcclxuXHRcdFx0XHRyZWxhdGl2ZShwcm9jZXNzLmN3ZCgpLCBkaWFnbm9zdGljLmZpbGUpLnJlcGxhY2UoL1xcXFwvZywgXCIvXCIpXHJcblx0XHRcdCl9KCR7ZGlhZ25vc3RpYy5kaWFnbm9zdGljTGluZS5saW5lICsgMX0sJHtcclxuXHRcdFx0XHRkaWFnbm9zdGljLmRpYWdub3N0aWNMaW5lLmNoYXJhY3RlciArIDFcclxuXHRcdFx0fSlgXHJcblx0XHQpO1xyXG5cclxuXHRcdHJlc3VsdFtkaWFnbm9zdGljLmNvZGVdLnB1c2goXHJcblx0XHRcdGAke2ZpbGVTcmNNc2d9IOKAoiAke2NoYWxrLmhleChcIiM3Mjg5REFcIikoZGlhZ25vc3RpYy5tZXNzYWdlKX1gXHJcblx0XHQpO1xyXG5cdH1cclxuXHRsb2dnZXIoXCJUcmFuc2ZlcnJlZCBhcnJheSB0byBvYmplY3QsIG5vdyBwb3N0aW5nIGVycm9ycyBieSBlcnJvciBJROKAplwiKTtcclxuXHQvLyNlbmRyZWdpb25cclxuXHJcblx0Ly8qIEVycm9yIGhlYWRlclxyXG5cdGNvbnNvbGUubG9nKFxyXG5cdFx0YCR7ZHNDb25zb2xlUHJlZml4fSAke2NoYWxrLmJvbGQoXHJcblx0XHRcdGNoYWxrLmhleChcIiNlODNhM2FcIikoXHJcblx0XHRcdFx0XCJGb3VuZCBcIiArXHJcblx0XHRcdFx0XHRkaWFnbm9zdGljRXJyb3JBcnJheS5sZW5ndGggK1xyXG5cdFx0XHRcdFx0XCIgZXJyb3JcIiArXHJcblx0XHRcdFx0XHQoZGlhZ25vc3RpY0Vycm9yQXJyYXkubGVuZ3RoID09PSAxID8gXCJcIiA6IFwic1wiKSArXHJcblx0XHRcdFx0XHRcIi4gV2F0Y2hpbmcgZm9yIGZpbGUgY2hhbmdlc+KAplwiXHJcblx0XHRcdClcclxuXHRcdCl9YFxyXG5cdCk7XHJcblxyXG5cdGxldCBpID0gMDtcclxuXHRmb3IgKGNvbnN0IFtlcnJvckNvZGUsIGVycm9yQXJyYXldIG9mIE9iamVjdC5lbnRyaWVzKHJlc3VsdCkpIHtcclxuXHRcdC8vKiBTcGFjaW5nIGJldHdlZW4gc3JjIGFuZCBlcnJvciBtZXNzYWdlLlxyXG5cdFx0b3V0bGluZShlcnJvckFycmF5LCBcIuKAolwiKTtcclxuXHJcblx0XHRpKys7XHJcblx0XHRpZiAoT2JqZWN0LmtleXMocmVzdWx0KS5sZW5ndGggPiAxKSB7XHJcblx0XHRcdGlmIChPYmplY3Qua2V5cyhyZXN1bHQpLmxlbmd0aCA9PT0gaSkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGDilbDilIAgJHtjaGFsay5ib2xkKGNoYWxrLnJlZEJyaWdodChcIlRTXCIgKyBlcnJvckNvZGUpKX1gKTtcclxuXHRcdFx0XHRkaXNwbGF5QXNUcmVlKGVycm9yQXJyYXksIFwiICAgXCIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGDilJzilIAgJHtjaGFsay5ib2xkKGNoYWxrLnJlZEJyaWdodChcIlRTXCIgKyBlcnJvckNvZGUpKX1gKTtcclxuXHRcdFx0XHRkaXNwbGF5QXNUcmVlKGVycm9yQXJyYXksIFwi4pSCICBcIik7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGDilbDilIAgJHtjaGFsay5ib2xkKGNoYWxrLnJlZEJyaWdodChcIlRTXCIgKyBlcnJvckNvZGUpKX1gKTtcclxuXHRcdFx0ZGlzcGxheUFzVHJlZShlcnJvckFycmF5LCBcIiAgIFwiKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGRpYWdub3N0aWNFcnJvckFycmF5ID0gW107XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGVDaGFuZ2UoZGlhZ25vc3RpYzogRGlhZ25vc3RpYykge1xyXG5cdC8vKiBcIlN0YXJ0aW5nIGNvbXBpbGF0aW9uIGluIHdhdGNoIG1vZGUuLi5cIlwiXHJcblx0aWYgKGRpYWdub3N0aWMuY29kZSA9PT0gNjAzMSkge1xyXG5cdFx0aWYgKCFjb25maWcuc2lsZW50KVxyXG5cdFx0XHRjb25zb2xlLmxvZyhcclxuXHRcdFx0XHRgJHtkc0NvbnNvbGVQcmVmaXh9ICR7Y2hhbGsuYmx1ZUJyaWdodChcclxuXHRcdFx0XHRcdFwiU3RhcnRpbmcgVHlwZVNjcmlwdCBjb21waWxlcuKAplwiXHJcblx0XHRcdFx0KX1gXHJcblx0XHRcdCk7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHQvLyogXCJGaWxlIGNoYW5nZSBkZXRlY3RlZC4uLlwiXHJcblx0aWYgKGRpYWdub3N0aWMuY29kZSA9PT0gNjAzMikge1xyXG5cdFx0aWYgKCFjb25maWcuc2lsZW50KVxyXG5cdFx0XHRjb25zb2xlLmxvZyhcclxuXHRcdFx0XHRgJHtkc0NvbnNvbGVQcmVmaXh9ICR7Y2hhbGsuYmx1ZUJyaWdodChcclxuXHRcdFx0XHRcdGRpYWdub3N0aWMubWVzc2FnZVRleHRcclxuXHRcdFx0XHRcdFx0LnRvU3RyaW5nKClcclxuXHRcdFx0XHRcdFx0LnN1YnN0cmluZygwLCBkaWFnbm9zdGljLm1lc3NhZ2VUZXh0LnRvU3RyaW5nKCkubGVuZ3RoIC0gMykgKyBcIuKAplwiXHJcblx0XHRcdFx0KX1gXHJcblx0XHRcdCk7XHJcblxyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0aWYgKFxyXG5cdFx0Ly8qIEZvdW5kIDAgZXJyb3JzXHJcblx0XHRkaWFnbm9zdGljLmNvZGUgPT09IDYxOTQgJiZcclxuXHRcdHBhcnNlSW50KGRpYWdub3N0aWMubWVzc2FnZVRleHQudG9TdHJpbmcoKS5yZXBsYWNlKC9cXEQvZywgXCJcIikpID09PSAwXHJcblx0KSB7XHJcblx0XHRhd2FpdCBjb3B5VGFzaygpO1xyXG5cdFx0Ly8qIFJlc3RhcnQgY2hpbGRcclxuXHRcdGF3YWl0IHJ1bkNoaWxkKCk7XHJcblxyXG5cdFx0aWYgKCFjb25maWcuc2lsZW50KVxyXG5cdFx0XHRjb25zb2xlLmxvZyhcclxuXHRcdFx0XHRkc0NvbnNvbGVQcmVmaXggK1xyXG5cdFx0XHRcdFx0XCIgXCIgK1xyXG5cdFx0XHRcdFx0Y2hhbGsuZ3JlZW4oXHJcblx0XHRcdFx0XHRcdGRpYWdub3N0aWMubWVzc2FnZVRleHRcclxuXHRcdFx0XHRcdFx0XHQudG9TdHJpbmcoKVxyXG5cdFx0XHRcdFx0XHRcdC5zdWJzdHJpbmcoMCwgZGlhZ25vc3RpYy5tZXNzYWdlVGV4dC50b1N0cmluZygpLmxlbmd0aCAtIDEpICsgXCLigKZcIlxyXG5cdFx0XHRcdFx0KVxyXG5cdFx0XHQpO1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0Ly8qIEVycm9ycywgbm8gcmVzdGFydFxyXG59XHJcbiJdfQ==