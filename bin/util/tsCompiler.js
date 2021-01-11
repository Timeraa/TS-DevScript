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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNDb21waWxlci5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsidXRpbC90c0NvbXBpbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUNBU29CO0FBQ3BCLHlCQUFvRDtBQUVwRCxnREFBMEI7QUFDMUIsd0RBQWtDO0FBQ2xDLGdEQUEwQjtBQUMxQix1RUFBZ0U7QUFDaEUsOEVBQWlEO0FBQ2pELGdFQUFzQztBQUV0QyxJQUFJLE9BQTZELEVBQ2hFLElBQUksR0FBRyxvQ0FBdUIsQ0FDN0IsRUFBRSxFQUNGLEVBQUUsRUFDRixnQkFBRyxFQUNILG9EQUF1QyxFQUN2QyxhQUFhLEVBQ2IsVUFBVSxDQUNWLENBQUM7QUFDSCxJQUFNLE1BQU0sR0FBRyxlQUFLLENBQUksUUFBSSxjQUFXLENBQUMsQ0FBQztBQUV6QyxTQUE4QixhQUFhOzs7WUFDMUMsSUFBSSxHQUFHLG9DQUF1QixDQUM3QixVQUFNLENBQUMsUUFBUSxFQUNmLEVBQUUsRUFDRixnQkFBRyxFQUNILG9EQUF1QyxFQUN2QyxhQUFhLEVBQ2IsVUFBVSxDQUNWLENBQUM7WUFFRixNQUFNLENBQUMsNkJBQTZCLENBQUMsQ0FBQztZQUN0QyxPQUFPLEdBQUcsK0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFbkMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDOzs7O0NBQ3BDO0FBZEQsZ0NBY0M7QUFFRCxJQUFJLG9CQUFvQixHQUtqQixFQUFFLEVBQ1IsbUJBQW1DLENBQUM7QUFDckMsU0FBUyxhQUFhLENBQUMsVUFBc0I7SUFFNUMsSUFBSSxtQkFBbUI7UUFBRSxZQUFZLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUMzRCxtQkFBbUIsR0FBRyxVQUFVLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFJdkQsb0JBQW9CLENBQUMsSUFB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VyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQ2hFLENBQ0gsQ0FBQzt3QkFFSCxXQUFPO3FCQUNQO3lCQUlBLENBQUEsVUFBVSxDQUFDLElBQUksS0FBSyxJQUFJO3dCQUN4QixRQUFRLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFBLEVBRHBFLGNBQ29FO29CQUVwRSxXQUFNLGtCQUFRLEVBQUUsRUFBQTs7b0JBQWhCLFNBQWdCLENBQUM7b0JBRWpCLFdBQU0sc0JBQVEsRUFBRSxFQUFBOztvQkFBaEIsU0FBZ0IsQ0FBQztvQkFFakIsSUFBSSxDQUFDLFVBQU0sQ0FBQyxNQUFNO3dCQUNqQixPQUFPLENBQUMsR0FBRyxDQUNWLG1CQUFlOzRCQUNkLEdBQUc7NEJBQ0gsZUFBSyxDQUFDLEtBQUssQ0FDVixVQUFVLENBQUMsV0FBVztpQ0FDcEIsUUFBUSxFQUFFO2lDQUNWLFNBQVMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUNsRSxDQUNGLENBQUM7b0JBQ0gsV0FBTzs7Ozs7Q0FJUiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcblx0RGlhZ25vc3RpYyxcclxuXHRTZW1hbnRpY0RpYWdub3N0aWNzQnVpbGRlclByb2dyYW0sXHJcblx0V2F0Y2hPZkNvbmZpZ0ZpbGUsXHJcblx0Y3JlYXRlU2VtYW50aWNEaWFnbm9zdGljc0J1aWxkZXJQcm9ncmFtLFxyXG5cdGNyZWF0ZVdhdGNoQ29tcGlsZXJIb3N0LFxyXG5cdGNyZWF0ZVdhdGNoUHJvZ3JhbSxcclxuXHRnZXRMaW5lQW5kQ2hhcmFjdGVyT2ZQb3NpdGlvbixcclxuXHRzeXNcclxufSBmcm9tIFwidHlwZXNjcmlwdFwiO1xyXG5pbXBvcnQgeyBjb25maWcsIGRzQ29uc29sZVByZWZpeCwgbmFtZSB9IGZyb20gXCIuLi9cIjtcclxuXHJcbmltcG9ydCBjaGFsayBmcm9tIFwiY2hhbGtcIjtcclxuaW1wb3J0IGNvcHlUYXNrIGZyb20gXCIuL2NvcHlUYXNrXCI7XHJcbmltcG9ydCBkZWJ1ZyBmcm9tIFwiZGVidWdcIjtcclxuaW1wb3J0IHsgZGlzcGxheUFzVHJlZSB9IGZyb20gXCIuL2Z1bmN0aW9ucy9kaXNwbGF5QXNUcmVlUHJlZml4XCI7XHJcbmltcG9ydCBvdXRsaW5lIGZyb20gXCIuL2Z1bmN0aW9ucy9vdXRsaW5lU3RyaW5nc1wiO1xyXG5pbXBvcnQgcnVuQ2hpbGQgZnJvbSBcIi4vY2hpbGRIYW5kbGVyXCI7XHJcblxyXG5sZXQgcHJvZ3JhbTogV2F0Y2hPZkNvbmZpZ0ZpbGU8U2VtYW50aWNEaWFnbm9zdGljc0J1aWxkZXJQcm9ncmFtPixcclxuXHRob3N0ID0gY3JlYXRlV2F0Y2hDb21waWxlckhvc3QoXHJcblx0XHRcIlwiLFxyXG5cdFx0e30sXHJcblx0XHRzeXMsXHJcblx0XHRjcmVhdGVTZW1hbnRpY0RpYWdub3N0aWNzQnVpbGRlclByb2dyYW0sXHJcblx0XHRnZXREaWFnbm9zdGljLFxyXG5cdFx0ZmlsZUNoYW5nZVxyXG5cdCk7XHJcbmNvbnN0IGxvZ2dlciA9IGRlYnVnKGAke25hbWV9OmNvbXBpbGVyYCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBydW5UU0NvbXBpbGVyKCkge1xyXG5cdGhvc3QgPSBjcmVhdGVXYXRjaENvbXBpbGVySG9zdChcclxuXHRcdGNvbmZpZy50c2NvbmZpZyxcclxuXHRcdHt9LFxyXG5cdFx0c3lzLFxyXG5cdFx0Y3JlYXRlU2VtYW50aWNEaWFnbm9zdGljc0J1aWxkZXJQcm9ncmFtLFxyXG5cdFx0Z2V0RGlhZ25vc3RpYyxcclxuXHRcdGZpbGVDaGFuZ2VcclxuXHQpO1xyXG5cclxuXHRsb2dnZXIoXCJDcmVhdGVkIFR5cGVTY3JpcHQgd2F0Y2hlci5cIik7XHJcblx0cHJvZ3JhbSA9IGNyZWF0ZVdhdGNoUHJvZ3JhbShob3N0KTtcclxuXHJcblx0cHJvY2Vzcy5vbmNlKFwiZXhpdFwiLCBwcm9ncmFtLmNsb3NlKTtcclxufVxyXG5cclxubGV0IGRpYWdub3N0aWNFcnJvckFycmF5OiB7XHJcblx0XHRmaWxlOiBzdHJpbmc7XHJcblx0XHRkaWFnbm9zdGljTGluZTogeyBsaW5lOiBudW1iZXI7IGNoYXJhY3RlcjogbnVtYmVyIH07XHJcblx0XHRtZXNzYWdlOiBzdHJpbmc7XHJcblx0XHRjb2RlOiBudW1iZXI7XHJcblx0fVtdID0gW10sXHJcblx0ZGlhZ25vc3RpY3NGaW5pc2hlZDogTm9kZUpTLlRpbWVvdXQ7XHJcbmZ1bmN0aW9uIGdldERpYWdub3N0aWMoZGlhZ25vc3RpYzogRGlhZ25vc3RpYykge1xyXG5cdC8vI3JlZ2lvbiBNYWtlIHN1cmUgZGlhZ25vc3RpY3MgYXJlIGZpbmlzaGVkXHJcblx0aWYgKGRpYWdub3N0aWNzRmluaXNoZWQpIGNsZWFyVGltZW91dChkaWFnbm9zdGljc0ZpbmlzaGVkKTtcclxuXHRkaWFnbm9zdGljc0ZpbmlzaGVkID0gc2V0VGltZW91dChyZXBvcnREaWFnbm9zdGljcywgMSk7XHJcblx0Ly8jZW5kcmVnaW9uXHJcblxyXG5cdC8vKiBBcHBlbmQgdG8gZGlhZ25vc3RpY0Vycm9yQXJyYXlcclxuXHRkaWFnbm9zdGljRXJyb3JBcnJheS5wdXNoKHtcclxuXHRcdGZpbGU6IGRpYWdub3N0aWMuZmlsZS5maWxlTmFtZS5yZXBsYWNlKFxyXG5cdFx0XHRob3N0LmdldEN1cnJlbnREaXJlY3RvcnkoKSArIFwiL1wiLFxyXG5cdFx0XHRcIlwiXHJcblx0XHQpLFxyXG5cdFx0ZGlhZ25vc3RpY0xpbmU6IGdldExpbmVBbmRDaGFyYWN0ZXJPZlBvc2l0aW9uKFxyXG5cdFx0XHRkaWFnbm9zdGljLmZpbGUsXHJcblx0XHRcdGRpYWdub3N0aWMuc3RhcnQhXHJcblx0XHQpLFxyXG5cdFx0bWVzc2FnZTpcclxuXHRcdFx0dHlwZW9mIGRpYWdub3N0aWMubWVzc2FnZVRleHQgIT09IFwic3RyaW5nXCJcclxuXHRcdFx0XHQ/IC8vVE9ETyBNYXliZSBzaG93IGl0IGluIG1vcmUgaW5kZW50cz9cclxuXHRcdFx0XHQgIGRpYWdub3N0aWMubWVzc2FnZVRleHQubWVzc2FnZVRleHRcclxuXHRcdFx0XHQ6IGRpYWdub3N0aWMubWVzc2FnZVRleHRcclxuXHRcdFx0XHRcdFx0LnRvU3RyaW5nKClcclxuXHRcdFx0XHRcdFx0LnJlcGxhY2UoaG9zdC5nZXRDdXJyZW50RGlyZWN0b3J5KCkgKyBcIi9cIiwgXCJcIiksXHJcblx0XHRjb2RlOiBkaWFnbm9zdGljLmNvZGVcclxuXHR9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVwb3J0RGlhZ25vc3RpY3MoKSB7XHJcblx0aWYgKGNvbmZpZy5zaWxlbnQpIHJldHVybjtcclxuXHJcblx0bGV0IHJlc3VsdDoge1xyXG5cdFx0W25hbWU6IG51bWJlcl06IHN0cmluZ1tdO1xyXG5cdH0gPSB7fTtcclxuXHJcblx0Ly8jcmVnaW9uIENvbnZlcnQgYXJyYXkgdG8gZnVsbHkgY29sb3JlZCBvYmplY3RcclxuXHRsb2dnZXIoXHJcblx0XHRgRm91bmQgJHtkaWFnbm9zdGljRXJyb3JBcnJheS5sZW5ndGh9IGVycm9ycy4gVHJhbnNmZXJyaW5nIGFycmF5IHRvIG9iamVjdOKApmBcclxuXHQpO1xyXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgZGlhZ25vc3RpY0Vycm9yQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuXHRcdGNvbnN0IGRpYWdub3N0aWMgPSBkaWFnbm9zdGljRXJyb3JBcnJheVtpXTtcclxuXHRcdC8vKiBFbnN1cmUgY29kZSBleGlzdHMgaW4gb2JqZWN0XHJcblx0XHRpZiAoIXJlc3VsdFtkaWFnbm9zdGljLmNvZGVdKSByZXN1bHRbZGlhZ25vc3RpYy5jb2RlXSA9IFtdO1xyXG5cclxuXHRcdC8vKiBGaWxlIHNyYyBtZXNzYWdlIGNvbG9yaW5nXHJcblx0XHRjb25zdCBmaWxlU3JjTXNnID0gY2hhbGsuaGV4KFwiI2JlYmViZVwiKShcclxuXHRcdFx0YCR7Y2hhbGsueWVsbG93QnJpZ2h0KGRpYWdub3N0aWMuZmlsZSl9KCR7XHJcblx0XHRcdFx0ZGlhZ25vc3RpYy5kaWFnbm9zdGljTGluZS5saW5lICsgMVxyXG5cdFx0XHR9LCR7ZGlhZ25vc3RpYy5kaWFnbm9zdGljTGluZS5jaGFyYWN0ZXIgKyAxfSlgXHJcblx0XHQpO1xyXG5cclxuXHRcdHJlc3VsdFtkaWFnbm9zdGljLmNvZGVdLnB1c2goXHJcblx0XHRcdGAke2ZpbGVTcmNNc2d9IOKAoiAke2NoYWxrLmhleChcIiM3Mjg5REFcIikoZGlhZ25vc3RpYy5tZXNzYWdlKX1gXHJcblx0XHQpO1xyXG5cdH1cclxuXHRsb2dnZXIoXCJUcmFuc2ZlcnJlZCBhcnJheSB0byBvYmplY3QsIG5vdyBwb3N0aW5nIGVycm9ycyBieSBlcnJvciBJROKAplwiKTtcclxuXHQvLyNlbmRyZWdpb25cclxuXHJcblx0Ly8qIEVycm9yIGhlYWRlclxyXG5cdGNvbnNvbGUubG9nKFxyXG5cdFx0YCR7ZHNDb25zb2xlUHJlZml4fSAke2NoYWxrLmJvbGQoXHJcblx0XHRcdGNoYWxrLmhleChcIiNlODNhM2FcIikoXHJcblx0XHRcdFx0XCJGb3VuZCBcIiArXHJcblx0XHRcdFx0XHRkaWFnbm9zdGljRXJyb3JBcnJheS5sZW5ndGggK1xyXG5cdFx0XHRcdFx0XCIgZXJyb3JcIiArXHJcblx0XHRcdFx0XHQoZGlhZ25vc3RpY0Vycm9yQXJyYXkubGVuZ3RoID09PSAxID8gXCJcIiA6IFwic1wiKSArXHJcblx0XHRcdFx0XHRcIi4gV2F0Y2hpbmcgZm9yIGZpbGUgY2hhbmdlc+KAplwiXHJcblx0XHRcdClcclxuXHRcdCl9YFxyXG5cdCk7XHJcblxyXG5cdGxldCBpID0gMDtcclxuXHRmb3IgKGNvbnN0IFtlcnJvckNvZGUsIGVycm9yQXJyYXldIG9mIE9iamVjdC5lbnRyaWVzKHJlc3VsdCkpIHtcclxuXHRcdC8vKiBTcGFjaW5nIGJldHdlZW4gc3JjIGFuZCBlcnJvciBtZXNzYWdlLlxyXG5cdFx0b3V0bGluZShlcnJvckFycmF5LCBcIuKAolwiKTtcclxuXHJcblx0XHRpKys7XHJcblx0XHRpZiAoT2JqZWN0LmtleXMocmVzdWx0KS5sZW5ndGggPiAxKSB7XHJcblx0XHRcdGlmIChPYmplY3Qua2V5cyhyZXN1bHQpLmxlbmd0aCA9PT0gaSkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGDilbDilIAgJHtjaGFsay5ib2xkKGNoYWxrLnJlZEJyaWdodChcIlRTXCIgKyBlcnJvckNvZGUpKX1gKTtcclxuXHRcdFx0XHRkaXNwbGF5QXNUcmVlKGVycm9yQXJyYXksIFwiICAgXCIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGDilJzilIAgJHtjaGFsay5ib2xkKGNoYWxrLnJlZEJyaWdodChcIlRTXCIgKyBlcnJvckNvZGUpKX1gKTtcclxuXHRcdFx0XHRkaXNwbGF5QXNUcmVlKGVycm9yQXJyYXksIFwi4pSCICBcIik7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGDilbDilIAgJHtjaGFsay5ib2xkKGNoYWxrLnJlZEJyaWdodChcIlRTXCIgKyBlcnJvckNvZGUpKX1gKTtcclxuXHRcdFx0ZGlzcGxheUFzVHJlZShlcnJvckFycmF5LCBcIiAgIFwiKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGRpYWdub3N0aWNFcnJvckFycmF5ID0gW107XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbGVDaGFuZ2UoZGlhZ25vc3RpYzogRGlhZ25vc3RpYykge1xyXG5cdC8vKiBcIlN0YXJ0aW5nIGNvbXBpbGF0aW9uIGluIHdhdGNoIG1vZGUuLi5cIlwiXHJcblx0aWYgKGRpYWdub3N0aWMuY29kZSA9PT0gNjAzMSkge1xyXG5cdFx0aWYgKCFjb25maWcuc2lsZW50KVxyXG5cdFx0XHRjb25zb2xlLmxvZyhcclxuXHRcdFx0XHRgJHtkc0NvbnNvbGVQcmVmaXh9ICR7Y2hhbGsuYmx1ZUJyaWdodChcclxuXHRcdFx0XHRcdFwiU3RhcnRpbmcgVHlwZVNjcmlwdCBjb21waWxlcuKAplwiXHJcblx0XHRcdFx0KX1gXHJcblx0XHRcdCk7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHQvLyogXCJGaWxlIGNoYW5nZSBkZXRlY3RlZC4uLlwiXHJcblx0aWYgKGRpYWdub3N0aWMuY29kZSA9PT0gNjAzMikge1xyXG5cdFx0aWYgKCFjb25maWcuc2lsZW50KVxyXG5cdFx0XHRjb25zb2xlLmxvZyhcclxuXHRcdFx0XHRgJHtkc0NvbnNvbGVQcmVmaXh9ICR7Y2hhbGsuYmx1ZUJyaWdodChcclxuXHRcdFx0XHRcdGRpYWdub3N0aWMubWVzc2FnZVRleHRcclxuXHRcdFx0XHRcdFx0LnRvU3RyaW5nKClcclxuXHRcdFx0XHRcdFx0LnN1YnN0cmluZygwLCBkaWFnbm9zdGljLm1lc3NhZ2VUZXh0LnRvU3RyaW5nKCkubGVuZ3RoIC0gMykgKyBcIuKAplwiXHJcblx0XHRcdFx0KX1gXHJcblx0XHRcdCk7XHJcblxyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0aWYgKFxyXG5cdFx0Ly8qIEZvdW5kIDAgZXJyb3JzXHJcblx0XHRkaWFnbm9zdGljLmNvZGUgPT09IDYxOTQgJiZcclxuXHRcdHBhcnNlSW50KGRpYWdub3N0aWMubWVzc2FnZVRleHQudG9TdHJpbmcoKS5yZXBsYWNlKC9cXEQvZywgXCJcIikpID09PSAwXHJcblx0KSB7XHJcblx0XHRhd2FpdCBjb3B5VGFzaygpO1xyXG5cdFx0Ly8qIFJlc3RhcnQgY2hpbGRcclxuXHRcdGF3YWl0IHJ1bkNoaWxkKCk7XHJcblxyXG5cdFx0aWYgKCFjb25maWcuc2lsZW50KVxyXG5cdFx0XHRjb25zb2xlLmxvZyhcclxuXHRcdFx0XHRkc0NvbnNvbGVQcmVmaXggK1xyXG5cdFx0XHRcdFx0XCIgXCIgK1xyXG5cdFx0XHRcdFx0Y2hhbGsuZ3JlZW4oXHJcblx0XHRcdFx0XHRcdGRpYWdub3N0aWMubWVzc2FnZVRleHRcclxuXHRcdFx0XHRcdFx0XHQudG9TdHJpbmcoKVxyXG5cdFx0XHRcdFx0XHRcdC5zdWJzdHJpbmcoMCwgZGlhZ25vc3RpYy5tZXNzYWdlVGV4dC50b1N0cmluZygpLmxlbmd0aCAtIDEpICsgXCLigKZcIlxyXG5cdFx0XHRcdFx0KVxyXG5cdFx0XHQpO1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0Ly8qIEVycm9ycywgbm8gcmVzdGFydFxyXG59XHJcbiJdfQ==