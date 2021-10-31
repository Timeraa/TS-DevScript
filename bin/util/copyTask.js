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
var debug_1 = __importDefault(require("debug"));
var fast_glob_1 = __importDefault(require("fast-glob"));
var fs_extra_1 = require("fs-extra");
var path_1 = require("path");
var __1 = require("../");
var logger = (0, debug_1.default)(__1.name + ":copyTask");
function copyTask() {
    return __awaiter(this, void 0, void 0, function () {
        var pkgChecks, copyTasks;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger("Copying files to " + __1.config.out);
                    return [4, Promise.all([
                            (0, fs_extra_1.pathExists)("package.json"),
                            (0, fs_extra_1.pathExists)("package-lock.json"),
                            (0, fs_extra_1.pathExists)("yarn.lock")
                        ])];
                case 1:
                    pkgChecks = _a.sent();
                    copyTasks = [];
                    if (pkgChecks[0])
                        copyTasks.push((0, fs_extra_1.copy)("package.json", (0, path_1.resolve)(__1.config.out, "package.json")));
                    if (pkgChecks[1])
                        copyTasks.push((0, fs_extra_1.copy)("package-lock.json", (0, path_1.resolve)(__1.config.out, "package-lock.json")));
                    if (pkgChecks[2])
                        copyTasks.push((0, fs_extra_1.copy)("yarn.lock", (0, path_1.resolve)(__1.config.out, "yarn.lock")));
                    copyTasks.push((0, fs_extra_1.copy)(__1.config.src, __1.config.out, {
                        filter: function (path) {
                            if (path.includes("/node_modules"))
                                return false;
                            return (0, path_1.extname)(path) !== ".ts";
                        }
                    }));
                    if (!__1.config.include) return [3, 3];
                    return [4, (0, fast_glob_1.default)(__1.config.include)];
                case 2:
                    (_a.sent()).forEach(function (e) {
                        return copyTasks.push((0, fs_extra_1.copy)(e, (0, path_1.join)(__1.config.out, (0, path_1.basename)(e))));
                    });
                    _a.label = 3;
                case 3: return [4, Promise.all([copyTasks, deleteObsolete()])];
                case 4:
                    _a.sent();
                    logger("Copied files from " + __1.config.src + " to " + __1.config.out);
                    return [2];
            }
        });
    });
}
exports.default = copyTask;
function deleteObsolete() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, dist, src, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = !__1.config.deleteObsolete;
                    if (_a) return [3, 2];
                    return [4, (0, fs_extra_1.pathExists)((0, path_1.resolve)(__1.config.out))];
                case 1:
                    _a = !(_e.sent());
                    _e.label = 2;
                case 2:
                    if (_a)
                        return [2];
                    logger("Deleting obsolete files…");
                    return [4, (0, fast_glob_1.default)("**/*", {
                            cwd: __1.config.out,
                            onlyFiles: true
                        })];
                case 3:
                    dist = _e.sent();
                    return [4, (0, fast_glob_1.default)("**/*", {
                            cwd: __1.config.src,
                            onlyFiles: true
                        })];
                case 4:
                    src = _e.sent();
                    if (!__1.config.include) return [3, 6];
                    _c = (_b = src.push).apply;
                    _d = [src];
                    return [4, (0, fast_glob_1.default)(__1.config.include, { onlyFiles: true })];
                case 5:
                    _c.apply(_b, _d.concat([(_e.sent())]));
                    _e.label = 6;
                case 6:
                    src.push("package.json", "package-lock.json", "yarn.lock");
                    src = src
                        .map(function (f) { return f.split(".")[0]; })
                        .filter(function (sf) { return dist.find(function (d) { return d.split(".")[0] == sf; }); });
                    return [4, Promise.all(dist
                            .filter(function (f) { return !src.includes((f.startsWith(__1.config.out) ? f.replace(__1.config.out, "") : f).split(".")[0]); })
                            .map(function (f) { return (0, fs_extra_1.remove)((0, path_1.resolve)(__1.config.out, f)); }))];
                case 7:
                    _e.sent();
                    logger("Deleted obsolete files");
                    return [2];
            }
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29weVRhc2suanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInV0aWwvY29weVRhc2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxnREFBMEI7QUFDMUIsd0RBQTZCO0FBQzdCLHFDQUFvRDtBQUNwRCw2QkFBd0Q7QUFFeEQseUJBQW1DO0FBRW5DLElBQU0sTUFBTSxHQUFHLElBQUEsZUFBSyxFQUFJLFFBQUksY0FBVyxDQUFDLENBQUM7QUFFekMsU0FBOEIsUUFBUTs7Ozs7O29CQUNyQyxNQUFNLENBQUMsc0JBQW9CLFVBQU0sQ0FBQyxHQUFLLENBQUMsQ0FBQztvQkFDdkIsV0FBTSxPQUFPLENBQUMsR0FBRyxDQUFDOzRCQUNuQyxJQUFBLHFCQUFVLEVBQUMsY0FBYyxDQUFDOzRCQUMxQixJQUFBLHFCQUFVLEVBQUMsbUJBQW1CLENBQUM7NEJBQy9CLElBQUEscUJBQVUsRUFBQyxXQUFXLENBQUM7eUJBQ3ZCLENBQUMsRUFBQTs7b0JBSkksU0FBUyxHQUFHLFNBSWhCO29CQUVFLFNBQVMsR0FBb0IsRUFBRSxDQUFDO29CQUVwQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQ2YsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFBLGVBQUksRUFBQyxjQUFjLEVBQUUsSUFBQSxjQUFPLEVBQUMsVUFBTSxDQUFDLEdBQUcsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzNFLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQzt3QkFDZixTQUFTLENBQUMsSUFBSSxDQUNiLElBQUEsZUFBSSxFQUFDLG1CQUFtQixFQUFFLElBQUEsY0FBTyxFQUFDLFVBQU0sQ0FBQyxHQUFHLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyxDQUNuRSxDQUFDO29CQUNILElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQzt3QkFDZixTQUFTLENBQUMsSUFBSSxDQUFDLElBQUEsZUFBSSxFQUFD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QUUsRUFBckIsQ0FBcUIsQ0FBQyxFQUF2QyxDQUF1QyxDQUFDLENBQUM7b0JBRzFELFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FDaEIsSUFBSTs2QkFDRixNQUFNLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFNLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBdkYsQ0FBdUYsQ0FBQzs2QkFDdEcsR0FBRyxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsSUFBQSxpQkFBTSxFQUFDLElBQUEsY0FBTyxFQUFDLFVBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBOUIsQ0FBOEIsQ0FBQyxDQUM1QyxFQUFBOztvQkFKRCxTQUlDLENBQUM7b0JBQ0YsTUFBTSxDQUFDLHdCQUF3QixDQUFDLENBQUM7Ozs7O0NBQ2pDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRlYnVnIGZyb20gXCJkZWJ1Z1wiO1xyXG5pbXBvcnQgZ2xvYiBmcm9tIFwiZmFzdC1nbG9iXCI7XHJcbmltcG9ydCB7IGNvcHksIHBhdGhFeGlzdHMsIHJlbW92ZSB9IGZyb20gXCJmcy1leHRyYVwiO1xyXG5pbXBvcnQgeyBiYXNlbmFtZSwgZXh0bmFtZSwgam9pbiwgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XHJcblxyXG5pbXBvcnQgeyBjb25maWcsIG5hbWUgfSBmcm9tIFwiLi4vXCI7XHJcblxyXG5jb25zdCBsb2dnZXIgPSBkZWJ1ZyhgJHtuYW1lfTpjb3B5VGFza2ApO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gY29weVRhc2soKSB7XHJcblx0bG9nZ2VyKGBDb3B5aW5nIGZpbGVzIHRvICR7Y29uZmlnLm91dH1gKTtcclxuXHRjb25zdCBwa2dDaGVja3MgPSBhd2FpdCBQcm9taXNlLmFsbChbXHJcblx0XHRwYXRoRXhpc3RzKFwicGFja2FnZS5qc29uXCIpLFxyXG5cdFx0cGF0aEV4aXN0cyhcInBhY2thZ2UtbG9jay5qc29uXCIpLFxyXG5cdFx0cGF0aEV4aXN0cyhcInlhcm4ubG9ja1wiKVxyXG5cdF0pO1xyXG5cclxuXHRsZXQgY29weVRhc2tzOiBQcm9taXNlPHZvaWQ+W10gPSBbXTtcclxuXHJcblx0aWYgKHBrZ0NoZWNrc1swXSlcclxuXHRcdGNvcHlUYXNrcy5wdXNoKGNvcHkoXCJwYWNrYWdlLmpzb25cIiwgcmVzb2x2ZShjb25maWcub3V0LCBgcGFja2FnZS5qc29uYCkpKTtcclxuXHRpZiAocGtnQ2hlY2tzWzFdKVxyXG5cdFx0Y29weVRhc2tzLnB1c2goXHJcblx0XHRcdGNvcHkoXCJwYWNrYWdlLWxvY2suanNvblwiLCByZXNvbHZlKGNvbmZpZy5vdXQsIGBwYWNrYWdlLWxvY2suanNvbmApKVxyXG5cdFx0KTtcclxuXHRpZiAocGtnQ2hlY2tzWzJdKVxyXG5cdFx0Y29weVRhc2tzLnB1c2goY29weShcInlhcm4ubG9ja1wiLCByZXNvbHZlKGNvbmZpZy5vdXQsIGB5YXJuLmxvY2tgKSkpO1xyXG5cclxuXHQvLyogQ29weSBmaWxlcyBmcm9tIHNyYyB0byBkaXN0XHJcblx0Y29weVRhc2tzLnB1c2goXHJcblx0XHRjb3B5KGNvbmZpZy5zcmMsIGNvbmZpZy5vdXQsIHtcclxuXHRcdFx0ZmlsdGVyOiBmdW5jdGlvbiAocGF0aCkge1xyXG5cdFx0XHRcdGlmIChwYXRoLmluY2x1ZGVzKFwiL25vZGVfbW9kdWxlc1wiKSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdHJldHVybiBleHRuYW1lKHBhdGgpICE9PSBcIi50c1wiO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdCk7XHJcblxyXG5cdGlmIChjb25maWcuaW5jbHVkZSlcclxuXHRcdChhd2FpdCBnbG9iKGNvbmZpZy5pbmNsdWRlKSkuZm9yRWFjaCgoZSkgPT5cclxuXHRcdFx0Y29weVRhc2tzLnB1c2goY29weShlLCBqb2luKGNvbmZpZy5vdXQsIGJhc2VuYW1lKGUpKSkpXHJcblx0XHQpO1xyXG5cclxuXHRhd2FpdCBQcm9taXNlLmFsbChbY29weVRhc2tzLCBkZWxldGVPYnNvbGV0ZSgpXSk7XHJcblx0bG9nZ2VyKGBDb3BpZWQgZmlsZXMgZnJvbSAke2NvbmZpZy5zcmN9IHRvICR7Y29uZmlnLm91dH1gKTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZGVsZXRlT2Jzb2xldGUoKSB7XHJcblx0aWYgKCFjb25maWcuZGVsZXRlT2Jzb2xldGUgfHwgIShhd2FpdCBwYXRoRXhpc3RzKHJlc29sdmUoY29uZmlnLm91dCkpKSlcclxuXHRcdHJldHVybjtcclxuXHJcblx0bG9nZ2VyKFwiRGVsZXRpbmcgb2Jzb2xldGUgZmlsZXPigKZcIik7XHJcblx0Ly8qIFNlbGVjdCBmaWxlc1xyXG5cdGxldCBkaXN0ID0gYXdhaXQgZ2xvYihcIioqLypcIiwge1xyXG5cdFx0XHRjd2Q6IGNvbmZpZy5vdXQsXHJcblx0XHRcdG9ubHlGaWxlczogdHJ1ZVxyXG5cdFx0fSksXHJcblx0XHRzcmMgPSBhd2FpdCBnbG9iKFwiKiovKlwiLCB7XHJcblx0XHRcdGN3ZDogY29uZmlnLnNyYyxcclxuXHRcdFx0b25seUZpbGVzOiB0cnVlXHJcblx0XHR9KTtcclxuXHJcblx0aWYgKGNvbmZpZy5pbmNsdWRlKVxyXG5cdFx0c3JjLnB1c2goLi4uKGF3YWl0IGdsb2IoY29uZmlnLmluY2x1ZGUsIHsgb25seUZpbGVzOiB0cnVlIH0pKSk7XHJcblxyXG5cdHNyYy5wdXNoKFwicGFja2FnZS5qc29uXCIsIFwicGFja2FnZS1sb2NrLmpzb25cIiwgXCJ5YXJuLmxvY2tcIik7XHJcblxyXG5cdC8vKiBGaWx0ZXIgZmlsZSBkaWZmZXJlbmNlc1xyXG5cdHNyYyA9IHNyY1xyXG5cdFx0Lm1hcCgoZikgPT4gZi5zcGxpdChcIi5cIilbMF0pXHJcblx0XHQuZmlsdGVyKChzZikgPT4gZGlzdC5maW5kKChkKSA9PiBkLnNwbGl0KFwiLlwiKVswXSA9PSBzZikpO1xyXG5cclxuXHQvLyogT2xkIGZpbGVzLCBkZWxldGVcclxuXHRhd2FpdCBQcm9taXNlLmFsbChcclxuXHRcdGRpc3RcclxuXHRcdFx0LmZpbHRlcigoZikgPT4gIXNyYy5pbmNsdWRlcygoZi5zdGFydHNXaXRoKGNvbmZpZy5vdXQpID8gZi5yZXBsYWNlKGNvbmZpZy5vdXQsIFwiXCIpIDogZikuc3BsaXQoXCIuXCIpWzBdKSlcclxuXHRcdFx0Lm1hcCgoZikgPT4gcmVtb3ZlKHJlc29sdmUoY29uZmlnLm91dCwgZikpKVxyXG5cdCk7XHJcblx0bG9nZ2VyKFwiRGVsZXRlZCBvYnNvbGV0ZSBmaWxlc1wiKTtcclxufVxyXG4iXX0=