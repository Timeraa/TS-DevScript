"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../");
var displayastree_1 = require("displayastree");
var chalk_1 = __importDefault(require("chalk"));
var command_line_args_1 = __importDefault(require("command-line-args"));
var outlineStrings_1 = __importDefault(require("./functions/outlineStrings"));
var path_1 = require("path");
function run() {
    var config;
    if (process.argv.includes("-h") || process.argv.includes("--help")) {
        new displayastree_1.Tree(chalk_1.default.green(chalk_1.default.bold("DevScript") + " " + chalk_1.default.hex("#bebebe")("(v" + __1.version + ")")), { headChar: __1.dsConsolePrefix + " " })
            .addBranch([
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
        { name: "depCheck", defaultValue: false, type: String },
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
    ], { stopAtFirstUnknown: false, partial: true });
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
    new displayastree_1.Tree(chalk_1.default.bold(chalk_1.default.green("Available arguments")), {
        headChar: __1.dsConsolePrefix + " "
    })
        .addBranch(settings)
        .log();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnSGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsidXRpbC9jb25maWdIYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEseUJBTWE7QUFFYiwrQ0FBcUM7QUFDckMsZ0RBQTBCO0FBQzFCLHdFQUF3QztBQUN4Qyw4RUFBaUQ7QUFDakQsNkJBQStCO0FBMEIvQixTQUF3QixHQUFHO0lBQzFCLElBQUksTUFBYyxDQUFDO0lBRW5CLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDbkUsSUFBSSxvQkFBSSxDQUNQLGVBQUssQ0FBQyxLQUFLLENBQ1AsZUFBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBSSxlQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUNqRCxJQUFJLEdBQUcsV0FBTyxHQUFHLEdBQUcsQ0FDbEIsQ0FDSCxFQUNELEVBQUUsUUFBUSxFQUFFLG1CQUFlLEdBQUcsR0FBRyxFQUFFLENBQ25DO2FBQ0MsU0FBUyxDQUFDO1lBQ1YsZUFBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxlQUFXLENBQUM7WUFDakMsZUFBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxhQUFXLGVBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsVUFBTSxDQUFHLENBQUM7WUFDL0QsZUFBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FDbkIsaUJBQWMsZ0JBQVksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBSyxlQUFLLENBQUMsR0FBRyxDQUMvRCxTQUFTLENBQ1QsQ0FBQyxnQkFBWSxDQUFDLElBQUksQ0FBQyxlQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxD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QUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsRUFBbEMsY0FBa0MsRUFBbEMsSUFBa0MsRUFBRTtRQUE5QyxJQUFBLFdBQU0sRUFBTCxDQUFDLFFBQUEsRUFBRSxDQUFDLFFBQUE7UUFDZixRQUFRLENBQUMsSUFBSSxDQUNULGVBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxTQUFJLGVBQUssQ0FBQyxTQUFTLENBQ2pELGVBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUM1QixnQkFBTSxlQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUcsQ0FDNUMsQ0FBQztLQUNGO0lBQ0Qsd0JBQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdkIsSUFBSSxvQkFBSSxDQUFDLGVBQUssQ0FBQyxJQUFJLENBQUMsZUFBSyxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLEVBQUU7UUFDeEQsUUFBUSxFQUFFLG1CQUFlLEdBQUcsR0FBRztLQUMvQixDQUFDO1NBQ0EsU0FBUyxDQUFDLFFBQVEsQ0FBQztTQUNuQixHQUFHLEVBQUUsQ0FBQztBQUNULENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG5cdGF1dGhvcixcclxuXHRjb250cmlidXRvcnMsXHJcblx0ZGVzY3JpcHRpb24sXHJcblx0ZHNDb25zb2xlUHJlZml4LFxyXG5cdHZlcnNpb25cclxufSBmcm9tIFwiLi4vXCI7XHJcblxyXG5pbXBvcnQgeyBUcmVlIH0gZnJvbSBcImRpc3BsYXlhc3RyZWVcIjtcclxuaW1wb3J0IGNoYWxrIGZyb20gXCJjaGFsa1wiO1xyXG5pbXBvcnQgY21kQXJncyBmcm9tIFwiY29tbWFuZC1saW5lLWFyZ3NcIjtcclxuaW1wb3J0IG91dGxpbmUgZnJvbSBcIi4vZnVuY3Rpb25zL291dGxpbmVTdHJpbmdzXCI7XHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xyXG5cclxuaW50ZXJmYWNlIGNvbmZpZyB7XHJcblx0c3JjOiBzdHJpbmc7XHJcblx0b3V0OiBzdHJpbmc7XHJcblx0ZGVsZXRlT2Jzb2xldGU6IGJvb2xlYW47XHJcblx0dHNjb25maWc6IHN0cmluZztcclxuXHRlbnRyeTogc3RyaW5nO1xyXG5cdGRlcENoZWNrOiBib29sZWFuO1xyXG5cdGV4Y2x1ZGVEZXBzOiBzdHJpbmc7XHJcblx0YXV0b0luc3RhbGxEZXA6IGJvb2xlYW47XHJcblx0YXV0b1JlbW92ZURlcDogYm9vbGVhbjtcclxuXHRhdXRvSW5zdGFsbFR5cGVzOiBib29sZWFuO1xyXG5cdGF1dG9SZW1vdmVUeXBlczogYm9vbGVhbjtcclxuXHRhdXRvVXBkYXRlT3V0ZGF0ZWQ6IGJvb2xlYW47XHJcblx0YXV0b1VwZGF0ZURlcHJlY2F0ZWQ6IGJvb2xlYW47XHJcblx0dXBkYXRlU2VsZWN0b3I6IGJvb2xlYW47XHJcblx0dG9kb0NoZWNrOiBib29sZWFuO1xyXG5cdHRvZG9UYWdzOiBzdHJpbmc7XHJcblx0Y29weU9ubHk6IGJvb2xlYW47XHJcblx0d2F0Y2g6IGJvb2xlYW47XHJcblx0aWdub3JlOiBzdHJpbmc7XHJcblx0aW5jbHVkZTogc3RyaW5nO1xyXG5cdHNpbGVudDogYm9vbGVhbjtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcnVuKCkge1xyXG5cdGxldCBjb25maWc6IGNvbmZpZztcclxuXHJcblx0aWYgKHByb2Nlc3MuYXJndi5pbmNsdWRlcyhcIi1oXCIpIHx8IHByb2Nlc3MuYXJndi5pbmNsdWRlcyhcIi0taGVscFwiKSkge1xyXG5cdFx0bmV3IFRyZWUoXHJcblx0XHRcdGNoYWxrLmdyZWVuKFxyXG5cdFx0XHRcdGAke2NoYWxrLmJvbGQoXCJEZXZTY3JpcHRcIil9ICR7Y2hhbGsuaGV4KFwiI2JlYmViZVwiKShcclxuXHRcdFx0XHRcdFwiKHZcIiArIHZlcnNpb24gKyBcIilcIlxyXG5cdFx0XHRcdCl9YFxyXG5cdFx0XHQpLFxyXG5cdFx0XHR7IGhlYWRDaGFyOiBkc0NvbnNvbGVQcmVmaXggKyBcIiBcIiB9XHJcblx0XHQpXHJcblx0XHRcdC5hZGRCcmFuY2goW1xyXG5cdFx0XHRcdGNoYWxrLmhleChcIiM3Mjg5REFcIikoZGVzY3JpcHRpb24pLFxyXG5cdFx0XHRcdGNoYWxrLmhleChcIiNlYmMxNGRcIikoYEF1dGhvcjogJHtjaGFsay5oZXgoXCIjYmViZWJlXCIpKGF1dGhvcil9YCksXHJcblx0XHRcdFx0Y2hhbGsuaGV4KFwiI2ViYzE0ZFwiKShcclxuXHRcdFx0XHRcdGBDb250cmlidXRvciR7Y29udHJpYnV0b3JzLmxlbmd0aCA9PT0gMSA/IFwiXCIgOiBcInNcIn06ICR7Y2hhbGsuaGV4KFxyXG5cdFx0XHRcdFx0XHRcIiNiZWJlYmVcIlxyXG5cdFx0XHRcdFx0KShjb250cmlidXRvcnMuam9pbihjaGFsay5oZXgoXCIjZWJjMTRkXCIpKFwiLCBcIikpKX1gXHJcblx0XHRcdFx0KVxyXG5cdFx0XHRdKVxyXG5cdFx0XHQubG9nKCk7XHJcblx0XHRzaG93QXZhaWxhYmxlQXJncygpO1xyXG5cdFx0cHJvY2Vzcy5leGl0KCk7XHJcblx0fVxyXG5cclxuXHRjb25maWcgPSBjbWRBcmdzKFxyXG5cdFx0W1xyXG5cdFx0XHR7IG5hbWU6IFwic3JjXCIsIGRlZmF1bHRWYWx1ZTogXCJzcmNcIiwgdHlwZTogU3RyaW5nIH0sXHJcblx0XHRcdHsgbmFtZTogXCJvdXRcIiwgZGVmYXVsdFZhbHVlOiBcImRpc3RcIiwgdHlwZTogU3RyaW5nIH0sXHJcblx0XHRcdHsgbmFtZTogXCJkZWxldGVPYnNvbGV0ZVwiLCBkZWZhdWx0VmFsdWU6IHRydWUsIHR5cGU6IFN0cmluZyB9LFxyXG5cdFx0XHR7IG5hbWU6IFwidHNjb25maWdcIiwgZGVmYXVsdFZhbHVlOiBcInRzY29uZmlnLmpzb25cIiwgdHlwZTogU3RyaW5nIH0sXHJcblx0XHRcdHsgbmFtZTogXCJlbnRyeVwiLCBkZWZhdWx0VmFsdWU6IG51bGwsIHR5cGU6IFN0cmluZyB9LFxyXG5cdFx0XHR7IG5hbWU6IFwiZGVwQ2hlY2tcIiwgZGVmYXVsdFZhbHVlOiBmYWxzZSwgdHlwZTogU3RyaW5nIH0sXHJcblx0XHRcdHsgbmFtZTogXCJleGNsdWRlRGVwc1wiLCBkZWZhdWx0VmFsdWU6IG51bGwsIHR5cGU6IFN0cmluZyB9LFxyXG5cdFx0XHR7IG5hbWU6IFwiYXV0b0luc3RhbGxEZXBcIiwgZGVmYXVsdFZhbHVlOiB0cnVlLCB0eXBlOiBCb29sZWFuIH0sXHJcblx0XHRcdHsgbmFtZTogXCJhdXRvUmVtb3ZlRGVwXCIsIGRlZmF1bHRWYWx1ZTogdHJ1ZSwgdHlwZTogQm9vbGVhbiB9LFxyXG5cdFx0XHR7IG5hbWU6IFwiYXV0b0luc3RhbGxUeXBlc1wiLCBkZWZhdWx0VmFsdWU6IHRydWUsIHR5cGU6IEJvb2xlYW4gfSxcclxuXHRcdFx0eyBuYW1lOiBcImF1dG9SZW1vdmVUeXBlc1wiLCBkZWZhdWx0VmFsdWU6IHRydWUsIHR5cGU6IEJvb2xlYW4gfSxcclxuXHRcdFx0eyBuYW1lOiBcImF1dG9VcGRhdGVPdXRkYXRlZFwiLCBkZWZhdWx0VmFsdWU6IGZhbHNlLCB0eXBlOiBCb29sZWFuIH0sXHJcblx0XHRcdHsgbmFtZTogXCJhdXRvVXBkYXRlRGVwcmVjYXRlZFwiLCBkZWZhdWx0VmFsdWU6IGZhbHNlLCB0eXBlOiBCb29sZWFuIH0sXHJcblx0XHRcdHsgbmFtZTogXCJ1cGRhdGVTZWxlY3RvclwiLCBkZWZhdWx0VmFsdWU6IHRydWUsIHR5cGU6IEJvb2xlYW4gfSxcclxuXHRcdFx0eyBuYW1lOiBcInRvZG9DaGVja1wiLCBkZWZhdWx0VmFsdWU6IHRydWUsIHR5cGU6IFN0cmluZyB9LFxyXG5cdFx0XHR7IG5hbWU6IFwidG9kb1RhZ3NcIiwgZGVmYXVsdFZhbHVlOiBudWxsLCB0eXBlOiBTdHJpbmcgfSxcclxuXHRcdFx0eyBuYW1lOiBcImNvcHlPbmx5XCIsIGRlZmF1bHRWYWx1ZTogZmFsc2UsIHR5cGU6IEJvb2xlYW4gfSxcclxuXHRcdFx0eyBuYW1lOiBcImlnbm9yZVwiLCBkZWZhdWx0VmFsdWU6IG51bGwsIHR5cGU6IFN0cmluZyB9LFxyXG5cdFx0XHR7IG5hbWU6IFwiaW5jbHVkZVwiLCBkZWZhdWx0VmFsdWU6IG51bGwsIHR5cGU6IFN0cmluZyB9LFxyXG5cdFx0XHR7IG5hbWU6IFwic2lsZW50XCIsIGFsaWFzOiBcInNcIiwgZGVmYXVsdFZhbHVlOiBmYWxzZSwgdHlwZTogQm9vbGVhbiB9XHJcblx0XHRdLFxyXG5cdFx0eyBzdG9wQXRGaXJzdFVua25vd246IGZhbHNlLCBwYXJ0aWFsOiB0cnVlIH1cclxuXHQpIGFzIGFueTtcclxuXHJcblx0aWYgKHR5cGVvZiBjb25maWcuZGVwQ2hlY2sgPT09IFwic3RyaW5nXCIpXHJcblx0XHRjb25maWcuZGVwQ2hlY2sgPSBCb29sZWFuKGNvbmZpZy5kZXBDaGVjayk7XHJcblx0aWYgKHR5cGVvZiBjb25maWcuZGVsZXRlT2Jzb2xldGUgPT09IFwic3RyaW5nXCIpXHJcblx0XHRjb25maWcuZGVsZXRlT2Jzb2xldGUgPSBCb29sZWFuKGNvbmZpZy5kZWxldGVPYnNvbGV0ZSk7XHJcblxyXG5cdC8vKiBUYWtlIHBvc3NpYmxlIGNvbmZpZyB2YWx1ZXMgZnJvbSBwYWNrYWdlLmpzb24gb2YgcHJvamVjdFxyXG5cdHRyeSB7XHJcblx0XHRjb25zdCBwa2dKc29uID0gcmVxdWlyZShyZXNvbHZlKHByb2Nlc3MuY3dkKCksIFwicGFja2FnZS5qc29uXCIpKTtcclxuXHJcblx0XHRpZiAocGtnSnNvbi5kZXZTY3JpcHQpIHtcclxuXHRcdFx0Zm9yIChsZXQga2V5IGluIHBrZ0pzb24uZGV2U2NyaXB0KSB7XHJcblx0XHRcdFx0aWYgKGNvbmZpZ1trZXldKSBjb25maWdba2V5XSA9IHBrZ0pzb24uZGV2U2NyaXB0W2tleV07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9IGNhdGNoIChlKSB7fVxyXG5cclxuXHRyZXR1cm4gY29uZmlnO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93QXZhaWxhYmxlQXJncygpOiB2b2lkIHtcclxuXHRjb25zdCBjb25maWdEZXNjcmlwdGlvbnM6IHtcclxuXHRcdFtuYW1lOiBzdHJpbmddOiB7XHJcblx0XHRcdHR5cGU6IHN0cmluZztcclxuXHRcdFx0ZGVzY3JpcHRpb246IHN0cmluZztcclxuXHRcdH07XHJcblx0fSA9IHtcclxuXHRcdHNyYzoge1xyXG5cdFx0XHR0eXBlOiBcInN0cmluZ1wiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJEaXJlY3RvcnkgY29udGFpbmluZyB0aGUgc291cmNlIGNvZGUuXCJcclxuXHRcdH0sXHJcblx0XHRvdXQ6IHtcclxuXHRcdFx0dHlwZTogXCJzdHJpbmdcIixcclxuXHRcdFx0ZGVzY3JpcHRpb246IFwiRGlyZWN0b3J5IHRoYXQgd2lsbCBjb250YWluIHRoZSBvdXRwdXQuXCJcclxuXHRcdH0sXHJcblx0XHRkZWxldGVPYnNvbGV0ZToge1xyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcclxuXHRcdFx0ZGVzY3JpcHRpb246XHJcblx0XHRcdFx0XCJXaGV0aGVyIG9yIG5vdCB0byBkZWxldGUgZmlsZXMgZnJvbSBvdXQgdGhhdCBhcmUgbm90IGluIHRoZSBzcmMuXCJcclxuXHRcdH0sXHJcblx0XHR0c2NvbmZpZzoge1xyXG5cdFx0XHR0eXBlOiBcInN0cmluZ1wiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJQYXRoIHRvIGEgdmFsaWQgdHNjb25maWcuanNvbiBmaWxlLlwiXHJcblx0XHR9LFxyXG5cdFx0ZW50cnk6IHtcclxuXHRcdFx0dHlwZTogXCJzdHJpbmdcIixcclxuXHRcdFx0ZGVzY3JpcHRpb246IFwiRW50cnkgZmlsZSB0byBiZSBleGVjdXRlZCBhZnRlciBjb21waWxhdGlvbi5cIlxyXG5cdFx0fSxcclxuXHRcdGRlcENoZWNrOiB7XHJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJXaGV0aGVyIG9yIG5vdCB0byBjaGVjayB0aGUgZGVwZW5kZW5jaWVzLlwiXHJcblx0XHR9LFxyXG5cdFx0ZXhjbHVkZURlcHM6IHtcclxuXHRcdFx0dHlwZTogXCJzdHJpbmdcIixcclxuXHRcdFx0ZGVzY3JpcHRpb246XHJcblx0XHRcdFx0XCJEZXBlbmRlbmNpZXMgdG8gZXhjbHVkZSBmcm9tIGF1dG9tYXRpY2FsbHkgdW5pbnN0YWxsaW5nLiAoU3RyaW5nIGxpc3Qgc2VwZXJhdGVkIGJ5IGNvbW1hcylcIlxyXG5cdFx0fSxcclxuXHRcdGF1dG9JbnN0YWxsRGVwOiB7XHJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjpcclxuXHRcdFx0XHRcIkF1dG9tYXRpY2FsbHkgaW5zdGFsbHMgbWlzc2luZyBkZXBlbmRlbmNpZXMuIChOZWVkcyBkZXBDaGVjayBlbmFibGVkKVwiXHJcblx0XHR9LFxyXG5cdFx0YXV0b1JlbW92ZURlcDoge1xyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcclxuXHRcdFx0ZGVzY3JpcHRpb246XHJcblx0XHRcdFx0XCJBdXRvbWF0aWNhbGx5IHJlbW92ZXMgdW51c2VkIGRlcGVuZGVuY2llcy4gKE5lZWRzIGRlcENoZWNrIGVuYWJsZWQpXCJcclxuXHRcdH0sXHJcblx0XHRhdXRvSW5zdGFsbFR5cGVzOiB7XHJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjpcclxuXHRcdFx0XHRcIkF1dG9tYXRpY2FsbHkgaW5zdGFsbHMgbWlzc2luZyBkZXBlbmRlbmNpZXMgQHR5cGVzLy4gKE5lZWRzIGRlcENoZWNrIGFuZCBhdXRvSW5zdGFsbERlcCBlbmFibGVkKVwiXHJcblx0XHR9LFxyXG5cdFx0YXV0b1JlbW92ZVR5cGVzOiB7XHJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjpcclxuXHRcdFx0XHRcIkF1dG9tYXRpY2FsbHkgcmVtb3ZlcyB1bnVzZWQgZGVwZW5kZW5jaWVzIEB0eXBlcy8uIChOZWVkcyBkZXBDaGVjayBhbmQgYXV0b1JlbW92ZURlcCBlbmFibGVkKVwiXHJcblx0XHR9LFxyXG5cdFx0YXV0b1VwZGF0ZU91dGRhdGVkOiB7XHJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjpcclxuXHRcdFx0XHRcIkF1dG9tYXRpY2FsbHkgdXBkYXRlIG91dGRhdGVkIGRlcGVuZGVuY2llcyB0byB0aGVpciBsYXRlc3QgdmVyc2lvbi4gKE5lZWRzIGRlcENoZWNrIGVuYWJsZWQpXCJcclxuXHRcdH0sXHJcblx0XHRhdXRvVXBkYXRlRGVwcmVjYXRlZDoge1xyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcclxuXHRcdFx0ZGVzY3JpcHRpb246XHJcblx0XHRcdFx0XCJBdXRvbWF0aWNhbGx5IHVwZGF0ZSBkZXByZWNhdGVkIGRlcGVuZGVuY2llcyB0byB0aGVpciBsYXRlc3QgdmVyc2lvbi4gKE5lZWRzIGRlcENoZWNrIGVuYWJsZWQpXCJcclxuXHRcdH0sXHJcblx0XHR1cGRhdGVTZWxlY3Rvcjoge1xyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcclxuXHRcdFx0ZGVzY3JpcHRpb246XHJcblx0XHRcdFx0XCJXaGV0aGVyIG9yIG5vdCB0byBzaG93IHRoZSB1cGRhdGUgc2VsZWN0b3IgZm9yIGRlcHJlY2F0ZWQgb3Igb3V0ZGF0ZWQgZGVwZW5kZW5jaWVzLiAoTmVlZHMgZGVwQ2hlY2sgZW5hYmxlZClcIlxyXG5cdFx0fSxcclxuXHRcdHRvZG9DaGVjazoge1xyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcclxuXHRcdFx0ZGVzY3JpcHRpb246IFwiV2hldGhlciBvciBub3QgdG8gY2hlY2sgZm9yIFRPRE8ncy5cIlxyXG5cdFx0fSxcclxuXHRcdHRvZG9UYWdzOiB7XHJcblx0XHRcdHR5cGU6IFwic3RyaW5nXCIsXHJcblx0XHRcdGRlc2NyaXB0aW9uOlxyXG5cdFx0XHRcdFwiQ3VzdG9tIHRhZ3MgdG8gaW5jbHVkZSBpbiB0aGUgVE9ETyBjaGVjay4gKFN0cmluZyBsaXN0IHNlcGVyYXRlZCBieSBjb21tYXMpXCJcclxuXHRcdH0sXHJcblx0XHRjb3B5T25seToge1xyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcclxuXHRcdFx0ZGVzY3JpcHRpb246IFwiV2hldGhlciBvciBub3Qgb25seSB0byBjb3B5IHRoZSBmaWxlcyBmcm9tIHNyYyB0byBvdXQuXCJcclxuXHRcdH0sXHJcblx0XHRpZ25vcmU6IHtcclxuXHRcdFx0dHlwZTogXCJzdHJpbmdcIixcclxuXHRcdFx0ZGVzY3JpcHRpb246XHJcblx0XHRcdFx0XCJGaWxlcyB0aGF0IHNob3VsZCBiZSBpZ25vcmVkIHdoZW4gd2F0Y2hpbmcgZmlsZXMuIChnbG9iIHBhdHRlcm4pXCJcclxuXHRcdH0sXHJcblx0XHRpbmNsdWRlOiB7XHJcblx0XHRcdHR5cGU6IFwic3RyaW5nXCIsXHJcblx0XHRcdGRlc2NyaXB0aW9uOlxyXG5cdFx0XHRcdFwiRmlsZXMgdGhhdCBzaG91bGQgYmUgaW5jbHVkZWQgd2hlbiB3YXRjaGluZyBmaWxlcy4gKGdsb2IgcGF0dGVybilcIlxyXG5cdFx0fSxcclxuXHRcdHNpbGVudDoge1xyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcclxuXHRcdFx0ZGVzY3JpcHRpb246IFwiV2hldGhlciBvciBub3QgdG8gcHJpbnQgY29uc29sZSBsb2dzLlwiXHJcblx0XHR9XHJcblx0fTtcclxuXHRsZXQgc2V0dGluZ3M6IHN0cmluZ1tdID0gW107XHJcblx0Zm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMoY29uZmlnRGVzY3JpcHRpb25zKSkge1xyXG5cdFx0c2V0dGluZ3MucHVzaChcclxuXHRcdFx0YCR7Y2hhbGsueWVsbG93QnJpZ2h0KFwiLS1cIiArIGspfSAke2NoYWxrLnVuZGVybGluZShcclxuXHRcdFx0XHRjaGFsay5oZXgoXCIjYmViZWJlXCIpKHYudHlwZSlcclxuXHRcdFx0KX0g4oCiICR7Y2hhbGsuaGV4KFwiIzcyODlEQVwiKSh2LmRlc2NyaXB0aW9uKX1gXHJcblx0XHQpO1xyXG5cdH1cclxuXHRvdXRsaW5lKHNldHRpbmdzLCBcIuKAolwiKTtcclxuXHRuZXcgVHJlZShjaGFsay5ib2xkKGNoYWxrLmdyZWVuKFwiQXZhaWxhYmxlIGFyZ3VtZW50c1wiKSksIHtcclxuXHRcdGhlYWRDaGFyOiBkc0NvbnNvbGVQcmVmaXggKyBcIiBcIlxyXG5cdH0pXHJcblx0XHQuYWRkQnJhbmNoKHNldHRpbmdzKVxyXG5cdFx0LmxvZygpO1xyXG59XHJcbiJdfQ==