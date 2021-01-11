"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../");
var chalk_1 = __importDefault(require("chalk"));
var command_line_args_1 = __importDefault(require("command-line-args"));
var displayAsTree_1 = __importDefault(require("./functions/displayAsTree"));
var outlineStrings_1 = __importDefault(require("./functions/outlineStrings"));
var path_1 = require("path");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnSGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsidXRpbC9jb25maWdIYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEseUJBTWE7QUFFYixnREFBMEI7QUFDMUIsd0VBQXdDO0FBQ3hDLDRFQUFzRDtBQUN0RCw4RUFBaUQ7QUFDakQsNkJBQStCO0FBa0IvQixTQUF3QixHQUFHO0lBQzFCLElBQUksTUFBYyxDQUFDO0lBRW5CLElBQUk7UUFDSCxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ25FLHVCQUFhLENBQ1osbUJBQWU7Z0JBQ2QsR0FBRztnQkFDSCxlQUFLLENBQUMsS0FBSyxDQUNQLGVBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQUksZUFBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FDakQsSUFBSSxHQUFHLFdBQU8sR0FBRyxHQUFHLENBQ2xCLENBQ0gsRUFDRjtnQkFDQyxlQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLGVBQVcsQ0FBQztnQkFDakMsZUFBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxhQUFXLGVBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsVUFBTSxDQUFHLENBQUM7Z0JBQy9ELGVBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQ25CLGlCQUFjLGdCQUFZLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLFdBQUssZUFBSyxDQUFDLEdBQUcsQ0FDL0QsU0FBUyxDQUNULENBQUMsZ0JBQVksQ0FBQyxJQUFJLENBQUMsZUFBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFHLENBQ2xEO2FBQ0QsQ0FDRCxDQUFDO1lBQ0YsaUJBQWlCLEVBQUUsQ0FBQztZQUNwQixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDZjtRQUVELE1BQU0sR0FBRywyQkFBTyxDQUFDO1lBQ2hCLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7WUFDbEQsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtZQUNuRCxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7WUFDNUQsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtZQUNqRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO1lBQ25ELEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7WUFDdEQsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtZQUN2RCxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO1lBQ3RELEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7WUFDeEQsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtZQUNwRCxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO1lBQ3JELEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTtTQUNsRSxDQUFRLENBQUM7UUFFVixJQUFJLE9BQU8sTUFBTSxDQUFDLFFBQVEsS0FBSyxRQUFRO1lBQ3RDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1QyxJQUFJLE9BQU8sTUFBTSxDQUFDLGNBQWMsS0FBSyxRQUFRO1lBQzVDLE1BQU0sQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUd4RCxJQUFJO1lBQ0gsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGNBQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUVoRSxJQUFJLE9BQU8sQ0FBQyxTQUFTLEVBQUU7Z0JBQ3RCLEtBQUssSUFBSSxHQUFHLElBQUksT0FBTyxDQUFDLFNBQVMsRUFBRTtvQkFDbEMsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDO3dCQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUN0RDthQUNEO1NBQ0Q7UUFBQyxPQUFPLENBQUMsRUFBRSxHQUFFO0tBQ2Q7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNYLE9BQU8sQ0FBQyxHQUFHLENBQ1AsbUJBQWUsU0FBSSxlQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUN6Qyx3QkFBcUIsZUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLGFBQUksQ0FDL0MsQ0FDSCxDQUFDO1FBQ0YsaUJBQWlCLEVBQUUsQ0FBQztRQUNwQixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDZjtJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2YsQ0FBQztBQXBFRCxzQkFvRUM7QUFFRCxTQUFTLGlCQUFpQjtJQUN6QixJQUFNLGtCQUFrQixHQUtwQjtRQUNILEdBQUcsRUFBRTtZQUNKLElBQUksRUFBRSxRQUFRO1lBQ2QsV0FBVyxFQUFFLHVDQUF1QztTQUNwRDtRQUNELEdBQUcsRUFBRTtZQUNKLElBQUksRUFBRSxRQUFRO1lBQ2QsV0FBVyxFQUFFLHlDQUF5QztTQUN0RDtRQUNELGNBQWMsRUFBRTtZQUNmLElBQUksRUFBRSxTQUFTO1lBQ2YsV0FBVyxFQUNWLGtFQUFrRTtTQUNuRTtRQUNELFFBQVEsRUFBRTtZQUNULElBQUksRUFBRSxRQUFRO1lBQ2QsV0FBVyxFQUFFLHFDQUFxQztTQUNsRDtRQUNELEtBQUssRUFBRTtZQUNOLElBQUksRUFBRSxRQUFRO1lBQ2QsV0FBVyxFQUFFLDhDQUE4QztTQUMzRDtRQUNELFFBQVEsRUFBRTtZQUNULElBQUksRUFBRSxTQUFTO1lBQ2YsV0FBVyxFQUFFLDJDQUEyQztTQUN4RDtRQUNELFNBQVMsRUFBRTtZQUNWLElBQUksRUFBRSxTQUFTO1lBQ2YsV0FBVyxFQUFFLHFDQUFxQztTQUNsRDtRQUNELFFBQVEsRUFBRTtZQUNULElBQUksRUFBRSxRQUFRO1lBQ2QsV0FBVyxFQUNWLDZFQUE2RTtTQUM5RTtRQUNELFFBQVEsRUFBRTtZQUNULElBQUksRUFBRSxTQUFTO1lBQ2YsV0FBVyxFQUFFLHVEQUF1RDtTQUNwRTtRQUNELE1BQU0sRUFBRTtZQUNQLElBQUksRUFBRSxRQUFRO1lBQ2QsV0FBVyxFQUNWLGtFQUFrRTtTQUNuRTtRQUNELE9BQU8sRUFBRTtZQUNSLElBQUksRUFBRSxRQUFRO1lBQ2QsV0FBVyxFQUNWLG1FQUFtRTtTQUNwRTtRQUNELE1BQU0sRUFBRTtZQUNQLElBQUksRUFBRSxTQUFTO1lBQ2YsV0FBVyxFQUFFLHVDQUF1QztTQUNwRDtLQUNELENBQUM7SUFDRixJQUFJLFFBQVEsR0FBYSxFQUFFLENBQUM7SUFDNUIsS0FBcUIsVUFBa0MsRUFBbEMsS0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLEVBQWxDLGNBQWtDLEVBQWxDLElBQWtDLEVBQUU7UUFBOUMsSUFBQSxXQUFNLEVBQUwsQ0FBQyxRQUFBLEVBQUUsQ0FBQyxRQUFBO1FBQ2YsUUFBUSxDQUFDLElBQUksQ0FDVCxlQUFLLENBQUMsWUFBWSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsU0FBSSxlQUFLLENBQUMsU0FBUyxDQUNqRCxlQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FDNUIsZ0JBQU0sZUFBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFHLENBQzVDLENBQUM7S0FDRjtJQUNELHdCQUFPLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZCLHVCQUFhLENBQ1QsbUJBQWUsU0FBSSxlQUFLLENBQUMsSUFBSSxDQUFDLGVBQUssQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBRyxFQUN0RSxRQUFRLENBQ1IsQ0FBQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG5cdGF1dGhvcixcclxuXHRjb250cmlidXRvcnMsXHJcblx0ZGVzY3JpcHRpb24sXHJcblx0ZHNDb25zb2xlUHJlZml4LFxyXG5cdHZlcnNpb25cclxufSBmcm9tIFwiLi4vXCI7XHJcblxyXG5pbXBvcnQgY2hhbGsgZnJvbSBcImNoYWxrXCI7XHJcbmltcG9ydCBjbWRBcmdzIGZyb20gXCJjb21tYW5kLWxpbmUtYXJnc1wiO1xyXG5pbXBvcnQgZGlzcGxheUFzVHJlZSBmcm9tIFwiLi9mdW5jdGlvbnMvZGlzcGxheUFzVHJlZVwiO1xyXG5pbXBvcnQgb3V0bGluZSBmcm9tIFwiLi9mdW5jdGlvbnMvb3V0bGluZVN0cmluZ3NcIjtcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XHJcblxyXG5pbnRlcmZhY2UgY29uZmlnIHtcclxuXHRzcmM6IHN0cmluZztcclxuXHRvdXQ6IHN0cmluZztcclxuXHRkZWxldGVPYnNvbGV0ZTogYm9vbGVhbjtcclxuXHR0c2NvbmZpZzogc3RyaW5nO1xyXG5cdGVudHJ5OiBzdHJpbmc7XHJcblx0ZGVwQ2hlY2s6IGJvb2xlYW47XHJcblx0dG9kb0NoZWNrOiBib29sZWFuO1xyXG5cdHRvZG9UYWdzOiBzdHJpbmc7XHJcblx0Y29weU9ubHk6IGJvb2xlYW47XHJcblx0d2F0Y2g6IGJvb2xlYW47XHJcblx0aWdub3JlOiBzdHJpbmc7XHJcblx0aW5jbHVkZTogc3RyaW5nO1xyXG5cdHNpbGVudDogYm9vbGVhbjtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcnVuKCkge1xyXG5cdGxldCBjb25maWc6IGNvbmZpZztcclxuXHJcblx0dHJ5IHtcclxuXHRcdGlmIChwcm9jZXNzLmFyZ3YuaW5jbHVkZXMoXCItaFwiKSB8fCBwcm9jZXNzLmFyZ3YuaW5jbHVkZXMoXCItLWhlbHBcIikpIHtcclxuXHRcdFx0ZGlzcGxheUFzVHJlZShcclxuXHRcdFx0XHRkc0NvbnNvbGVQcmVmaXggK1xyXG5cdFx0XHRcdFx0XCIgXCIgK1xyXG5cdFx0XHRcdFx0Y2hhbGsuZ3JlZW4oXHJcblx0XHRcdFx0XHRcdGAke2NoYWxrLmJvbGQoXCJEZXZTY3JpcHRcIil9ICR7Y2hhbGsuaGV4KFwiI2JlYmViZVwiKShcclxuXHRcdFx0XHRcdFx0XHRcIih2XCIgKyB2ZXJzaW9uICsgXCIpXCJcclxuXHRcdFx0XHRcdFx0KX1gXHJcblx0XHRcdFx0XHQpLFxyXG5cdFx0XHRcdFtcclxuXHRcdFx0XHRcdGNoYWxrLmhleChcIiM3Mjg5REFcIikoZGVzY3JpcHRpb24pLFxyXG5cdFx0XHRcdFx0Y2hhbGsuaGV4KFwiI2ViYzE0ZFwiKShgQXV0aG9yOiAke2NoYWxrLmhleChcIiNiZWJlYmVcIikoYXV0aG9yKX1gKSxcclxuXHRcdFx0XHRcdGNoYWxrLmhleChcIiNlYmMxNGRcIikoXHJcblx0XHRcdFx0XHRcdGBDb250cmlidXRvciR7Y29udHJpYnV0b3JzLmxlbmd0aCA9PT0gMSA/IFwiXCIgOiBcInNcIn06ICR7Y2hhbGsuaGV4KFxyXG5cdFx0XHRcdFx0XHRcdFwiI2JlYmViZVwiXHJcblx0XHRcdFx0XHRcdCkoY29udHJpYnV0b3JzLmpvaW4oY2hhbGsuaGV4KFwiI2ViYzE0ZFwiKShcIiwgXCIpKSl9YFxyXG5cdFx0XHRcdFx0KVxyXG5cdFx0XHRcdF1cclxuXHRcdFx0KTtcclxuXHRcdFx0c2hvd0F2YWlsYWJsZUFyZ3MoKTtcclxuXHRcdFx0cHJvY2Vzcy5leGl0KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uZmlnID0gY21kQXJncyhbXHJcblx0XHRcdHsgbmFtZTogXCJzcmNcIiwgZGVmYXVsdFZhbHVlOiBcInNyY1wiLCB0eXBlOiBTdHJpbmcgfSxcclxuXHRcdFx0eyBuYW1lOiBcIm91dFwiLCBkZWZhdWx0VmFsdWU6IFwiZGlzdFwiLCB0eXBlOiBTdHJpbmcgfSxcclxuXHRcdFx0eyBuYW1lOiBcImRlbGV0ZU9ic29sZXRlXCIsIGRlZmF1bHRWYWx1ZTogdHJ1ZSwgdHlwZTogU3RyaW5nIH0sXHJcblx0XHRcdHsgbmFtZTogXCJ0c2NvbmZpZ1wiLCBkZWZhdWx0VmFsdWU6IFwidHNjb25maWcuanNvblwiLCB0eXBlOiBTdHJpbmcgfSxcclxuXHRcdFx0eyBuYW1lOiBcImVudHJ5XCIsIGRlZmF1bHRWYWx1ZTogbnVsbCwgdHlwZTogU3RyaW5nIH0sXHJcblx0XHRcdHsgbmFtZTogXCJkZXBDaGVja1wiLCBkZWZhdWx0VmFsdWU6IHRydWUsIHR5cGU6IFN0cmluZyB9LFxyXG5cdFx0XHR7IG5hbWU6IFwidG9kb0NoZWNrXCIsIGRlZmF1bHRWYWx1ZTogdHJ1ZSwgdHlwZTogU3RyaW5nIH0sXHJcblx0XHRcdHsgbmFtZTogXCJ0b2RvVGFnc1wiLCBkZWZhdWx0VmFsdWU6IG51bGwsIHR5cGU6IFN0cmluZyB9LFxyXG5cdFx0XHR7IG5hbWU6IFwiY29weU9ubHlcIiwgZGVmYXVsdFZhbHVlOiBmYWxzZSwgdHlwZTogQm9vbGVhbiB9LFxyXG5cdFx0XHR7IG5hbWU6IFwiaWdub3JlXCIsIGRlZmF1bHRWYWx1ZTogbnVsbCwgdHlwZTogU3RyaW5nIH0sXHJcblx0XHRcdHsgbmFtZTogXCJpbmNsdWRlXCIsIGRlZmF1bHRWYWx1ZTogbnVsbCwgdHlwZTogU3RyaW5nIH0sXHJcblx0XHRcdHsgbmFtZTogXCJzaWxlbnRcIiwgYWxpYXM6IFwic1wiLCBkZWZhdWx0VmFsdWU6IGZhbHNlLCB0eXBlOiBCb29sZWFuIH1cclxuXHRcdF0pIGFzIGFueTtcclxuXHJcblx0XHRpZiAodHlwZW9mIGNvbmZpZy5kZXBDaGVjayA9PT0gXCJzdHJpbmdcIilcclxuXHRcdFx0Y29uZmlnLmRlcENoZWNrID0gQm9vbGVhbihjb25maWcuZGVwQ2hlY2spO1xyXG5cdFx0aWYgKHR5cGVvZiBjb25maWcuZGVsZXRlT2Jzb2xldGUgPT09IFwic3RyaW5nXCIpXHJcblx0XHRcdGNvbmZpZy5kZWxldGVPYnNvbGV0ZSA9IEJvb2xlYW4oY29uZmlnLmRlbGV0ZU9ic29sZXRlKTtcclxuXHJcblx0XHQvLyogVGFrZSBwb3NzaWJsZSBjb25maWcgdmFsdWVzIGZyb20gcGFja2FnZS5qc29uIG9mIHByb2plY3RcclxuXHRcdHRyeSB7XHJcblx0XHRcdGNvbnN0IHBrZ0pzb24gPSByZXF1aXJlKHJlc29sdmUocHJvY2Vzcy5jd2QoKSwgXCJwYWNrYWdlLmpzb25cIikpO1xyXG5cclxuXHRcdFx0aWYgKHBrZ0pzb24uZGV2U2NyaXB0KSB7XHJcblx0XHRcdFx0Zm9yIChsZXQga2V5IGluIHBrZ0pzb24uZGV2U2NyaXB0KSB7XHJcblx0XHRcdFx0XHRpZiAoY29uZmlnW2tleV0pIGNvbmZpZ1trZXldID0gcGtnSnNvbi5kZXZTY3JpcHRba2V5XTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0gY2F0Y2ggKGUpIHt9XHJcblx0fSBjYXRjaCAoZSkge1xyXG5cdFx0Y29uc29sZS5sb2coXHJcblx0XHRcdGAke2RzQ29uc29sZVByZWZpeH0gJHtjaGFsay5oZXgoXCIjZTgzYTNhXCIpKFxyXG5cdFx0XHRcdGBVbmtub3duIGFyZ3VtZW50IFwiJHtjaGFsay5ib2xkKGUub3B0aW9uTmFtZSl9XCLigKZgXHJcblx0XHRcdCl9YFxyXG5cdFx0KTtcclxuXHRcdHNob3dBdmFpbGFibGVBcmdzKCk7XHJcblx0XHRwcm9jZXNzLmV4aXQoKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBjb25maWc7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNob3dBdmFpbGFibGVBcmdzKCk6IHZvaWQge1xyXG5cdGNvbnN0IGNvbmZpZ0Rlc2NyaXB0aW9uczoge1xyXG5cdFx0W25hbWU6IHN0cmluZ106IHtcclxuXHRcdFx0dHlwZTogc3RyaW5nO1xyXG5cdFx0XHRkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG5cdFx0fTtcclxuXHR9ID0ge1xyXG5cdFx0c3JjOiB7XHJcblx0XHRcdHR5cGU6IFwic3RyaW5nXCIsXHJcblx0XHRcdGRlc2NyaXB0aW9uOiBcIkRpcmVjdG9yeSBjb250YWluaW5nIHRoZSBzb3VyY2UgY29kZS5cIlxyXG5cdFx0fSxcclxuXHRcdG91dDoge1xyXG5cdFx0XHR0eXBlOiBcInN0cmluZ1wiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJEaXJlY3RvcnkgdGhhdCB3aWxsIGNvbnRhaW4gdGhlIG91dHB1dC5cIlxyXG5cdFx0fSxcclxuXHRcdGRlbGV0ZU9ic29sZXRlOiB7XHJcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjpcclxuXHRcdFx0XHRcIldoZXRoZXIgb3Igbm90IHRvIGRlbGV0ZSBmaWxlcyBmcm9tIG91dCB0aGF0IGFyZSBub3QgaW4gdGhlIHNyYy5cIlxyXG5cdFx0fSxcclxuXHRcdHRzY29uZmlnOiB7XHJcblx0XHRcdHR5cGU6IFwic3RyaW5nXCIsXHJcblx0XHRcdGRlc2NyaXB0aW9uOiBcIlBhdGggdG8gYSB2YWxpZCB0c2NvbmZpZy5qc29uIGZpbGUuXCJcclxuXHRcdH0sXHJcblx0XHRlbnRyeToge1xyXG5cdFx0XHR0eXBlOiBcInN0cmluZ1wiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJFbnRyeSBmaWxlIHRvIGJlIGV4ZWN1dGVkIGFmdGVyIGNvbXBpbGF0aW9uLlwiXHJcblx0XHR9LFxyXG5cdFx0ZGVwQ2hlY2s6IHtcclxuXHRcdFx0dHlwZTogXCJib29sZWFuXCIsXHJcblx0XHRcdGRlc2NyaXB0aW9uOiBcIldoZXRoZXIgb3Igbm90IHRvIGNoZWNrIHRoZSBkZXBlbmRlbmNpZXMuXCJcclxuXHRcdH0sXHJcblx0XHR0b2RvQ2hlY2s6IHtcclxuXHRcdFx0dHlwZTogXCJib29sZWFuXCIsXHJcblx0XHRcdGRlc2NyaXB0aW9uOiBcIldoZXRoZXIgb3Igbm90IHRvIGNoZWNrIGZvciBUT0RPJ3MuXCJcclxuXHRcdH0sXHJcblx0XHR0b2RvVGFnczoge1xyXG5cdFx0XHR0eXBlOiBcInN0cmluZ1wiLFxyXG5cdFx0XHRkZXNjcmlwdGlvbjpcclxuXHRcdFx0XHRcIkN1c3RvbSB0YWdzIHRvIGluY2x1ZGUgaW4gdGhlIFRPRE8gY2hlY2suIChTdHJpbmcgbGlzdCBzZXBlcmF0ZWQgYnkgY29tbWFzKVwiXHJcblx0XHR9LFxyXG5cdFx0Y29weU9ubHk6IHtcclxuXHRcdFx0dHlwZTogXCJib29sZWFuXCIsXHJcblx0XHRcdGRlc2NyaXB0aW9uOiBcIldoZXRoZXIgb3Igbm90IG9ubHkgdG8gY29weSB0aGUgZmlsZXMgZnJvbSBzcmMgdG8gb3V0XCJcclxuXHRcdH0sXHJcblx0XHRpZ25vcmU6IHtcclxuXHRcdFx0dHlwZTogXCJzdHJpbmdcIixcclxuXHRcdFx0ZGVzY3JpcHRpb246XHJcblx0XHRcdFx0XCJGaWxlcyB0aGF0IHNob3VsZCBiZSBpZ25vcmVkIHdoZW4gd2F0Y2hpbmcgZmlsZXMuIChnbG9iIHBhdHRlcm4pXCJcclxuXHRcdH0sXHJcblx0XHRpbmNsdWRlOiB7XHJcblx0XHRcdHR5cGU6IFwic3RyaW5nXCIsXHJcblx0XHRcdGRlc2NyaXB0aW9uOlxyXG5cdFx0XHRcdFwiRmlsZXMgdGhhdCBzaG91bGQgYmUgaW5jbHVkZWQgd2hlbiB3YXRjaGluZyBmaWxlcy4gKGdsb2IgcGF0dGVybilcIlxyXG5cdFx0fSxcclxuXHRcdHNpbGVudDoge1xyXG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcclxuXHRcdFx0ZGVzY3JpcHRpb246IFwiV2hldGhlciBvciBub3QgdG8gcHJpbnQgY29uc29sZSBsb2dzLlwiXHJcblx0XHR9XHJcblx0fTtcclxuXHRsZXQgc2V0dGluZ3M6IHN0cmluZ1tdID0gW107XHJcblx0Zm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMoY29uZmlnRGVzY3JpcHRpb25zKSkge1xyXG5cdFx0c2V0dGluZ3MucHVzaChcclxuXHRcdFx0YCR7Y2hhbGsueWVsbG93QnJpZ2h0KFwiLS1cIiArIGspfSAke2NoYWxrLnVuZGVybGluZShcclxuXHRcdFx0XHRjaGFsay5oZXgoXCIjYmViZWJlXCIpKHYudHlwZSlcclxuXHRcdFx0KX0g4oCiICR7Y2hhbGsuaGV4KFwiIzcyODlEQVwiKSh2LmRlc2NyaXB0aW9uKX1gXHJcblx0XHQpO1xyXG5cdH1cclxuXHRvdXRsaW5lKHNldHRpbmdzLCBcIuKAolwiKTtcclxuXHRkaXNwbGF5QXNUcmVlKFxyXG5cdFx0YCR7ZHNDb25zb2xlUHJlZml4fSAke2NoYWxrLmJvbGQoY2hhbGsuZ3JlZW4oXCJBdmFpbGFibGUgYXJndW1lbnRzXCIpKX1gLFxyXG5cdFx0c2V0dGluZ3NcclxuXHQpO1xyXG59XHJcbiJdfQ==