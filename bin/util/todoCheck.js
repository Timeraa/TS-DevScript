"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var displayastree_1 = require("displayastree");
var path_1 = require("path");
var index_1 = require("../index");
var chalk_1 = __importDefault(require("chalk"));
var debug_1 = __importDefault(require("debug"));
var fast_glob_1 = __importDefault(require("fast-glob"));
var outlineStrings_1 = __importDefault(require("./functions/outlineStrings"));
var fs_1 = require("fs");
var logger = (0, debug_1.default)("".concat(index_1.name, ":todocheck"));
function checkTodos() {
    return __awaiter(this, void 0, void 0, function () {
        var files, todos, count, _loop_1, _i, files_1, file, finalObj, tree, sections, _a, _b, _c, fileName, todoArray;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    logger("Running TODO check...");
                    return [4 /*yield*/, (0, fast_glob_1.default)("**/*.ts", { cwd: process.cwd(), onlyFiles: true })];
                case 1:
                    files = (_d.sent()).filter(function (f) { return !f.startsWith("node_modules"); }), todos = {};
                    count = 0;
                    _loop_1 = function (file) {
                        var fileTodos = leasot.parse((0, fs_1.readFileSync)((0, path_1.join)(process.cwd(), file), "utf-8"), {
                            extension: (0, path_1.extname)(file),
                            filename: (0, path_1.basename)(file),
                            customTags: index_1.config.todoTags ? index_1.config.todoTags.split(",") : []
                        });
                        fileTodos.forEach(function (todo) {
                            count++;
                            var todoObject = {
                                line: todo.line,
                                ref: todo.ref,
                                text: todo.text,
                                tag: todo.tag,
                                path: (0, path_1.relative)(process.cwd(), file).replace(/\\/g, "/")
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
                            return "".concat(chalk_1.default.yellowBright(todo.path)).concat(chalk_1.default.hex("#bebebe")("(" + todo.line + ")"), " \u2022 ").concat(todo.tag === "TODO"
                                ? chalk_1.default.hex("#FF8C00")(todo.tag)
                                : todo.tag === "FIXME"
                                    ? chalk_1.default.hex("#FF2D00")(todo.tag)
                                    : chalk_1.default.hex("#98C379")(todo.tag), " ").concat(chalk_1.default.hex("#7289DA")(todo.text)).concat(todo.ref ? " • " + chalk_1.default.green("Ref: " + todo.ref) : "");
                        });
                    });
                    logger("TODO check finished. Found ".concat(count, " TODO").concat(count > 1 ? "'s" : "", "."));
                    if (Object.keys(finalObj).length) {
                        tree = new displayastree_1.Tree(chalk_1.default.hex("#FF8C00")("Found ".concat(count, " TODO").concat(count > 1 ? "'s" : "", "\u2026\"")), {
                            headChar: index_1.dsConsolePrefix + " "
                        });
                        sections = [];
                        for (_a = 0, _b = Object.entries(finalObj); _a < _b.length; _a++) {
                            _c = _b[_a], fileName = _c[0], todoArray = _c[1];
                            //* Spacing between src and error message.
                            (0, outlineStrings_1.default)(todoArray, "•");
                            sections.push(new displayastree_1.Branch(chalk_1.default.bold(chalk_1.default.cyan(fileName))).addBranch(todoArray));
                        }
                        tree.addBranch(sections).log();
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = checkTodos;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9kb0NoZWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwvdG9kb0NoZWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBaUM7QUFFakMsK0NBQTZDO0FBQzdDLDZCQUF5RDtBQUN6RCxrQ0FBeUQ7QUFFekQsZ0RBQTBCO0FBQzFCLGdEQUEwQjtBQUMxQix3REFBNkI7QUFDN0IsOEVBQWlEO0FBQ2pELHlCQUFrQztBQUVsQyxJQUFNLE1BQU0sR0FBRyxJQUFBLGVBQUssRUFBQyxVQUFHLFlBQUksZUFBWSxDQUFDLENBQUM7QUFFMUMsU0FBOEIsVUFBVTs7Ozs7O29CQUN2QyxNQUFNLENBQUMsdUJBQXVCLENBQUMsQ0FBQztvQkFFOUIscUJBQU0sSUFBQSxtQkFBSSxFQUFDLFNBQVMsRUFBRSxFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUE7O29CQUQxRCxLQUFLLEdBQUcsQ0FDWixTQUE4RCxDQUM5RCxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsRUFBN0IsQ0FBNkIsQ0FBQyxFQUM5QyxLQUFLLEdBUUQsRUFBRTtvQkFDSCxLQUFLLEdBQUcsQ0FBQyxDQUFDO3dDQUVILElBQUk7d0JBQ2QsSUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FDN0IsSUFBQSxpQkFBWSxFQUFDLElBQUEsV0FBSSxFQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxPQUFPLENBQUMsRUFDaEQ7NEJBQ0MsU0FBUyxFQUFFLElBQUEsY0FBTyxFQUFDLElBQUksQ0FBQzs0QkFDeEIsUUFBUSxFQUFFLElBQUEsZUFBUSxF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QyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQUcsQ0FBQyxDQUFDO29CQUU1RSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFO3dCQUMzQixJQUFJLEdBQUcsSUFBSSxvQkFBSSxDQUNwQixlQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLGdCQUFTLEtBQUssa0JBQVEsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLGFBQUksQ0FBQyxFQUNyRTs0QkFDQyxRQUFRLEVBQUUsdUJBQWUsR0FBRyxHQUFHO3lCQUMvQixDQUNELENBQUM7d0JBQ0ksUUFBUSxHQUFhLEVBQUUsQ0FBQzt3QkFDOUIsV0FBNEQsRUFBeEIsS0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUF4QixjQUF3QixFQUF4QixJQUF3QixFQUFFOzRCQUFuRCxXQUFxQixFQUFwQixRQUFRLFFBQUEsRUFBRSxTQUFTLFFBQUE7NEJBQzlCLDBDQUEwQzs0QkFDMUMsSUFBQSx3QkFBTyxFQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQzs0QkFDeEIsUUFBUSxDQUFDLElBQUksQ0FDWixJQUFJLHNCQUFNLENBQUMsZUFBSyxDQUFDLElBQUksQ0FBQyxlQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQ2pFLENBQUM7eUJBQ0Y7d0JBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztxQkFDL0I7Ozs7O0NBQ0Q7QUFwRkQsNkJBb0ZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbGVhc290IGZyb20gXCJsZWFzb3RcIjtcclxuXHJcbmltcG9ydCB7IEJyYW5jaCwgVHJlZSB9IGZyb20gXCJkaXNwbGF5YXN0cmVlXCI7XHJcbmltcG9ydCB7IGJhc2VuYW1lLCBleHRuYW1lLCBqb2luLCByZWxhdGl2ZSB9IGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7IGNvbmZpZywgZHNDb25zb2xlUHJlZml4LCBuYW1lIH0gZnJvbSBcIi4uL2luZGV4XCI7XHJcblxyXG5pbXBvcnQgY2hhbGsgZnJvbSBcImNoYWxrXCI7XHJcbmltcG9ydCBkZWJ1ZyBmcm9tIFwiZGVidWdcIjtcclxuaW1wb3J0IGdsb2IgZnJvbSBcImZhc3QtZ2xvYlwiO1xyXG5pbXBvcnQgb3V0bGluZSBmcm9tIFwiLi9mdW5jdGlvbnMvb3V0bGluZVN0cmluZ3NcIjtcclxuaW1wb3J0IHsgcmVhZEZpbGVTeW5jIH0gZnJvbSBcImZzXCI7XHJcblxyXG5jb25zdCBsb2dnZXIgPSBkZWJ1ZyhgJHtuYW1lfTp0b2RvY2hlY2tgKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGNoZWNrVG9kb3MoKSB7XHJcblx0bG9nZ2VyKFwiUnVubmluZyBUT0RPIGNoZWNrLi4uXCIpO1xyXG5cdGNvbnN0IGZpbGVzID0gKFxyXG5cdFx0XHRhd2FpdCBnbG9iKFwiKiovKi50c1wiLCB7IGN3ZDogcHJvY2Vzcy5jd2QoKSwgb25seUZpbGVzOiB0cnVlIH0pXHJcblx0XHQpLmZpbHRlcigoZikgPT4gIWYuc3RhcnRzV2l0aChcIm5vZGVfbW9kdWxlc1wiKSksXHJcblx0XHR0b2Rvczoge1xyXG5cdFx0XHRbbmFtZTogc3RyaW5nXToge1xyXG5cdFx0XHRcdGxpbmU6IG51bWJlcjtcclxuXHRcdFx0XHRyZWY6IHN0cmluZztcclxuXHRcdFx0XHR0ZXh0OiBzdHJpbmc7XHJcblx0XHRcdFx0dGFnOiBzdHJpbmc7XHJcblx0XHRcdFx0cGF0aDogc3RyaW5nO1xyXG5cdFx0XHR9W107XHJcblx0XHR9ID0ge307XHJcblx0bGV0IGNvdW50ID0gMDtcclxuXHJcblx0Zm9yIChjb25zdCBmaWxlIG9mIGZpbGVzKSB7XHJcblx0XHRjb25zdCBmaWxlVG9kb3MgPSBsZWFzb3QucGFyc2UoXHJcblx0XHRcdHJlYWRGaWxlU3luYyhqb2luKHByb2Nlc3MuY3dkKCksIGZpbGUpLCBcInV0Zi04XCIpLFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0ZXh0ZW5zaW9uOiBleHRuYW1lKGZpbGUpLFxyXG5cdFx0XHRcdGZpbGVuYW1lOiBiYXNlbmFtZShmaWxlKSxcclxuXHRcdFx0XHRjdXN0b21UYWdzOiBjb25maWcudG9kb1RhZ3MgPyBjb25maWcudG9kb1RhZ3Muc3BsaXQoXCIsXCIpIDogW11cclxuXHRcdFx0fVxyXG5cdFx0KTtcclxuXHJcblx0XHRmaWxlVG9kb3MuZm9yRWFjaCgodG9kbzogYW55KSA9PiB7XHJcblx0XHRcdGNvdW50Kys7XHJcblx0XHRcdGNvbnN0IHRvZG9PYmplY3QgPSB7XHJcblx0XHRcdFx0bGluZTogdG9kby5saW5lLFxyXG5cdFx0XHRcdHJlZjogdG9kby5yZWYsXHJcblx0XHRcdFx0dGV4dDogdG9kby50ZXh0LFxyXG5cdFx0XHRcdHRhZzogdG9kby50YWcsXHJcblx0XHRcdFx0cGF0aDogcmVsYXRpdmUocHJvY2Vzcy5jd2QoKSwgZmlsZSkucmVwbGFjZSgvXFxcXC9nLCBcIi9cIilcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdGlmICh0b2Rvc1t0b2RvLmZpbGVdKSB0b2Rvc1t0b2RvLmZpbGVdLnB1c2godG9kb09iamVjdCk7XHJcblx0XHRcdGVsc2UgdG9kb3NbdG9kby5maWxlXSA9IFt0b2RvT2JqZWN0XTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0T2JqZWN0LmtleXModG9kb3MpLmZvckVhY2goKGZpbGUpID0+IHtcclxuXHRcdHRvZG9zW2ZpbGVdLnNvcnQoKGEsIGIpID0+IGEubGluZSAtIGIubGluZSk7XHJcblx0fSk7XHJcblxyXG5cdGNvbnN0IGZpbmFsT2JqOiB7XHJcblx0XHRbbmFtZTogc3RyaW5nXTogc3RyaW5nW107XHJcblx0fSA9IHt9O1xyXG5cdE9iamVjdC5rZXlzKHRvZG9zKS5mb3JFYWNoKChmaWxlKSA9PiB7XHJcblx0XHRmaW5hbE9ialtmaWxlXSA9IHRvZG9zW2ZpbGVdLm1hcChcclxuXHRcdFx0KHRvZG8pID0+XHJcblx0XHRcdFx0YCR7Y2hhbGsueWVsbG93QnJpZ2h0KHRvZG8ucGF0aCl9JHtjaGFsay5oZXgoXCIjYmViZWJlXCIpKFxyXG5cdFx0XHRcdFx0XCIoXCIgKyB0b2RvLmxpbmUgKyBcIilcIlxyXG5cdFx0XHRcdCl9IOKAoiAke1xyXG5cdFx0XHRcdFx0dG9kby50YWcgPT09IFwiVE9ET1wiXHJcblx0XHRcdFx0XHRcdD8gY2hhbGsuaGV4KFwiI0ZGOEMwMFwiKSh0b2RvLnRhZylcclxuXHRcdFx0XHRcdFx0OiB0b2RvLnRhZyA9PT0gXCJGSVhNRVwiXHJcblx0XHRcdFx0XHRcdD8gY2hhbGsuaGV4KFwiI0ZGMkQwMFwiKSh0b2RvLnRhZylcclxuXHRcdFx0XHRcdFx0OiBjaGFsay5oZXgoXCIjOThDMzc5XCIpKHRvZG8udGFnKVxyXG5cdFx0XHRcdH0gJHtjaGFsay5oZXgoXCIjNzI4OURBXCIpKHRvZG8udGV4dCl9JHtcclxuXHRcdFx0XHRcdHRvZG8ucmVmID8gXCIg4oCiIFwiICsgY2hhbGsuZ3JlZW4oXCJSZWY6IFwiICsgdG9kby5yZWYpIDogXCJcIlxyXG5cdFx0XHRcdH1gXHJcblx0XHQpO1xyXG5cdH0pO1xyXG5cclxuXHRsb2dnZXIoYFRPRE8gY2hlY2sgZmluaXNoZWQuIEZvdW5kICR7Y291bnR9IFRPRE8ke2NvdW50ID4gMSA/IFwiJ3NcIiA6IFwiXCJ9LmApO1xyXG5cclxuXHRpZiAoT2JqZWN0LmtleXMoZmluYWxPYmopLmxlbmd0aCkge1xyXG5cdFx0Y29uc3QgdHJlZSA9IG5ldyBUcmVlKFxyXG5cdFx0XHRjaGFsay5oZXgoXCIjRkY4QzAwXCIpKGBGb3VuZCAke2NvdW50fSBUT0RPJHtjb3VudCA+IDEgPyBcIidzXCIgOiBcIlwifeKAplwiYCksXHJcblx0XHRcdHtcclxuXHRcdFx0XHRoZWFkQ2hhcjogZHNDb25zb2xlUHJlZml4ICsgXCIgXCJcclxuXHRcdFx0fVxyXG5cdFx0KTtcclxuXHRcdGNvbnN0IHNlY3Rpb25zOiBCcmFuY2hbXSA9IFtdO1xyXG5cdFx0Zm9yIChjb25zdCBbZmlsZU5hbWUsIHRvZG9BcnJheV0gb2YgT2JqZWN0LmVudHJpZXMoZmluYWxPYmopKSB7XHJcblx0XHRcdC8vKiBTcGFjaW5nIGJldHdlZW4gc3JjIGFuZCBlcnJvciBtZXNzYWdlLlxyXG5cdFx0XHRvdXRsaW5lKHRvZG9BcnJheSwgXCLigKJcIik7XHJcblx0XHRcdHNlY3Rpb25zLnB1c2goXHJcblx0XHRcdFx0bmV3IEJyYW5jaChjaGFsay5ib2xkKGNoYWxrLmN5YW4oZmlsZU5hbWUpKSkuYWRkQnJhbmNoKHRvZG9BcnJheSlcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHRcdHRyZWUuYWRkQnJhbmNoKHNlY3Rpb25zKS5sb2coKTtcclxuXHR9XHJcbn1cclxuIl19