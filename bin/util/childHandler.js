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
                    if (fs_extra_1.pathExists(__1.config.entry ? __1.config.entry : path_1.resolve(__1.config.out, "index.js"))) {
                        logger("Starting with entry index.js");
                        currentChild = child_process_1.fork(__1.config.entry ? __1.config.entry : path_1.resolve(__1.config.out, "index.js"), process.argv, {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpbGRIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJ1dGlsL2NoaWxkSGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLCtDQUEwRDtBQUMxRCx5QkFBb0Q7QUFFcEQsZ0RBQTBCO0FBQzFCLGdEQUEwQjtBQUMxQixxQ0FBc0M7QUFDdEMsNkJBQStCO0FBQy9CLHdEQUFpQztBQUVqQyxJQUFJLFlBQVksR0FBd0IsSUFBSSxDQUFDO0FBQzdDLElBQU0sTUFBTSxHQUFHLGVBQUssQ0FBSSxRQUFJLGtCQUFlLENBQUMsQ0FBQztBQUU3QyxTQUE4QixRQUFROzs7Ozs7O29CQUNqQyxXQUFXLEdBQVEsSUFBSSxDQUFDO29CQUU1QixJQUFJO3dCQUNILFdBQVcsR0FBRyxPQUFPLENBQUMsY0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDO3FCQUM5RDtvQkFBQyxPQUFPLEdBQUcsRUFBRTt3QkFDYixNQUFNLENBQUMsdUJBQXVCLENBQUMsQ0FBQztxQkFDaEM7b0JBRUQsV0FBTSxZQUFZLEVBQUUsRUFBQTs7b0JBQXBCLFNBQW9CLENBQUM7eUJBRWpCLENBQUEsQ0FBQyxVQUFNLENBQUMsS0FBSyxLQUFJLE1BQUEsV0FBVyxhQUFYLFdBQVcsdUJBQVgsV0FBVyxDQUFFLE9BQU8sMENBQUUsS0FBSyxDQUFBLENBQUEsRUFBNUMsY0FBNEM7b0JBQy9DLE1BQU0sQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO29CQUN4QyxLQUFBLHFCQUFLLENBQUE7b0JBQ2xCLFdBQU0scUJBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsWUFBWSxDQUFDLEVBQUE7O29CQURoRCxZQUFZLEdBQUcsa0JBQ2QsQ0FBQyxTQUE4QyxDQUFDOzRCQUMvQyxDQUFDLENBQUMseUJBQXlCOzRCQUMzQixDQUFDLENBQUMsd0JBQXdCO3dCQUMzQixPQUFPLENBQUMsSUFBSTt3QkFDWjs0QkFDQyxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsRUFBRTs0QkFDbEIsS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLOzRCQUNwQixHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUc7NEJBQ2hCLEtBQUssRUFBRSxJQUFJOzRCQUNYLEtBQUssRUFBRSxTQUFTO3lCQUNoQixFQUNELENBQUM7b0JBRUYsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7b0JBQ3hDLFdBQU87O29CQUdSLElBQ0MscUJBQVUsQ0FBQyxVQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxVQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxjQUFPLENBQUMsVUFBTSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQyxFQUN4RTt3QkFDRCxNQUFNLENBQUMsOEJBQThCLENBQUMsQ0FBQzt3QkFDdkMsWUFBWSxHQUFHLG9CQUFJLENBQ2xCLFVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGNBQU8sQ0FBQyxVQUFNLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxFQUM3RCxPQUFPLENBQUMsSUFBSSxFQUNaOzRCQUNDLEdBQUcsRUFBRSxVQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQU0sQ0FBQyxHQUFHOzRCQUM5QyxRQUFRLEVBQUUsT0FBTyxDQUFDLElBQUk7eUJBQ3RCLENBQ0QsQ0FBQzt3QkFDRixXQUFPO3FCQUNQO29CQUdELE1BQU0sSUFBSSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7OztDQUNsQztBQWhERCwyQkFnREM7QUFFRCxTQUFTLFlBQVksQ0FBQyxJQUFZLEVBQUUsTUFBc0I7SUFDekQsSUFBSSxDQUFDLFVBQU0sQ0FBQyxNQUFNO1FBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQ1AsbUJBQWUsU0FBSSxlQUFLLENBQUMsTUFBTSxDQUNqQyx5QkFBeUI7WUFDeEIsZUFBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDakIsWUFBWTtZQUNaLGVBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQ25CLEVBQUUsQ0FDRCxDQUNILENBQUM7QUFDSixDQUFDO0FBRUQsU0FBZSxZQUFZOzs7Ozs7eUJBQ3RCLENBQUEsWUFBWSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQSxFQUFwQyxjQUFvQzs7OztvQkFFdEMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7b0JBQ2xELFdBQU0sSUFBSSxPQUFPLENBQU8sVUFBQyxPQUFPLEVBQUUsTUFBTTs0QkFDdkMsT0FBQSxtQkFBUSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLFVBQUMsR0FBRztnQ0FDekMsT0FBQSxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFOzRCQUE3QixDQUE2QixDQUM3Qjt3QkFGRCxDQUVDLENBQ0QsRUFBQTs7b0JBSkQsU0FJQyxDQUFDO29CQUNGLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOzs7O29CQUV6QixNQUFNLENBQUMsMEJBQTBCLEVBQUUsS0FBRyxDQUFDLENBQUM7OztvQkFFekMsWUFBWSxHQUFHLElBQUksQ0FBQzs7Ozs7O0NBRXJCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hpbGRQcm9jZXNzLCBmb3JrLCBzcGF3biB9IGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XHJcbmltcG9ydCB7IGNvbmZpZywgZHNDb25zb2xlUHJlZml4LCBuYW1lIH0gZnJvbSBcIi4uL1wiO1xyXG5cclxuaW1wb3J0IGNoYWxrIGZyb20gXCJjaGFsa1wiO1xyXG5pbXBvcnQgZGVidWcgZnJvbSBcImRlYnVnXCI7XHJcbmltcG9ydCB7IHBhdGhFeGlzdHMgfSBmcm9tIFwiZnMtZXh0cmFcIjtcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB0cmVlS2lsbCBmcm9tIFwidHJlZS1raWxsXCI7XHJcblxyXG5sZXQgY3VycmVudENoaWxkOiBDaGlsZFByb2Nlc3MgfCBudWxsID0gbnVsbDtcclxuY29uc3QgbG9nZ2VyID0gZGVidWcoYCR7bmFtZX06Y2hpbGRIYW5kbGVyYCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBydW5DaGlsZCgpIHtcclxuXHRsZXQgcHJvamVjdEpTT046IGFueSA9IG51bGw7XHJcblxyXG5cdHRyeSB7XHJcblx0XHRwcm9qZWN0SlNPTiA9IHJlcXVpcmUocmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCBcInBhY2thZ2UuanNvblwiKSk7XHJcblx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRsb2dnZXIoXCJObyBwYWNrYWdlLmpzb24gZm91bmRcIik7XHJcblx0fVxyXG5cclxuXHRhd2FpdCBraWxsT2xkQ2hpbGQoKTtcclxuXHJcblx0aWYgKCFjb25maWcuZW50cnkgJiYgcHJvamVjdEpTT04/LnNjcmlwdHM/LnN0YXJ0KSB7XHJcblx0XHRsb2dnZXIoXCJTdGFydGluZyB3aXRoIHN0YXJ0IHNjcmlwdCBmcm9tIHByb2plY3QuanNvblwiKTtcclxuXHRcdGN1cnJlbnRDaGlsZCA9IHNwYXduKFxyXG5cdFx0XHQoYXdhaXQgcGF0aEV4aXN0cyhwcm9jZXNzLmN3ZCgpICsgXCIveWFybi5sb2NrXCIpKVxyXG5cdFx0XHRcdD8gXCJ5YXJuIHJ1biAtLXNpbGVudCBzdGFydFwiXHJcblx0XHRcdFx0OiBcIm5wbSBydW4gLS1zaWxlbnQgc3RhcnRcIixcclxuXHRcdFx0cHJvY2Vzcy5hcmd2LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0Y3dkOiBwcm9jZXNzLmN3ZCgpLFxyXG5cdFx0XHRcdGFyZ3YwOiBwcm9jZXNzLmFyZ3YwLFxyXG5cdFx0XHRcdGVudjogcHJvY2Vzcy5lbnYsXHJcblx0XHRcdFx0c2hlbGw6IHRydWUsXHJcblx0XHRcdFx0c3RkaW86IFwiaW5oZXJpdFwiXHJcblx0XHRcdH1cclxuXHRcdCk7XHJcblxyXG5cdFx0Y3VycmVudENoaWxkLm9uY2UoXCJleGl0XCIsIG9uQ2hpbGREZWF0aCk7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHRpZiAoXHJcblx0XHRwYXRoRXhpc3RzKGNvbmZpZy5lbnRyeSA/IGNvbmZpZy5lbnRyeSA6IHJlc29sdmUoY29uZmlnLm91dCwgXCJpbmRleC5qc1wiKSlcclxuXHQpIHtcclxuXHRcdGxvZ2dlcihcIlN0YXJ0aW5nIHdpdGggZW50cnkgaW5kZXguanNcIik7XHJcblx0XHRjdXJyZW50Q2hpbGQgPSBmb3JrKFxyXG5cdFx0XHRjb25maWcuZW50cnkgPyBjb25maWcuZW50cnkgOiByZXNvbHZlKGNvbmZpZy5vdXQsIFwiaW5kZXguanNcIiksXHJcblx0XHRcdHByb2Nlc3MuYXJndixcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGN3ZDogY29uZmlnLmVudHJ5ID8gcHJvY2Vzcy5jd2QoKSA6IGNvbmZpZy5vdXQsXHJcblx0XHRcdFx0ZXhlY0FyZ3Y6IHByb2Nlc3MuYXJndlxyXG5cdFx0XHR9XHJcblx0XHQpO1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0Ly9UT0RPIEJldHRlciBtZXNzYWdlXHJcblx0dGhyb3cgbmV3IEVycm9yKFwiTm8gZW50cnkgZm91bmRcIik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9uQ2hpbGREZWF0aChjb2RlOiBudW1iZXIsIHNpZ25hbDogTm9kZUpTLlNpZ25hbHMpIHtcclxuXHRpZiAoIWNvbmZpZy5zaWxlbnQpXHJcblx0XHRjb25zb2xlLmxvZyhcclxuXHRcdFx0YCR7ZHNDb25zb2xlUHJlZml4fSAke2NoYWxrLnllbGxvdyhcclxuXHRcdFx0XHRcIlByb2Nlc3MgZXhpdCB3aXRoIGNvZGUgXCIgK1xyXG5cdFx0XHRcdFx0Y2hhbGsud2hpdGUoY29kZSkgK1xyXG5cdFx0XHRcdFx0XCIsIHNpZ25hbDogXCIgK1xyXG5cdFx0XHRcdFx0Y2hhbGsud2hpdGUoc2lnbmFsKSArXHJcblx0XHRcdFx0XHRcIlwiXHJcblx0XHRcdCl9YFxyXG5cdFx0KTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24ga2lsbE9sZENoaWxkKCkge1xyXG5cdGlmIChjdXJyZW50Q2hpbGQgJiYgIWN1cnJlbnRDaGlsZC5raWxsZWQpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGN1cnJlbnRDaGlsZC5yZW1vdmVMaXN0ZW5lcihcImV4aXRcIiwgb25DaGlsZERlYXRoKTtcclxuXHRcdFx0YXdhaXQgbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT5cclxuXHRcdFx0XHR0cmVlS2lsbChjdXJyZW50Q2hpbGQucGlkLCBcIlNJR0tJTExcIiwgKGVycikgPT5cclxuXHRcdFx0XHRcdGVyciA/IHJlamVjdChlcnIpIDogcmVzb2x2ZSgpXHJcblx0XHRcdFx0KVxyXG5cdFx0XHQpO1xyXG5cdFx0XHRsb2dnZXIoXCJLaWxsIG9sZCBjaGlsZFwiKTtcclxuXHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRsb2dnZXIoXCJGYWlsZWQgdG8ga2lsbCBvbGQgY2hpbGRcIiwgZXJyKTtcclxuXHRcdH1cclxuXHRcdGN1cnJlbnRDaGlsZCA9IG51bGw7XHJcblx0fVxyXG59XHJcbiJdfQ==