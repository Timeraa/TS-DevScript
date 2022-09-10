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
        new displayastree_1.Tree(chalk_1.default.green("".concat(chalk_1.default.bold("DevScript"), " ").concat(chalk_1.default.hex("#bebebe")("(v" + __1.version + ")"))), { headChar: __1.dsConsolePrefix + " " })
            .addBranch([
            chalk_1.default.hex("#7289DA")(__1.description),
            chalk_1.default.hex("#ebc14d")("Author: ".concat(chalk_1.default.hex("#bebebe")(__1.author))),
            chalk_1.default.hex("#ebc14d")("Contributor".concat(__1.contributors.length === 1 ? "" : "s", ": ").concat(chalk_1.default.hex("#bebebe")(__1.contributors.join(chalk_1.default.hex("#ebc14d")(", ")))))
        ])
            .log();
        showAvailableArgs();
        process.exit();
    }
    config = (0, command_line_args_1.default)([
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
    //* Take possible config values from package.json of project
    try {
        var pkgJson = require((0, path_1.resolve)(process.cwd(), "package.json"));
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
        settings.push("".concat(chalk_1.default.yellowBright("--" + k), " ").concat(chalk_1.default.underline(chalk_1.default.hex("#bebebe")(v.type)), " \u2022 ").concat(chalk_1.default.hex("#7289DA")(v.description)));
    }
    (0, outlineStrings_1.default)(settings, "•");
    new displayastree_1.Tree(chalk_1.default.bold(chalk_1.default.green("Available arguments")), {
        headChar: __1.dsConsolePrefix + " "
    })
        .addBranch(settings)
        .log();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnSGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL2NvbmZpZ0hhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx5QkFNYTtBQUViLCtDQUFxQztBQUNyQyxnREFBMEI7QUFDMUIsd0VBQXdDO0FBQ3hDLDhFQUFpRDtBQUNqRCw2QkFBK0I7QUE0Qi9CLFNBQXdCLEdBQUc7SUFDMUIsSUFBSSxNQUFjLENBQUM7SUFFbkIsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUNuRSxJQUFJLG9CQUFJLENBQ1AsZUFBSyxDQUFDLEtBQUssQ0FDVixVQUFHLGVBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQUksZUFBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FDakQsSUFBSSxHQUFHLFdBQU8sR0FBRyxHQUFHLENBQ3BCLENBQUUsQ0FDSCxFQUNELEVBQUUsUUFBUSxFQUFFLG1CQUFlLEdBQUcsR0FBRyxFQUFFLENBQ25DO2FBQ0MsU0FBUyxDQUFDO1lBQ1YsZUFBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxlQUFXLENBQUM7WUFDakMsZUFBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxrQkFBVyxlQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFVBQU0sQ0FBQyxDQUFFLENBQUM7WUFDL0QsZUFBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FDbkIscUJBQWMsZ0JBQVksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBSyxlQUFLLENBQUMsR0FBRyxDQUMvRCxTQUFTLENBQ1QsQ0FBQyxnQkFBWSxDQUFDLElBQUksQ0FBQyxlQUFLLENB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RixJQUFJLFFBQVEsR0FBYSxFQUFFLENBQUM7SUFDNUIsS0FBcUIsVUFBa0MsRUFBbEMsS0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLEVBQWxDLGNBQWtDLEVBQWxDLElBQWtDLEVBQUU7UUFBOUMsSUFBQSxXQUFNLEVBQUwsQ0FBQyxRQUFBLEVBQUUsQ0FBQyxRQUFBO1FBQ2YsUUFBUSxDQUFDLElBQUksQ0FDWixVQUFHLGVBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxjQUFJLGVBQUssQ0FBQyxTQUFTLENBQ2pELGVBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUM1QixxQkFBTSxlQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBRSxDQUM1QyxDQUFDO0tBQ0Y7SUFDRCxJQUFBLHdCQUFPLEVBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZCLElBQUksb0JBQUksQ0FBQyxlQUFLLENBQUMsSUFBSSxDQUFDLGVBQUssQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQyxFQUFFO1FBQ3hELFFBQVEsRUFBRSxtQkFBZSxHQUFHLEdBQUc7S0FDL0IsQ0FBQztTQUNBLFNBQVMsQ0FBQyxRQUFRLENBQUM7U0FDbkIsR0FBRyxFQUFFLENBQUM7QUFDVCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuXHRhdXRob3IsXHJcblx0Y29udHJpYnV0b3JzLFxyXG5cdGRlc2NyaXB0aW9uLFxyXG5cdGRzQ29uc29sZVByZWZpeCxcclxuXHR2ZXJzaW9uXHJcbn0gZnJvbSBcIi4uL1wiO1xyXG5cclxuaW1wb3J0IHsgVHJlZSB9IGZyb20gXCJkaXNwbGF5YXN0cmVlXCI7XHJcbmltcG9ydCBjaGFsayBmcm9tIFwiY2hhbGtcIjtcclxuaW1wb3J0IGNtZEFyZ3MgZnJvbSBcImNvbW1hbmQtbGluZS1hcmdzXCI7XHJcbmltcG9ydCBvdXRsaW5lIGZyb20gXCIuL2Z1bmN0aW9ucy9vdXRsaW5lU3RyaW5nc1wiO1xyXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSBcInBhdGhcIjtcclxuXHJcbmludGVyZmFjZSBjb25maWcge1xyXG5cdHNyYzogc3RyaW5nO1xyXG5cdG91dDogc3RyaW5nO1xyXG5cdGRlbGV0ZU9ic29sZXRlOiBib29sZWFuO1xyXG5cdHRzY29uZmlnOiBzdHJpbmc7XHJcblx0ZW50cnk6IHN0cmluZztcclxuXHRkZXBDaGVjazogYm9vbGVhbjtcclxuXHRleGNsdWRlRGVwczogc3RyaW5nO1xyXG5cdGF1dG9JbnN0YWxsRGVwOiBib29sZWFuO1xyXG5cdGF1dG9SZW1vdmVEZXA6IGJvb2xlYW47XHJcblx0YXV0b0luc3RhbGxUeXBlczogYm9vbGVhbjtcclxuXHRhdXRvUmVtb3ZlVHlwZXM6IGJvb2xlYW47XHJcblx0YXV0b1VwZGF0ZU91dGRhdGVkOiBib29sZWFuO1xyXG5cdGF1dG9VcGRhdGVEZXByZWNhdGVkOiBib29sZWFuO1xyXG5cdHVwZGF0ZVNlbGVjdG9yOiBib29sZWFuO1xyXG5cdHRvZG9DaGVjazogYm9vbGVhbjtcclxuXHR0b2RvVGFnczogc3RyaW5nO1xyXG5cdGNvcHlPbmx5OiBib29sZWFuO1xyXG5cdHdhdGNoOiBib29sZWFuO1xyXG5cdGlnbm9yZTogc3RyaW5nO1xyXG5cdGluY2x1ZGU6IHN0cmluZztcclxuXHRzaWxlbnQ6IGJvb2xlYW47XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIENvbmZpZyA9IGNvbmZpZyAmIFJlY29yZDxzdHJpbmcsIGFueT5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJ1bigpOiBDb25maWcge1xyXG5cdGxldCBjb25maWc6IENvbmZpZztcclxuXHJcblx0aWYgKHByb2Nlc3MuYXJndi5pbmNsdWRlcyhcIi1oXCIpIHx8IHByb2Nlc3MuYXJndi5pbmNsdWRlcyhcIi0taGVscFwiKSkge1xyXG5cdFx0bmV3IFRyZWUoXHJcblx0XHRcdGNoYWxrLmdyZWVuKFxyXG5cdFx0XHRcdGAke2NoYWxrLmJvbGQoXCJEZXZTY3JpcHRcIil9ICR7Y2hhbGsuaGV4KFwiI2JlYmViZVwiKShcclxuXHRcdFx0XHRcdFwiKHZcIiArIHZlcnNpb24gKyBcIilcIlxyXG5cdFx0XHRcdCl9YFxyXG5cdFx0XHQpLFxyXG5cdFx0XHR7IGhlYWRDaGFyOiBkc0NvbnNvbGVQcmVmaXggKyBcIiBcIiB9XHJcblx0XHQpXHJcblx0XHRcdC5hZGRCcmFuY2goW1xyXG5cdFx0XHRcdGNoYWxrLmhleChcIiM3Mjg5REFcIikoZGVzY3JpcHRpb24pLFxyXG5cdFx0XHRcdGNoYWxrLmhleChcIiNlYmMxNGRcIikoYEF1dGhvcjogJHtjaGFsay5oZXgoXCIjYmViZWJlXCIpKGF1dGhvcil9YCksXHJcblx0XHRcdFx0Y2hhbGsuaGV4KFwiI2ViYzE0ZFwiKShcclxuXHRcdFx0XHRcdGBDb250cmlidXRvciR7Y29udHJpYnV0b3JzLmxlbmd0aCA9PT0gMSA/IFwiXCIgOiBcInNcIn06ICR7Y2hhbGsuaGV4KFxyXG5cdFx0XHRcdFx0XHRcIiNiZWJlYmVcIlxyXG5cdFx0XHRcdFx0KShjb250cmlidXRvcnMuam9pbihjaGFsay5oZXgoXCIjZWJjMTRkXCIpKFwiLCBcIikpKX1gXHJcblx0XHRcdFx0KVxyXG5cdFx0XHRdKVxyXG5cdFx0XHQubG9nKCk7XHJcblx0XHRzaG93QXZhaWxhYmxlQXJncygpO1xyXG5cdFx0cHJvY2Vzcy5leGl0KCk7XHJcblx0fVxyXG5cclxuXHRjb25maWcgPSBjbWRBcmdzKFxyXG5cdFx0W1xyXG5cdFx0XHR7IG5hbWU6IFwic3JjXCIsIGRlZmF1bHRWYWx1ZTogXCJzcmNcIiwgdHlwZTogU3RyaW5nIH0sXHJcblx0XHRcdHsgbmFtZTogXCJvdXRcIiwgZGVmYXVsdFZhbHVlOiBcImRpc3RcIiwgdHlwZTogU3RyaW5nIH0sXHJcblx0XHRcdHsgbmFtZTogXCJkZWxldGVPYnNvbGV0ZVwiLCBkZWZhdWx0VmFsdWU6IHRydWUsIHR5cGU6IFN0cmluZyB9LFxyXG5cdFx0XHR7IG5hbWU6IFwidHNjb25maWdcIiwgZGVmYXVsdFZhbHVlOiBcInRzY29uZmlnLmpzb25cIiwgdHlwZTogU3RyaW5nIH0sXHJcblx0XHRcdHsgbmFtZTogXCJlbnRyeVwiLCBkZWZhdWx0VmFsdWU6IG51bGwsIHR5cGU6IFN0cmluZyB9LFxyXG5cdFx0XHR7IG5hbWU6IFwiZGVwQ2hlY2tcIiwgZGVmYXVsdFZhbHVlOiBmYWxzZSwgdHlwZTogU3RyaW5nIH0sXHJcblx0XHRcdHsgbmFtZTogXCJleGNsdWRlRGVwc1wiLCBkZWZhdWx0VmFsdWU6IG51bGwsIHR5cGU6IFN0cmluZyB9LFxyXG5cdFx0XHR7IG5hbWU6IFwiYXV0b0luc3RhbGxEZXBcIiwgZGVmYXVsdFZhbHVlOiB0cnVlLCB0eXBlOiBCb29sZWFuIH0sXHJcblx0XHRcdHsgbmFtZTogXCJhdXRvUmVtb3ZlRGVwXCIsIGRlZmF1bHRWYWx1ZTogdHJ1ZSwgdHlwZTogQm9vbGVhbiB9LFxyXG5cdFx0XHR7IG5hbWU6IFwiYXV0b0luc3RhbGxUeXBlc1wiLCBkZWZhdWx0VmFsdWU6IHRydWUsIHR5cGU6IEJvb2xlYW4gfSxcclxuXHRcdFx0eyBuYW1lOiBcImF1dG9SZW1vdmVUeXBlc1wiLCBkZWZhdWx0VmFsdWU6IHRydWUsIHR5cGU6IEJvb2xlYW4gfSxcclxuXHRcdFx0eyBuYW1lOiBcImF1dG9VcGRhdGVPdXRkYXRlZFwiLCBkZWZhdWx0VmFsdWU6IGZhbHNlLCB0eXBlOiBCb29sZWFuIH0sXHJcblx0XHRcdHsgbmFtZTogXCJhdXRvVXBkYXRlRGVwcmVjYXRlZFwiLCBkZWZhdWx0VmFsdWU6IGZhbHNlLCB0eXBlOiBCb29sZWFuIH0sXHJcblx0XHRcdHsgbmFtZTogXCJ1cGRhdGVTZWxlY3RvclwiLCBkZWZhdWx0VmFsdWU6IHRydWUsIHR5cGU6IEJvb2xlYW4gfSxcclxuXHRcdFx0eyBuYW1lOiBcInRvZG9DaGVja1wiLCBkZWZhdWx0VmFsdWU6IHRydWUsIHR5cGU6IFN0cmluZyB9LFxyXG5cdFx0XHR7IG5hbWU6IFwidG9kb1RhZ3NcIiwgZGVmYXVsdFZhbHVlOiBudWxsLCB0eXBlOiBTdHJpbmcgfSxcclxuXHRcdFx0eyBuYW1lOiBcImNvcHlPbmx5XCIsIGRlZmF1bHRWYWx1ZTogZmFsc2UsIHR5cGU6IEJvb2xlYW4gfSxcclxuXHRcdFx0eyBuYW1lOiBcImlnbm9yZVwiLCBkZWZhdWx0VmFsdWU6IG51bGwsIHR5cGU6IFN0cmluZyB9LFxyXG5cdFx0XHR7IG5hbWU6IFwiaW5jbHVkZVwiLCBkZWZhdWx0VmFsdWU6IG51bGwsIHR5cGU6IFN0cmluZyB9LFxyXG5cdFx0XHR7IG5hbWU6IFwic2lsZW50XCIsIGFsaWFzOiBcInNcIiwgZGVmYXVsdFZhbHVlOiBmYWxzZSwgdHlwZTogQm9vbGVhbiB9XHJcblx0XHRdLFxyXG5cdFx0eyBzdG9wQXRGaXJzdFVua25vd246IGZhbHNlLCBwYXJ0aWFsOiB0cnVlIH1cclxuXHQpIGFzIGFueTtcclxuXHJcblx0aWYgKHR5cGVvZiBjb25maWcuZGVwQ2hlY2sgPT09IFwic3RyaW5nXCIpXHJcblx0XHRjb25maWcuZGVwQ2hlY2sgPSBCb29sZWFuKGNvbmZpZy5kZXBDaGVjayk7XHJcblx0aWYgKHR5cGVvZiBjb25maWcuZGVsZXRlT2Jzb2xldGUgPT09IFwic3RyaW5nXCIpXHJcblx0XHRjb25maWcuZGVsZXRlT2Jzb2xldGUgPSBCb29sZWFuKGNvbmZpZy5kZWxldGVPYnNvbGV0ZSk7XHJcblxyXG5cdC8vKiBUYWtlIHBvc3NpYmxlIGNvbmZpZyB2YWx1ZXMgZnJvbSBwYWNrYWdlLmpzb24gb2YgcHJvamVjdFxyXG5cdHRyeSB7XHJcblx0XHRjb25zdCBwa2dKc29uID0gcmVxdWlyZShyZXNvbHZlKHByb2Nlc3MuY3dkKCksIFwicGFja2FnZS5qc29uXCIpKTtcclxuXHJcblx0XHRpZiAocGtnSnNvbi5kZXZTY3JpcHQpIHtcclxuXHRcdFx0Zm9yIChsZXQga2V5IGluIHBrZ0pzb24uZGV2U2NyaXB0KSB7XHJcblx0XHRcdFx0aWYgKGNvbmZpZ1trZXldKSBjb25maWdba2V5XSA9IHBrZ0pzb24uZGV2U2NyaXB0W2tleV07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9IGNhdGNoIChlKSB7fVxyXG5cclxuXHRyZXR1cm4gY29uZmlnO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93QXZhaWxhYmxlQXJncygpOiB2b2lkIHtcclxuXHRjb25zdCBjb25maWdEZXNjcmlwdGlvbnM6IHtcclxuXHRcdFtuYW1lOiBzdHJpbmddOiB7XHJcblx0XHRcdHR5cGU6IHN0cmluZztcclxuXHRcdFx0ZGVzY3JpcHRpb246IHN0cmluZztcclxuXHRcdH07XHJcblx0fSA9IHtcclxuXHRcdHNyYzoge1xyXG5cdFx0XHR0eXBlOiBcInN0cmluZ1wiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJEaXJlY3RvcnkgY29udGFpbmluZyB0aGUgc291cmNlIGNvZGUuXCJcclxuXHRcdH0sXHJcblx0XHRvdXQ6IHtcclxuXHRcdFx0dHlwZTogXCJzdHJpbmdcIixcclxuXHRcdFx0ZGVzY3JpcHRpb246IFwiRGlyZWN0b3J5IHRoYXQgd2lsbCBjb250YWluIHRoZSBvdXRwdXQuXCJcclxuXHRcdH0sXHJcblx0XHRkZWxldGVPYnNvbGV0ZToge1xyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcclxuXHRcdFx0ZGVzY3JpcHRpb246XHJcblx0XHRcdFx0XCJXaGV0aGVyIG9yIG5vdCB0byBkZWxldGUgZmlsZXMgZnJvbSBvdXQgdGhhdCBhcmUgbm90IGluIHRoZSBzcmMuXCJcclxuXHRcdH0sXHJcblx0XHR0c2NvbmZpZzoge1xyXG5cdFx0XHR0eXBlOiBcInN0cmluZ1wiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJQYXRoIHRvIGEgdmFsaWQgdHNjb25maWcuanNvbiBmaWxlLlwiXHJcblx0XHR9LFxyXG5cdFx0ZW50cnk6IHtcclxuXHRcdFx0dHlwZTogXCJzdHJpbmdcIixcclxuXHRcdFx0ZGVzY3JpcHRpb246IFwiRW50cnkgZmlsZSB0byBiZSBleGVjdXRlZCBhZnRlciBjb21waWxhdGlvbi5cIlxyXG5cdFx0fSxcclxuXHRcdGRlcENoZWNrOiB7XHJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJXaGV0aGVyIG9yIG5vdCB0byBjaGVjayB0aGUgZGVwZW5kZW5jaWVzLlwiXHJcblx0XHR9LFxyXG5cdFx0ZXhjbHVkZURlcHM6IHtcclxuXHRcdFx0dHlwZTogXCJzdHJpbmdcIixcclxuXHRcdFx0ZGVzY3JpcHRpb246XHJcblx0XHRcdFx0XCJEZXBlbmRlbmNpZXMgdG8gZXhjbHVkZSBmcm9tIGF1dG9tYXRpY2FsbHkgdW5pbnN0YWxsaW5nLiAoU3RyaW5nIGxpc3Qgc2VwZXJhdGVkIGJ5IGNvbW1hcylcIlxyXG5cdFx0fSxcclxuXHRcdGF1dG9JbnN0YWxsRGVwOiB7XHJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjpcclxuXHRcdFx0XHRcIkF1dG9tYXRpY2FsbHkgaW5zdGFsbHMgbWlzc2luZyBkZXBlbmRlbmNpZXMuIChOZWVkcyBkZXBDaGVjayBlbmFibGVkKVwiXHJcblx0XHR9LFxyXG5cdFx0YXV0b1JlbW92ZURlcDoge1xyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcclxuXHRcdFx0ZGVzY3JpcHRpb246XHJcblx0XHRcdFx0XCJBdXRvbWF0aWNhbGx5IHJlbW92ZXMgdW51c2VkIGRlcGVuZGVuY2llcy4gKE5lZWRzIGRlcENoZWNrIGVuYWJsZWQpXCJcclxuXHRcdH0sXHJcblx0XHRhdXRvSW5zdGFsbFR5cGVzOiB7XHJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjpcclxuXHRcdFx0XHRcIkF1dG9tYXRpY2FsbHkgaW5zdGFsbHMgbWlzc2luZyBkZXBlbmRlbmNpZXMgQHR5cGVzLy4gKE5lZWRzIGRlcENoZWNrIGFuZCBhdXRvSW5zdGFsbERlcCBlbmFibGVkKVwiXHJcblx0XHR9LFxyXG5cdFx0YXV0b1JlbW92ZVR5cGVzOiB7XHJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjpcclxuXHRcdFx0XHRcIkF1dG9tYXRpY2FsbHkgcmVtb3ZlcyB1bnVzZWQgZGVwZW5kZW5jaWVzIEB0eXBlcy8uIChOZWVkcyBkZXBDaGVjayBhbmQgYXV0b1JlbW92ZURlcCBlbmFibGVkKVwiXHJcblx0XHR9LFxyXG5cdFx0YXV0b1VwZGF0ZU91dGRhdGVkOiB7XHJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjpcclxuXHRcdFx0XHRcIkF1dG9tYXRpY2FsbHkgdXBkYXRlIG91dGRhdGVkIGRlcGVuZGVuY2llcyB0byB0aGVpciBsYXRlc3QgdmVyc2lvbi4gKE5lZWRzIGRlcENoZWNrIGVuYWJsZWQpXCJcclxuXHRcdH0sXHJcblx0XHRhdXRvVXBkYXRlRGVwcmVjYXRlZDoge1xyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcclxuXHRcdFx0ZGVzY3JpcHRpb246XHJcblx0XHRcdFx0XCJBdXRvbWF0aWNhbGx5IHVwZGF0ZSBkZXByZWNhdGVkIGRlcGVuZGVuY2llcyB0byB0aGVpciBsYXRlc3QgdmVyc2lvbi4gKE5lZWRzIGRlcENoZWNrIGVuYWJsZWQpXCJcclxuXHRcdH0sXHJcblx0XHR1cGRhdGVTZWxlY3Rvcjoge1xyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcclxuXHRcdFx0ZGVzY3JpcHRpb246XHJcblx0XHRcdFx0XCJXaGV0aGVyIG9yIG5vdCB0byBzaG93IHRoZSB1cGRhdGUgc2VsZWN0b3IgZm9yIGRlcHJlY2F0ZWQgb3Igb3V0ZGF0ZWQgZGVwZW5kZW5jaWVzLiAoTmVlZHMgZGVwQ2hlY2sgZW5hYmxlZClcIlxyXG5cdFx0fSxcclxuXHRcdHRvZG9DaGVjazoge1xyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcclxuXHRcdFx0ZGVzY3JpcHRpb246IFwiV2hldGhlciBvciBub3QgdG8gY2hlY2sgZm9yIFRPRE8ncy5cIlxyXG5cdFx0fSxcclxuXHRcdHRvZG9UYWdzOiB7XHJcblx0XHRcdHR5cGU6IFwic3RyaW5nXCIsXHJcblx0XHRcdGRlc2NyaXB0aW9uOlxyXG5cdFx0XHRcdFwiQ3VzdG9tIHRhZ3MgdG8gaW5jbHVkZSBpbiB0aGUgVE9ETyBjaGVjay4gKFN0cmluZyBsaXN0IHNlcGVyYXRlZCBieSBjb21tYXMpXCJcclxuXHRcdH0sXHJcblx0XHRjb3B5T25seToge1xyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcclxuXHRcdFx0ZGVzY3JpcHRpb246IFwiV2hldGhlciBvciBub3Qgb25seSB0byBjb3B5IHRoZSBmaWxlcyBmcm9tIHNyYyB0byBvdXQuXCJcclxuXHRcdH0sXHJcblx0XHRpZ25vcmU6IHtcclxuXHRcdFx0dHlwZTogXCJzdHJpbmdcIixcclxuXHRcdFx0ZGVzY3JpcHRpb246XHJcblx0XHRcdFx0XCJGaWxlcyB0aGF0IHNob3VsZCBiZSBpZ25vcmVkIHdoZW4gd2F0Y2hpbmcgZmlsZXMuIChnbG9iIHBhdHRlcm4pXCJcclxuXHRcdH0sXHJcblx0XHRpbmNsdWRlOiB7XHJcblx0XHRcdHR5cGU6IFwic3RyaW5nXCIsXHJcblx0XHRcdGRlc2NyaXB0aW9uOlxyXG5cdFx0XHRcdFwiRmlsZXMgdGhhdCBzaG91bGQgYmUgaW5jbHVkZWQgd2hlbiB3YXRjaGluZyBmaWxlcy4gKGdsb2IgcGF0dGVybilcIlxyXG5cdFx0fSxcclxuXHRcdHNpbGVudDoge1xyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcclxuXHRcdFx0ZGVzY3JpcHRpb246IFwiV2hldGhlciBvciBub3QgdG8gcHJpbnQgY29uc29sZSBsb2dzLlwiXHJcblx0XHR9XHJcblx0fTtcclxuXHRsZXQgc2V0dGluZ3M6IHN0cmluZ1tdID0gW107XHJcblx0Zm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMoY29uZmlnRGVzY3JpcHRpb25zKSkge1xyXG5cdFx0c2V0dGluZ3MucHVzaChcclxuXHRcdFx0YCR7Y2hhbGsueWVsbG93QnJpZ2h0KFwiLS1cIiArIGspfSAke2NoYWxrLnVuZGVybGluZShcclxuXHRcdFx0XHRjaGFsay5oZXgoXCIjYmViZWJlXCIpKHYudHlwZSlcclxuXHRcdFx0KX0g4oCiICR7Y2hhbGsuaGV4KFwiIzcyODlEQVwiKSh2LmRlc2NyaXB0aW9uKX1gXHJcblx0XHQpO1xyXG5cdH1cclxuXHRvdXRsaW5lKHNldHRpbmdzLCBcIuKAolwiKTtcclxuXHRuZXcgVHJlZShjaGFsay5ib2xkKGNoYWxrLmdyZWVuKFwiQXZhaWxhYmxlIGFyZ3VtZW50c1wiKSksIHtcclxuXHRcdGhlYWRDaGFyOiBkc0NvbnNvbGVQcmVmaXggKyBcIiBcIlxyXG5cdH0pXHJcblx0XHQuYWRkQnJhbmNoKHNldHRpbmdzKVxyXG5cdFx0LmxvZygpO1xyXG59XHJcbiJdfQ==