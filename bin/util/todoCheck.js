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
var leasot = __importStar(require("leasot"));
var path_1 = require("path");
var chalk_1 = __importDefault(require("chalk"));
var index_1 = require("../index");
var debug_1 = __importDefault(require("debug"));
var displayAsTreePrefix_1 = require("./functions/displayAsTreePrefix");
var fast_glob_1 = __importDefault(require("fast-glob"));
var outlineStrings_1 = __importDefault(require("./functions/outlineStrings"));
var fs_1 = require("fs");
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
                            customTags: index_1.config.todoTags.split(",")
                        });
                        fileTodos.forEach(function (todo) {
                            count++;
                            if (todos[todo.file]) {
                                todos[todo.file].push({
                                    line: todo.line,
                                    ref: todo.ref,
                                    text: todo.text,
                                    tag: todo.tag,
                                    path: path_1.join(process.cwd(), file)
                                });
                            }
                            else {
                                todos[todo.file] = [
                                    {
                                        line: todo.line,
                                        ref: todo.ref,
                                        text: todo.text,
                                        tag: todo.tag,
                                        path: path_1.join(process.cwd(), file)
                                    }
                                ];
                            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9kb0NoZWNrLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJ1dGlsL3RvZG9DaGVjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBaUM7QUFFakMsNkJBQStDO0FBQy9DLGdEQUFtQztBQUNuQyxrQ0FBeUQ7QUFFekQsZ0RBQTBCO0FBQzFCLHVFQUFnRTtBQUNoRSx3REFBNkI7QUFDN0IsOEVBQWlEO0FBQ2pELHlCQUFrQztBQUVsQyxJQUFNLE1BQU0sR0FBRyxlQUFLLENBQUksWUFBSSxlQUFZLENBQUMsQ0FBQztBQUUxQyxTQUE4QixVQUFVOzs7Ozs7b0JBQ3ZDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO29CQUU5QixXQUFNLG1CQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBQTs7b0JBRDFELEtBQUssR0FBRyxDQUNaLFNBQThELENBQzlELENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxFQUE3QixDQUE2QixDQUFDLEVBQzlDLEtBQUssR0FRRCxFQUFFO29CQUNILEtBQUssR0FBRyxDQUFDLENBQUM7d0NBRUgsSUFBSTt3QkFDZCxJQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUM3QixpQkFBWSxDQUFDLFdBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsT0FBTyxDQUFDLEVBQ2hEOzRCQUNDLFNBQVMsRUFBRSxjQUFPLENBQUMsSUFBSSxDQUFDOzRCQUN4QixRQUFRLEVBQUUsZUFBUSxDQUFDLElBQUksQ0FBQzs0QkFDeEIsVUFBVSxFQUFFLGNBQU0sQ0FBQyxRQUFRLENB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QUFDLGtCQUFNLGVBQUssQ0FBQyxJQUFJLENBQUMsZUFBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBRyxDQUFDLENBQUM7Z0NBQ3RELG1DQUFhLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDOzZCQUNoQzt5QkFDRDtxQkFDRDs7Ozs7Q0FDRDtBQXRHRCw2QkFzR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBsZWFzb3QgZnJvbSBcImxlYXNvdFwiO1xyXG5cclxuaW1wb3J0IHsgYmFzZW5hbWUsIGV4dG5hbWUsIGpvaW4gfSBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgY2hhbGssIHsgaGV4IH0gZnJvbSBcImNoYWxrXCI7XHJcbmltcG9ydCB7IGNvbmZpZywgZHNDb25zb2xlUHJlZml4LCBuYW1lIH0gZnJvbSBcIi4uL2luZGV4XCI7XHJcblxyXG5pbXBvcnQgZGVidWcgZnJvbSBcImRlYnVnXCI7XHJcbmltcG9ydCB7IGRpc3BsYXlBc1RyZWUgfSBmcm9tIFwiLi9mdW5jdGlvbnMvZGlzcGxheUFzVHJlZVByZWZpeFwiO1xyXG5pbXBvcnQgZ2xvYiBmcm9tIFwiZmFzdC1nbG9iXCI7XHJcbmltcG9ydCBvdXRsaW5lIGZyb20gXCIuL2Z1bmN0aW9ucy9vdXRsaW5lU3RyaW5nc1wiO1xyXG5pbXBvcnQgeyByZWFkRmlsZVN5bmMgfSBmcm9tIFwiZnNcIjtcclxuXHJcbmNvbnN0IGxvZ2dlciA9IGRlYnVnKGAke25hbWV9OnRvZG9jaGVja2ApO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gY2hlY2tUb2RvcygpIHtcclxuXHRsb2dnZXIoXCJSdW5uaW5nIFRPRE8gY2hlY2suLi5cIik7XHJcblx0Y29uc3QgZmlsZXMgPSAoXHJcblx0XHRcdGF3YWl0IGdsb2IoXCIqKi8qLnRzXCIsIHsgY3dkOiBwcm9jZXNzLmN3ZCgpLCBvbmx5RmlsZXM6IHRydWUgfSlcclxuXHRcdCkuZmlsdGVyKChmKSA9PiAhZi5zdGFydHNXaXRoKFwibm9kZV9tb2R1bGVzXCIpKSxcclxuXHRcdHRvZG9zOiB7XHJcblx0XHRcdFtuYW1lOiBzdHJpbmddOiB7XHJcblx0XHRcdFx0bGluZTogbnVtYmVyO1xyXG5cdFx0XHRcdHJlZjogc3RyaW5nO1xyXG5cdFx0XHRcdHRleHQ6IHN0cmluZztcclxuXHRcdFx0XHR0YWc6IHN0cmluZztcclxuXHRcdFx0XHRwYXRoOiBzdHJpbmc7XHJcblx0XHRcdH1bXTtcclxuXHRcdH0gPSB7fTtcclxuXHRsZXQgY291bnQgPSAwO1xyXG5cclxuXHRmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMpIHtcclxuXHRcdGNvbnN0IGZpbGVUb2RvcyA9IGxlYXNvdC5wYXJzZShcclxuXHRcdFx0cmVhZEZpbGVTeW5jKGpvaW4ocHJvY2Vzcy5jd2QoKSwgZmlsZSksIFwidXRmLThcIiksXHJcblx0XHRcdHtcclxuXHRcdFx0XHRleHRlbnNpb246IGV4dG5hbWUoZmlsZSksXHJcblx0XHRcdFx0ZmlsZW5hbWU6IGJhc2VuYW1lKGZpbGUpLFxyXG5cdFx0XHRcdGN1c3RvbVRhZ3M6IGNvbmZpZy50b2RvVGFncy5zcGxpdChcIixcIilcclxuXHRcdFx0fVxyXG5cdFx0KTtcclxuXHJcblx0XHRmaWxlVG9kb3MuZm9yRWFjaCgodG9kbykgPT4ge1xyXG5cdFx0XHRjb3VudCsrO1xyXG5cdFx0XHRpZiAodG9kb3NbdG9kby5maWxlXSkge1xyXG5cdFx0XHRcdHRvZG9zW3RvZG8uZmlsZV0ucHVzaCh7XHJcblx0XHRcdFx0XHRsaW5lOiB0b2RvLmxpbmUsXHJcblx0XHRcdFx0XHRyZWY6IHRvZG8ucmVmLFxyXG5cdFx0XHRcdFx0dGV4dDogdG9kby50ZXh0LFxyXG5cdFx0XHRcdFx0dGFnOiB0b2RvLnRhZyxcclxuXHRcdFx0XHRcdHBhdGg6IGpvaW4ocHJvY2Vzcy5jd2QoKSwgZmlsZSlcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0b2Rvc1t0b2RvLmZpbGVdID0gW1xyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRsaW5lOiB0b2RvLmxpbmUsXHJcblx0XHRcdFx0XHRcdHJlZjogdG9kby5yZWYsXHJcblx0XHRcdFx0XHRcdHRleHQ6IHRvZG8udGV4dCxcclxuXHRcdFx0XHRcdFx0dGFnOiB0b2RvLnRhZyxcclxuXHRcdFx0XHRcdFx0cGF0aDogam9pbihwcm9jZXNzLmN3ZCgpLCBmaWxlKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdF07XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0T2JqZWN0LmtleXModG9kb3MpLmZvckVhY2goKGZpbGUpID0+IHtcclxuXHRcdHRvZG9zW2ZpbGVdLnNvcnQoKGEsIGIpID0+IGEubGluZSAtIGIubGluZSk7XHJcblx0fSk7XHJcblxyXG5cdGNvbnN0IGZpbmFsT2JqOiB7XHJcblx0XHRbbmFtZTogc3RyaW5nXTogc3RyaW5nW107XHJcblx0fSA9IHt9O1xyXG5cdE9iamVjdC5rZXlzKHRvZG9zKS5mb3JFYWNoKChmaWxlKSA9PiB7XHJcblx0XHRmaW5hbE9ialtmaWxlXSA9IHRvZG9zW2ZpbGVdLm1hcChcclxuXHRcdFx0KHRvZG8pID0+XHJcblx0XHRcdFx0YCR7Y2hhbGsueWVsbG93QnJpZ2h0KHRvZG8ucGF0aCl9JHtjaGFsay5oZXgoXCIjYmViZWJlXCIpKFxyXG5cdFx0XHRcdFx0XCIoXCIgKyB0b2RvLmxpbmUgKyBcIilcIlxyXG5cdFx0XHRcdCl9IOKAoiAke1xyXG5cdFx0XHRcdFx0dG9kby50YWcgPT09IFwiVE9ET1wiXHJcblx0XHRcdFx0XHRcdD8gY2hhbGsuaGV4KFwiI0ZGOEMwMFwiKSh0b2RvLnRhZylcclxuXHRcdFx0XHRcdFx0OiB0b2RvLnRhZyA9PT0gXCJGSVhNRVwiXHJcblx0XHRcdFx0XHRcdD8gY2hhbGsuaGV4KFwiI0ZGMkQwMFwiKSh0b2RvLnRhZylcclxuXHRcdFx0XHRcdFx0OiBjaGFsay5oZXgoXCIjOThDMzc5XCIpKHRvZG8udGFnKVxyXG5cdFx0XHRcdH0gJHtjaGFsay5oZXgoXCIjNzI4OURBXCIpKHRvZG8udGV4dCl9JHtcclxuXHRcdFx0XHRcdHRvZG8ucmVmID8gXCIg4oCiIFwiICsgY2hhbGsuZ3JlZW4oXCJSZWY6IFwiICsgdG9kby5yZWYpIDogXCJcIlxyXG5cdFx0XHRcdH1gXHJcblx0XHQpO1xyXG5cdH0pO1xyXG5cclxuXHRsb2dnZXIoYFRPRE8gY2hlY2sgZmluaXNoZWQuIEZvdW5kICR7Y291bnR9IFRPRE8ncy5gKTtcclxuXHJcblx0aWYgKE9iamVjdC5rZXlzKGZpbmFsT2JqKS5sZW5ndGggPiAwKSB7XHJcblx0XHRjb25zb2xlLmxvZyhcclxuXHRcdFx0YCR7ZHNDb25zb2xlUHJlZml4fSAke2NoYWxrLmhleChcIiNGRjhDMDBcIikoXHJcblx0XHRcdFx0XCJGb3VuZCBcIiArIGNvdW50ICsgXCIgVE9ETydz4oCmXCJcclxuXHRcdFx0KX1gXHJcblx0XHQpO1xyXG5cdFx0bGV0IGkgPSAwO1xyXG5cdFx0Zm9yIChjb25zdCBbZmlsZU5hbWUsIHRvZG9BcnJheV0gb2YgT2JqZWN0LmVudHJpZXMoZmluYWxPYmopKSB7XHJcblx0XHRcdC8vKiBTcGFjaW5nIGJldHdlZW4gc3JjIGFuZCBlcnJvciBtZXNzYWdlLlxyXG5cdFx0XHRvdXRsaW5lKHRvZG9BcnJheSwgXCLigKJcIik7XHJcblxyXG5cdFx0XHRpKys7XHJcblx0XHRcdGlmIChPYmplY3Qua2V5cyhmaW5hbE9iaikubGVuZ3RoID4gMSkge1xyXG5cdFx0XHRcdGlmIChPYmplY3Qua2V5cyhmaW5hbE9iaikubGVuZ3RoID09PSBpKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhg4pWw4pSAICR7Y2hhbGsuYm9sZChjaGFsay5jeWFuKGZpbGVOYW1lKSl9YCk7XHJcblx0XHRcdFx0XHRkaXNwbGF5QXNUcmVlKHRvZG9BcnJheSwgXCIgICBcIik7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGDilJzilIAgJHtjaGFsay5ib2xkKGNoYWxrLmN5YW4oZmlsZU5hbWUpKX1gKTtcclxuXHRcdFx0XHRcdGRpc3BsYXlBc1RyZWUodG9kb0FycmF5LCBcIuKUgiAgXCIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhg4pWw4pSAICR7Y2hhbGsuYm9sZChjaGFsay5jeWFuKGZpbGVOYW1lKSl9YCk7XHJcblx0XHRcdFx0ZGlzcGxheUFzVHJlZSh0b2RvQXJyYXksIFwiICAgXCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiJdfQ==