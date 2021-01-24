"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../");
var chalk_1 = __importDefault(require("chalk"));
var command_line_args_1 = __importDefault(require("command-line-args"));
var outlineStrings_1 = __importDefault(require("./functions/outlineStrings"));
var path_1 = require("path");
var displayastree_1 = require("displayastree");
function run() {
    var config;
    try {
        if (process.argv.includes("-h") || process.argv.includes("--help")) {
            new displayastree_1.DisplayAsTree(chalk_1.default.green(chalk_1.default.bold("DevScript") + " " + chalk_1.default.hex("#bebebe")("(v" + __1.version + ")")), { startChar: __1.dsConsolePrefix + " " })
                .addSection([
                chalk_1.default.hex("#7289DA")(__1.description),
                chalk_1.default.hex("#ebc14d")("Author: " + chalk_1.default.hex("#bebebe")(__1.author)),
                chalk_1.default.hex("#ebc14d")("Contributor" + (__1.contributors.length === 1 ? "" : "s") + ": " + chalk_1.default.hex("#bebebe")(__1.contributors.join(chalk_1.default.hex("#ebc14d")(", "))))
            ])
                .log();
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
            { name: "excludeDeps", defaultValue: null, type: String },
            { name: "autoInstallDep", defaultValue: true, type: Boolean },
            { name: "autoRemoveDep", defaultValue: true, type: Boolean },
            { name: "autoInstallTypes", defaultValue: true, type: Boolean },
            { name: "autoRemoveTypes", defaultValue: true, type: Boolean },
            { name: "autoUpdateOutdated", defaultValue: false, type: Boolean },
            { name: "autoUpdateDeprecated", defaultValue: false, type: Boolean },
            { name: "updateSelector", defaultValue: true, type: Boolean },
            { name: "todoCheck", defaultValue: true, type: String },
            { name: "todoTags", defaultValue: null, type: String },
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
        excludeDeps: {
            type: "string",
            description: "Dependencies to exclude from automatically uninstalling. (String list seperated by commas)"
        },
        autoInstallDep: {
            type: "boolean",
            description: "Automatically installs missing dependencies. (Needs depCheck enabled)"
        },
        autoRemoveDep: {
            type: "boolean",
            description: "Automatically removes unused dependencies. (Needs depCheck enabled)"
        },
        autoInstallTypes: {
            type: "boolean",
            description: "Automatically installs missing dependencies @types/. (Needs depCheck and autoInstallDep enabled)"
        },
        autoRemoveTypes: {
            type: "boolean",
            description: "Automatically removes unused dependencies @types/. (Needs depCheck and autoRemoveDep enabled)"
        },
        autoUpdateOutdated: {
            type: "boolean",
            description: "Automatically update outdated dependencies to their latest version. (Needs depCheck enabled)"
        },
        autoUpdateDeprecated: {
            type: "boolean",
            description: "Automatically update deprecated dependencies to their latest version. (Needs depCheck enabled)"
        },
        updateSelector: {
            type: "boolean",
            description: "Whether or not to show the update selector for deprecated or outdated dependencies. (Needs depCheck enabled)"
        },
        todoCheck: {
            type: "boolean",
            description: "Whether or not to check for TODO's."
        },
        todoTags: {
            type: "string",
            description: "Custom tags to include in the TODO check. (String list seperated by commas)"
        },
        copyOnly: {
            type: "boolean",
            description: "Whether or not only to copy the files from src to out."
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
    new displayastree_1.DisplayAsTree(chalk_1.default.bold(chalk_1.default.green("Available arguments")), {
        startChar: __1.dsConsolePrefix + " "
    })
        .addSection(settings)
        .log();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnSGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsidXRpbC9jb25maWdIYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEseUJBTWE7QUFFYixnREFBMEI7QUFDMUIsd0VBQXdDO0FBQ3hDLDhFQUFpRDtBQUNqRCw2QkFBK0I7QUFDL0IsK0NBQThDO0FBMEI5QyxTQUF3QixHQUFHO0lBQzFCLElBQUksTUFBYyxDQUFDO0lBRW5CLElBQUk7UUFDSCxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ25FLElBQUksNkJBQWEsQ0FDaEIsZUFBSyxDQUFDLEtBQUssQ0FDUCxlQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFJLGVBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQ2pELElBQUksR0FBRyxXQUFPLEdBQUcsR0FBRyxDQUNsQixDQUNILEVBQ0QsRUFBRSxTQUFTLEVBQUUsbUJBQWUsR0FBRyxHQUFHLEVBQUUsQ0FDcEM7aUJBQ0MsVUFBVSxDQUFDO2dCQUNYLGVBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsZUFBVyxDQUFDO2dCQUNqQyxlQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLGFBQVcsZUFBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxVQUFNLENBQUcsQ0FBQztnQkFDL0QsZUFBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FDbkIsaUJBQWMsZ0JBQVksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBSyxlQUFLLENBQUMsR0FBRyxDQUMvRCxTQUFTLENBQ1QsQ0FBQyxnQkFBWSxDQUFDLElBQUksQ0FBQyxlQUFLLENBQUMsR0FBRyxD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Q0QsT0FBTyxFQUFFO1lBQ1IsSUFBSSxFQUFFLFFBQVE7WUFDZCxXQUFXLEVBQ1YsbUVBQW1FO1NBQ3BFO1FBQ0QsTUFBTSxFQUFFO1lBQ1AsSUFBSSxFQUFFLFNBQVM7WUFDZixXQUFXLEVBQUUsdUNBQXVDO1NBQ3BEO0tBQ0QsQ0FBQztJQUNGLElBQUksUUFBUSxHQUFhLEVBQUUsQ0FBQztJQUM1QixLQUFxQixVQUFrQyxFQUFsQyxLQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsRUFBbEMsY0FBa0MsRUFBbEMsSUFBa0MsRUFBRTtRQUE5QyxJQUFBLFdBQU0sRUFBTCxDQUFDLFFBQUEsRUFBRSxDQUFDLFFBQUE7UUFDZixRQUFRLENBQUMsSUFBSSxDQUNULGVBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxTQUFJLGVBQUssQ0FBQyxTQUFTLENBQ2pELGVBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUM1QixnQkFBTSxlQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUcsQ0FDNUMsQ0FBQztLQUNGO0lBQ0Qsd0JBQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdkIsSUFBSSw2QkFBYSxDQUFDLGVBQUssQ0FBQyxJQUFJLENBQUMsZUFBSyxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLEVBQUU7UUFDakUsU0FBUyxFQUFFLG1CQUFlLEdBQUcsR0FBRztLQUNoQyxDQUFDO1NBQ0EsVUFBVSxDQUFDLFFBQVEsQ0FBQztTQUNwQixHQUFHLEVBQUUsQ0FBQztBQUNULENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG5cdGF1dGhvcixcclxuXHRjb250cmlidXRvcnMsXHJcblx0ZGVzY3JpcHRpb24sXHJcblx0ZHNDb25zb2xlUHJlZml4LFxyXG5cdHZlcnNpb25cclxufSBmcm9tIFwiLi4vXCI7XHJcblxyXG5pbXBvcnQgY2hhbGsgZnJvbSBcImNoYWxrXCI7XHJcbmltcG9ydCBjbWRBcmdzIGZyb20gXCJjb21tYW5kLWxpbmUtYXJnc1wiO1xyXG5pbXBvcnQgb3V0bGluZSBmcm9tIFwiLi9mdW5jdGlvbnMvb3V0bGluZVN0cmluZ3NcIjtcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7IERpc3BsYXlBc1RyZWUgfSBmcm9tIFwiZGlzcGxheWFzdHJlZVwiO1xyXG5cclxuaW50ZXJmYWNlIGNvbmZpZyB7XHJcblx0c3JjOiBzdHJpbmc7XHJcblx0b3V0OiBzdHJpbmc7XHJcblx0ZGVsZXRlT2Jzb2xldGU6IGJvb2xlYW47XHJcblx0dHNjb25maWc6IHN0cmluZztcclxuXHRlbnRyeTogc3RyaW5nO1xyXG5cdGRlcENoZWNrOiBib29sZWFuO1xyXG5cdGV4Y2x1ZGVEZXBzOiBzdHJpbmc7XHJcblx0YXV0b0luc3RhbGxEZXA6IGJvb2xlYW47XHJcblx0YXV0b1JlbW92ZURlcDogYm9vbGVhbjtcclxuXHRhdXRvSW5zdGFsbFR5cGVzOiBib29sZWFuO1xyXG5cdGF1dG9SZW1vdmVUeXBlczogYm9vbGVhbjtcclxuXHRhdXRvVXBkYXRlT3V0ZGF0ZWQ6IGJvb2xlYW47XHJcblx0YXV0b1VwZGF0ZURlcHJlY2F0ZWQ6IGJvb2xlYW47XHJcblx0dXBkYXRlU2VsZWN0b3I6IGJvb2xlYW47XHJcblx0dG9kb0NoZWNrOiBib29sZWFuO1xyXG5cdHRvZG9UYWdzOiBzdHJpbmc7XHJcblx0Y29weU9ubHk6IGJvb2xlYW47XHJcblx0d2F0Y2g6IGJvb2xlYW47XHJcblx0aWdub3JlOiBzdHJpbmc7XHJcblx0aW5jbHVkZTogc3RyaW5nO1xyXG5cdHNpbGVudDogYm9vbGVhbjtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcnVuKCkge1xyXG5cdGxldCBjb25maWc6IGNvbmZpZztcclxuXHJcblx0dHJ5IHtcclxuXHRcdGlmIChwcm9jZXNzLmFyZ3YuaW5jbHVkZXMoXCItaFwiKSB8fCBwcm9jZXNzLmFyZ3YuaW5jbHVkZXMoXCItLWhlbHBcIikpIHtcclxuXHRcdFx0bmV3IERpc3BsYXlBc1RyZWUoXHJcblx0XHRcdFx0Y2hhbGsuZ3JlZW4oXHJcblx0XHRcdFx0XHRgJHtjaGFsay5ib2xkKFwiRGV2U2NyaXB0XCIpfSAke2NoYWxrLmhleChcIiNiZWJlYmVcIikoXHJcblx0XHRcdFx0XHRcdFwiKHZcIiArIHZlcnNpb24gKyBcIilcIlxyXG5cdFx0XHRcdFx0KX1gXHJcblx0XHRcdFx0KSxcclxuXHRcdFx0XHR7IHN0YXJ0Q2hhcjogZHNDb25zb2xlUHJlZml4ICsgXCIgXCIgfVxyXG5cdFx0XHQpXHJcblx0XHRcdFx0LmFkZFNlY3Rpb24oW1xyXG5cdFx0XHRcdFx0Y2hhbGsuaGV4KFwiIzcyODlEQVwiKShkZXNjcmlwdGlvbiksXHJcblx0XHRcdFx0XHRjaGFsay5oZXgoXCIjZWJjMTRkXCIpKGBBdXRob3I6ICR7Y2hhbGsuaGV4KFwiI2JlYmViZVwiKShhdXRob3IpfWApLFxyXG5cdFx0XHRcdFx0Y2hhbGsuaGV4KFwiI2ViYzE0ZFwiKShcclxuXHRcdFx0XHRcdFx0YENvbnRyaWJ1dG9yJHtjb250cmlidXRvcnMubGVuZ3RoID09PSAxID8gXCJcIiA6IFwic1wifTogJHtjaGFsay5oZXgoXHJcblx0XHRcdFx0XHRcdFx0XCIjYmViZWJlXCJcclxuXHRcdFx0XHRcdFx0KShjb250cmlidXRvcnMuam9pbihjaGFsay5oZXgoXCIjZWJjMTRkXCIpKFwiLCBcIikpKX1gXHJcblx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XSlcclxuXHRcdFx0XHQubG9nKCk7XHJcblx0XHRcdHNob3dBdmFpbGFibGVBcmdzKCk7XHJcblx0XHRcdHByb2Nlc3MuZXhpdCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbmZpZyA9IGNtZEFyZ3MoW1xyXG5cdFx0XHR7IG5hbWU6IFwic3JjXCIsIGRlZmF1bHRWYWx1ZTogXCJzcmNcIiwgdHlwZTogU3RyaW5nIH0sXHJcblx0XHRcdHsgbmFtZTogXCJvdXRcIiwgZGVmYXVsdFZhbHVlOiBcImRpc3RcIiwgdHlwZTogU3RyaW5nIH0sXHJcblx0XHRcdHsgbmFtZTogXCJkZWxldGVPYnNvbGV0ZVwiLCBkZWZhdWx0VmFsdWU6IHRydWUsIHR5cGU6IFN0cmluZyB9LFxyXG5cdFx0XHR7IG5hbWU6IFwidHNjb25maWdcIiwgZGVmYXVsdFZhbHVlOiBcInRzY29uZmlnLmpzb25cIiwgdHlwZTogU3RyaW5nIH0sXHJcblx0XHRcdHsgbmFtZTogXCJlbnRyeVwiLCBkZWZhdWx0VmFsdWU6IG51bGwsIHR5cGU6IFN0cmluZyB9LFxyXG5cdFx0XHR7IG5hbWU6IFwiZGVwQ2hlY2tcIiwgZGVmYXVsdFZhbHVlOiB0cnVlLCB0eXBlOiBTdHJpbmcgfSxcclxuXHRcdFx0eyBuYW1lOiBcImV4Y2x1ZGVEZXBzXCIsIGRlZmF1bHRWYWx1ZTogbnVsbCwgdHlwZTogU3RyaW5nIH0sXHJcblx0XHRcdHsgbmFtZTogXCJhdXRvSW5zdGFsbERlcFwiLCBkZWZhdWx0VmFsdWU6IHRydWUsIHR5cGU6IEJvb2xlYW4gfSxcclxuXHRcdFx0eyBuYW1lOiBcImF1dG9SZW1vdmVEZXBcIiwgZGVmYXVsdFZhbHVlOiB0cnVlLCB0eXBlOiBCb29sZWFuIH0sXHJcblx0XHRcdHsgbmFtZTogXCJhdXRvSW5zdGFsbFR5cGVzXCIsIGRlZmF1bHRWYWx1ZTogdHJ1ZSwgdHlwZTogQm9vbGVhbiB9LFxyXG5cdFx0XHR7IG5hbWU6IFwiYXV0b1JlbW92ZVR5cGVzXCIsIGRlZmF1bHRWYWx1ZTogdHJ1ZSwgdHlwZTogQm9vbGVhbiB9LFxyXG5cdFx0XHR7IG5hbWU6IFwiYXV0b1VwZGF0ZU91dGRhdGVkXCIsIGRlZmF1bHRWYWx1ZTogZmFsc2UsIHR5cGU6IEJvb2xlYW4gfSxcclxuXHRcdFx0eyBuYW1lOiBcImF1dG9VcGRhdGVEZXByZWNhdGVkXCIsIGRlZmF1bHRWYWx1ZTogZmFsc2UsIHR5cGU6IEJvb2xlYW4gfSxcclxuXHRcdFx0eyBuYW1lOiBcInVwZGF0ZVNlbGVjdG9yXCIsIGRlZmF1bHRWYWx1ZTogdHJ1ZSwgdHlwZTogQm9vbGVhbiB9LFxyXG5cdFx0XHR7IG5hbWU6IFwidG9kb0NoZWNrXCIsIGRlZmF1bHRWYWx1ZTogdHJ1ZSwgdHlwZTogU3RyaW5nIH0sXHJcblx0XHRcdHsgbmFtZTogXCJ0b2RvVGFnc1wiLCBkZWZhdWx0VmFsdWU6IG51bGwsIHR5cGU6IFN0cmluZyB9LFxyXG5cdFx0XHR7IG5hbWU6IFwiY29weU9ubHlcIiwgZGVmYXVsdFZhbHVlOiBmYWxzZSwgdHlwZTogQm9vbGVhbiB9LFxyXG5cdFx0XHR7IG5hbWU6IFwiaWdub3JlXCIsIGRlZmF1bHRWYWx1ZTogbnVsbCwgdHlwZTogU3RyaW5nIH0sXHJcblx0XHRcdHsgbmFtZTogXCJpbmNsdWRlXCIsIGRlZmF1bHRWYWx1ZTogbnVsbCwgdHlwZTogU3RyaW5nIH0sXHJcblx0XHRcdHsgbmFtZTogXCJzaWxlbnRcIiwgYWxpYXM6IFwic1wiLCBkZWZhdWx0VmFsdWU6IGZhbHNlLCB0eXBlOiBCb29sZWFuIH1cclxuXHRcdF0pIGFzIGFueTtcclxuXHJcblx0XHRpZiAodHlwZW9mIGNvbmZpZy5kZXBDaGVjayA9PT0gXCJzdHJpbmdcIilcclxuXHRcdFx0Y29uZmlnLmRlcENoZWNrID0gQm9vbGVhbihjb25maWcuZGVwQ2hlY2spO1xyXG5cdFx0aWYgKHR5cGVvZiBjb25maWcuZGVsZXRlT2Jzb2xldGUgPT09IFwic3RyaW5nXCIpXHJcblx0XHRcdGNvbmZpZy5kZWxldGVPYnNvbGV0ZSA9IEJvb2xlYW4oY29uZmlnLmRlbGV0ZU9ic29sZXRlKTtcclxuXHJcblx0XHQvLyogVGFrZSBwb3NzaWJsZSBjb25maWcgdmFsdWVzIGZyb20gcGFja2FnZS5qc29uIG9mIHByb2plY3RcclxuXHRcdHRyeSB7XHJcblx0XHRcdGNvbnN0IHBrZ0pzb24gPSByZXF1aXJlKHJlc29sdmUocHJvY2Vzcy5jd2QoKSwgXCJwYWNrYWdlLmpzb25cIikpO1xyXG5cclxuXHRcdFx0aWYgKHBrZ0pzb24uZGV2U2NyaXB0KSB7XHJcblx0XHRcdFx0Zm9yIChsZXQga2V5IGluIHBrZ0pzb24uZGV2U2NyaXB0KSB7XHJcblx0XHRcdFx0XHRpZiAoY29uZmlnW2tleV0pIGNvbmZpZ1trZXldID0gcGtnSnNvbi5kZXZTY3JpcHRba2V5XTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0gY2F0Y2ggKGUpIHt9XHJcblx0fSBjYXRjaCAoZSkge1xyXG5cdFx0Y29uc29sZS5sb2coXHJcblx0XHRcdGAke2RzQ29uc29sZVByZWZpeH0gJHtjaGFsay5oZXgoXCIjZTgzYTNhXCIpKFxyXG5cdFx0XHRcdGBVbmtub3duIGFyZ3VtZW50IFwiJHtjaGFsay5ib2xkKGUub3B0aW9uTmFtZSl9XCLigKZgXHJcblx0XHRcdCl9YFxyXG5cdFx0KTtcclxuXHRcdHNob3dBdmFpbGFibGVBcmdzKCk7XHJcblx0XHRwcm9jZXNzLmV4aXQoKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBjb25maWc7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNob3dBdmFpbGFibGVBcmdzKCk6IHZvaWQge1xyXG5cdGNvbnN0IGNvbmZpZ0Rlc2NyaXB0aW9uczoge1xyXG5cdFx0W25hbWU6IHN0cmluZ106IHtcclxuXHRcdFx0dHlwZTogc3RyaW5nO1xyXG5cdFx0XHRkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG5cdFx0fTtcclxuXHR9ID0ge1xyXG5cdFx0c3JjOiB7XHJcblx0XHRcdHR5cGU6IFwic3RyaW5nXCIsXHJcblx0XHRcdGRlc2NyaXB0aW9uOiBcIkRpcmVjdG9yeSBjb250YWluaW5nIHRoZSBzb3VyY2UgY29kZS5cIlxyXG5cdFx0fSxcclxuXHRcdG91dDoge1xyXG5cdFx0XHR0eXBlOiBcInN0cmluZ1wiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJEaXJlY3RvcnkgdGhhdCB3aWxsIGNvbnRhaW4gdGhlIG91dHB1dC5cIlxyXG5cdFx0fSxcclxuXHRcdGRlbGV0ZU9ic29sZXRlOiB7XHJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjpcclxuXHRcdFx0XHRcIldoZXRoZXIgb3Igbm90IHRvIGRlbGV0ZSBmaWxlcyBmcm9tIG91dCB0aGF0IGFyZSBub3QgaW4gdGhlIHNyYy5cIlxyXG5cdFx0fSxcclxuXHRcdHRzY29uZmlnOiB7XHJcblx0XHRcdHR5cGU6IFwic3RyaW5nXCIsXHJcblx0XHRcdGRlc2NyaXB0aW9uOiBcIlBhdGggdG8gYSB2YWxpZCB0c2NvbmZpZy5qc29uIGZpbGUuXCJcclxuXHRcdH0sXHJcblx0XHRlbnRyeToge1xyXG5cdFx0XHR0eXBlOiBcInN0cmluZ1wiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJFbnRyeSBmaWxlIHRvIGJlIGV4ZWN1dGVkIGFmdGVyIGNvbXBpbGF0aW9uLlwiXHJcblx0XHR9LFxyXG5cdFx0ZGVwQ2hlY2s6IHtcclxuXHRcdFx0dHlwZTogXCJib29sZWFuXCIsXHJcblx0XHRcdGRlc2NyaXB0aW9uOiBcIldoZXRoZXIgb3Igbm90IHRvIGNoZWNrIHRoZSBkZXBlbmRlbmNpZXMuXCJcclxuXHRcdH0sXHJcblx0XHRleGNsdWRlRGVwczoge1xyXG5cdFx0XHR0eXBlOiBcInN0cmluZ1wiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjpcclxuXHRcdFx0XHRcIkRlcGVuZGVuY2llcyB0byBleGNsdWRlIGZyb20gYXV0b21hdGljYWxseSB1bmluc3RhbGxpbmcuIChTdHJpbmcgbGlzdCBzZXBlcmF0ZWQgYnkgY29tbWFzKVwiXHJcblx0XHR9LFxyXG5cdFx0YXV0b0luc3RhbGxEZXA6IHtcclxuXHRcdFx0dHlwZTogXCJib29sZWFuXCIsXHJcblx0XHRcdGRlc2NyaXB0aW9uOlxyXG5cdFx0XHRcdFwiQXV0b21hdGljYWxseSBpbnN0YWxscyBtaXNzaW5nIGRlcGVuZGVuY2llcy4gKE5lZWRzIGRlcENoZWNrIGVuYWJsZWQpXCJcclxuXHRcdH0sXHJcblx0XHRhdXRvUmVtb3ZlRGVwOiB7XHJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjpcclxuXHRcdFx0XHRcIkF1dG9tYXRpY2FsbHkgcmVtb3ZlcyB1bnVzZWQgZGVwZW5kZW5jaWVzLiAoTmVlZHMgZGVwQ2hlY2sgZW5hYmxlZClcIlxyXG5cdFx0fSxcclxuXHRcdGF1dG9JbnN0YWxsVHlwZXM6IHtcclxuXHRcdFx0dHlwZTogXCJib29sZWFuXCIsXHJcblx0XHRcdGRlc2NyaXB0aW9uOlxyXG5cdFx0XHRcdFwiQXV0b21hdGljYWxseSBpbnN0YWxscyBtaXNzaW5nIGRlcGVuZGVuY2llcyBAdHlwZXMvLiAoTmVlZHMgZGVwQ2hlY2sgYW5kIGF1dG9JbnN0YWxsRGVwIGVuYWJsZWQpXCJcclxuXHRcdH0sXHJcblx0XHRhdXRvUmVtb3ZlVHlwZXM6IHtcclxuXHRcdFx0dHlwZTogXCJib29sZWFuXCIsXHJcblx0XHRcdGRlc2NyaXB0aW9uOlxyXG5cdFx0XHRcdFwiQXV0b21hdGljYWxseSByZW1vdmVzIHVudXNlZCBkZXBlbmRlbmNpZXMgQHR5cGVzLy4gKE5lZWRzIGRlcENoZWNrIGFuZCBhdXRvUmVtb3ZlRGVwIGVuYWJsZWQpXCJcclxuXHRcdH0sXHJcblx0XHRhdXRvVXBkYXRlT3V0ZGF0ZWQ6IHtcclxuXHRcdFx0dHlwZTogXCJib29sZWFuXCIsXHJcblx0XHRcdGRlc2NyaXB0aW9uOlxyXG5cdFx0XHRcdFwiQXV0b21hdGljYWxseSB1cGRhdGUgb3V0ZGF0ZWQgZGVwZW5kZW5jaWVzIHRvIHRoZWlyIGxhdGVzdCB2ZXJzaW9uLiAoTmVlZHMgZGVwQ2hlY2sgZW5hYmxlZClcIlxyXG5cdFx0fSxcclxuXHRcdGF1dG9VcGRhdGVEZXByZWNhdGVkOiB7XHJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjpcclxuXHRcdFx0XHRcIkF1dG9tYXRpY2FsbHkgdXBkYXRlIGRlcHJlY2F0ZWQgZGVwZW5kZW5jaWVzIHRvIHRoZWlyIGxhdGVzdCB2ZXJzaW9uLiAoTmVlZHMgZGVwQ2hlY2sgZW5hYmxlZClcIlxyXG5cdFx0fSxcclxuXHRcdHVwZGF0ZVNlbGVjdG9yOiB7XHJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjpcclxuXHRcdFx0XHRcIldoZXRoZXIgb3Igbm90IHRvIHNob3cgdGhlIHVwZGF0ZSBzZWxlY3RvciBmb3IgZGVwcmVjYXRlZCBvciBvdXRkYXRlZCBkZXBlbmRlbmNpZXMuIChOZWVkcyBkZXBDaGVjayBlbmFibGVkKVwiXHJcblx0XHR9LFxyXG5cdFx0dG9kb0NoZWNrOiB7XHJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJXaGV0aGVyIG9yIG5vdCB0byBjaGVjayBmb3IgVE9ETydzLlwiXHJcblx0XHR9LFxyXG5cdFx0dG9kb1RhZ3M6IHtcclxuXHRcdFx0dHlwZTogXCJzdHJpbmdcIixcclxuXHRcdFx0ZGVzY3JpcHRpb246XHJcblx0XHRcdFx0XCJDdXN0b20gdGFncyB0byBpbmNsdWRlIGluIHRoZSBUT0RPIGNoZWNrLiAoU3RyaW5nIGxpc3Qgc2VwZXJhdGVkIGJ5IGNvbW1hcylcIlxyXG5cdFx0fSxcclxuXHRcdGNvcHlPbmx5OiB7XHJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJXaGV0aGVyIG9yIG5vdCBvbmx5IHRvIGNvcHkgdGhlIGZpbGVzIGZyb20gc3JjIHRvIG91dC5cIlxyXG5cdFx0fSxcclxuXHRcdGlnbm9yZToge1xyXG5cdFx0XHR0eXBlOiBcInN0cmluZ1wiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjpcclxuXHRcdFx0XHRcIkZpbGVzIHRoYXQgc2hvdWxkIGJlIGlnbm9yZWQgd2hlbiB3YXRjaGluZyBmaWxlcy4gKGdsb2IgcGF0dGVybilcIlxyXG5cdFx0fSxcclxuXHRcdGluY2x1ZGU6IHtcclxuXHRcdFx0dHlwZTogXCJzdHJpbmdcIixcclxuXHRcdFx0ZGVzY3JpcHRpb246XHJcblx0XHRcdFx0XCJGaWxlcyB0aGF0IHNob3VsZCBiZSBpbmNsdWRlZCB3aGVuIHdhdGNoaW5nIGZpbGVzLiAoZ2xvYiBwYXR0ZXJuKVwiXHJcblx0XHR9LFxyXG5cdFx0c2lsZW50OiB7XHJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJXaGV0aGVyIG9yIG5vdCB0byBwcmludCBjb25zb2xlIGxvZ3MuXCJcclxuXHRcdH1cclxuXHR9O1xyXG5cdGxldCBzZXR0aW5nczogc3RyaW5nW10gPSBbXTtcclxuXHRmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhjb25maWdEZXNjcmlwdGlvbnMpKSB7XHJcblx0XHRzZXR0aW5ncy5wdXNoKFxyXG5cdFx0XHRgJHtjaGFsay55ZWxsb3dCcmlnaHQoXCItLVwiICsgayl9ICR7Y2hhbGsudW5kZXJsaW5lKFxyXG5cdFx0XHRcdGNoYWxrLmhleChcIiNiZWJlYmVcIikodi50eXBlKVxyXG5cdFx0XHQpfSDigKIgJHtjaGFsay5oZXgoXCIjNzI4OURBXCIpKHYuZGVzY3JpcHRpb24pfWBcclxuXHRcdCk7XHJcblx0fVxyXG5cdG91dGxpbmUoc2V0dGluZ3MsIFwi4oCiXCIpO1xyXG5cdG5ldyBEaXNwbGF5QXNUcmVlKGNoYWxrLmJvbGQoY2hhbGsuZ3JlZW4oXCJBdmFpbGFibGUgYXJndW1lbnRzXCIpKSwge1xyXG5cdFx0c3RhcnRDaGFyOiBkc0NvbnNvbGVQcmVmaXggKyBcIiBcIlxyXG5cdH0pXHJcblx0XHQuYWRkU2VjdGlvbihzZXR0aW5ncylcclxuXHRcdC5sb2coKTtcclxufVxyXG4iXX0=