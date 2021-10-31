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
var logger = (0, debug_1.default)(__1.name + ":childHandler");
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
                    return [4, killOldChild()];
                case 1:
                    _c.sent();
                    if (!(!__1.config.entry && ((_a = projectJSON === null || projectJSON === void 0 ? void 0 : projectJSON.scripts) === null || _a === void 0 ? void 0 : _a.start))) return [3, 3];
                    logger("Starting with start script from project.json");
                    _b = child_process_1.spawn;
                    return [4, (0, fs_extra_1.pathExists)(process.cwd() + "/yarn.lock")];
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
                    return [2];
                case 3:
                    if ((0, fs_extra_1.pathExists)(__1.config.entry ? __1.config.entry : (0, path_1.resolve)(__1.config.out, "index.js"))) {
                        logger("Starting with entry index.js");
                        currentChild = (0, child_process_1.fork)(__1.config.entry ? __1.config.entry : (0, path_1.resolve)(__1.config.out, "index.js"), process.argv, {
                            cwd: __1.config.entry ? process.cwd() : __1.config.out,
                            execArgv: process.argv
                        });
                        return [2];
                    }
                    throw new Error("No entry found");
            }
        });
    });
}
exports.default = runChild;
function onChildDeath(code, signal) {
    if (!__1.config.silent)
        console.log(__1.dsConsolePrefix + " " + chalk_1.default.yellow("Process exit with code " +
            chalk_1.default.white(code) +
            ", signal: " +
            chalk_1.default.white(signal) +
            ""));
}
function killOldChild() {
    return __awaiter(this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(currentChild && !currentChild.killed)) return [3, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    currentChild.removeListener("exit", onChildDeath);
                    return [4, new Promise(function (resolve, reject) {
                            return (0, tree_kill_1.default)(currentChild.pid, "SIGKILL", function (err) {
                                return err ? reject(err) : resolve();
                            });
                        })];
                case 2:
                    _a.sent();
                    logger("Kill old child");
                    return [3, 4];
                case 3:
                    err_1 = _a.sent();
                    logger("Failed to kill old child", err_1);
                    return [3, 4];
                case 4:
                    currentChild = null;
                    _a.label = 5;
                case 5: return [2];
            }
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpbGRIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJ1dGlsL2NoaWxkSGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLCtDQUEwRDtBQUMxRCx5QkFBb0Q7QUFFcEQsZ0RBQTBCO0FBQzFCLGdEQUEwQjtBQUMxQixxQ0FBc0M7QUFDdEMsNkJBQStCO0FBQy9CLHdEQUFpQztBQUVqQyxJQUFJLFlBQVksR0FBd0IsSUFBSSxDQUFDO0FBQzdDLElBQU0sTUFBTSxHQUFHLElBQUEsZUFBSyxFQUFJLFFBQUksa0JBQWUsQ0FBQyxDQUFDO0FBRTdDLFNBQThCLFFBQVE7Ozs7Ozs7b0JBQ2pDLFdBQVcsR0FBUSxJQUFJLENBQUM7b0JBRTVCLElBQUk7d0JBQ0gsV0FBVyxHQUFHLE9BQU8sQ0FBQyxJQUFBLGNBQU8sRUFBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQztxQkFDOUQ7b0JBQUMsT0FBTyxHQUFHLEVBQUU7d0JBQ2IsTUFBTSxDQUFDLHVCQUF1QixDQUFDLENBQUM7cUJBQ2hDO29CQUVELFdBQU0sWUFBWSxFQUFFLEVBQUE7O29CQUFwQixTQUFvQixDQUFDO3lCQUVqQixDQUFBLENBQUMsVUFBTSxDQUFDLEtBQUssS0FBSSxNQUFBLFdBQVcsYUFBWCxXQUFXLHVCQUFYLFdBQVcsQ0FBRSxPQUFPLDBDQUFFLEtBQUssQ0FBQSxDQUFBLEVBQTVDLGNBQTRDO29CQUMvQyxNQUFNLENBQUMsOENBQThDLENBQUMsQ0FBQztvQkFDeEMsS0FBQSxxQkFBSyxDQUFBO29CQUNsQixXQUFNLElBQUEscUJBQVUsRUFBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsWUFBWSxDQUFDLEVBQUE7O29CQURoRCxZQUFZLEdBQUcsa0JBQ2QsQ0FBQyxTQUE4QyxDQUFDOzRCQUMvQyxDQUFDLENBQUMseUJBQXlCOzRCQUMzQixDQUFDLENBQUMsd0JBQXdCO3dCQUMzQixPQUFPLENBQUMsSUFBSTt3QkFDWjs0QkFDQyxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsRUFBRTs0QkFDbEIsS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLOzRCQUNwQixHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUc7NEJBQ2hCLEtBQUssRUFBRSxJQUFJOzRCQUNYLEtBQUssRUFBRSxTQUFTO3lCQUNoQixFQUNELENBQUM7b0JBRUYsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7b0JBQ3hDLFdBQU87O29CQUdSLElBQ0MsSUFBQSxxQkFBVSxFQUFDLFVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUEsY0FBTyxFQUFDLFVBQU0sQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUMsRUFDeEU7d0JBQ0QsTUFBTSxDQUFDLDhCQUE4QixDQUFDLENBQUM7d0JBQ3ZDLFlBQVksR0FBRyxJQUFBLG9CQUFJLEVBQ2xCLFVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUEsY0FBTyxFQUFDLFVBQU0sQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLEVBQzdELE9BQU8sQ0FBQyxJQUFJLEVBQ1o7NEJBQ0MsR0FBRyxFQUFFLFVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBTSxDQUFDLEdBQUc7NEJBQzlDLFFBQVEsRUFBRSxPQUFPLENBQUMsSUFBSTt5QkFDdEIsQ0FDRCxDQUFDO3dCQUNGLFdBQU87cUJBQ1A7b0JBR0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOzs7O0NBQ2xDO0FBaERELDJCQWdEQztBQUVELFNBQVMsWUFBWSxDQUFDLElBQVksRUFBRSxNQUFzQjtJQUN6RCxJQUFJLENBQUMsVUFBTSxDQUFDLE1BQU07UUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FDUCxtQkFBZSxTQUFJLGVBQUssQ0FBQyxNQUFNLENBQ2pDLHlCQUF5QjtZQUN4QixlQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztZQUNqQixZQUFZO1lBQ1osZUFBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFDbkIsRUFBRSxDQUNELENBQ0gsQ0FBQztBQUNKLENBQUM7QUFFRCxTQUFlLFlBQVk7Ozs7Ozt5QkFDdEIsQ0FBQSxZQUFZLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFBLEVBQXBDLGNBQW9DOzs7O29CQUV0QyxZQUFZLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztvQkFDbEQsV0FBTSxJQUFJLE9BQU8sQ0FBTyxVQUFDLE9BQU8sRUFBRSxNQUFNOzRCQUN2QyxPQUFBLElBQUEsbUJBQVEsRUFBQyxZQUFZLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxVQUFDLEdBQUc7Z0NBQ3pDLE9BQUEsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRTs0QkFBN0IsQ0FBNkIsQ0FDN0I7d0JBRkQsQ0FFQyxDQUNELEVBQUE7O29CQUpELFNBSUMsQ0FBQztvQkFDRixNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7OztvQkFFekIsTUFBTSxDQUFDLDBCQUEwQixFQUFFLEtBQUcsQ0FBQyxDQUFDOzs7b0JBRXpDLFlBQVksR0FBRyxJQUFJLENBQUM7Ozs7OztDQUVyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoaWxkUHJvY2VzcywgZm9yaywgc3Bhd24gfSBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiO1xyXG5pbXBvcnQgeyBjb25maWcsIGRzQ29uc29sZVByZWZpeCwgbmFtZSB9IGZyb20gXCIuLi9cIjtcclxuXHJcbmltcG9ydCBjaGFsayBmcm9tIFwiY2hhbGtcIjtcclxuaW1wb3J0IGRlYnVnIGZyb20gXCJkZWJ1Z1wiO1xyXG5pbXBvcnQgeyBwYXRoRXhpc3RzIH0gZnJvbSBcImZzLWV4dHJhXCI7XHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgdHJlZUtpbGwgZnJvbSBcInRyZWUta2lsbFwiO1xyXG5cclxubGV0IGN1cnJlbnRDaGlsZDogQ2hpbGRQcm9jZXNzIHwgbnVsbCA9IG51bGw7XHJcbmNvbnN0IGxvZ2dlciA9IGRlYnVnKGAke25hbWV9OmNoaWxkSGFuZGxlcmApO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gcnVuQ2hpbGQoKSB7XHJcblx0bGV0IHByb2plY3RKU09OOiBhbnkgPSBudWxsO1xyXG5cclxuXHR0cnkge1xyXG5cdFx0cHJvamVjdEpTT04gPSByZXF1aXJlKHJlc29sdmUocHJvY2Vzcy5jd2QoKSwgXCJwYWNrYWdlLmpzb25cIikpO1xyXG5cdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0bG9nZ2VyKFwiTm8gcGFja2FnZS5qc29uIGZvdW5kXCIpO1xyXG5cdH1cclxuXHJcblx0YXdhaXQga2lsbE9sZENoaWxkKCk7XHJcblxyXG5cdGlmICghY29uZmlnLmVudHJ5ICYmIHByb2plY3RKU09OPy5zY3JpcHRzPy5zdGFydCkge1xyXG5cdFx0bG9nZ2VyKFwiU3RhcnRpbmcgd2l0aCBzdGFydCBzY3JpcHQgZnJvbSBwcm9qZWN0Lmpzb25cIik7XHJcblx0XHRjdXJyZW50Q2hpbGQgPSBzcGF3bihcclxuXHRcdFx0KGF3YWl0IHBhdGhFeGlzdHMocHJvY2Vzcy5jd2QoKSArIFwiL3lhcm4ubG9ja1wiKSlcclxuXHRcdFx0XHQ/IFwieWFybiBydW4gLS1zaWxlbnQgc3RhcnRcIlxyXG5cdFx0XHRcdDogXCJucG0gcnVuIC0tc2lsZW50IHN0YXJ0XCIsXHJcblx0XHRcdHByb2Nlc3MuYXJndixcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGN3ZDogcHJvY2Vzcy5jd2QoKSxcclxuXHRcdFx0XHRhcmd2MDogcHJvY2Vzcy5hcmd2MCxcclxuXHRcdFx0XHRlbnY6IHByb2Nlc3MuZW52LFxyXG5cdFx0XHRcdHNoZWxsOiB0cnVlLFxyXG5cdFx0XHRcdHN0ZGlvOiBcImluaGVyaXRcIlxyXG5cdFx0XHR9XHJcblx0XHQpO1xyXG5cclxuXHRcdGN1cnJlbnRDaGlsZC5vbmNlKFwiZXhpdFwiLCBvbkNoaWxkRGVhdGgpO1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0aWYgKFxyXG5cdFx0cGF0aEV4aXN0cyhjb25maWcuZW50cnkgPyBjb25maWcuZW50cnkgOiByZXNvbHZlKGNvbmZpZy5vdXQsIFwiaW5kZXguanNcIikpXHJcblx0KSB7XHJcblx0XHRsb2dnZXIoXCJTdGFydGluZyB3aXRoIGVudHJ5IGluZGV4LmpzXCIpO1xyXG5cdFx0Y3VycmVudENoaWxkID0gZm9yayhcclxuXHRcdFx0Y29uZmlnLmVudHJ5ID8gY29uZmlnLmVudHJ5IDogcmVzb2x2ZShjb25maWcub3V0LCBcImluZGV4LmpzXCIpLFxyXG5cdFx0XHRwcm9jZXNzLmFyZ3YsXHJcblx0XHRcdHtcclxuXHRcdFx0XHRjd2Q6IGNvbmZpZy5lbnRyeSA/IHByb2Nlc3MuY3dkKCkgOiBjb25maWcub3V0LFxyXG5cdFx0XHRcdGV4ZWNBcmd2OiBwcm9jZXNzLmFyZ3ZcclxuXHRcdFx0fVxyXG5cdFx0KTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdC8vVE9ETyBCZXR0ZXIgbWVzc2FnZVxyXG5cdHRocm93IG5ldyBFcnJvcihcIk5vIGVudHJ5IGZvdW5kXCIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBvbkNoaWxkRGVhdGgoY29kZTogbnVtYmVyLCBzaWduYWw6IE5vZGVKUy5TaWduYWxzKSB7XHJcblx0aWYgKCFjb25maWcuc2lsZW50KVxyXG5cdFx0Y29uc29sZS5sb2coXHJcblx0XHRcdGAke2RzQ29uc29sZVByZWZpeH0gJHtjaGFsay55ZWxsb3coXHJcblx0XHRcdFx0XCJQcm9jZXNzIGV4aXQgd2l0aCBjb2RlIFwiICtcclxuXHRcdFx0XHRcdGNoYWxrLndoaXRlKGNvZGUpICtcclxuXHRcdFx0XHRcdFwiLCBzaWduYWw6IFwiICtcclxuXHRcdFx0XHRcdGNoYWxrLndoaXRlKHNpZ25hbCkgK1xyXG5cdFx0XHRcdFx0XCJcIlxyXG5cdFx0XHQpfWBcclxuXHRcdCk7XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGtpbGxPbGRDaGlsZCgpIHtcclxuXHRpZiAoY3VycmVudENoaWxkICYmICFjdXJyZW50Q2hpbGQua2lsbGVkKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRjdXJyZW50Q2hpbGQucmVtb3ZlTGlzdGVuZXIoXCJleGl0XCIsIG9uQ2hpbGREZWF0aCk7XHJcblx0XHRcdGF3YWl0IG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+XHJcblx0XHRcdFx0dHJlZUtpbGwoY3VycmVudENoaWxkLnBpZCwgXCJTSUdLSUxMXCIsIChlcnIpID0+XHJcblx0XHRcdFx0XHRlcnIgPyByZWplY3QoZXJyKSA6IHJlc29sdmUoKVxyXG5cdFx0XHRcdClcclxuXHRcdFx0KTtcclxuXHRcdFx0bG9nZ2VyKFwiS2lsbCBvbGQgY2hpbGRcIik7XHJcblx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0bG9nZ2VyKFwiRmFpbGVkIHRvIGtpbGwgb2xkIGNoaWxkXCIsIGVycik7XHJcblx0XHR9XHJcblx0XHRjdXJyZW50Q2hpbGQgPSBudWxsO1xyXG5cdH1cclxufVxyXG4iXX0=