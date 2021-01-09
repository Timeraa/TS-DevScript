"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var command_line_args_1 = __importDefault(require("command-line-args"));
var path_1 = require("path");
var __1 = require("../");
var displayAsTree_1 = __importDefault(require("./functions/displayAsTree"));
var outlineStrings_1 = __importDefault(require("./functions/outlineStrings"));
function run() {
    var config;
    try {
        if (process.argv.includes("-h") || process.argv.includes("--help")) {
            displayAsTree_1.default(__1.dsConsolePrefix +
                " " +
                chalk_1.default.green(chalk_1.default.bold("DevScript") + " " + chalk_1.default.hex("#bebebe")("(v" + __1.version + ")")), [
                chalk_1.default.hex("#7289DA")(__1.description),
                chalk_1.default.hex("#ebc14d")("Author: " + chalk_1.default.hex("#bebebe")(__1.author)),
                chalk_1.default.hex("#ebc14d")("Contributor" + (__1.contributors.length === 1 ? "" : "s") + ": " + chalk_1.default.hex("#bebebe")(__1.contributors.join(chalk_1.default.hex("#ebc14d")(", "))))
            ]);
            showAvailableArgs();
            process.exit();
        }
        config = command_line_args_1.default([
            { name: "src", defaultValue: "src", type: String },
            { name: "out", defaultValue: "dist", type: String },
            { name: "deleteObsolete", defaultValue: true, type: String },
            { name: "tsconfig", defaultValue: "tsconfig.json", type: String },
            { name: "entry", defaultValue: null, type: String },
            { name: "depCheck", defaultValue: true, type: String },
            { name: "copyOnly", defaultValue: false, type: Boolean },
            { name: "ignore", defaultValue: null, type: String },
            { name: "include", defaultValue: null, type: String },
            { name: "silent", alias: "s", defaultValue: false, type: Boolean }
        ]);
        if (typeof config.depCheck === "string")
            config.depCheck = Boolean(config.depCheck);
        if (typeof config.deleteObsolete === "string")
            config.deleteObsolete = Boolean(config.deleteObsolete);
        try {
            var pkgJson = require(path_1.resolve(process.cwd(), "package.json"));
            if (pkgJson.devScript) {
                for (var key in pkgJson.devScript) {
                    if (config[key])
                        config[key] = pkgJson.devScript[key];
                }
            }
        }
        catch (e) { }
    }
    catch (e) {
        console.log(__1.dsConsolePrefix + " " + chalk_1.default.hex("#e83a3a")("Unknown argument \"" + chalk_1.default.bold(e.optionName) + "\"\u2026"));
        showAvailableArgs();
        process.exit();
    }
    return config;
}
exports.default = run;
function showAvailableArgs() {
    var configDescriptions = {
        src: {
            type: "string",
            description: "Directory containing the source code."
        },
        out: {
            type: "string",
            description: "Directory that will contain the output."
        },
        deleteObsolete: {
            type: "boolean",
            description: "Whether or not to delete files from out that are not in the src."
        },
        tsconfig: {
            type: "string",
            description: "Path to a valid tsconfig.json file."
        },
        entry: {
            type: "string",
            description: "Entry file to be executed after compilation."
        },
        depCheck: {
            type: "boolean",
            description: "Whether or not to check the dependencies."
        },
        copyOnly: {
            type: "boolean",
            description: "Whether or not only to copy the files from src to out"
        },
        ignore: {
            type: "string",
            description: "Files that should be ignored when watching files. (glob pattern)"
        },
        include: {
            type: "string",
            description: "Files that should be included when watching files. (glob pattern)"
        },
        silent: {
            type: "boolean",
            description: "Whether or not to print console logs."
        }
    };
    var settings = [];
    for (var _i = 0, _a = Object.entries(configDescriptions); _i < _a.length; _i++) {
        var _b = _a[_i], k = _b[0], v = _b[1];
        settings.push(chalk_1.default.yellowBright("--" + k) + " " + chalk_1.default.underline(chalk_1.default.hex("#bebebe")(v.type)) + " \u2022 " + chalk_1.default.hex("#7289DA")(v.description));
    }
    outlineStrings_1.default(settings, "•");
    displayAsTree_1.default(__1.dsConsolePrefix + " " + chalk_1.default.bold(chalk_1.default.green("Available arguments")), settings);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnSGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsidXRpbC9jb25maWdIYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsZ0RBQTBCO0FBQzFCLHdFQUF3QztBQUN4Qyw2QkFBK0I7QUFFL0IseUJBQWtGO0FBQ2xGLDRFQUFzRDtBQUN0RCw4RUFBaUQ7QUFnQmpELFNBQXdCLEdBQUc7SUFDMUIsSUFBSSxNQUFjLENBQUM7SUFFbkIsSUFBSTtRQUNILElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDbkUsdUJBQWEsQ0FDWixtQkFBZTtnQkFDZCxHQUFHO2dCQUNILGVBQUssQ0FBQyxLQUFLLENBQ1AsZUFBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBSSxlQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUNqRCxJQUFJLEdBQUcsV0FBTyxHQUFHLEdBQUcsQ0FDbEIsQ0FDSCxFQUNGO2dCQUNDLGVBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsZUFBVyxDQUFDO2dCQUNqQyxlQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLGFBQVcsZUFBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxVQUFNLENBQUcsQ0FBQztnQkFDL0QsZUFBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FDbkIsaUJBQWMsZ0JBQVksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBSyxlQUFLLENBQUMsR0FBRyxDQUMvRCxTQUFTLENBQ1QsQ0FBQyxnQkFBWSxDQUFDLElBQUksQ0FBQyxlQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUcs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QyxDQUFDO0tBQ0Y7SUFDRCx3QkFBTyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN2Qix1QkFBYSxDQUNULG1CQUFlLFNBQUksZUFBSyxDQUFDLElBQUksQ0FBQyxlQUFLLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUcsRUFDdEUsUUFBUSxDQUNSLENBQUM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNoYWxrIGZyb20gXCJjaGFsa1wiO1xyXG5pbXBvcnQgY21kQXJncyBmcm9tIFwiY29tbWFuZC1saW5lLWFyZ3NcIjtcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XHJcblxyXG5pbXBvcnQgeyBhdXRob3IsIGNvbnRyaWJ1dG9ycywgZGVzY3JpcHRpb24sIGRzQ29uc29sZVByZWZpeCwgdmVyc2lvbiB9IGZyb20gXCIuLi9cIjtcclxuaW1wb3J0IGRpc3BsYXlBc1RyZWUgZnJvbSBcIi4vZnVuY3Rpb25zL2Rpc3BsYXlBc1RyZWVcIjtcclxuaW1wb3J0IG91dGxpbmUgZnJvbSBcIi4vZnVuY3Rpb25zL291dGxpbmVTdHJpbmdzXCI7XHJcblxyXG5pbnRlcmZhY2UgY29uZmlnIHtcclxuXHRzcmM6IHN0cmluZztcclxuXHRvdXQ6IHN0cmluZztcclxuXHRkZWxldGVPYnNvbGV0ZTogYm9vbGVhbjtcclxuXHR0c2NvbmZpZzogc3RyaW5nO1xyXG5cdGVudHJ5OiBzdHJpbmc7XHJcblx0ZGVwQ2hlY2s6IGJvb2xlYW47XHJcblx0Y29weU9ubHk6IGJvb2xlYW47XHJcblx0d2F0Y2g6IGJvb2xlYW47XHJcblx0aWdub3JlOiBzdHJpbmc7XHJcblx0aW5jbHVkZTogc3RyaW5nO1xyXG5cdHNpbGVudDogYm9vbGVhbjtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcnVuKCkge1xyXG5cdGxldCBjb25maWc6IGNvbmZpZztcclxuXHJcblx0dHJ5IHtcclxuXHRcdGlmIChwcm9jZXNzLmFyZ3YuaW5jbHVkZXMoXCItaFwiKSB8fCBwcm9jZXNzLmFyZ3YuaW5jbHVkZXMoXCItLWhlbHBcIikpIHtcclxuXHRcdFx0ZGlzcGxheUFzVHJlZShcclxuXHRcdFx0XHRkc0NvbnNvbGVQcmVmaXggK1xyXG5cdFx0XHRcdFx0XCIgXCIgK1xyXG5cdFx0XHRcdFx0Y2hhbGsuZ3JlZW4oXHJcblx0XHRcdFx0XHRcdGAke2NoYWxrLmJvbGQoXCJEZXZTY3JpcHRcIil9ICR7Y2hhbGsuaGV4KFwiI2JlYmViZVwiKShcclxuXHRcdFx0XHRcdFx0XHRcIih2XCIgKyB2ZXJzaW9uICsgXCIpXCJcclxuXHRcdFx0XHRcdFx0KX1gXHJcblx0XHRcdFx0XHQpLFxyXG5cdFx0XHRcdFtcclxuXHRcdFx0XHRcdGNoYWxrLmhleChcIiM3Mjg5REFcIikoZGVzY3JpcHRpb24pLFxyXG5cdFx0XHRcdFx0Y2hhbGsuaGV4KFwiI2ViYzE0ZFwiKShgQXV0aG9yOiAke2NoYWxrLmhleChcIiNiZWJlYmVcIikoYXV0aG9yKX1gKSxcclxuXHRcdFx0XHRcdGNoYWxrLmhleChcIiNlYmMxNGRcIikoXHJcblx0XHRcdFx0XHRcdGBDb250cmlidXRvciR7Y29udHJpYnV0b3JzLmxlbmd0aCA9PT0gMSA/IFwiXCIgOiBcInNcIn06ICR7Y2hhbGsuaGV4KFxyXG5cdFx0XHRcdFx0XHRcdFwiI2JlYmViZVwiXHJcblx0XHRcdFx0XHRcdCkoY29udHJpYnV0b3JzLmpvaW4oY2hhbGsuaGV4KFwiI2ViYzE0ZFwiKShcIiwgXCIpKSl9YFxyXG5cdFx0XHRcdFx0KVxyXG5cdFx0XHRcdF1cclxuXHRcdFx0KTtcclxuXHRcdFx0c2hvd0F2YWlsYWJsZUFyZ3MoKTtcclxuXHRcdFx0cHJvY2Vzcy5leGl0KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uZmlnID0gY21kQXJncyhbXHJcblx0XHRcdHsgbmFtZTogXCJzcmNcIiwgZGVmYXVsdFZhbHVlOiBcInNyY1wiLCB0eXBlOiBTdHJpbmcgfSxcclxuXHRcdFx0eyBuYW1lOiBcIm91dFwiLCBkZWZhdWx0VmFsdWU6IFwiZGlzdFwiLCB0eXBlOiBTdHJpbmcgfSxcclxuXHRcdFx0eyBuYW1lOiBcImRlbGV0ZU9ic29sZXRlXCIsIGRlZmF1bHRWYWx1ZTogdHJ1ZSwgdHlwZTogU3RyaW5nIH0sXHJcblx0XHRcdHsgbmFtZTogXCJ0c2NvbmZpZ1wiLCBkZWZhdWx0VmFsdWU6IFwidHNjb25maWcuanNvblwiLCB0eXBlOiBTdHJpbmcgfSxcclxuXHRcdFx0eyBuYW1lOiBcImVudHJ5XCIsIGRlZmF1bHRWYWx1ZTogbnVsbCwgdHlwZTogU3RyaW5nIH0sXHJcblx0XHRcdHsgbmFtZTogXCJkZXBDaGVja1wiLCBkZWZhdWx0VmFsdWU6IHRydWUsIHR5cGU6IFN0cmluZyB9LFxyXG5cdFx0XHR7IG5hbWU6IFwiY29weU9ubHlcIiwgZGVmYXVsdFZhbHVlOiBmYWxzZSwgdHlwZTogQm9vbGVhbiB9LFxyXG5cdFx0XHR7IG5hbWU6IFwiaWdub3JlXCIsIGRlZmF1bHRWYWx1ZTogbnVsbCwgdHlwZTogU3RyaW5nIH0sXHJcblx0XHRcdHsgbmFtZTogXCJpbmNsdWRlXCIsIGRlZmF1bHRWYWx1ZTogbnVsbCwgdHlwZTogU3RyaW5nIH0sXHJcblx0XHRcdHsgbmFtZTogXCJzaWxlbnRcIiwgYWxpYXM6IFwic1wiLCBkZWZhdWx0VmFsdWU6IGZhbHNlLCB0eXBlOiBCb29sZWFuIH1cclxuXHRcdF0pIGFzIGFueTtcclxuXHJcblx0XHRpZiAodHlwZW9mIGNvbmZpZy5kZXBDaGVjayA9PT0gXCJzdHJpbmdcIilcclxuXHRcdFx0Y29uZmlnLmRlcENoZWNrID0gQm9vbGVhbihjb25maWcuZGVwQ2hlY2spO1xyXG5cdFx0aWYgKHR5cGVvZiBjb25maWcuZGVsZXRlT2Jzb2xldGUgPT09IFwic3RyaW5nXCIpXHJcblx0XHRcdGNvbmZpZy5kZWxldGVPYnNvbGV0ZSA9IEJvb2xlYW4oY29uZmlnLmRlbGV0ZU9ic29sZXRlKTtcclxuXHJcblx0XHQvLyogVGFrZSBwb3NzaWJsZSBjb25maWcgdmFsdWVzIGZyb20gcGFja2FnZS5qc29uIG9mIHByb2plY3RcclxuXHRcdHRyeSB7XHJcblx0XHRcdGNvbnN0IHBrZ0pzb24gPSByZXF1aXJlKHJlc29sdmUocHJvY2Vzcy5jd2QoKSwgXCJwYWNrYWdlLmpzb25cIikpO1xyXG5cclxuXHRcdFx0aWYgKHBrZ0pzb24uZGV2U2NyaXB0KSB7XHJcblx0XHRcdFx0Zm9yIChsZXQga2V5IGluIHBrZ0pzb24uZGV2U2NyaXB0KSB7XHJcblx0XHRcdFx0XHRpZiAoY29uZmlnW2tleV0pIGNvbmZpZ1trZXldID0gcGtnSnNvbi5kZXZTY3JpcHRba2V5XTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0gY2F0Y2ggKGUpIHt9XHJcblx0fSBjYXRjaCAoZSkge1xyXG5cdFx0Y29uc29sZS5sb2coXHJcblx0XHRcdGAke2RzQ29uc29sZVByZWZpeH0gJHtjaGFsay5oZXgoXCIjZTgzYTNhXCIpKFxyXG5cdFx0XHRcdGBVbmtub3duIGFyZ3VtZW50IFwiJHtjaGFsay5ib2xkKGUub3B0aW9uTmFtZSl9XCLigKZgXHJcblx0XHRcdCl9YFxyXG5cdFx0KTtcclxuXHRcdHNob3dBdmFpbGFibGVBcmdzKCk7XHJcblx0XHRwcm9jZXNzLmV4aXQoKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBjb25maWc7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNob3dBdmFpbGFibGVBcmdzKCk6IHZvaWQge1xyXG5cdGNvbnN0IGNvbmZpZ0Rlc2NyaXB0aW9uczoge1xyXG5cdFx0W25hbWU6IHN0cmluZ106IHtcclxuXHRcdFx0dHlwZTogc3RyaW5nO1xyXG5cdFx0XHRkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG5cdFx0fTtcclxuXHR9ID0ge1xyXG5cdFx0c3JjOiB7XHJcblx0XHRcdHR5cGU6IFwic3RyaW5nXCIsXHJcblx0XHRcdGRlc2NyaXB0aW9uOiBcIkRpcmVjdG9yeSBjb250YWluaW5nIHRoZSBzb3VyY2UgY29kZS5cIlxyXG5cdFx0fSxcclxuXHRcdG91dDoge1xyXG5cdFx0XHR0eXBlOiBcInN0cmluZ1wiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJEaXJlY3RvcnkgdGhhdCB3aWxsIGNvbnRhaW4gdGhlIG91dHB1dC5cIlxyXG5cdFx0fSxcclxuXHRcdGRlbGV0ZU9ic29sZXRlOiB7XHJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjpcclxuXHRcdFx0XHRcIldoZXRoZXIgb3Igbm90IHRvIGRlbGV0ZSBmaWxlcyBmcm9tIG91dCB0aGF0IGFyZSBub3QgaW4gdGhlIHNyYy5cIlxyXG5cdFx0fSxcclxuXHRcdHRzY29uZmlnOiB7XHJcblx0XHRcdHR5cGU6IFwic3RyaW5nXCIsXHJcblx0XHRcdGRlc2NyaXB0aW9uOiBcIlBhdGggdG8gYSB2YWxpZCB0c2NvbmZpZy5qc29uIGZpbGUuXCJcclxuXHRcdH0sXHJcblx0XHRlbnRyeToge1xyXG5cdFx0XHR0eXBlOiBcInN0cmluZ1wiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJFbnRyeSBmaWxlIHRvIGJlIGV4ZWN1dGVkIGFmdGVyIGNvbXBpbGF0aW9uLlwiXHJcblx0XHR9LFxyXG5cdFx0ZGVwQ2hlY2s6IHtcclxuXHRcdFx0dHlwZTogXCJib29sZWFuXCIsXHJcblx0XHRcdGRlc2NyaXB0aW9uOiBcIldoZXRoZXIgb3Igbm90IHRvIGNoZWNrIHRoZSBkZXBlbmRlbmNpZXMuXCJcclxuXHRcdH0sXHJcblx0XHRjb3B5T25seToge1xyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcclxuXHRcdFx0ZGVzY3JpcHRpb246IFwiV2hldGhlciBvciBub3Qgb25seSB0byBjb3B5IHRoZSBmaWxlcyBmcm9tIHNyYyB0byBvdXRcIlxyXG5cdFx0fSxcclxuXHRcdGlnbm9yZToge1xyXG5cdFx0XHR0eXBlOiBcInN0cmluZ1wiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjpcclxuXHRcdFx0XHRcIkZpbGVzIHRoYXQgc2hvdWxkIGJlIGlnbm9yZWQgd2hlbiB3YXRjaGluZyBmaWxlcy4gKGdsb2IgcGF0dGVybilcIlxyXG5cdFx0fSxcclxuXHRcdGluY2x1ZGU6IHtcclxuXHRcdFx0dHlwZTogXCJzdHJpbmdcIixcclxuXHRcdFx0ZGVzY3JpcHRpb246XHJcblx0XHRcdFx0XCJGaWxlcyB0aGF0IHNob3VsZCBiZSBpbmNsdWRlZCB3aGVuIHdhdGNoaW5nIGZpbGVzLiAoZ2xvYiBwYXR0ZXJuKVwiXHJcblx0XHR9LFxyXG5cdFx0c2lsZW50OiB7XHJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJXaGV0aGVyIG9yIG5vdCB0byBwcmludCBjb25zb2xlIGxvZ3MuXCJcclxuXHRcdH1cclxuXHR9O1xyXG5cdGxldCBzZXR0aW5nczogc3RyaW5nW10gPSBbXTtcclxuXHRmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhjb25maWdEZXNjcmlwdGlvbnMpKSB7XHJcblx0XHRzZXR0aW5ncy5wdXNoKFxyXG5cdFx0XHRgJHtjaGFsay55ZWxsb3dCcmlnaHQoXCItLVwiICsgayl9ICR7Y2hhbGsudW5kZXJsaW5lKFxyXG5cdFx0XHRcdGNoYWxrLmhleChcIiNiZWJlYmVcIikodi50eXBlKVxyXG5cdFx0XHQpfSDigKIgJHtjaGFsay5oZXgoXCIjNzI4OURBXCIpKHYuZGVzY3JpcHRpb24pfWBcclxuXHRcdCk7XHJcblx0fVxyXG5cdG91dGxpbmUoc2V0dGluZ3MsIFwi4oCiXCIpO1xyXG5cdGRpc3BsYXlBc1RyZWUoXHJcblx0XHRgJHtkc0NvbnNvbGVQcmVmaXh9ICR7Y2hhbGsuYm9sZChjaGFsay5ncmVlbihcIkF2YWlsYWJsZSBhcmd1bWVudHNcIikpfWAsXHJcblx0XHRzZXR0aW5nc1xyXG5cdCk7XHJcbn1cclxuIl19