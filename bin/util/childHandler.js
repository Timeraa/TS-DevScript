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
var child_process_1 = require("child_process");
var __1 = require("../");
var chalk_1 = __importDefault(require("chalk"));
var debug_1 = __importDefault(require("debug"));
var fs_extra_1 = require("fs-extra");
var path_1 = require("path");
var tree_kill_1 = __importDefault(require("tree-kill"));
var currentChild = null;
var logger = (0, debug_1.default)("".concat(__1.name, ":childHandler"));
function runChild() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var projectJSON, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    projectJSON = null;
                    try {
                        projectJSON = require((0, path_1.resolve)(process.cwd(), "package.json"));
                    }
                    catch (err) {
                        logger("No package.json found");
                    }
                    return [4 /*yield*/, killOldChild()];
                case 1:
                    _c.sent();
                    if (!(!__1.config.entry && ((_a = projectJSON === null || projectJSON === void 0 ? void 0 : projectJSON.scripts) === null || _a === void 0 ? void 0 : _a.start))) return [3 /*break*/, 3];
                    logger("Starting with start script from project.json");
                    _b = child_process_1.spawn;
                    return [4 /*yield*/, (0, fs_extra_1.pathExists)(process.cwd() + "/yarn.lock")];
                case 2:
                    currentChild = _b.apply(void 0, [(_c.sent())
                            ? "yarn run --silent start"
                            : "npm run --silent start",
                        process.argv,
                        {
                            cwd: process.cwd(),
                            argv0: process.argv0,
                            env: process.env,
                            shell: true,
                            stdio: "inherit"
                        }]);
                    currentChild.once("exit", onChildDeath);
                    return [2 /*return*/];
                case 3: return [4 /*yield*/, (0, fs_extra_1.pathExists)(__1.config.entry ? __1.config.entry : (0, path_1.resolve)(__1.config.out, "index.js"))];
                case 4:
                    if (_c.sent()) {
                        logger("Starting with entry index.js");
                        currentChild = (0, child_process_1.fork)(__1.config.entry ? __1.config.entry : (0, path_1.resolve)(__1.config.out, "index.js"), process.argv, {
                            cwd: __1.config.entry ? process.cwd() : __1.config.out,
                        });
                        return [2 /*return*/];
                    }
                    throw new Error("No entry point found!");
            }
        });
    });
}
exports.default = runChild;
function onChildDeath(code, signal) {
    if (!__1.config.silent)
        console.log("".concat(__1.dsConsolePrefix, " ").concat(chalk_1.default.yellow("Process exit with code " +
            chalk_1.default.white(code) +
            ", signal: " +
            chalk_1.default.white(signal) +
            "")));
}
function killOldChild() {
    return __awaiter(this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(currentChild && !currentChild.killed)) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    currentChild.removeListener("exit", onChildDeath);
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            return (0, tree_kill_1.default)(currentChild.pid, "SIGKILL", function (err) {
                                return err ? reject(err) : resolve();
                            });
                        })];
                case 2:
                    _a.sent();
                    logger("Kill old child");
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    logger("Failed to kill old child", err_1);
                    return [3 /*break*/, 4];
                case 4:
                    currentChild = null;
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpbGRIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwvY2hpbGRIYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsK0NBQTBEO0FBQzFELHlCQUFvRDtBQUVwRCxnREFBMEI7QUFDMUIsZ0RBQTBCO0FBQzFCLHFDQUFzQztBQUN0Qyw2QkFBK0I7QUFDL0Isd0RBQWlDO0FBRWpDLElBQUksWUFBWSxHQUF3QixJQUFJLENBQUM7QUFDN0MsSUFBTSxNQUFNLEdBQUcsSUFBQSxlQUFLLEVBQUMsVUFBRyxRQUFJLGtCQUFlLENBQUMsQ0FBQztBQUU3QyxTQUE4QixRQUFROzs7Ozs7O29CQUNqQyxXQUFXLEdBQVEsSUFBSSxDQUFDO29CQUU1QixJQUFJO3dCQUNILFdBQVcsR0FBRyxPQUFPLENBQUMsSUFBQSxjQUFPLEVBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7cUJBQzlEO29CQUFDLE9BQU8sR0FBRyxFQUFFO3dCQUNiLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO3FCQUNoQztvQkFFRCxxQkFBTSxZQUFZLEVBQUUsRUFBQTs7b0JBQXBCLFNBQW9CLENBQUM7eUJBRWpCLENBQUEsQ0FBQyxVQUFNLENBQUMsS0FBSyxLQUFJLE1BQUEsV0FBVyxhQUFYLFdBQVcsdUJBQVgsV0FBVyxDQUFFLE9BQU8sMENBQUUsS0FBSyxDQUFBLENBQUEsRUFBNUMsd0JBQTRDO29CQUMvQyxNQUFNLENBQUMsOENBQThDLENBQUMsQ0FBQztvQkFDeEMsS0FBQSxxQkFBSyxDQUFBO29CQUNsQixxQkFBTSxJQUFBLHFCQUFVLEVBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLFlBQVksQ0FBQyxFQUFBOztvQkFEaEQsWUFBWSxHQUFHLGtCQUNkLENBQUMsU0FBOEMsQ0FBQzs0QkFDL0MsQ0FBQyxDQUFDLHlCQUF5Qjs0QkFDM0IsQ0FBQyxDQUFDLHdCQUF3Qjt3QkFDM0IsT0FBTyxDQUFDLElBQUk7d0JBQ1o7NEJBQ0MsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUU7NEJBQ2xCLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSzs0QkFDcEIsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHOzRCQUNoQixLQUFLLEVBQUUsSUFBSTs0QkFDWCxLQUFLLEVBQUUsU0FBUzt5QkFDaEIsRUFDRCxDQUFDO29CQUVGLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDO29CQUN4QyxzQkFBTzt3QkFJUCxxQkFBTSxJQUFBLHFCQUFVLEVBQUMsVUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsVUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBQSxjQUFPLEVBQUMsVUFBTSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQyxFQUFBOztvQkFEaEYsSUFDQyxTQUErRSxFQUM5RTt3QkFDRCxNQUFNLENBQUMsOEJBQThCLENBQUMsQ0FBQzt3QkFDdkMsWUFBWSxHQUFHLElBQUEsb0JBQUksRUFDbEIsVUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsVUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBQSxjQUFPLEVBQUMsVUFBTSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsRUFDN0QsT0FBTyxDQUFDLElBQUksRUFDWjs0QkFDQyxHQUFHLEVBQUUsVUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFNLENBQUMsR0FBRzt5QkFDOUMsQ0FDRCxDQUFDO3dCQUNGLHNCQUFPO3FCQUNQO29CQUVELE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQzs7OztDQUN6QztBQTlDRCwyQkE4Q0M7QUFFRCxTQUFTLFlBQVksQ0FBQyxJQUFZLEVBQUUsTUFBc0I7SUFDekQsSUFBSSxDQUFDLFVBQU0sQ0FBQyxNQUFNO1FBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQ1YsVUFBRyxtQkFBZSxjQUFJLGVBQUssQ0FBQyxNQUFNLENBQ2pDLHlCQUF5QjtZQUN4QixlQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztZQUNqQixZQUFZO1lBQ1osZUFBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFDbkIsRUFBRSxDQUNILENBQUUsQ0FDSCxDQUFDO0FBQ0osQ0FBQztBQUVELFNBQWUsWUFBWTs7Ozs7O3lCQUN0QixDQUFBLFlBQVksSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUEsRUFBcEMsd0JBQW9DOzs7O29CQUV0QyxZQUFZLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztvQkFDbEQscUJBQU0sSUFBSSxPQUFPLENBQU8sVUFBQyxPQUFPLEVBQUUsTUFBTTs0QkFDdkMsT0FBQSxJQUFBLG1CQUFRLEVBQUMsWUFBYSxDQUFDLEdBQUksRUFBRSxTQUFTLEVBQUUsVUFBQyxHQUFHO2dDQUMzQyxPQUFBLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUU7NEJBQTdCLENBQTZCLENBQzdCO3dCQUZELENBRUMsQ0FDRCxFQUFBOztvQkFKRCxTQUlDLENBQUM7b0JBQ0YsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUM7Ozs7b0JBRXpCLE1BQU0sQ0FBQywwQkFBMEIsRUFBRSxLQUFHLENBQUMsQ0FBQzs7O29CQUV6QyxZQUFZLEdBQUcsSUFBSSxDQUFDOzs7Ozs7Q0FFckIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGlsZFByb2Nlc3MsIGZvcmssIHNwYXduIH0gZnJvbSBcImNoaWxkX3Byb2Nlc3NcIjtcclxuaW1wb3J0IHsgY29uZmlnLCBkc0NvbnNvbGVQcmVmaXgsIG5hbWUgfSBmcm9tIFwiLi4vXCI7XHJcblxyXG5pbXBvcnQgY2hhbGsgZnJvbSBcImNoYWxrXCI7XHJcbmltcG9ydCBkZWJ1ZyBmcm9tIFwiZGVidWdcIjtcclxuaW1wb3J0IHsgcGF0aEV4aXN0cyB9IGZyb20gXCJmcy1leHRyYVwiO1xyXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHRyZWVLaWxsIGZyb20gXCJ0cmVlLWtpbGxcIjtcclxuXHJcbmxldCBjdXJyZW50Q2hpbGQ6IENoaWxkUHJvY2VzcyB8IG51bGwgPSBudWxsO1xyXG5jb25zdCBsb2dnZXIgPSBkZWJ1ZyhgJHtuYW1lfTpjaGlsZEhhbmRsZXJgKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHJ1bkNoaWxkKCkge1xyXG5cdGxldCBwcm9qZWN0SlNPTjogYW55ID0gbnVsbDtcclxuXHJcblx0dHJ5IHtcclxuXHRcdHByb2plY3RKU09OID0gcmVxdWlyZShyZXNvbHZlKHByb2Nlc3MuY3dkKCksIFwicGFja2FnZS5qc29uXCIpKTtcclxuXHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdGxvZ2dlcihcIk5vIHBhY2thZ2UuanNvbiBmb3VuZFwiKTtcclxuXHR9XHJcblxyXG5cdGF3YWl0IGtpbGxPbGRDaGlsZCgpO1xyXG5cclxuXHRpZiAoIWNvbmZpZy5lbnRyeSAmJiBwcm9qZWN0SlNPTj8uc2NyaXB0cz8uc3RhcnQpIHtcclxuXHRcdGxvZ2dlcihcIlN0YXJ0aW5nIHdpdGggc3RhcnQgc2NyaXB0IGZyb20gcHJvamVjdC5qc29uXCIpO1xyXG5cdFx0Y3VycmVudENoaWxkID0gc3Bhd24oXHJcblx0XHRcdChhd2FpdCBwYXRoRXhpc3RzKHByb2Nlc3MuY3dkKCkgKyBcIi95YXJuLmxvY2tcIikpXHJcblx0XHRcdFx0PyBcInlhcm4gcnVuIC0tc2lsZW50IHN0YXJ0XCJcclxuXHRcdFx0XHQ6IFwibnBtIHJ1biAtLXNpbGVudCBzdGFydFwiLFxyXG5cdFx0XHRwcm9jZXNzLmFyZ3YsXHJcblx0XHRcdHtcclxuXHRcdFx0XHRjd2Q6IHByb2Nlc3MuY3dkKCksXHJcblx0XHRcdFx0YXJndjA6IHByb2Nlc3MuYXJndjAsXHJcblx0XHRcdFx0ZW52OiBwcm9jZXNzLmVudixcclxuXHRcdFx0XHRzaGVsbDogdHJ1ZSxcclxuXHRcdFx0XHRzdGRpbzogXCJpbmhlcml0XCJcclxuXHRcdFx0fVxyXG5cdFx0KTtcclxuXHJcblx0XHRjdXJyZW50Q2hpbGQub25jZShcImV4aXRcIiwgb25DaGlsZERlYXRoKTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdGlmIChcclxuXHRcdGF3YWl0IHBhdGhFeGlzdHMoY29uZmlnLmVudHJ5ID8gY29uZmlnLmVudHJ5IDogcmVzb2x2ZShjb25maWcub3V0LCBcImluZGV4LmpzXCIpKVxyXG5cdCkge1xyXG5cdFx0bG9nZ2VyKFwiU3RhcnRpbmcgd2l0aCBlbnRyeSBpbmRleC5qc1wiKTtcclxuXHRcdGN1cnJlbnRDaGlsZCA9IGZvcmsoXHJcblx0XHRcdGNvbmZpZy5lbnRyeSA/IGNvbmZpZy5lbnRyeSA6IHJlc29sdmUoY29uZmlnLm91dCwgXCJpbmRleC5qc1wiKSxcclxuXHRcdFx0cHJvY2Vzcy5hcmd2LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0Y3dkOiBjb25maWcuZW50cnkgPyBwcm9jZXNzLmN3ZCgpIDogY29uZmlnLm91dCxcclxuXHRcdFx0fVxyXG5cdFx0KTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdHRocm93IG5ldyBFcnJvcihcIk5vIGVudHJ5IHBvaW50IGZvdW5kIVwiKTtcclxufVxyXG5cclxuZnVuY3Rpb24gb25DaGlsZERlYXRoKGNvZGU6IG51bWJlciwgc2lnbmFsOiBOb2RlSlMuU2lnbmFscykge1xyXG5cdGlmICghY29uZmlnLnNpbGVudClcclxuXHRcdGNvbnNvbGUubG9nKFxyXG5cdFx0XHRgJHtkc0NvbnNvbGVQcmVmaXh9ICR7Y2hhbGsueWVsbG93KFxyXG5cdFx0XHRcdFwiUHJvY2VzcyBleGl0IHdpdGggY29kZSBcIiArXHJcblx0XHRcdFx0XHRjaGFsay53aGl0ZShjb2RlKSArXHJcblx0XHRcdFx0XHRcIiwgc2lnbmFsOiBcIiArXHJcblx0XHRcdFx0XHRjaGFsay53aGl0ZShzaWduYWwpICtcclxuXHRcdFx0XHRcdFwiXCJcclxuXHRcdFx0KX1gXHJcblx0XHQpO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBraWxsT2xkQ2hpbGQoKSB7XHJcblx0aWYgKGN1cnJlbnRDaGlsZCAmJiAhY3VycmVudENoaWxkLmtpbGxlZCkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0Y3VycmVudENoaWxkLnJlbW92ZUxpc3RlbmVyKFwiZXhpdFwiLCBvbkNoaWxkRGVhdGgpO1xyXG5cdFx0XHRhd2FpdCBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiBcclxuXHRcdFx0XHR0cmVlS2lsbChjdXJyZW50Q2hpbGQhLnBpZCEsIFwiU0lHS0lMTFwiLCAoZXJyKSA9PlxyXG5cdFx0XHRcdFx0ZXJyID8gcmVqZWN0KGVycikgOiByZXNvbHZlKClcclxuXHRcdFx0XHQpXHJcblx0XHRcdCk7XHJcblx0XHRcdGxvZ2dlcihcIktpbGwgb2xkIGNoaWxkXCIpO1xyXG5cdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdGxvZ2dlcihcIkZhaWxlZCB0byBraWxsIG9sZCBjaGlsZFwiLCBlcnIpO1xyXG5cdFx0fVxyXG5cdFx0Y3VycmVudENoaWxkID0gbnVsbDtcclxuXHR9XHJcbn1cclxuIl19