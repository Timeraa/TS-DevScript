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
var chokidar_1 = __importDefault(require("chokidar"));
var path_1 = require("path");
var __1 = require("../");
var childHandler_1 = __importDefault(require("./childHandler"));
var copyTask_1 = __importDefault(require("./copyTask"));
function runFileWatcher() {
    return __awaiter(this, void 0, void 0, function () {
        var watcher;
        var _this = this;
        return __generator(this, function (_a) {
            watcher = chokidar_1.default.watch(__1.config.src, {
                ignored: ["**/*.ts", __1.config.ignore],
                persistent: true,
                cwd: process.cwd(),
                ignoreInitial: true
            });
            if (__1.config.include)
                chokidar_1.default
                    .watch(__1.config.include, { persistent: true, ignoreInitial: true })
                    .on("all", function (e, p) { return watcher.emit("all", e, p); });
            watcher.on("all", function (event, path) { return __awaiter(_this, void 0, void 0, function () {
                var fileEvent;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fileEvent = "changed";
                            switch (event) {
                                case "add":
                                    fileEvent = "added";
                                    break;
                                case "unlink":
                                    fileEvent = "deleted";
                                    break;
                            }
                            if (!__1.config.silent)
                                console.log(__1.dsConsolePrefix +
                                    chalk_1.default.yellowBright(" ".concat(chalk_1.default.cyan((0, path_1.basename)(path)), " ").concat(fileEvent, ", restarting\u2026")));
                            return [4 /*yield*/, (0, copyTask_1.default)()];
                        case 1:
                            _a.sent();
                            (0, childHandler_1.default)();
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    });
}
exports.default = runFileWatcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZVdhdGNoZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbC9maWxlV2F0Y2hlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGdEQUEwQjtBQUMxQixzREFBZ0M7QUFDaEMsNkJBQWdDO0FBRWhDLHlCQUE4QztBQUM5QyxnRUFBc0M7QUFDdEMsd0RBQWtDO0FBRWxDLFNBQThCLGNBQWM7Ozs7O1lBQ3JDLE9BQU8sR0FBRyxrQkFBUSxDQUFDLEtBQUssQ0FBQyxVQUFNLENBQUMsR0FBRyxFQUFFO2dCQUMxQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsVUFBTSxDQUFDLE1BQU0sQ0FBQztnQkFDbkMsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxFQUFFO2dCQUNsQixhQUFhLEVBQUUsSUFBSTthQUNuQixDQUFDLENBQUM7WUFFSCxJQUFJLFVBQU0sQ0FBQyxPQUFPO2dCQUNqQixrQkFBUTtxQkFDTixLQUFLLENBQUMsVUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxDQUFDO3FCQUNoRSxFQUFFLENBQUMsS0FBSyxFQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBekIsQ0FBeUIsQ0FBQyxDQUFDO1lBRWxELE9BQU8sQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLFVBQU8sS0FBSyxFQUFFLElBQUk7Ozs7OzRCQUMvQixTQUFTLEdBQVcsU0FBUyxDQUFDOzRCQUNsQyxRQUFRLEtBQUssRUFBRTtnQ0FDZCxLQUFLLEtBQUs7b0NBQ1QsU0FBUyxHQUFHLE9BQU8sQ0FBQztvQ0FDcEIsTUFBTTtnQ0FDUCxLQUFLLFFBQVE7b0NBQ1osU0FBUyxHQUFHLFNBQVMsQ0FBQztvQ0FDdEIsTUFBTTs2QkFDUDs0QkFFRCxJQUFJLENBQUMsVUFBTSxDQUFDLE1BQU07Z0NBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQ1YsbUJBQWU7b0NBQ2QsZUFBSyxDQUFDLFlBQVksQ0FDakIsV0FBSSxlQUFLLENBQUMsSUFBSSxDQUFDLElBQUEsZUFBUSxFQUFDLElBQUksQ0FBQyxDQUFDLGNBQUksU0FBUyx1QkFBZSxDQUMxRCxDQUNGLENBQUM7NEJBRUgscUJBQU0sSUFBQSxrQkFBUSxHQUFFLEVBQUE7OzRCQUFoQixTQUFnQixDQUFDOzRCQUNqQixJQUFBLHNCQUFRLEdBQUUsQ0FBQzs7OztpQkFDWCxDQUFDLENBQUM7Ozs7Q0FDSDtBQW5DRCxpQ0FtQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2hhbGsgZnJvbSBcImNoYWxrXCI7XHJcbmltcG9ydCBjaG9raWRhciBmcm9tIFwiY2hva2lkYXJcIjtcclxuaW1wb3J0IHsgYmFzZW5hbWUgfSBmcm9tIFwicGF0aFwiO1xyXG5cclxuaW1wb3J0IHsgY29uZmlnLCBkc0NvbnNvbGVQcmVmaXggfSBmcm9tIFwiLi4vXCI7XHJcbmltcG9ydCBydW5DaGlsZCBmcm9tIFwiLi9jaGlsZEhhbmRsZXJcIjtcclxuaW1wb3J0IGNvcHlUYXNrIGZyb20gXCIuL2NvcHlUYXNrXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBydW5GaWxlV2F0Y2hlcigpIHtcclxuXHRjb25zdCB3YXRjaGVyID0gY2hva2lkYXIud2F0Y2goY29uZmlnLnNyYywge1xyXG5cdFx0aWdub3JlZDogW1wiKiovKi50c1wiLCBjb25maWcuaWdub3JlXSxcclxuXHRcdHBlcnNpc3RlbnQ6IHRydWUsXHJcblx0XHRjd2Q6IHByb2Nlc3MuY3dkKCksXHJcblx0XHRpZ25vcmVJbml0aWFsOiB0cnVlXHJcblx0fSk7XHJcblxyXG5cdGlmIChjb25maWcuaW5jbHVkZSlcclxuXHRcdGNob2tpZGFyXHJcblx0XHRcdC53YXRjaChjb25maWcuaW5jbHVkZSwgeyBwZXJzaXN0ZW50OiB0cnVlLCBpZ25vcmVJbml0aWFsOiB0cnVlIH0pXHJcblx0XHRcdC5vbihcImFsbFwiLCAoZSwgcCkgPT4gd2F0Y2hlci5lbWl0KFwiYWxsXCIsIGUsIHApKTtcclxuXHJcblx0d2F0Y2hlci5vbihcImFsbFwiLCBhc3luYyAoZXZlbnQsIHBhdGgpID0+IHtcclxuXHRcdGxldCBmaWxlRXZlbnQ6IHN0cmluZyA9IFwiY2hhbmdlZFwiO1xyXG5cdFx0c3dpdGNoIChldmVudCkge1xyXG5cdFx0XHRjYXNlIFwiYWRkXCI6XHJcblx0XHRcdFx0ZmlsZUV2ZW50ID0gXCJhZGRlZFwiO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIFwidW5saW5rXCI6XHJcblx0XHRcdFx0ZmlsZUV2ZW50ID0gXCJkZWxldGVkXCI7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCFjb25maWcuc2lsZW50KVxyXG5cdFx0XHRjb25zb2xlLmxvZyhcclxuXHRcdFx0XHRkc0NvbnNvbGVQcmVmaXggK1xyXG5cdFx0XHRcdFx0Y2hhbGsueWVsbG93QnJpZ2h0KFxyXG5cdFx0XHRcdFx0XHRgICR7Y2hhbGsuY3lhbihiYXNlbmFtZShwYXRoKSl9ICR7ZmlsZUV2ZW50fSwgcmVzdGFydGluZ+KApmBcclxuXHRcdFx0XHRcdClcclxuXHRcdFx0KTtcclxuXHJcblx0XHRhd2FpdCBjb3B5VGFzaygpO1xyXG5cdFx0cnVuQ2hpbGQoKTtcclxuXHR9KTtcclxufVxyXG4iXX0=