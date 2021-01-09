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
var logger = debug_1.default(__1.name + ":copyTask");
function copyTask() {
    return __awaiter(this, void 0, void 0, function () {
        var pkgChecks, copyTasks;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger("Copying files to " + __1.config.out);
                    return [4, Promise.all([
                            fs_extra_1.pathExists("package.json"),
                            fs_extra_1.pathExists("package-lock.json"),
                            fs_extra_1.pathExists("yarn.lock")
                        ])];
                case 1:
                    pkgChecks = _a.sent();
                    copyTasks = [];
                    if (pkgChecks[0])
                        copyTasks.push(fs_extra_1.copy("package.json", path_1.resolve(__1.config.out, "package.json")));
                    if (pkgChecks[1])
                        copyTasks.push(fs_extra_1.copy("package-lock.json", path_1.resolve(__1.config.out, "package-lock.json")));
                    if (pkgChecks[2])
                        copyTasks.push(fs_extra_1.copy("yarn.lock", path_1.resolve(__1.config.out, "yarn.lock")));
                    copyTasks.push(fs_extra_1.copy(__1.config.src, __1.config.out, {
                        filter: function (path) {
                            if (path.includes("/node_modules"))
                                return false;
                            return path_1.extname(path) !== ".ts";
                        }
                    }));
                    if (!__1.config.include) return [3, 3];
                    return [4, fast_glob_1.default(__1.config.include)];
                case 2:
                    (_a.sent()).forEach(function (e) {
                        return copyTasks.push(fs_extra_1.copy(e, path_1.join(__1.config.out, path_1.basename(e))));
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
                    return [4, fs_extra_1.pathExists(path_1.resolve(__1.config.out))];
                case 1:
                    _a = !(_e.sent());
                    _e.label = 2;
                case 2:
                    if (_a)
                        return [2];
                    logger("Deleting obsolete files…");
                    return [4, fast_glob_1.default("**/*", {
                            cwd: __1.config.out,
                            onlyFiles: true
                        })];
                case 3:
                    dist = _e.sent();
                    return [4, fast_glob_1.default("**/*", {
                            cwd: __1.config.src,
                            onlyFiles: true
                        })];
                case 4:
                    src = _e.sent();
                    if (!__1.config.include) return [3, 6];
                    _c = (_b = src.push).apply;
                    _d = [src];
                    return [4, fast_glob_1.default(__1.config.include, { onlyFiles: true })];
                case 5:
                    _c.apply(_b, _d.concat([(_e.sent())]));
                    _e.label = 6;
                case 6:
                    src.push("package.json", "package-lock.json", "yarn.lock");
                    src = src
                        .map(function (f) { return f.split(".")[0]; })
                        .filter(function (sf) { return dist.find(function (d) { return d.split(".")[0] == sf; }); });
                    return [4, Promise.all(dist
                            .filter(function (f) { return !src.includes(f.replace(__1.config.out, "").split(".")[0]); })
                            .map(function (f) { return fs_extra_1.remove(path_1.resolve(__1.config.out, f)); }))];
                case 7:
                    _e.sent();
                    logger("Deleted obsolete files");
                    return [2];
            }
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29weVRhc2suanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInV0aWwvY29weVRhc2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxnREFBMEI7QUFDMUIsd0RBQTZCO0FBQzdCLHFDQUFvRDtBQUNwRCw2QkFBd0Q7QUFFeEQseUJBQW1DO0FBRW5DLElBQU0sTUFBTSxHQUFHLGVBQUssQ0FBSSxRQUFJLGNBQVcsQ0FBQyxDQUFDO0FBRXpDLFNBQThCLFFBQVE7Ozs7OztvQkFDckMsTUFBTSxDQUFDLHNCQUFvQixVQUFNLENBQUMsR0FBSyxDQUFDLENBQUM7b0JBQ3ZCLFdBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQzs0QkFDbkMscUJBQVUsQ0FBQyxjQUFjLENBQUM7NEJBQzFCLHFCQUFVLENBQUMsbUJBQW1CLENBQUM7NEJBQy9CLHFCQUFVLENBQUMsV0FBVyxDQUFDO3lCQUN2QixDQUFDLEVBQUE7O29CQUpJLFNBQVMsR0FBRyxTQUloQjtvQkFFRSxTQUFTLEdBQW9CLEVBQUUsQ0FBQztvQkFFcEMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDO3dCQUNmLFNBQVMsQ0FBQyxJQUFJLENBQUMsZUFBSSxDQUFDLGNBQWMsRUFBRSxjQUFPLENBQUMsVUFBTSxDQUFDLEdBQUcsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzNFLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQzt3QkFDZixTQUFTLENBQUMsSUFBSSxDQUNiLGVBQUksQ0FBQyxtQkFBbUIsRUFBRSxjQUFPLENBQUMsVUFBTSxDQUFDLEdBQUcsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDLENBQ25FLENBQUM7b0JBQ0gsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDO3dCQUNmLFNBQVMsQ0FBQyxJQUFJLENBQUMsZUFBSSxDQUFDLFdBQVcsRUFBRSxjQUFPLENBQUMsVUFBTSxDQUFDLEdBQUcsRUFBRSxXQUFX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LElBQUssT0FBQSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFNLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUF0RCxDQUFzRCxDQUFDOzZCQUNyRSxHQUFHLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxpQkFBTSxDQUFDLGNBQU8sQ0FBQyxVQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQTlCLENBQThCLENBQUMsQ0FDNUMsRUFBQTs7b0JBSkQsU0FJQyxDQUFDO29CQUNGLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDOzs7OztDQUNqQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkZWJ1ZyBmcm9tIFwiZGVidWdcIjtcclxuaW1wb3J0IGdsb2IgZnJvbSBcImZhc3QtZ2xvYlwiO1xyXG5pbXBvcnQgeyBjb3B5LCBwYXRoRXhpc3RzLCByZW1vdmUgfSBmcm9tIFwiZnMtZXh0cmFcIjtcclxuaW1wb3J0IHsgYmFzZW5hbWUsIGV4dG5hbWUsIGpvaW4sIHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xyXG5cclxuaW1wb3J0IHsgY29uZmlnLCBuYW1lIH0gZnJvbSBcIi4uL1wiO1xyXG5cclxuY29uc3QgbG9nZ2VyID0gZGVidWcoYCR7bmFtZX06Y29weVRhc2tgKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGNvcHlUYXNrKCkge1xyXG5cdGxvZ2dlcihgQ29weWluZyBmaWxlcyB0byAke2NvbmZpZy5vdXR9YCk7XHJcblx0Y29uc3QgcGtnQ2hlY2tzID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xyXG5cdFx0cGF0aEV4aXN0cyhcInBhY2thZ2UuanNvblwiKSxcclxuXHRcdHBhdGhFeGlzdHMoXCJwYWNrYWdlLWxvY2suanNvblwiKSxcclxuXHRcdHBhdGhFeGlzdHMoXCJ5YXJuLmxvY2tcIilcclxuXHRdKTtcclxuXHJcblx0bGV0IGNvcHlUYXNrczogUHJvbWlzZTx2b2lkPltdID0gW107XHJcblxyXG5cdGlmIChwa2dDaGVja3NbMF0pXHJcblx0XHRjb3B5VGFza3MucHVzaChjb3B5KFwicGFja2FnZS5qc29uXCIsIHJlc29sdmUoY29uZmlnLm91dCwgYHBhY2thZ2UuanNvbmApKSk7XHJcblx0aWYgKHBrZ0NoZWNrc1sxXSlcclxuXHRcdGNvcHlUYXNrcy5wdXNoKFxyXG5cdFx0XHRjb3B5KFwicGFja2FnZS1sb2NrLmpzb25cIiwgcmVzb2x2ZShjb25maWcub3V0LCBgcGFja2FnZS1sb2NrLmpzb25gKSlcclxuXHRcdCk7XHJcblx0aWYgKHBrZ0NoZWNrc1syXSlcclxuXHRcdGNvcHlUYXNrcy5wdXNoKGNvcHkoXCJ5YXJuLmxvY2tcIiwgcmVzb2x2ZShjb25maWcub3V0LCBgeWFybi5sb2NrYCkpKTtcclxuXHJcblx0Ly8qIENvcHkgZmlsZXMgZnJvbSBzcmMgdG8gZGlzdFxyXG5cdGNvcHlUYXNrcy5wdXNoKFxyXG5cdFx0Y29weShjb25maWcuc3JjLCBjb25maWcub3V0LCB7XHJcblx0XHRcdGZpbHRlcjogZnVuY3Rpb24gKHBhdGgpIHtcclxuXHRcdFx0XHRpZiAocGF0aC5pbmNsdWRlcyhcIi9ub2RlX21vZHVsZXNcIikpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRyZXR1cm4gZXh0bmFtZShwYXRoKSAhPT0gXCIudHNcIjtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHQpO1xyXG5cclxuXHRpZiAoY29uZmlnLmluY2x1ZGUpXHJcblx0XHQoYXdhaXQgZ2xvYihjb25maWcuaW5jbHVkZSkpLmZvckVhY2goKGUpID0+XHJcblx0XHRcdGNvcHlUYXNrcy5wdXNoKGNvcHkoZSwgam9pbihjb25maWcub3V0LCBiYXNlbmFtZShlKSkpKVxyXG5cdFx0KTtcclxuXHJcblx0YXdhaXQgUHJvbWlzZS5hbGwoW2NvcHlUYXNrcywgZGVsZXRlT2Jzb2xldGUoKV0pO1xyXG5cdGxvZ2dlcihgQ29waWVkIGZpbGVzIGZyb20gJHtjb25maWcuc3JjfSB0byAke2NvbmZpZy5vdXR9YCk7XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGRlbGV0ZU9ic29sZXRlKCkge1xyXG5cdGlmICghY29uZmlnLmRlbGV0ZU9ic29sZXRlIHx8ICEoYXdhaXQgcGF0aEV4aXN0cyhyZXNvbHZlKGNvbmZpZy5vdXQpKSkpXHJcblx0XHRyZXR1cm47XHJcblxyXG5cdGxvZ2dlcihcIkRlbGV0aW5nIG9ic29sZXRlIGZpbGVz4oCmXCIpO1xyXG5cdC8vKiBTZWxlY3QgZmlsZXNcclxuXHRsZXQgZGlzdCA9IGF3YWl0IGdsb2IoXCIqKi8qXCIsIHtcclxuXHRcdFx0Y3dkOiBjb25maWcub3V0LFxyXG5cdFx0XHRvbmx5RmlsZXM6IHRydWVcclxuXHRcdH0pLFxyXG5cdFx0c3JjID0gYXdhaXQgZ2xvYihcIioqLypcIiwge1xyXG5cdFx0XHRjd2Q6IGNvbmZpZy5zcmMsXHJcblx0XHRcdG9ubHlGaWxlczogdHJ1ZVxyXG5cdFx0fSk7XHJcblxyXG5cdGlmIChjb25maWcuaW5jbHVkZSlcclxuXHRcdHNyYy5wdXNoKC4uLihhd2FpdCBnbG9iKGNvbmZpZy5pbmNsdWRlLCB7IG9ubHlGaWxlczogdHJ1ZSB9KSkpO1xyXG5cclxuXHRzcmMucHVzaChcInBhY2thZ2UuanNvblwiLCBcInBhY2thZ2UtbG9jay5qc29uXCIsIFwieWFybi5sb2NrXCIpO1xyXG5cclxuXHQvLyogRmlsdGVyIGZpbGUgZGlmZmVyZW5jZXNcclxuXHRzcmMgPSBzcmNcclxuXHRcdC5tYXAoKGYpID0+IGYuc3BsaXQoXCIuXCIpWzBdKVxyXG5cdFx0LmZpbHRlcigoc2YpID0+IGRpc3QuZmluZCgoZCkgPT4gZC5zcGxpdChcIi5cIilbMF0gPT0gc2YpKTtcclxuXHJcblx0Ly8qIE9sZCBmaWxlcywgZGVsZXRlXHJcblx0YXdhaXQgUHJvbWlzZS5hbGwoXHJcblx0XHRkaXN0XHJcblx0XHRcdC5maWx0ZXIoKGYpID0+ICFzcmMuaW5jbHVkZXMoZi5yZXBsYWNlKGNvbmZpZy5vdXQsIFwiXCIpLnNwbGl0KFwiLlwiKVswXSkpXHJcblx0XHRcdC5tYXAoKGYpID0+IHJlbW92ZShyZXNvbHZlKGNvbmZpZy5vdXQsIGYpKSlcclxuXHQpO1xyXG5cdGxvZ2dlcihcIkRlbGV0ZWQgb2Jzb2xldGUgZmlsZXNcIik7XHJcbn1cclxuIl19