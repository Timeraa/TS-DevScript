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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9kb0NoZWNrLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJ1dGlsL3RvZG9DaGVjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBaUM7QUFFakMsNkJBQStDO0FBQy9DLGtDQUF5RDtBQUV6RCxnREFBMEI7QUFDMUIsZ0RBQTBCO0FBQzFCLHVFQUFnRTtBQUNoRSx3REFBNkI7QUFDN0IsOEVBQWlEO0FBQ2pELHlCQUFrQztBQUVsQyxJQUFNLE1BQU0sR0FBRyxlQUFLLENBQUksWUFBSSxlQUFZLENBQUMsQ0FBQztBQUUxQyxTQUE4QixVQUFVOzs7Ozs7b0JBQ3ZDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO29CQUU5QixXQUFNLG1CQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBQTs7b0JBRDFELEtBQUssR0FBRyxDQUNaLFNBQThELENBQzlELENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxFQUE3QixDQUE2QixDQUFDLEVBQzlDLEtBQUssR0FRRCxFQUFFO29CQUNILEtBQUssR0FBRyxDQUFDLENBQUM7d0NBRUgsSUFBSTt3QkFDZCxJQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUM3QixpQkFBWSxDQUFDLFdBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsT0FBTyxDQUFDLEVBQ2hEOzRCQUNDLFNBQVMsRUFBRSxjQUFPLENBQUMsSUFBSSxDQUFDOzRCQUN4QixRQUFRLEVBQUUsZUFBUSxDQUFDLElBQUksQ0FBQzs0QkFDeEIsVUFBVSxFQUFFLGNBQU0sQ0FBQyxRQUFRLENB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QUFDLENBQUM7aUNBQ2hDOzZCQUNEO2lDQUFNO2dDQUNOLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQU0sZUFBSyxDQUFDLElBQUksQ0FBQyxlQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFHLENBQUMsQ0FBQztnQ0FDdEQsbUNBQWEsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7NkJBQ2hDO3lCQUNEO3FCQUNEOzs7OztDQUNEO0FBdEdELDZCQXNHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGxlYXNvdCBmcm9tIFwibGVhc290XCI7XHJcblxyXG5pbXBvcnQgeyBiYXNlbmFtZSwgZXh0bmFtZSwgam9pbiB9IGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7IGNvbmZpZywgZHNDb25zb2xlUHJlZml4LCBuYW1lIH0gZnJvbSBcIi4uL2luZGV4XCI7XHJcblxyXG5pbXBvcnQgY2hhbGsgZnJvbSBcImNoYWxrXCI7XHJcbmltcG9ydCBkZWJ1ZyBmcm9tIFwiZGVidWdcIjtcclxuaW1wb3J0IHsgZGlzcGxheUFzVHJlZSB9IGZyb20gXCIuL2Z1bmN0aW9ucy9kaXNwbGF5QXNUcmVlUHJlZml4XCI7XHJcbmltcG9ydCBnbG9iIGZyb20gXCJmYXN0LWdsb2JcIjtcclxuaW1wb3J0IG91dGxpbmUgZnJvbSBcIi4vZnVuY3Rpb25zL291dGxpbmVTdHJpbmdzXCI7XHJcbmltcG9ydCB7IHJlYWRGaWxlU3luYyB9IGZyb20gXCJmc1wiO1xyXG5cclxuY29uc3QgbG9nZ2VyID0gZGVidWcoYCR7bmFtZX06dG9kb2NoZWNrYCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBjaGVja1RvZG9zKCkge1xyXG5cdGxvZ2dlcihcIlJ1bm5pbmcgVE9ETyBjaGVjay4uLlwiKTtcclxuXHRjb25zdCBmaWxlcyA9IChcclxuXHRcdFx0YXdhaXQgZ2xvYihcIioqLyoudHNcIiwgeyBjd2Q6IHByb2Nlc3MuY3dkKCksIG9ubHlGaWxlczogdHJ1ZSB9KVxyXG5cdFx0KS5maWx0ZXIoKGYpID0+ICFmLnN0YXJ0c1dpdGgoXCJub2RlX21vZHVsZXNcIikpLFxyXG5cdFx0dG9kb3M6IHtcclxuXHRcdFx0W25hbWU6IHN0cmluZ106IHtcclxuXHRcdFx0XHRsaW5lOiBudW1iZXI7XHJcblx0XHRcdFx0cmVmOiBzdHJpbmc7XHJcblx0XHRcdFx0dGV4dDogc3RyaW5nO1xyXG5cdFx0XHRcdHRhZzogc3RyaW5nO1xyXG5cdFx0XHRcdHBhdGg6IHN0cmluZztcclxuXHRcdFx0fVtdO1xyXG5cdFx0fSA9IHt9O1xyXG5cdGxldCBjb3VudCA9IDA7XHJcblxyXG5cdGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xyXG5cdFx0Y29uc3QgZmlsZVRvZG9zID0gbGVhc290LnBhcnNlKFxyXG5cdFx0XHRyZWFkRmlsZVN5bmMoam9pbihwcm9jZXNzLmN3ZCgpLCBmaWxlKSwgXCJ1dGYtOFwiKSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGV4dGVuc2lvbjogZXh0bmFtZShmaWxlKSxcclxuXHRcdFx0XHRmaWxlbmFtZTogYmFzZW5hbWUoZmlsZSksXHJcblx0XHRcdFx0Y3VzdG9tVGFnczogY29uZmlnLnRvZG9UYWdzID8gY29uZmlnLnRvZG9UYWdzLnNwbGl0KFwiLFwiKSA6IFtdXHJcblx0XHRcdH1cclxuXHRcdCk7XHJcblxyXG5cdFx0ZmlsZVRvZG9zLmZvckVhY2goKHRvZG8pID0+IHtcclxuXHRcdFx0Y291bnQrKztcclxuXHRcdFx0aWYgKHRvZG9zW3RvZG8uZmlsZV0pIHtcclxuXHRcdFx0XHR0b2Rvc1t0b2RvLmZpbGVdLnB1c2goe1xyXG5cdFx0XHRcdFx0bGluZTogdG9kby5saW5lLFxyXG5cdFx0XHRcdFx0cmVmOiB0b2RvLnJlZixcclxuXHRcdFx0XHRcdHRleHQ6IHRvZG8udGV4dCxcclxuXHRcdFx0XHRcdHRhZzogdG9kby50YWcsXHJcblx0XHRcdFx0XHRwYXRoOiBqb2luKHByb2Nlc3MuY3dkKCksIGZpbGUpXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dG9kb3NbdG9kby5maWxlXSA9IFtcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0bGluZTogdG9kby5saW5lLFxyXG5cdFx0XHRcdFx0XHRyZWY6IHRvZG8ucmVmLFxyXG5cdFx0XHRcdFx0XHR0ZXh0OiB0b2RvLnRleHQsXHJcblx0XHRcdFx0XHRcdHRhZzogdG9kby50YWcsXHJcblx0XHRcdFx0XHRcdHBhdGg6IGpvaW4ocHJvY2Vzcy5jd2QoKSwgZmlsZSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRdO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdE9iamVjdC5rZXlzKHRvZG9zKS5mb3JFYWNoKChmaWxlKSA9PiB7XHJcblx0XHR0b2Rvc1tmaWxlXS5zb3J0KChhLCBiKSA9PiBhLmxpbmUgLSBiLmxpbmUpO1xyXG5cdH0pO1xyXG5cclxuXHRjb25zdCBmaW5hbE9iajoge1xyXG5cdFx0W25hbWU6IHN0cmluZ106IHN0cmluZ1tdO1xyXG5cdH0gPSB7fTtcclxuXHRPYmplY3Qua2V5cyh0b2RvcykuZm9yRWFjaCgoZmlsZSkgPT4ge1xyXG5cdFx0ZmluYWxPYmpbZmlsZV0gPSB0b2Rvc1tmaWxlXS5tYXAoXHJcblx0XHRcdCh0b2RvKSA9PlxyXG5cdFx0XHRcdGAke2NoYWxrLnllbGxvd0JyaWdodCh0b2RvLnBhdGgpfSR7Y2hhbGsuaGV4KFwiI2JlYmViZVwiKShcclxuXHRcdFx0XHRcdFwiKFwiICsgdG9kby5saW5lICsgXCIpXCJcclxuXHRcdFx0XHQpfSDigKIgJHtcclxuXHRcdFx0XHRcdHRvZG8udGFnID09PSBcIlRPRE9cIlxyXG5cdFx0XHRcdFx0XHQ/IGNoYWxrLmhleChcIiNGRjhDMDBcIikodG9kby50YWcpXHJcblx0XHRcdFx0XHRcdDogdG9kby50YWcgPT09IFwiRklYTUVcIlxyXG5cdFx0XHRcdFx0XHQ/IGNoYWxrLmhleChcIiNGRjJEMDBcIikodG9kby50YWcpXHJcblx0XHRcdFx0XHRcdDogY2hhbGsuaGV4KFwiIzk4QzM3OVwiKSh0b2RvLnRhZylcclxuXHRcdFx0XHR9ICR7Y2hhbGsuaGV4KFwiIzcyODlEQVwiKSh0b2RvLnRleHQpfSR7XHJcblx0XHRcdFx0XHR0b2RvLnJlZiA/IFwiIOKAoiBcIiArIGNoYWxrLmdyZWVuKFwiUmVmOiBcIiArIHRvZG8ucmVmKSA6IFwiXCJcclxuXHRcdFx0XHR9YFxyXG5cdFx0KTtcclxuXHR9KTtcclxuXHJcblx0bG9nZ2VyKGBUT0RPIGNoZWNrIGZpbmlzaGVkLiBGb3VuZCAke2NvdW50fSBUT0RPJ3MuYCk7XHJcblxyXG5cdGlmIChPYmplY3Qua2V5cyhmaW5hbE9iaikubGVuZ3RoID4gMCkge1xyXG5cdFx0Y29uc29sZS5sb2coXHJcblx0XHRcdGAke2RzQ29uc29sZVByZWZpeH0gJHtjaGFsay5oZXgoXCIjRkY4QzAwXCIpKFxyXG5cdFx0XHRcdFwiRm91bmQgXCIgKyBjb3VudCArIFwiIFRPRE8nc+KAplwiXHJcblx0XHRcdCl9YFxyXG5cdFx0KTtcclxuXHRcdGxldCBpID0gMDtcclxuXHRcdGZvciAoY29uc3QgW2ZpbGVOYW1lLCB0b2RvQXJyYXldIG9mIE9iamVjdC5lbnRyaWVzKGZpbmFsT2JqKSkge1xyXG5cdFx0XHQvLyogU3BhY2luZyBiZXR3ZWVuIHNyYyBhbmQgZXJyb3IgbWVzc2FnZS5cclxuXHRcdFx0b3V0bGluZSh0b2RvQXJyYXksIFwi4oCiXCIpO1xyXG5cclxuXHRcdFx0aSsrO1xyXG5cdFx0XHRpZiAoT2JqZWN0LmtleXMoZmluYWxPYmopLmxlbmd0aCA+IDEpIHtcclxuXHRcdFx0XHRpZiAoT2JqZWN0LmtleXMoZmluYWxPYmopLmxlbmd0aCA9PT0gaSkge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYOKVsOKUgCAke2NoYWxrLmJvbGQoY2hhbGsuY3lhbihmaWxlTmFtZSkpfWApO1xyXG5cdFx0XHRcdFx0ZGlzcGxheUFzVHJlZSh0b2RvQXJyYXksIFwiICAgXCIpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhg4pSc4pSAICR7Y2hhbGsuYm9sZChjaGFsay5jeWFuKGZpbGVOYW1lKSl9YCk7XHJcblx0XHRcdFx0XHRkaXNwbGF5QXNUcmVlKHRvZG9BcnJheSwgXCLilIIgIFwiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYOKVsOKUgCAke2NoYWxrLmJvbGQoY2hhbGsuY3lhbihmaWxlTmFtZSkpfWApO1xyXG5cdFx0XHRcdGRpc3BsYXlBc1RyZWUodG9kb0FycmF5LCBcIiAgIFwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4iXX0=