"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var fast_glob_1 = __importDefault(require("fast-glob"));
var fs_1 = require("fs");
var leasot = __importStar(require("leasot"));
var path_1 = require("path");
var index_1 = require("../index");
var displayAsTreePrefix_1 = require("./functions/displayAsTreePrefix");
var outlineStrings_1 = __importDefault(require("./functions/outlineStrings"));
var logger = debug_1.default(index_1.name + ":todocheck");
function checkTodos() {
    return __awaiter(this, void 0, void 0, function () {
        var files, todos, count, _loop_1, _i, files_1, file, finalObj, i, _a, _b, _c, fileName, todoArray;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    logger("Running TODO check...");
                    return [4, fast_glob_1.default("**/*.ts", { cwd: process.cwd(), onlyFiles: true })];
                case 1:
                    files = (_d.sent()).filter(function (f) { return !f.startsWith("node_modules"); }), todos = {};
                    count = 0;
                    _loop_1 = function (file) {
                        var fileTodos = leasot.parse(fs_1.readFileSync(path_1.join(process.cwd(), file), "utf-8"), {
                            extension: path_1.extname(file),
                            filename: path_1.basename(file),
                            customTags: index_1.config.todoTags ? index_1.config.todoTags.split(",") : []
                        });
                        fileTodos.forEach(function (todo) {
                            count++;
                            var todoObject = {
                                line: todo.line,
                                ref: todo.ref,
                                text: todo.text,
                                tag: todo.tag,
                                path: path_1.relative(path_1.dirname(process.cwd()), file).replace(/\\/g, "/")
                            };
                            if (todos[todo.file])
                                todos[todo.file].push(todoObject);
                            else
                                todos[todo.file] = [todoObject];
                        });
                    };
                    for (_i = 0, files_1 = files; _i < files_1.length; _i++) {
                        file = files_1[_i];
                        _loop_1(file);
                    }
                    Object.keys(todos).forEach(function (file) {
                        todos[file].sort(function (a, b) { return a.line - b.line; });
                    });
                    finalObj = {};
                    Object.keys(todos).forEach(function (file) {
                        finalObj[file] = todos[file].map(function (todo) {
                            return "" + chalk_1.default.yellowBright(todo.path) + chalk_1.default.hex("#bebebe")("(" + todo.line + ")") + " \u2022 " + (todo.tag === "TODO"
                                ? chalk_1.default.hex("#FF8C00")(todo.tag)
                                : todo.tag === "FIXME"
                                    ? chalk_1.default.hex("#FF2D00")(todo.tag)
                                    : chalk_1.default.hex("#98C379")(todo.tag)) + " " + chalk_1.default.hex("#7289DA")(todo.text) + (todo.ref ? " • " + chalk_1.default.green("Ref: " + todo.ref) : "");
                        });
                    });
                    logger("TODO check finished. Found " + count + " TODO's.");
                    if (Object.keys(finalObj).length > 0) {
                        console.log(index_1.dsConsolePrefix + " " + chalk_1.default.hex("#FF8C00")("Found " + count + " TODO's…"));
                        i = 0;
                        for (_a = 0, _b = Object.entries(finalObj); _a < _b.length; _a++) {
                            _c = _b[_a], fileName = _c[0], todoArray = _c[1];
                            outlineStrings_1.default(todoArray, "•");
                            i++;
                            if (Object.keys(finalObj).length > 1) {
                                if (Object.keys(finalObj).length === i) {
                                    console.log("\u2570\u2500 " + chalk_1.default.bold(chalk_1.default.cyan(fileName)));
                                    displayAsTreePrefix_1.displayAsTree(todoArray, "   ");
                                }
                                else {
                                    console.log("\u251C\u2500 " + chalk_1.default.bold(chalk_1.default.cyan(fileName)));
                                    displayAsTreePrefix_1.displayAsTree(todoArray, "│  ");
                                }
                            }
                            else {
                                console.log("\u2570\u2500 " + chalk_1.default.bold(chalk_1.default.cyan(fileName)));
                                displayAsTreePrefix_1.displayAsTree(todoArray, "   ");
                            }
                        }
                    }
                    return [2];
            }
        });
    });
}
exports.default = checkTodos;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9kb0NoZWNrLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJ1dGlsL3RvZG9DaGVjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxnREFBMEI7QUFDMUIsZ0RBQTBCO0FBQzFCLHdEQUE2QjtBQUM3Qix5QkFBa0M7QUFDbEMsNkNBQWlDO0FBQ2pDLDZCQUFrRTtBQUVsRSxrQ0FBeUQ7QUFDekQsdUVBQWdFO0FBQ2hFLDhFQUFpRDtBQUVqRCxJQUFNLE1BQU0sR0FBRyxlQUFLLENBQUksWUFBSSxlQUFZLENBQUMsQ0FBQztBQUUxQyxTQUE4QixVQUFVOzs7Ozs7b0JBQ3ZDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO29CQUU5QixXQUFNLG1CQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBQTs7b0JBRDFELEtBQUssR0FBRyxDQUNaLFNBQThELENBQzlELENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxFQUE3QixDQUE2QixDQUFDLEVBQzlDLEtBQUssR0FRRCxFQUFFO29CQUNILEtBQUssR0FBRyxDQUFDLENBQUM7d0NBRUgsSUFBSTt3QkFDZCxJQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUM3QixpQkFBWSxDQUFDLFdBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsT0FBTyxDQUFDLEVBQ2hEOzRCQUNDLFNBQVMsRUFBRSxjQUFPLENBQUMsSUFBSSxDQUFDOzRCQUN4QixRQUFRLEVBQUUsZUFBUSxDQUFDLElBQUksQ0FBQzs0QkFDeEIsVUFBVSxFQUFFLGNBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLGNBQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO3lCQUM3RCxDQUNELENBQUM7d0JBRUYsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUk7NEJBQ3RCLEtBQUssRUFBRSxDQUFDOzRCQUNSLElBQU0sVUFBVSxHQUFHO2dDQUNsQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0NBQ2YsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO2dDQUNiLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtnQ0FDZixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7Z0NBQ2IsSUFBSSxFQUFFLGVBQVEsQ0FBQyxjQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUM7NkJBQ2hFLENBQUM7NEJBRUYsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQ0FBRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQzs7Z0NBQ25ELEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQzt3QkFDdEMsQ0FBQyxDQUFDLENBQUM7O29CQXRCSixXQUF3QixFQUFMLGVBQUssRUFBTCxtQkFBSyxFQUFMLElBQUs7d0JBQWIsSUFBSTtnQ0FBSixJQUFJO3FCQXVCZDtvQkFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUk7d0JBQy9CLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFmLENBQWUsQ0FBQyxDQUFDO29CQUM3QyxDQUFDLENBQUMsQ0FBQztvQkFFRyxRQUFRLEdBRVYsRUFBRSxDQUFDO29CQUNQLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTt3QkFDL0IsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQy9CLFVBQUMsSUFBSTs0QkFDSixPQUFBLEtBQUcsZUFBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsZUFBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FDdEQsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUNyQixpQkFDQSxJQUFJLENBQUMsR0FBRyxLQUFLLE1BQU07Z0NBQ2xCLENBQUMsQ0FBQyxlQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7Z0NBQ2hDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLE9BQU87b0NBQ3RCLENBQUMsQ0FBQyxlQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7b0NBQ2hDLENBQUMsQ0FBQyxlQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFDOUIsZUFBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQ2xDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxlQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FDdEQ7d0JBVkYsQ0FVRSxDQUNILENBQUM7b0JBQ0gsQ0FBQyxDQUFDLENBQUM7b0JBRUgsTUFBTSxDQUFDLGdDQUE4QixLQUFLLGFBQVUsQ0FBQyxDQUFDO29CQUV0RCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTt3QkFDckMsT0FBTyxDQUFDLEdBQUcsQ0FDUCx1QkFBZSxTQUFJLGVBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQ3pDLFFBQVEsR0FBRyxLQUFLLEdBQUcsVUFBVSxDQUMzQixDQUNILENBQUM7d0JBQ0UsQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDVixXQUE0RCxFQUF4QixLQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQXhCLGNBQXdCLEVBQXhCLElBQXdCLEVBQUU7NEJBQW5ELFdBQXFCLEVBQXBCLFFBQVEsUUFBQSxFQUFFLFNBQVMsUUFBQTs0QkFFOUIsd0JBQU8sQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7NEJBRXhCLENBQUMsRUFBRSxDQUFDOzRCQUNKLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dDQUNyQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtvQ0FDdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBTSxlQUFLLENBQUMsSUFBSSxDQUFDLGVBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUcsQ0FBQyxDQUFDO29DQUN0RCxtQ0FBYSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztpQ0FDaEM7cUNBQU07b0NBQ04sT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBTSxlQUFLLENBQUMsSUFBSSxDQUFDLGVBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUcsQ0FBQyxDQUFDO29DQUN0RCxtQ0FBYSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztpQ0FDaEM7NkJBQ0Q7aUNBQU07Z0NBQ04sT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBTSxlQUFLLENBQUMsSUFBSSxDQUFDLGVBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUcsQ0FBQyxDQUFDO2dDQUN0RCxtQ0FBYSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQzs2QkFDaEM7eUJBQ0Q7cUJBQ0Q7Ozs7O0NBQ0Q7QUE3RkQsNkJBNkZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNoYWxrIGZyb20gXCJjaGFsa1wiO1xyXG5pbXBvcnQgZGVidWcgZnJvbSBcImRlYnVnXCI7XHJcbmltcG9ydCBnbG9iIGZyb20gXCJmYXN0LWdsb2JcIjtcclxuaW1wb3J0IHsgcmVhZEZpbGVTeW5jIH0gZnJvbSBcImZzXCI7XHJcbmltcG9ydCAqIGFzIGxlYXNvdCBmcm9tIFwibGVhc290XCI7XHJcbmltcG9ydCB7IGJhc2VuYW1lLCBkaXJuYW1lLCBleHRuYW1lLCBqb2luLCByZWxhdGl2ZSB9IGZyb20gXCJwYXRoXCI7XHJcblxyXG5pbXBvcnQgeyBjb25maWcsIGRzQ29uc29sZVByZWZpeCwgbmFtZSB9IGZyb20gXCIuLi9pbmRleFwiO1xyXG5pbXBvcnQgeyBkaXNwbGF5QXNUcmVlIH0gZnJvbSBcIi4vZnVuY3Rpb25zL2Rpc3BsYXlBc1RyZWVQcmVmaXhcIjtcclxuaW1wb3J0IG91dGxpbmUgZnJvbSBcIi4vZnVuY3Rpb25zL291dGxpbmVTdHJpbmdzXCI7XHJcblxyXG5jb25zdCBsb2dnZXIgPSBkZWJ1ZyhgJHtuYW1lfTp0b2RvY2hlY2tgKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGNoZWNrVG9kb3MoKSB7XHJcblx0bG9nZ2VyKFwiUnVubmluZyBUT0RPIGNoZWNrLi4uXCIpO1xyXG5cdGNvbnN0IGZpbGVzID0gKFxyXG5cdFx0XHRhd2FpdCBnbG9iKFwiKiovKi50c1wiLCB7IGN3ZDogcHJvY2Vzcy5jd2QoKSwgb25seUZpbGVzOiB0cnVlIH0pXHJcblx0XHQpLmZpbHRlcigoZikgPT4gIWYuc3RhcnRzV2l0aChcIm5vZGVfbW9kdWxlc1wiKSksXHJcblx0XHR0b2Rvczoge1xyXG5cdFx0XHRbbmFtZTogc3RyaW5nXToge1xyXG5cdFx0XHRcdGxpbmU6IG51bWJlcjtcclxuXHRcdFx0XHRyZWY6IHN0cmluZztcclxuXHRcdFx0XHR0ZXh0OiBzdHJpbmc7XHJcblx0XHRcdFx0dGFnOiBzdHJpbmc7XHJcblx0XHRcdFx0cGF0aDogc3RyaW5nO1xyXG5cdFx0XHR9W107XHJcblx0XHR9ID0ge307XHJcblx0bGV0IGNvdW50ID0gMDtcclxuXHJcblx0Zm9yIChjb25zdCBmaWxlIG9mIGZpbGVzKSB7XHJcblx0XHRjb25zdCBmaWxlVG9kb3MgPSBsZWFzb3QucGFyc2UoXHJcblx0XHRcdHJlYWRGaWxlU3luYyhqb2luKHByb2Nlc3MuY3dkKCksIGZpbGUpLCBcInV0Zi04XCIpLFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0ZXh0ZW5zaW9uOiBleHRuYW1lKGZpbGUpLFxyXG5cdFx0XHRcdGZpbGVuYW1lOiBiYXNlbmFtZShmaWxlKSxcclxuXHRcdFx0XHRjdXN0b21UYWdzOiBjb25maWcudG9kb1RhZ3MgPyBjb25maWcudG9kb1RhZ3Muc3BsaXQoXCIsXCIpIDogW11cclxuXHRcdFx0fVxyXG5cdFx0KTtcclxuXHJcblx0XHRmaWxlVG9kb3MuZm9yRWFjaCgodG9kbykgPT4ge1xyXG5cdFx0XHRjb3VudCsrO1xyXG5cdFx0XHRjb25zdCB0b2RvT2JqZWN0ID0ge1xyXG5cdFx0XHRcdGxpbmU6IHRvZG8ubGluZSxcclxuXHRcdFx0XHRyZWY6IHRvZG8ucmVmLFxyXG5cdFx0XHRcdHRleHQ6IHRvZG8udGV4dCxcclxuXHRcdFx0XHR0YWc6IHRvZG8udGFnLFxyXG5cdFx0XHRcdHBhdGg6IHJlbGF0aXZlKGRpcm5hbWUocHJvY2Vzcy5jd2QoKSksIGZpbGUpLnJlcGxhY2UoL1xcXFwvZywgXCIvXCIpXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRpZiAodG9kb3NbdG9kby5maWxlXSkgdG9kb3NbdG9kby5maWxlXS5wdXNoKHRvZG9PYmplY3QpO1xyXG5cdFx0XHRlbHNlIHRvZG9zW3RvZG8uZmlsZV0gPSBbdG9kb09iamVjdF07XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdE9iamVjdC5rZXlzKHRvZG9zKS5mb3JFYWNoKChmaWxlKSA9PiB7XHJcblx0XHR0b2Rvc1tmaWxlXS5zb3J0KChhLCBiKSA9PiBhLmxpbmUgLSBiLmxpbmUpO1xyXG5cdH0pO1xyXG5cclxuXHRjb25zdCBmaW5hbE9iajoge1xyXG5cdFx0W25hbWU6IHN0cmluZ106IHN0cmluZ1tdO1xyXG5cdH0gPSB7fTtcclxuXHRPYmplY3Qua2V5cyh0b2RvcykuZm9yRWFjaCgoZmlsZSkgPT4ge1xyXG5cdFx0ZmluYWxPYmpbZmlsZV0gPSB0b2Rvc1tmaWxlXS5tYXAoXHJcblx0XHRcdCh0b2RvKSA9PlxyXG5cdFx0XHRcdGAke2NoYWxrLnllbGxvd0JyaWdodCh0b2RvLnBhdGgpfSR7Y2hhbGsuaGV4KFwiI2JlYmViZVwiKShcclxuXHRcdFx0XHRcdFwiKFwiICsgdG9kby5saW5lICsgXCIpXCJcclxuXHRcdFx0XHQpfSDigKIgJHtcclxuXHRcdFx0XHRcdHRvZG8udGFnID09PSBcIlRPRE9cIlxyXG5cdFx0XHRcdFx0XHQ/IGNoYWxrLmhleChcIiNGRjhDMDBcIikodG9kby50YWcpXHJcblx0XHRcdFx0XHRcdDogdG9kby50YWcgPT09IFwiRklYTUVcIlxyXG5cdFx0XHRcdFx0XHQ/IGNoYWxrLmhleChcIiNGRjJEMDBcIikodG9kby50YWcpXHJcblx0XHRcdFx0XHRcdDogY2hhbGsuaGV4KFwiIzk4QzM3OVwiKSh0b2RvLnRhZylcclxuXHRcdFx0XHR9ICR7Y2hhbGsuaGV4KFwiIzcyODlEQVwiKSh0b2RvLnRleHQpfSR7XHJcblx0XHRcdFx0XHR0b2RvLnJlZiA/IFwiIOKAoiBcIiArIGNoYWxrLmdyZWVuKFwiUmVmOiBcIiArIHRvZG8ucmVmKSA6IFwiXCJcclxuXHRcdFx0XHR9YFxyXG5cdFx0KTtcclxuXHR9KTtcclxuXHJcblx0bG9nZ2VyKGBUT0RPIGNoZWNrIGZpbmlzaGVkLiBGb3VuZCAke2NvdW50fSBUT0RPJ3MuYCk7XHJcblxyXG5cdGlmIChPYmplY3Qua2V5cyhmaW5hbE9iaikubGVuZ3RoID4gMCkge1xyXG5cdFx0Y29uc29sZS5sb2coXHJcblx0XHRcdGAke2RzQ29uc29sZVByZWZpeH0gJHtjaGFsay5oZXgoXCIjRkY4QzAwXCIpKFxyXG5cdFx0XHRcdFwiRm91bmQgXCIgKyBjb3VudCArIFwiIFRPRE8nc+KAplwiXHJcblx0XHRcdCl9YFxyXG5cdFx0KTtcclxuXHRcdGxldCBpID0gMDtcclxuXHRcdGZvciAoY29uc3QgW2ZpbGVOYW1lLCB0b2RvQXJyYXldIG9mIE9iamVjdC5lbnRyaWVzKGZpbmFsT2JqKSkge1xyXG5cdFx0XHQvLyogU3BhY2luZyBiZXR3ZWVuIHNyYyBhbmQgZXJyb3IgbWVzc2FnZS5cclxuXHRcdFx0b3V0bGluZSh0b2RvQXJyYXksIFwi4oCiXCIpO1xyXG5cclxuXHRcdFx0aSsrO1xyXG5cdFx0XHRpZiAoT2JqZWN0LmtleXMoZmluYWxPYmopLmxlbmd0aCA+IDEpIHtcclxuXHRcdFx0XHRpZiAoT2JqZWN0LmtleXMoZmluYWxPYmopLmxlbmd0aCA9PT0gaSkge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYOKVsOKUgCAke2NoYWxrLmJvbGQoY2hhbGsuY3lhbihmaWxlTmFtZSkpfWApO1xyXG5cdFx0XHRcdFx0ZGlzcGxheUFzVHJlZSh0b2RvQXJyYXksIFwiICAgXCIpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhg4pSc4pSAICR7Y2hhbGsuYm9sZChjaGFsay5jeWFuKGZpbGVOYW1lKSl9YCk7XHJcblx0XHRcdFx0XHRkaXNwbGF5QXNUcmVlKHRvZG9BcnJheSwgXCLilIIgIFwiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYOKVsOKUgCAke2NoYWxrLmJvbGQoY2hhbGsuY3lhbihmaWxlTmFtZSkpfWApO1xyXG5cdFx0XHRcdGRpc3BsYXlBc1RyZWUodG9kb0FycmF5LCBcIiAgIFwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4iXX0=