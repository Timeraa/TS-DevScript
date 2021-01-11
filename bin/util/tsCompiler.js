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
var path_1 = require("path");
var typescript_1 = require("typescript");
var __1 = require("../");
var childHandler_1 = __importDefault(require("./childHandler"));
var copyTask_1 = __importDefault(require("./copyTask"));
var displayAsTreePrefix_1 = require("./functions/displayAsTreePrefix");
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
        var fileSrcMsg = chalk_1.default.hex("#bebebe")(chalk_1.default.yellowBright(path_1.relative(path_1.dirname(process.cwd()), diagnostic.file).replace(/\\/g, "/")) + "(" + (diagnostic.diagnosticLine.line + 1) + "," + (diagnostic.diagnosticLine.character + 1) + ")");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNDb21waWxlci5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsidXRpbC90c0NvbXBpbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsZ0RBQTBCO0FBQzFCLGdEQUEwQjtBQUMxQiw2QkFBeUM7QUFDekMseUNBSW9CO0FBRXBCLHlCQUFvRDtBQUNwRCxnRUFBc0M7QUFDdEMsd0RBQWtDO0FBQ2xDLHVFQUFnRTtBQUNoRSw4RUFBaUQ7QUFFakQsSUFBSSxPQUE2RCxFQUNoRSxJQUFJLEdBQUcsb0NBQXVCLENBQzdCLEVBQUUsRUFDRixFQUFFLEVBQ0YsZ0JBQUcsRUFDSCxvREFBdUMsRUFDdkMsYUFBYSxFQUNiLFVBQVUsQ0FDVixDQUFDO0FBQ0gsSUFBTSxNQUFNLEdBQUcsZUFBSyxDQUFJLFFBQUksY0FBVyxDQUFDLENBQUM7QUFFekMsU0FBOEIsYUFBYTs7O1lBQzFDLElBQUksR0FBRyxvQ0FBdUIsQ0FDN0IsVUFBTSxDQUFDLFFBQVEsRUFDZixFQUFFLEVBQ0YsZ0JBQUcsRUFDSCxvREFBdUMsRUFDdkMsYUFBYSxFQUNiLFVBQVUsQ0FDVixDQUFDO1lBRUYsTUFBTSxDQUFDLDZCQUE2QixDQUFDLENBQUM7WUFDdEMsT0FBTyxHQUFHLCtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBRW5DLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzs7OztDQUNwQztBQWRELGdDQWNDO0FBRUQsSUFBSSxvQkFBb0IsR0FLakIsRUFBRSxFQUNSLG1CQUFtQyxDQUFDO0FBQ3JDLFNBQVMsYUFBYSxDQUFDLFVBQXNCO0lBRTVDLElBQUksbUJBQW1CO1FBQUUsWUFBWSxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDM0QsbUJBQW1CLEdBQUcsVUFBVSxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxDQUFDO0lBSXZELG9C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LG1CQUFlLFNBQUksZUFBSyxDQUFDLFVBQVUsQ0FDckMsVUFBVSxDQUFDLFdBQVc7aUNBQ3BCLFFBQVEsRUFBRTtpQ0FDVixTQUFTLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FDaEUsQ0FDSCxDQUFDO3dCQUVILFdBQU87cUJBQ1A7eUJBSUEsQ0FBQSxVQUFVLENBQUMsSUFBSSxLQUFLLElBQUk7d0JBQ3hCLFFBQVEsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUEsRUFEcEUsY0FDb0U7b0JBRXBFLFdBQU0sa0JBQVEsRUFBRSxFQUFBOztvQkFBaEIsU0FBZ0IsQ0FBQztvQkFFakIsV0FBTSxzQkFBUSxFQUFFLEVBQUE7O29CQUFoQixTQUFnQixDQUFDO29CQUVqQixJQUFJLENBQUMsVUFBTSxDQUFDLE1BQU07d0JBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQ1YsbUJBQWU7NEJBQ2QsR0FBRzs0QkFDSCxlQUFLLENBQUMsS0FBSyxDQUNWLFVBQVUsQ0FBQyxXQUFXO2lDQUNwQixRQUFRLEVBQUU7aUNBQ1YsU0FBUyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQ2xFLENBQ0YsQ0FBQztvQkFDSCxXQUFPOzs7OztDQUlSIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNoYWxrIGZyb20gXCJjaGFsa1wiO1xyXG5pbXBvcnQgZGVidWcgZnJvbSBcImRlYnVnXCI7XHJcbmltcG9ydCB7IGRpcm5hbWUsIHJlbGF0aXZlIH0gZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHtcclxuXHRjcmVhdGVTZW1hbnRpY0RpYWdub3N0aWNzQnVpbGRlclByb2dyYW0sIGNyZWF0ZVdhdGNoQ29tcGlsZXJIb3N0LCBjcmVhdGVXYXRjaFByb2dyYW0sXHJcblx0RGlhZ25vc3RpYywgZ2V0TGluZUFuZENoYXJhY3Rlck9mUG9zaXRpb24sIFNlbWFudGljRGlhZ25vc3RpY3NCdWlsZGVyUHJvZ3JhbSwgc3lzLFxyXG5cdFdhdGNoT2ZDb25maWdGaWxlXHJcbn0gZnJvbSBcInR5cGVzY3JpcHRcIjtcclxuXHJcbmltcG9ydCB7IGNvbmZpZywgZHNDb25zb2xlUHJlZml4LCBuYW1lIH0gZnJvbSBcIi4uL1wiO1xyXG5pbXBvcnQgcnVuQ2hpbGQgZnJvbSBcIi4vY2hpbGRIYW5kbGVyXCI7XHJcbmltcG9ydCBjb3B5VGFzayBmcm9tIFwiLi9jb3B5VGFza1wiO1xyXG5pbXBvcnQgeyBkaXNwbGF5QXNUcmVlIH0gZnJvbSBcIi4vZnVuY3Rpb25zL2Rpc3BsYXlBc1RyZWVQcmVmaXhcIjtcclxuaW1wb3J0IG91dGxpbmUgZnJvbSBcIi4vZnVuY3Rpb25zL291dGxpbmVTdHJpbmdzXCI7XHJcblxyXG5sZXQgcHJvZ3JhbTogV2F0Y2hPZkNvbmZpZ0ZpbGU8U2VtYW50aWNEaWFnbm9zdGljc0J1aWxkZXJQcm9ncmFtPixcclxuXHRob3N0ID0gY3JlYXRlV2F0Y2hDb21waWxlckhvc3QoXHJcblx0XHRcIlwiLFxyXG5cdFx0e30sXHJcblx0XHRzeXMsXHJcblx0XHRjcmVhdGVTZW1hbnRpY0RpYWdub3N0aWNzQnVpbGRlclByb2dyYW0sXHJcblx0XHRnZXREaWFnbm9zdGljLFxyXG5cdFx0ZmlsZUNoYW5nZVxyXG5cdCk7XHJcbmNvbnN0IGxvZ2dlciA9IGRlYnVnKGAke25hbWV9OmNvbXBpbGVyYCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBydW5UU0NvbXBpbGVyKCkge1xyXG5cdGhvc3QgPSBjcmVhdGVXYXRjaENvbXBpbGVySG9zdChcclxuXHRcdGNvbmZpZy50c2NvbmZpZyxcclxuXHRcdHt9LFxyXG5cdFx0c3lzLFxyXG5cdFx0Y3JlYXRlU2VtYW50aWNEaWFnbm9zdGljc0J1aWxkZXJQcm9ncmFtLFxyXG5cdFx0Z2V0RGlhZ25vc3RpYyxcclxuXHRcdGZpbGVDaGFuZ2VcclxuXHQpO1xyXG5cclxuXHRsb2dnZXIoXCJDcmVhdGVkIFR5cGVTY3JpcHQgd2F0Y2hlci5cIik7XHJcblx0cHJvZ3JhbSA9IGNyZWF0ZVdhdGNoUHJvZ3JhbShob3N0KTtcclxuXHJcblx0cHJvY2Vzcy5vbmNlKFwiZXhpdFwiLCBwcm9ncmFtLmNsb3NlKTtcclxufVxyXG5cclxubGV0IGRpYWdub3N0aWNFcnJvckFycmF5OiB7XHJcblx0XHRmaWxlOiBzdHJpbmc7XHJcblx0XHRkaWFnbm9zdGljTGluZTogeyBsaW5lOiBudW1iZXI7IGNoYXJhY3RlcjogbnVtYmVyIH07XHJcblx0XHRtZXNzYWdlOiBzdHJpbmc7XHJcblx0XHRjb2RlOiBudW1iZXI7XHJcblx0fVtdID0gW10sXHJcblx0ZGlhZ25vc3RpY3NGaW5pc2hlZDogTm9kZUpTLlRpbWVvdXQ7XHJcbmZ1bmN0aW9uIGdldERpYWdub3N0aWMoZGlhZ25vc3RpYzogRGlhZ25vc3RpYykge1xyXG5cdC8vI3JlZ2lvbiBNYWtlIHN1cmUgZGlhZ25vc3RpY3MgYXJlIGZpbmlzaGVkXHJcblx0aWYgKGRpYWdub3N0aWNzRmluaXNoZWQpIGNsZWFyVGltZW91dChkaWFnbm9zdGljc0ZpbmlzaGVkKTtcclxuXHRkaWFnbm9zdGljc0ZpbmlzaGVkID0gc2V0VGltZW91dChyZXBvcnREaWFnbm9zdGljcywgMSk7XHJcblx0Ly8jZW5kcmVnaW9uXHJcblxyXG5cdC8vKiBBcHBlbmQgdG8gZGlhZ25vc3RpY0Vycm9yQXJyYXlcclxuXHRkaWFnbm9zdGljRXJyb3JBcnJheS5wdXNoKHtcclxuXHRcdGZpbGU6IGRpYWdub3N0aWMuZmlsZS5maWxlTmFtZS5yZXBsYWNlKFxyXG5cdFx0XHRob3N0LmdldEN1cnJlbnREaXJlY3RvcnkoKSArIFwiL1wiLFxyXG5cdFx0XHRcIlwiXHJcblx0XHQpLFxyXG5cdFx0ZGlhZ25vc3RpY0xpbmU6IGdldExpbmVBbmRDaGFyYWN0ZXJPZlBvc2l0aW9uKFxyXG5cdFx0XHRkaWFnbm9zdGljLmZpbGUsXHJcblx0XHRcdGRpYWdub3N0aWMuc3RhcnQhXHJcblx0XHQpLFxyXG5cdFx0bWVzc2FnZTpcclxuXHRcdFx0dHlwZW9mIGRpYWdub3N0aWMubWVzc2FnZVRleHQgIT09IFwic3RyaW5nXCJcclxuXHRcdFx0XHQ/IC8vVE9ETyBNYXliZSBzaG93IGl0IGluIG1vcmUgaW5kZW50cz9cclxuXHRcdFx0XHQgIGRpYWdub3N0aWMubWVzc2FnZVRleHQubWVzc2FnZVRleHRcclxuXHRcdFx0XHQ6IGRpYWdub3N0aWMubWVzc2FnZVRleHRcclxuXHRcdFx0XHRcdFx0LnRvU3RyaW5nKClcclxuXHRcdFx0XHRcdFx0LnJlcGxhY2UoaG9zdC5nZXRDdXJyZW50RGlyZWN0b3J5KCkgKyBcIi9cIiwgXCJcIiksXHJcblx0XHRjb2RlOiBkaWFnbm9zdGljLmNvZGVcclxuXHR9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVwb3J0RGlhZ25vc3RpY3MoKSB7XHJcblx0aWYgKGNvbmZpZy5zaWxlbnQpIHJldHVybjtcclxuXHJcblx0bGV0IHJlc3VsdDoge1xyXG5cdFx0W25hbWU6IG51bWJlcl06IHN0cmluZ1tdO1xyXG5cdH0gPSB7fTtcclxuXHJcblx0Ly8jcmVnaW9uIENvbnZlcnQgYXJyYXkgdG8gZnVsbHkgY29sb3JlZCBvYmplY3RcclxuXHRsb2dnZXIoXHJcblx0XHRgRm91bmQgJHtkaWFnbm9zdGljRXJyb3JBcnJheS5sZW5ndGh9IGVycm9ycy4gVHJhbnNmZXJyaW5nIGFycmF5IHRvIG9iamVjdOKApmBcclxuXHQpO1xyXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgZGlhZ25vc3RpY0Vycm9yQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuXHRcdGNvbnN0IGRpYWdub3N0aWMgPSBkaWFnbm9zdGljRXJyb3JBcnJheVtpXTtcclxuXHRcdC8vKiBFbnN1cmUgY29kZSBleGlzdHMgaW4gb2JqZWN0XHJcblx0XHRpZiAoIXJlc3VsdFtkaWFnbm9zdGljLmNvZGVdKSByZXN1bHRbZGlhZ25vc3RpYy5jb2RlXSA9IFtdO1xyXG5cclxuXHRcdC8vKiBGaWxlIHNyYyBtZXNzYWdlIGNvbG9yaW5nXHJcblx0XHRjb25zdCBmaWxlU3JjTXNnID0gY2hhbGsuaGV4KFwiI2JlYmViZVwiKShcclxuXHRcdFx0YCR7Y2hhbGsueWVsbG93QnJpZ2h0KFxyXG5cdFx0XHRcdHJlbGF0aXZlKGRpcm5hbWUocHJvY2Vzcy5jd2QoKSksIGRpYWdub3N0aWMuZmlsZSkucmVwbGFjZSgvXFxcXC9nLCBcIi9cIilcclxuXHRcdFx0KX0oJHtkaWFnbm9zdGljLmRpYWdub3N0aWNMaW5lLmxpbmUgKyAxfSwke1xyXG5cdFx0XHRcdGRpYWdub3N0aWMuZGlhZ25vc3RpY0xpbmUuY2hhcmFjdGVyICsgMVxyXG5cdFx0XHR9KWBcclxuXHRcdCk7XHJcblxyXG5cdFx0cmVzdWx0W2RpYWdub3N0aWMuY29kZV0ucHVzaChcclxuXHRcdFx0YCR7ZmlsZVNyY01zZ30g4oCiICR7Y2hhbGsuaGV4KFwiIzcyODlEQVwiKShkaWFnbm9zdGljLm1lc3NhZ2UpfWBcclxuXHRcdCk7XHJcblx0fVxyXG5cdGxvZ2dlcihcIlRyYW5zZmVycmVkIGFycmF5IHRvIG9iamVjdCwgbm93IHBvc3RpbmcgZXJyb3JzIGJ5IGVycm9yIElE4oCmXCIpO1xyXG5cdC8vI2VuZHJlZ2lvblxyXG5cclxuXHQvLyogRXJyb3IgaGVhZGVyXHJcblx0Y29uc29sZS5sb2coXHJcblx0XHRgJHtkc0NvbnNvbGVQcmVmaXh9ICR7Y2hhbGsuYm9sZChcclxuXHRcdFx0Y2hhbGsuaGV4KFwiI2U4M2EzYVwiKShcclxuXHRcdFx0XHRcIkZvdW5kIFwiICtcclxuXHRcdFx0XHRcdGRpYWdub3N0aWNFcnJvckFycmF5Lmxlbmd0aCArXHJcblx0XHRcdFx0XHRcIiBlcnJvclwiICtcclxuXHRcdFx0XHRcdChkaWFnbm9zdGljRXJyb3JBcnJheS5sZW5ndGggPT09IDEgPyBcIlwiIDogXCJzXCIpICtcclxuXHRcdFx0XHRcdFwiLiBXYXRjaGluZyBmb3IgZmlsZSBjaGFuZ2Vz4oCmXCJcclxuXHRcdFx0KVxyXG5cdFx0KX1gXHJcblx0KTtcclxuXHJcblx0bGV0IGkgPSAwO1xyXG5cdGZvciAoY29uc3QgW2Vycm9yQ29kZSwgZXJyb3JBcnJheV0gb2YgT2JqZWN0LmVudHJpZXMocmVzdWx0KSkge1xyXG5cdFx0Ly8qIFNwYWNpbmcgYmV0d2VlbiBzcmMgYW5kIGVycm9yIG1lc3NhZ2UuXHJcblx0XHRvdXRsaW5lKGVycm9yQXJyYXksIFwi4oCiXCIpO1xyXG5cclxuXHRcdGkrKztcclxuXHRcdGlmIChPYmplY3Qua2V5cyhyZXN1bHQpLmxlbmd0aCA+IDEpIHtcclxuXHRcdFx0aWYgKE9iamVjdC5rZXlzKHJlc3VsdCkubGVuZ3RoID09PSBpKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYOKVsOKUgCAke2NoYWxrLmJvbGQoY2hhbGsucmVkQnJpZ2h0KFwiVFNcIiArIGVycm9yQ29kZSkpfWApO1xyXG5cdFx0XHRcdGRpc3BsYXlBc1RyZWUoZXJyb3JBcnJheSwgXCIgICBcIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYOKUnOKUgCAke2NoYWxrLmJvbGQoY2hhbGsucmVkQnJpZ2h0KFwiVFNcIiArIGVycm9yQ29kZSkpfWApO1xyXG5cdFx0XHRcdGRpc3BsYXlBc1RyZWUoZXJyb3JBcnJheSwgXCLilIIgIFwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y29uc29sZS5sb2coYOKVsOKUgCAke2NoYWxrLmJvbGQoY2hhbGsucmVkQnJpZ2h0KFwiVFNcIiArIGVycm9yQ29kZSkpfWApO1xyXG5cdFx0XHRkaXNwbGF5QXNUcmVlKGVycm9yQXJyYXksIFwiICAgXCIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZGlhZ25vc3RpY0Vycm9yQXJyYXkgPSBbXTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmlsZUNoYW5nZShkaWFnbm9zdGljOiBEaWFnbm9zdGljKSB7XHJcblx0Ly8qIFwiU3RhcnRpbmcgY29tcGlsYXRpb24gaW4gd2F0Y2ggbW9kZS4uLlwiXCJcclxuXHRpZiAoZGlhZ25vc3RpYy5jb2RlID09PSA2MDMxKSB7XHJcblx0XHRpZiAoIWNvbmZpZy5zaWxlbnQpXHJcblx0XHRcdGNvbnNvbGUubG9nKFxyXG5cdFx0XHRcdGAke2RzQ29uc29sZVByZWZpeH0gJHtjaGFsay5ibHVlQnJpZ2h0KFxyXG5cdFx0XHRcdFx0XCJTdGFydGluZyBUeXBlU2NyaXB0IGNvbXBpbGVy4oCmXCJcclxuXHRcdFx0XHQpfWBcclxuXHRcdFx0KTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdC8vKiBcIkZpbGUgY2hhbmdlIGRldGVjdGVkLi4uXCJcclxuXHRpZiAoZGlhZ25vc3RpYy5jb2RlID09PSA2MDMyKSB7XHJcblx0XHRpZiAoIWNvbmZpZy5zaWxlbnQpXHJcblx0XHRcdGNvbnNvbGUubG9nKFxyXG5cdFx0XHRcdGAke2RzQ29uc29sZVByZWZpeH0gJHtjaGFsay5ibHVlQnJpZ2h0KFxyXG5cdFx0XHRcdFx0ZGlhZ25vc3RpYy5tZXNzYWdlVGV4dFxyXG5cdFx0XHRcdFx0XHQudG9TdHJpbmcoKVxyXG5cdFx0XHRcdFx0XHQuc3Vic3RyaW5nKDAsIGRpYWdub3N0aWMubWVzc2FnZVRleHQudG9TdHJpbmcoKS5sZW5ndGggLSAzKSArIFwi4oCmXCJcclxuXHRcdFx0XHQpfWBcclxuXHRcdFx0KTtcclxuXHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHRpZiAoXHJcblx0XHQvLyogRm91bmQgMCBlcnJvcnNcclxuXHRcdGRpYWdub3N0aWMuY29kZSA9PT0gNjE5NCAmJlxyXG5cdFx0cGFyc2VJbnQoZGlhZ25vc3RpYy5tZXNzYWdlVGV4dC50b1N0cmluZygpLnJlcGxhY2UoL1xcRC9nLCBcIlwiKSkgPT09IDBcclxuXHQpIHtcclxuXHRcdGF3YWl0IGNvcHlUYXNrKCk7XHJcblx0XHQvLyogUmVzdGFydCBjaGlsZFxyXG5cdFx0YXdhaXQgcnVuQ2hpbGQoKTtcclxuXHJcblx0XHRpZiAoIWNvbmZpZy5zaWxlbnQpXHJcblx0XHRcdGNvbnNvbGUubG9nKFxyXG5cdFx0XHRcdGRzQ29uc29sZVByZWZpeCArXHJcblx0XHRcdFx0XHRcIiBcIiArXHJcblx0XHRcdFx0XHRjaGFsay5ncmVlbihcclxuXHRcdFx0XHRcdFx0ZGlhZ25vc3RpYy5tZXNzYWdlVGV4dFxyXG5cdFx0XHRcdFx0XHRcdC50b1N0cmluZygpXHJcblx0XHRcdFx0XHRcdFx0LnN1YnN0cmluZygwLCBkaWFnbm9zdGljLm1lc3NhZ2VUZXh0LnRvU3RyaW5nKCkubGVuZ3RoIC0gMSkgKyBcIuKAplwiXHJcblx0XHRcdFx0XHQpXHJcblx0XHRcdCk7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHQvLyogRXJyb3JzLCBubyByZXN0YXJ0XHJcbn1cclxuIl19