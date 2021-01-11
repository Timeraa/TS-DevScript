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
var index_1 = require("../index");
var chalk_1 = __importDefault(require("chalk"));
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
                            customTags: index_1.config.todoTags ? index_1.config.todoTags.split(",") : []
                        });
                        fileTodos.forEach(function (todo) {
                            count++;
                            var todoObject = {
                                line: todo.line,
                                ref: todo.ref,
                                text: todo.text,
                                tag: todo.tag,
                                path: path_1.relative(process.cwd(), file).replace(/\\/g, "/")
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9kb0NoZWNrLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJ1dGlsL3RvZG9DaGVjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBaUM7QUFFakMsNkJBQWtFO0FBQ2xFLGtDQUF5RDtBQUV6RCxnREFBMEI7QUFDMUIsZ0RBQTBCO0FBQzFCLHVFQUFnRTtBQUNoRSx3REFBNkI7QUFDN0IsOEVBQWlEO0FBQ2pELHlCQUFrQztBQUVsQyxJQUFNLE1BQU0sR0FBRyxlQUFLLENBQUksWUFBSSxlQUFZLENBQUMsQ0FBQztBQUUxQyxTQUE4QixVQUFVOzs7Ozs7b0JBQ3ZDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO29CQUU5QixXQUFNLG1CQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBQTs7b0JBRDFELEtBQUssR0FBRyxDQUNaLFNBQThELENBQzlELENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxFQUE3QixDQUE2QixDQUFDLEVBQzlDLEtBQUssR0FRRCxFQUFFO29CQUNILEtBQUssR0FBRyxDQUFDLENBQUM7d0NBRUgsSUFBSTt3QkFDZCxJQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUM3QixpQkFBWSxDQUFDLFdBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsT0FBTyxDQUFDLEVBQ2hEOzRCQUNDLFNBQVMsRUFBRSxjQUFPLENBQUMsSUFBSSxDQUFDOzRCQUN4QixRQUFRLEVBQUUsZUFBUSxDQUFDLElBQUksQ0FBQzs0QkFDeEIsVUFBVSxFQUFFLGNBQU0sQ0FBQyxRQUFRLENB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QVMsRUFBRSxLQUFLLENBQUMsQ0FBQzs2QkFDaEM7eUJBQ0Q7cUJBQ0Q7Ozs7O0NBQ0Q7QUE3RkQsNkJBNkZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbGVhc290IGZyb20gXCJsZWFzb3RcIjtcclxuXHJcbmltcG9ydCB7IGJhc2VuYW1lLCBkaXJuYW1lLCBleHRuYW1lLCBqb2luLCByZWxhdGl2ZSB9IGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7IGNvbmZpZywgZHNDb25zb2xlUHJlZml4LCBuYW1lIH0gZnJvbSBcIi4uL2luZGV4XCI7XHJcblxyXG5pbXBvcnQgY2hhbGsgZnJvbSBcImNoYWxrXCI7XHJcbmltcG9ydCBkZWJ1ZyBmcm9tIFwiZGVidWdcIjtcclxuaW1wb3J0IHsgZGlzcGxheUFzVHJlZSB9IGZyb20gXCIuL2Z1bmN0aW9ucy9kaXNwbGF5QXNUcmVlUHJlZml4XCI7XHJcbmltcG9ydCBnbG9iIGZyb20gXCJmYXN0LWdsb2JcIjtcclxuaW1wb3J0IG91dGxpbmUgZnJvbSBcIi4vZnVuY3Rpb25zL291dGxpbmVTdHJpbmdzXCI7XHJcbmltcG9ydCB7IHJlYWRGaWxlU3luYyB9IGZyb20gXCJmc1wiO1xyXG5cclxuY29uc3QgbG9nZ2VyID0gZGVidWcoYCR7bmFtZX06dG9kb2NoZWNrYCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBjaGVja1RvZG9zKCkge1xyXG5cdGxvZ2dlcihcIlJ1bm5pbmcgVE9ETyBjaGVjay4uLlwiKTtcclxuXHRjb25zdCBmaWxlcyA9IChcclxuXHRcdFx0YXdhaXQgZ2xvYihcIioqLyoudHNcIiwgeyBjd2Q6IHByb2Nlc3MuY3dkKCksIG9ubHlGaWxlczogdHJ1ZSB9KVxyXG5cdFx0KS5maWx0ZXIoKGYpID0+ICFmLnN0YXJ0c1dpdGgoXCJub2RlX21vZHVsZXNcIikpLFxyXG5cdFx0dG9kb3M6IHtcclxuXHRcdFx0W25hbWU6IHN0cmluZ106IHtcclxuXHRcdFx0XHRsaW5lOiBudW1iZXI7XHJcblx0XHRcdFx0cmVmOiBzdHJpbmc7XHJcblx0XHRcdFx0dGV4dDogc3RyaW5nO1xyXG5cdFx0XHRcdHRhZzogc3RyaW5nO1xyXG5cdFx0XHRcdHBhdGg6IHN0cmluZztcclxuXHRcdFx0fVtdO1xyXG5cdFx0fSA9IHt9O1xyXG5cdGxldCBjb3VudCA9IDA7XHJcblxyXG5cdGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xyXG5cdFx0Y29uc3QgZmlsZVRvZG9zID0gbGVhc290LnBhcnNlKFxyXG5cdFx0XHRyZWFkRmlsZVN5bmMoam9pbihwcm9jZXNzLmN3ZCgpLCBmaWxlKSwgXCJ1dGYtOFwiKSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGV4dGVuc2lvbjogZXh0bmFtZShmaWxlKSxcclxuXHRcdFx0XHRmaWxlbmFtZTogYmFzZW5hbWUoZmlsZSksXHJcblx0XHRcdFx0Y3VzdG9tVGFnczogY29uZmlnLnRvZG9UYWdzID8gY29uZmlnLnRvZG9UYWdzLnNwbGl0KFwiLFwiKSA6IFtdXHJcblx0XHRcdH1cclxuXHRcdCk7XHJcblxyXG5cdFx0ZmlsZVRvZG9zLmZvckVhY2goKHRvZG8pID0+IHtcclxuXHRcdFx0Y291bnQrKztcclxuXHRcdFx0Y29uc3QgdG9kb09iamVjdCA9IHtcclxuXHRcdFx0XHRsaW5lOiB0b2RvLmxpbmUsXHJcblx0XHRcdFx0cmVmOiB0b2RvLnJlZixcclxuXHRcdFx0XHR0ZXh0OiB0b2RvLnRleHQsXHJcblx0XHRcdFx0dGFnOiB0b2RvLnRhZyxcclxuXHRcdFx0XHRwYXRoOiByZWxhdGl2ZShwcm9jZXNzLmN3ZCgpLCBmaWxlKS5yZXBsYWNlKC9cXFxcL2csIFwiL1wiKVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0aWYgKHRvZG9zW3RvZG8uZmlsZV0pIHRvZG9zW3RvZG8uZmlsZV0ucHVzaCh0b2RvT2JqZWN0KTtcclxuXHRcdFx0ZWxzZSB0b2Rvc1t0b2RvLmZpbGVdID0gW3RvZG9PYmplY3RdO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRPYmplY3Qua2V5cyh0b2RvcykuZm9yRWFjaCgoZmlsZSkgPT4ge1xyXG5cdFx0dG9kb3NbZmlsZV0uc29ydCgoYSwgYikgPT4gYS5saW5lIC0gYi5saW5lKTtcclxuXHR9KTtcclxuXHJcblx0Y29uc3QgZmluYWxPYmo6IHtcclxuXHRcdFtuYW1lOiBzdHJpbmddOiBzdHJpbmdbXTtcclxuXHR9ID0ge307XHJcblx0T2JqZWN0LmtleXModG9kb3MpLmZvckVhY2goKGZpbGUpID0+IHtcclxuXHRcdGZpbmFsT2JqW2ZpbGVdID0gdG9kb3NbZmlsZV0ubWFwKFxyXG5cdFx0XHQodG9kbykgPT5cclxuXHRcdFx0XHRgJHtjaGFsay55ZWxsb3dCcmlnaHQodG9kby5wYXRoKX0ke2NoYWxrLmhleChcIiNiZWJlYmVcIikoXHJcblx0XHRcdFx0XHRcIihcIiArIHRvZG8ubGluZSArIFwiKVwiXHJcblx0XHRcdFx0KX0g4oCiICR7XHJcblx0XHRcdFx0XHR0b2RvLnRhZyA9PT0gXCJUT0RPXCJcclxuXHRcdFx0XHRcdFx0PyBjaGFsay5oZXgoXCIjRkY4QzAwXCIpKHRvZG8udGFnKVxyXG5cdFx0XHRcdFx0XHQ6IHRvZG8udGFnID09PSBcIkZJWE1FXCJcclxuXHRcdFx0XHRcdFx0PyBjaGFsay5oZXgoXCIjRkYyRDAwXCIpKHRvZG8udGFnKVxyXG5cdFx0XHRcdFx0XHQ6IGNoYWxrLmhleChcIiM5OEMzNzlcIikodG9kby50YWcpXHJcblx0XHRcdFx0fSAke2NoYWxrLmhleChcIiM3Mjg5REFcIikodG9kby50ZXh0KX0ke1xyXG5cdFx0XHRcdFx0dG9kby5yZWYgPyBcIiDigKIgXCIgKyBjaGFsay5ncmVlbihcIlJlZjogXCIgKyB0b2RvLnJlZikgOiBcIlwiXHJcblx0XHRcdFx0fWBcclxuXHRcdCk7XHJcblx0fSk7XHJcblxyXG5cdGxvZ2dlcihgVE9ETyBjaGVjayBmaW5pc2hlZC4gRm91bmQgJHtjb3VudH0gVE9ETydzLmApO1xyXG5cclxuXHRpZiAoT2JqZWN0LmtleXMoZmluYWxPYmopLmxlbmd0aCA+IDApIHtcclxuXHRcdGNvbnNvbGUubG9nKFxyXG5cdFx0XHRgJHtkc0NvbnNvbGVQcmVmaXh9ICR7Y2hhbGsuaGV4KFwiI0ZGOEMwMFwiKShcclxuXHRcdFx0XHRcIkZvdW5kIFwiICsgY291bnQgKyBcIiBUT0RPJ3PigKZcIlxyXG5cdFx0XHQpfWBcclxuXHRcdCk7XHJcblx0XHRsZXQgaSA9IDA7XHJcblx0XHRmb3IgKGNvbnN0IFtmaWxlTmFtZSwgdG9kb0FycmF5XSBvZiBPYmplY3QuZW50cmllcyhmaW5hbE9iaikpIHtcclxuXHRcdFx0Ly8qIFNwYWNpbmcgYmV0d2VlbiBzcmMgYW5kIGVycm9yIG1lc3NhZ2UuXHJcblx0XHRcdG91dGxpbmUodG9kb0FycmF5LCBcIuKAolwiKTtcclxuXHJcblx0XHRcdGkrKztcclxuXHRcdFx0aWYgKE9iamVjdC5rZXlzKGZpbmFsT2JqKS5sZW5ndGggPiAxKSB7XHJcblx0XHRcdFx0aWYgKE9iamVjdC5rZXlzKGZpbmFsT2JqKS5sZW5ndGggPT09IGkpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGDilbDilIAgJHtjaGFsay5ib2xkKGNoYWxrLmN5YW4oZmlsZU5hbWUpKX1gKTtcclxuXHRcdFx0XHRcdGRpc3BsYXlBc1RyZWUodG9kb0FycmF5LCBcIiAgIFwiKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYOKUnOKUgCAke2NoYWxrLmJvbGQoY2hhbGsuY3lhbihmaWxlTmFtZSkpfWApO1xyXG5cdFx0XHRcdFx0ZGlzcGxheUFzVHJlZSh0b2RvQXJyYXksIFwi4pSCICBcIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGDilbDilIAgJHtjaGFsay5ib2xkKGNoYWxrLmN5YW4oZmlsZU5hbWUpKX1gKTtcclxuXHRcdFx0XHRkaXNwbGF5QXNUcmVlKHRvZG9BcnJheSwgXCIgICBcIik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn1cclxuIl19