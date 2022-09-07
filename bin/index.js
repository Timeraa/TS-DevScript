#!/usr/bin/env node
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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.contributors = exports.author = exports.version = exports.description = exports.name = exports.dsConsolePrefix = void 0;
require("source-map-support/register");
var path_1 = require("path");
var configHandler_1 = __importDefault(require("./util/configHandler"));
var chalk_1 = __importDefault(require("chalk"));
var depCheck_1 = __importDefault(require("./util/depCheck"));
var todoCheck_1 = __importDefault(require("./util/todoCheck"));
var copyTask_1 = __importDefault(require("./util/copyTask"));
var fileWatcher_1 = __importDefault(require("./util/fileWatcher"));
var tsCompiler_1 = __importDefault(require("./util/tsCompiler"));
exports.dsConsolePrefix = "● ", exports.name = (_a = require("../package.json"), _a.name), exports.description = _a.description, exports.version = _a.version, exports.author = _a.author, exports.contributors = _a.contributors;
exports.config = (0, configHandler_1.default)();
function run() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!exports.config.copyOnly) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, copyTask_1.default)()];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    if (!exports.config.silent)
                        console.log(chalk_1.default.green("".concat(chalk_1.default.white(exports.dsConsolePrefix), "Launching ").concat(chalk_1.default.bold("DevScript"), " ").concat(chalk_1.default.hex("#bebebe")("(v" + exports.version + ")"), " on ").concat(chalk_1.default.bold((0, path_1.basename)(process.cwd())), "\u2026")));
                    (0, fileWatcher_1.default)();
                    if (!exports.config.depCheck) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, depCheck_1.default)()];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    if (!(!exports.config.silent && exports.config.todoCheck)) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, todoCheck_1.default)()];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    (0, tsCompiler_1.default)();
                    return [2 /*return*/];
            }
        });
    });
}
run();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSx1Q0FBcUM7QUFFckMsNkJBQWdDO0FBQ2hDLHVFQUF1QztBQUN2QyxnREFBMEI7QUFDMUIsNkRBQXdDO0FBQ3hDLCtEQUEwQztBQUMxQyw2REFBdUM7QUFDdkMsbUVBQWdEO0FBQ2hELGlFQUE4QztBQUVqQyxRQUFBLGVBQWUsR0FBRyxJQUFJLEVBRWpDLFFBQUEsSUFBSSxJQURMLEtBWUksT0FBTyxDQUFDLGlCQUFpQixDQUFDLFlBVjdCLFFBQUEsV0FBVyxtQkFDWCxRQUFBLE9BQU8sZUFDUCxRQUFBLE1BQU0sY0FDTixRQUFBLFlBQVksbUJBT2tCO0FBRW5CLFFBQUEsTUFBTSxHQUFHLElBQUEsdUJBQUcsR0FBRSxDQUFDO0FBRTVCLFNBQWUsR0FBRzs7Ozs7eUJBQ2IsY0FBTSxDQUFDLFFBQVEsRUFBZix3QkFBZTtvQkFBUyxxQkFBTSxJQUFBLGtCQUFRLEdBQUUsRUFBQTt3QkFBdkIsc0JBQU8sU0FBZ0IsRUFBQzs7b0JBRTdDLElBQUksQ0FBQyxjQUFNLENBQUMsTUFBTTt3QkFDakIsT0FBTyxDQUFDLEdBQUcsQ0FDVixlQUFLLENBQUMsS0FBSyxDQUNWLFVBQUcsZUFBSyxDQUFDLEtBQUssQ0FBQyx1QkFBZSxDQUFDLHVCQUFhLGVBQUssQ0FBQyxJQUFJLENBQ3JELFdBQVcsQ0FDWCxjQUFJLGVBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxHQUFHLGVBQU8sR0FBRyxHQUFHLENBQUMsaUJBQU8sZUFBSyxDQUFDLElBQUksQ0FDL0QsSUFBQSxlQUFRLEVBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQ3ZCLFdBQUcsQ0FDSixDQUNELENBQUM7b0JBRUgsSUFBQSxxQkFBYyxHQUFFLENBQUM7eUJBRWIsY0FBTSxDQUFDLFFBQVEsRUFBZix3QkFBZTtvQkFBRSxxQkFBTSxJQUFBLGtCQUFTLEdBQUUsRUFBQTs7b0JBQWpCLFNBQWlCLENBQUM7Ozt5QkFDbkMsQ0FBQSxDQUFDLGNBQU0sQ0FBQyxNQUFNLElBQUksY0FBTSxDQUFDLFNBQVMsQ0FBQSxFQUFsQyx3QkFBa0M7b0JBQUUscUJBQU0sSUFBQSxtQkFBVSxHQUFFLEVBQUE7O29CQUFsQixTQUFrQixDQUFDOzs7b0JBRTNELElBQUEsb0JBQWEsR0FBRSxDQUFDOzs7OztDQUNoQjtBQUVELEdBQUcsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxyXG5cclxuaW1wb3J0IFwic291cmNlLW1hcC1zdXBwb3J0L3JlZ2lzdGVyXCI7XHJcblxyXG5pbXBvcnQgeyBiYXNlbmFtZSB9IGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCBjZmcgZnJvbSBcIi4vdXRpbC9jb25maWdIYW5kbGVyXCI7XHJcbmltcG9ydCBjaGFsayBmcm9tIFwiY2hhbGtcIjtcclxuaW1wb3J0IGNoZWNrRGVwcyBmcm9tIFwiLi91dGlsL2RlcENoZWNrXCI7XHJcbmltcG9ydCBjaGVja1RvZG9zIGZyb20gXCIuL3V0aWwvdG9kb0NoZWNrXCI7XHJcbmltcG9ydCBjb3B5VGFzayBmcm9tIFwiLi91dGlsL2NvcHlUYXNrXCI7XHJcbmltcG9ydCBydW5GaWxlV2F0Y2hlciBmcm9tIFwiLi91dGlsL2ZpbGVXYXRjaGVyXCI7XHJcbmltcG9ydCBydW5UU0NvbXBpbGVyIGZyb20gXCIuL3V0aWwvdHNDb21waWxlclwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGRzQ29uc29sZVByZWZpeCA9IFwi4pePIFwiLFxyXG5cdHtcclxuXHRcdG5hbWUsXHJcblx0XHRkZXNjcmlwdGlvbixcclxuXHRcdHZlcnNpb24sXHJcblx0XHRhdXRob3IsXHJcblx0XHRjb250cmlidXRvcnNcclxuXHR9OiB7XHJcblx0XHRuYW1lOiBzdHJpbmc7XHJcblx0XHRkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG5cdFx0dmVyc2lvbjogc3RyaW5nO1xyXG5cdFx0YXV0aG9yOiBzdHJpbmc7XHJcblx0XHRjb250cmlidXRvcnM6IHN0cmluZ1tdO1xyXG5cdH0gPSByZXF1aXJlKFwiLi4vcGFja2FnZS5qc29uXCIpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IGNmZygpO1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gcnVuKCkge1xyXG5cdGlmIChjb25maWcuY29weU9ubHkpIHJldHVybiBhd2FpdCBjb3B5VGFzaygpO1xyXG5cclxuXHRpZiAoIWNvbmZpZy5zaWxlbnQpXHJcblx0XHRjb25zb2xlLmxvZyhcclxuXHRcdFx0Y2hhbGsuZ3JlZW4oXHJcblx0XHRcdFx0YCR7Y2hhbGsud2hpdGUoZHNDb25zb2xlUHJlZml4KX1MYXVuY2hpbmcgJHtjaGFsay5ib2xkKFxyXG5cdFx0XHRcdFx0XCJEZXZTY3JpcHRcIlxyXG5cdFx0XHRcdCl9ICR7Y2hhbGsuaGV4KFwiI2JlYmViZVwiKShcIih2XCIgKyB2ZXJzaW9uICsgXCIpXCIpfSBvbiAke2NoYWxrLmJvbGQoXHJcblx0XHRcdFx0XHRiYXNlbmFtZShwcm9jZXNzLmN3ZCgpKVxyXG5cdFx0XHRcdCl94oCmYFxyXG5cdFx0XHQpXHJcblx0XHQpO1xyXG5cclxuXHRydW5GaWxlV2F0Y2hlcigpO1xyXG5cclxuXHRpZiAoY29uZmlnLmRlcENoZWNrKSBhd2FpdCBjaGVja0RlcHMoKTtcclxuXHRpZiAoIWNvbmZpZy5zaWxlbnQgJiYgY29uZmlnLnRvZG9DaGVjaykgYXdhaXQgY2hlY2tUb2RvcygpO1xyXG5cclxuXHRydW5UU0NvbXBpbGVyKCk7XHJcbn1cclxuXHJcbnJ1bigpO1xyXG4iXX0=