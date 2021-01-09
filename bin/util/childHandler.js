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
var child_process_1 = require("child_process");
var debug_1 = __importDefault(require("debug"));
var fs_extra_1 = require("fs-extra");
var path_1 = require("path");
var tree_kill_1 = __importDefault(require("tree-kill"));
var __1 = require("../");
var currentChild = null;
var logger = debug_1.default(__1.name + ":childHandler");
function runChild() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var projectJSON, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    projectJSON = null;
                    try {
                        projectJSON = require(path_1.resolve(process.cwd(), "package.json"));
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
                    return [4, fs_extra_1.pathExists(process.cwd() + "/yarn.lock")];
                case 2:
                    currentChild = _b.apply(void 0, [(_c.sent())
                            ? "yarn run --silent start"
                            : "npm run --silent start", {
                            cwd: process.cwd(),
                            shell: true,
                            stdio: "inherit"
                        }]);
                    currentChild.once("exit", onChildDeath);
                    return [2];
                case 3:
                    if (fs_extra_1.pathExists(__1.config.entry ? __1.config.entry : path_1.resolve(__1.config.out, "index.js"))) {
                        logger("Starting with entry index.js");
                        currentChild = child_process_1.fork(__1.config.entry ? __1.config.entry : path_1.resolve(__1.config.out, "index.js"), [], {
                            cwd: __1.config.entry ? process.cwd() : __1.config.out
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
                            return tree_kill_1.default(currentChild.pid, "SIGKILL", function (err) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpbGRIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJ1dGlsL2NoaWxkSGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGdEQUEwQjtBQUMxQiwrQ0FBMEQ7QUFDMUQsZ0RBQTBCO0FBQzFCLHFDQUFzQztBQUN0Qyw2QkFBK0I7QUFDL0Isd0RBQWlDO0FBRWpDLHlCQUFvRDtBQUVwRCxJQUFJLFlBQVksR0FBd0IsSUFBSSxDQUFDO0FBQzdDLElBQU0sTUFBTSxHQUFHLGVBQUssQ0FBSSxRQUFJLGtCQUFlLENBQUMsQ0FBQztBQUU3QyxTQUE4QixRQUFROzs7Ozs7O29CQUNqQyxXQUFXLEdBQVEsSUFBSSxDQUFDO29CQUU1QixJQUFJO3dCQUNILFdBQVcsR0FBRyxPQUFPLENBQUMsY0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDO3FCQUM5RDtvQkFBQyxPQUFPLEdBQUcsRUFBRTt3QkFDYixNQUFNLENBQUMsdUJBQXVCLENBQUMsQ0FBQztxQkFDaEM7b0JBRUQsV0FBTSxZQUFZLEVBQUUsRUFBQTs7b0JBQXBCLFNBQW9CLENBQUM7eUJBRWpCLENBQUEsQ0FBQyxVQUFNLENBQUMsS0FBSyxXQUFJLFdBQVcsYUFBWCxXQUFXLHVCQUFYLFdBQVcsQ0FBRSxPQUFPLDBDQUFFLEtBQUssQ0FBQSxDQUFBLEVBQTVDLGNBQTRDO29CQUMvQyxNQUFNLENBQUMsOENBQThDLENBQUMsQ0FBQztvQkFDeEMsS0FBQSxxQkFBSyxDQUFBO29CQUNsQixXQUFNLHFCQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLFlBQVksQ0FBQyxFQUFBOztvQkFEaEQsWUFBWSxHQUFHLGtCQUNkLENBQUMsU0FBOEMsQ0FBQzs0QkFDL0MsQ0FBQyxDQUFDLHlCQUF5Qjs0QkFDM0IsQ0FBQyxDQUFDLHdCQUF3QixFQUMzQjs0QkFDQyxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsRUFBRTs0QkFDbEIsS0FBSyxFQUFFLElBQUk7NEJBQ1gsS0FBSyxFQUFFLFNBQVM7eUJBQ2hCLEVBQ0QsQ0FBQztvQkFFRixZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztvQkFDeEMsV0FBTzs7b0JBR1IsSUFDQyxxQkFBVSxDQUFDLFVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGNBQU8sQ0FBQyxVQUFNLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDLEVBQ3hFO3dCQUNELE1BQU0sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO3dCQUN2QyxZQUFZLEdBQUcsb0JBQUksQ0FDbEIsVUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsVUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsY0FBTyxDQUFDLFVBQU0sQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLEVBQzdELEVBQUUsRUFDRjs0QkFDQyxHQUFHLEVBQUUsVUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFNLENBQUMsR0FBRzt5QkFDOUMsQ0FDRCxDQUFDO3dCQUNGLFdBQU87cUJBQ1A7b0JBR0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOzs7O0NBQ2xDO0FBNUNELDJCQTRDQztBQUVELFNBQVMsWUFBWSxDQUFDLElBQVksRUFBRSxNQUFzQjtJQUN6RCxJQUFJLENBQUMsVUFBTSxDQUFDLE1BQU07UUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FDUCxtQkFBZSxTQUFJLGVBQUssQ0FBQyxNQUFNLENBQ2pDLHlCQUF5QjtZQUN4QixlQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztZQUNqQixZQUFZO1lBQ1osZUFBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFDbkIsRUFBRSxDQUNELENBQ0gsQ0FBQztBQUNKLENBQUM7QUFFRCxTQUFlLFlBQVk7Ozs7Ozt5QkFDdEIsQ0FBQSxZQUFZLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFBLEVBQXBDLGNBQW9DOzs7O29CQUV0QyxZQUFZLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztvQkFDbEQsV0FBTSxJQUFJLE9BQU8sQ0FBTyxVQUFDLE9BQU8sRUFBRSxNQUFNOzRCQUN2QyxPQUFBLG1CQUFRLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsVUFBQyxHQUFHO2dDQUN6QyxPQUFBLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUU7NEJBQTdCLENBQTZCLENBQzdCO3dCQUZELENBRUMsQ0FDRCxFQUFBOztvQkFKRCxTQUlDLENBQUM7b0JBQ0YsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUM7Ozs7b0JBRXpCLE1BQU0sQ0FBQywwQkFBMEIsRUFBRSxLQUFHLENBQUMsQ0FBQzs7O29CQUV6QyxZQUFZLEdBQUcsSUFBSSxDQUFDOzs7Ozs7Q0FFckIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2hhbGsgZnJvbSBcImNoYWxrXCI7XHJcbmltcG9ydCB7IENoaWxkUHJvY2VzcywgZm9yaywgc3Bhd24gfSBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiO1xyXG5pbXBvcnQgZGVidWcgZnJvbSBcImRlYnVnXCI7XHJcbmltcG9ydCB7IHBhdGhFeGlzdHMgfSBmcm9tIFwiZnMtZXh0cmFcIjtcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB0cmVlS2lsbCBmcm9tIFwidHJlZS1raWxsXCI7XHJcblxyXG5pbXBvcnQgeyBjb25maWcsIGRzQ29uc29sZVByZWZpeCwgbmFtZSB9IGZyb20gXCIuLi9cIjtcclxuXHJcbmxldCBjdXJyZW50Q2hpbGQ6IENoaWxkUHJvY2VzcyB8IG51bGwgPSBudWxsO1xyXG5jb25zdCBsb2dnZXIgPSBkZWJ1ZyhgJHtuYW1lfTpjaGlsZEhhbmRsZXJgKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHJ1bkNoaWxkKCkge1xyXG5cdGxldCBwcm9qZWN0SlNPTjogYW55ID0gbnVsbDtcclxuXHJcblx0dHJ5IHtcclxuXHRcdHByb2plY3RKU09OID0gcmVxdWlyZShyZXNvbHZlKHByb2Nlc3MuY3dkKCksIFwicGFja2FnZS5qc29uXCIpKTtcclxuXHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdGxvZ2dlcihcIk5vIHBhY2thZ2UuanNvbiBmb3VuZFwiKTtcclxuXHR9XHJcblxyXG5cdGF3YWl0IGtpbGxPbGRDaGlsZCgpO1xyXG5cclxuXHRpZiAoIWNvbmZpZy5lbnRyeSAmJiBwcm9qZWN0SlNPTj8uc2NyaXB0cz8uc3RhcnQpIHtcclxuXHRcdGxvZ2dlcihcIlN0YXJ0aW5nIHdpdGggc3RhcnQgc2NyaXB0IGZyb20gcHJvamVjdC5qc29uXCIpO1xyXG5cdFx0Y3VycmVudENoaWxkID0gc3Bhd24oXHJcblx0XHRcdChhd2FpdCBwYXRoRXhpc3RzKHByb2Nlc3MuY3dkKCkgKyBcIi95YXJuLmxvY2tcIikpXHJcblx0XHRcdFx0PyBcInlhcm4gcnVuIC0tc2lsZW50IHN0YXJ0XCJcclxuXHRcdFx0XHQ6IFwibnBtIHJ1biAtLXNpbGVudCBzdGFydFwiLFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0Y3dkOiBwcm9jZXNzLmN3ZCgpLFxyXG5cdFx0XHRcdHNoZWxsOiB0cnVlLFxyXG5cdFx0XHRcdHN0ZGlvOiBcImluaGVyaXRcIlxyXG5cdFx0XHR9XHJcblx0XHQpO1xyXG5cclxuXHRcdGN1cnJlbnRDaGlsZC5vbmNlKFwiZXhpdFwiLCBvbkNoaWxkRGVhdGgpO1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0aWYgKFxyXG5cdFx0cGF0aEV4aXN0cyhjb25maWcuZW50cnkgPyBjb25maWcuZW50cnkgOiByZXNvbHZlKGNvbmZpZy5vdXQsIFwiaW5kZXguanNcIikpXHJcblx0KSB7XHJcblx0XHRsb2dnZXIoXCJTdGFydGluZyB3aXRoIGVudHJ5IGluZGV4LmpzXCIpO1xyXG5cdFx0Y3VycmVudENoaWxkID0gZm9yayhcclxuXHRcdFx0Y29uZmlnLmVudHJ5ID8gY29uZmlnLmVudHJ5IDogcmVzb2x2ZShjb25maWcub3V0LCBcImluZGV4LmpzXCIpLFxyXG5cdFx0XHRbXSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGN3ZDogY29uZmlnLmVudHJ5ID8gcHJvY2Vzcy5jd2QoKSA6IGNvbmZpZy5vdXRcclxuXHRcdFx0fVxyXG5cdFx0KTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdC8vVE9ETyBCZXR0ZXIgbWVzc2FnZVxyXG5cdHRocm93IG5ldyBFcnJvcihcIk5vIGVudHJ5IGZvdW5kXCIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBvbkNoaWxkRGVhdGgoY29kZTogbnVtYmVyLCBzaWduYWw6IE5vZGVKUy5TaWduYWxzKSB7XHJcblx0aWYgKCFjb25maWcuc2lsZW50KVxyXG5cdFx0Y29uc29sZS5sb2coXHJcblx0XHRcdGAke2RzQ29uc29sZVByZWZpeH0gJHtjaGFsay55ZWxsb3coXHJcblx0XHRcdFx0XCJQcm9jZXNzIGV4aXQgd2l0aCBjb2RlIFwiICtcclxuXHRcdFx0XHRcdGNoYWxrLndoaXRlKGNvZGUpICtcclxuXHRcdFx0XHRcdFwiLCBzaWduYWw6IFwiICtcclxuXHRcdFx0XHRcdGNoYWxrLndoaXRlKHNpZ25hbCkgK1xyXG5cdFx0XHRcdFx0XCJcIlxyXG5cdFx0XHQpfWBcclxuXHRcdCk7XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGtpbGxPbGRDaGlsZCgpIHtcclxuXHRpZiAoY3VycmVudENoaWxkICYmICFjdXJyZW50Q2hpbGQua2lsbGVkKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRjdXJyZW50Q2hpbGQucmVtb3ZlTGlzdGVuZXIoXCJleGl0XCIsIG9uQ2hpbGREZWF0aCk7XHJcblx0XHRcdGF3YWl0IG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+XHJcblx0XHRcdFx0dHJlZUtpbGwoY3VycmVudENoaWxkLnBpZCwgXCJTSUdLSUxMXCIsIChlcnIpID0+XHJcblx0XHRcdFx0XHRlcnIgPyByZWplY3QoZXJyKSA6IHJlc29sdmUoKVxyXG5cdFx0XHRcdClcclxuXHRcdFx0KTtcclxuXHRcdFx0bG9nZ2VyKFwiS2lsbCBvbGQgY2hpbGRcIik7XHJcblx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0bG9nZ2VyKFwiRmFpbGVkIHRvIGtpbGwgb2xkIGNoaWxkXCIsIGVycik7XHJcblx0XHR9XHJcblx0XHRjdXJyZW50Q2hpbGQgPSBudWxsO1xyXG5cdH1cclxufVxyXG4iXX0=