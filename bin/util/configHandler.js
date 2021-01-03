"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const command_line_args_1 = __importDefault(require("command-line-args"));
const path_1 = require("path");
const __1 = require("../");
const displayAsTree_1 = __importDefault(require("./functions/displayAsTree"));
const outlineStrings_1 = __importDefault(require("./functions/outlineStrings"));
function run() {
    let config;
    try {
        if (process.argv.includes("-h") || process.argv.includes("--help")) {
            displayAsTree_1.default(__1.dsConsolePrefix +
                " " +
                chalk_1.default.green(`${chalk_1.default.bold("DevScript")} ${chalk_1.default.hex("#bebebe")("(v" + __1.version + ")")}`), [
                chalk_1.default.hex("#7289DA")(__1.description),
                chalk_1.default.hex("#ebc14d")(`Author: ${chalk_1.default.hex("#bebebe")(__1.author)}`),
                chalk_1.default.hex("#ebc14d")(`Contributor${__1.contributors.length === 1 ? "" : "s"}: ${chalk_1.default.hex("#bebebe")(__1.contributors.join(chalk_1.default.hex("#ebc14d")(", ")))}`)
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
            const pkgJson = require(path_1.resolve(process.cwd(), "package.json"));
            if (pkgJson.devScript) {
                for (let key in pkgJson.devScript) {
                    if (config[key])
                        config[key] = pkgJson.devScript[key];
                }
            }
        }
        catch (e) { }
    }
    catch (e) {
        console.log(`${__1.dsConsolePrefix} ${chalk_1.default.hex("#e83a3a")(`Unknown argument "${chalk_1.default.bold(e.optionName)}"…`)}`);
        showAvailableArgs();
        process.exit();
    }
    return config;
}
exports.default = run;
function showAvailableArgs() {
    const configDescriptions = {
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
    let settings = [];
    for (const [k, v] of Object.entries(configDescriptions)) {
        settings.push(`${chalk_1.default.yellowBright("--" + k)} ${chalk_1.default.underline(chalk_1.default.hex("#bebebe")(v.type))} • ${chalk_1.default.hex("#7289DA")(v.description)}`);
    }
    outlineStrings_1.default(settings, "•");
    displayAsTree_1.default(`${__1.dsConsolePrefix} ${chalk_1.default.bold(chalk_1.default.green("Available arguments"))}`, settings);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnSGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsidXRpbC9jb25maWdIYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQTBCO0FBQzFCLDBFQUF3QztBQUN4QywrQkFBK0I7QUFFL0IsMkJBQWtGO0FBQ2xGLDhFQUFzRDtBQUN0RCxnRkFBaUQ7QUFnQmpELFNBQXdCLEdBQUc7SUFDMUIsSUFBSSxNQUFjLENBQUM7SUFFbkIsSUFBSTtRQUNILElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDbkUsdUJBQWEsQ0FDWixtQkFBZTtnQkFDZCxHQUFHO2dCQUNILGVBQUssQ0FBQyxLQUFLLENBQ1YsR0FBRyxlQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLGVBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQ2pELElBQUksR0FBRyxXQUFPLEdBQUcsR0FBRyxDQUNwQixFQUFFLENBQ0gsRUFDRjtnQkFDQyxlQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLGVBQVcsQ0FBQztnQkFDakMsZUFBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLGVBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsVUFBTSxDQUFDLEVBQUUsQ0FBQztnQkFDL0QsZUFBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FDbkIsY0FBYyxnQkFBWSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLGVBQUssQ0FBQyxHQUFHLENBQy9ELFNBQVMsQ0FDVCxDQUFDLGdCQUFZLENBQUMsSUFBSSxDQUFDLGVBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQ2xEO2FBQ0QsQ0FDRCxDQUFDO1lBQ0YsaUJBQWlCLEVBQUUsQ0FBQztZQUNwQixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDZjtRQUVELE1BQU0sR0FBRywyQkFBTyxDQUFDO1lBQ2hCLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7WUFDbEQsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtZQUNuRCxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7WUFDNUQsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtZQUNqRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO1lBQ25ELEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7WUFDdEQsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTtZQUN4RCxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO1lBQ3BELEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7WUFDckQsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFO1NBQ2xFLENBQVEsQ0FBQztRQUVWLElBQUksT0FBTyxNQUFNLENBQUMsUUFBUSxLQUFLLFFBQVE7WUFDdEMsTUFBTSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzVDLElBQUksT0FBTyxNQUFNLENBQUMsY0FBYyxLQUFLLFFBQVE7WUFDNUMsTUFBTSxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBR3hELElBQUk7WUFDSCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsY0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBRWhFLElBQUksT0FBTyxDQUFDLFNBQVMsRUFBRTtnQkFDdEIsS0FBSyxJQUFJLEdBQUcsSUFBSSxPQUFPLENBQUMsU0FBUyxFQUFFO29CQUNsQyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUM7d0JBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ3REO2FBQ0Q7U0FDRDtRQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUU7S0FDZDtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1gsT0FBTyxDQUFDLEdBQUcsQ0FDVixHQUFHLG1CQUFlLElBQUksZUFBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FDekMscUJBQXFCLGVBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQ2pELEVBQUUsQ0FDSCxDQUFDO1FBQ0YsaUJBQWlCLEVBQUUsQ0FBQztRQUNwQixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDZjtJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2YsQ0FBQztBQWxFRCxzQkFrRUM7QUFFRCxTQUFTLGlCQUFpQjtJQUN6QixNQUFNLGtCQUFrQixHQUtwQjtRQUNILEdBQUcsRUFBRTtZQUNKLElBQUksRUFBRSxRQUFRO1lBQ2QsV0FBVyxFQUFFLHVDQUF1QztTQUNwRDtRQUNELEdBQUcsRUFBRTtZQUNKLElBQUksRUFBRSxRQUFRO1lBQ2QsV0FBVyxFQUFFLHlDQUF5QztTQUN0RDtRQUNELGNBQWMsRUFBRTtZQUNmLElBQUksRUFBRSxTQUFTO1lBQ2YsV0FBVyxFQUNWLGtFQUFrRTtTQUNuRTtRQUNELFFBQVEsRUFBRTtZQUNULElBQUksRUFBRSxRQUFRO1lBQ2QsV0FBVyxFQUFFLHFDQUFxQztTQUNsRDtRQUNELEtBQUssRUFBRTtZQUNOLElBQUksRUFBRSxRQUFRO1lBQ2QsV0FBVyxFQUFFLDhDQUE4QztTQUMzRDtRQUNELFFBQVEsRUFBRTtZQUNULElBQUksRUFBRSxTQUFTO1lBQ2YsV0FBVyxFQUFFLDJDQUEyQztTQUN4RDtRQUNELFFBQVEsRUFBRTtZQUNULElBQUksRUFBRSxTQUFTO1lBQ2YsV0FBVyxFQUFFLHVEQUF1RDtTQUNwRTtRQUNELE1BQU0sRUFBRTtZQUNQLElBQUksRUFBRSxRQUFRO1lBQ2QsV0FBVyxFQUNWLGtFQUFrRTtTQUNuRTtRQUNELE9BQU8sRUFBRTtZQUNSLElBQUksRUFBRSxRQUFRO1lBQ2QsV0FBVyxFQUNWLG1FQUFtRTtTQUNwRTtRQUNELE1BQU0sRUFBRTtZQUNQLElBQUksRUFBRSxTQUFTO1lBQ2YsV0FBVyxFQUFFLHVDQUF1QztTQUNwRDtLQUNELENBQUM7SUFDRixJQUFJLFFBQVEsR0FBYSxFQUFFLENBQUM7SUFDNUIsS0FBSyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsRUFBRTtRQUN4RCxRQUFRLENBQUMsSUFBSSxDQUNaLEdBQUcsZUFBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksZUFBSyxDQUFDLFNBQVMsQ0FDakQsZUFBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQzVCLE1BQU0sZUFBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FDNUMsQ0FBQztLQUNGO0lBQ0Qsd0JBQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdkIsdUJBQWEsQ0FDWixHQUFHLG1CQUFlLElBQUksZUFBSyxDQUFDLElBQUksQ0FBQyxlQUFLLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUMsRUFBRSxFQUN0RSxRQUFRLENBQ1IsQ0FBQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2hhbGsgZnJvbSBcImNoYWxrXCI7XG5pbXBvcnQgY21kQXJncyBmcm9tIFwiY29tbWFuZC1saW5lLWFyZ3NcIjtcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xuXG5pbXBvcnQgeyBhdXRob3IsIGNvbnRyaWJ1dG9ycywgZGVzY3JpcHRpb24sIGRzQ29uc29sZVByZWZpeCwgdmVyc2lvbiB9IGZyb20gXCIuLi9cIjtcbmltcG9ydCBkaXNwbGF5QXNUcmVlIGZyb20gXCIuL2Z1bmN0aW9ucy9kaXNwbGF5QXNUcmVlXCI7XG5pbXBvcnQgb3V0bGluZSBmcm9tIFwiLi9mdW5jdGlvbnMvb3V0bGluZVN0cmluZ3NcIjtcblxuaW50ZXJmYWNlIGNvbmZpZyB7XG5cdHNyYzogc3RyaW5nO1xuXHRvdXQ6IHN0cmluZztcblx0ZGVsZXRlT2Jzb2xldGU6IGJvb2xlYW47XG5cdHRzY29uZmlnOiBzdHJpbmc7XG5cdGVudHJ5OiBzdHJpbmc7XG5cdGRlcENoZWNrOiBib29sZWFuO1xuXHRjb3B5T25seTogYm9vbGVhbjtcblx0d2F0Y2g6IGJvb2xlYW47XG5cdGlnbm9yZTogc3RyaW5nO1xuXHRpbmNsdWRlOiBzdHJpbmc7XG5cdHNpbGVudDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcnVuKCkge1xuXHRsZXQgY29uZmlnOiBjb25maWc7XG5cblx0dHJ5IHtcblx0XHRpZiAocHJvY2Vzcy5hcmd2LmluY2x1ZGVzKFwiLWhcIikgfHwgcHJvY2Vzcy5hcmd2LmluY2x1ZGVzKFwiLS1oZWxwXCIpKSB7XG5cdFx0XHRkaXNwbGF5QXNUcmVlKFxuXHRcdFx0XHRkc0NvbnNvbGVQcmVmaXggK1xuXHRcdFx0XHRcdFwiIFwiICtcblx0XHRcdFx0XHRjaGFsay5ncmVlbihcblx0XHRcdFx0XHRcdGAke2NoYWxrLmJvbGQoXCJEZXZTY3JpcHRcIil9ICR7Y2hhbGsuaGV4KFwiI2JlYmViZVwiKShcblx0XHRcdFx0XHRcdFx0XCIodlwiICsgdmVyc2lvbiArIFwiKVwiXG5cdFx0XHRcdFx0XHQpfWBcblx0XHRcdFx0XHQpLFxuXHRcdFx0XHRbXG5cdFx0XHRcdFx0Y2hhbGsuaGV4KFwiIzcyODlEQVwiKShkZXNjcmlwdGlvbiksXG5cdFx0XHRcdFx0Y2hhbGsuaGV4KFwiI2ViYzE0ZFwiKShgQXV0aG9yOiAke2NoYWxrLmhleChcIiNiZWJlYmVcIikoYXV0aG9yKX1gKSxcblx0XHRcdFx0XHRjaGFsay5oZXgoXCIjZWJjMTRkXCIpKFxuXHRcdFx0XHRcdFx0YENvbnRyaWJ1dG9yJHtjb250cmlidXRvcnMubGVuZ3RoID09PSAxID8gXCJcIiA6IFwic1wifTogJHtjaGFsay5oZXgoXG5cdFx0XHRcdFx0XHRcdFwiI2JlYmViZVwiXG5cdFx0XHRcdFx0XHQpKGNvbnRyaWJ1dG9ycy5qb2luKGNoYWxrLmhleChcIiNlYmMxNGRcIikoXCIsIFwiKSkpfWBcblx0XHRcdFx0XHQpXG5cdFx0XHRcdF1cblx0XHRcdCk7XG5cdFx0XHRzaG93QXZhaWxhYmxlQXJncygpO1xuXHRcdFx0cHJvY2Vzcy5leGl0KCk7XG5cdFx0fVxuXG5cdFx0Y29uZmlnID0gY21kQXJncyhbXG5cdFx0XHR7IG5hbWU6IFwic3JjXCIsIGRlZmF1bHRWYWx1ZTogXCJzcmNcIiwgdHlwZTogU3RyaW5nIH0sXG5cdFx0XHR7IG5hbWU6IFwib3V0XCIsIGRlZmF1bHRWYWx1ZTogXCJkaXN0XCIsIHR5cGU6IFN0cmluZyB9LFxuXHRcdFx0eyBuYW1lOiBcImRlbGV0ZU9ic29sZXRlXCIsIGRlZmF1bHRWYWx1ZTogdHJ1ZSwgdHlwZTogU3RyaW5nIH0sXG5cdFx0XHR7IG5hbWU6IFwidHNjb25maWdcIiwgZGVmYXVsdFZhbHVlOiBcInRzY29uZmlnLmpzb25cIiwgdHlwZTogU3RyaW5nIH0sXG5cdFx0XHR7IG5hbWU6IFwiZW50cnlcIiwgZGVmYXVsdFZhbHVlOiBudWxsLCB0eXBlOiBTdHJpbmcgfSxcblx0XHRcdHsgbmFtZTogXCJkZXBDaGVja1wiLCBkZWZhdWx0VmFsdWU6IHRydWUsIHR5cGU6IFN0cmluZyB9LFxuXHRcdFx0eyBuYW1lOiBcImNvcHlPbmx5XCIsIGRlZmF1bHRWYWx1ZTogZmFsc2UsIHR5cGU6IEJvb2xlYW4gfSxcblx0XHRcdHsgbmFtZTogXCJpZ25vcmVcIiwgZGVmYXVsdFZhbHVlOiBudWxsLCB0eXBlOiBTdHJpbmcgfSxcblx0XHRcdHsgbmFtZTogXCJpbmNsdWRlXCIsIGRlZmF1bHRWYWx1ZTogbnVsbCwgdHlwZTogU3RyaW5nIH0sXG5cdFx0XHR7IG5hbWU6IFwic2lsZW50XCIsIGFsaWFzOiBcInNcIiwgZGVmYXVsdFZhbHVlOiBmYWxzZSwgdHlwZTogQm9vbGVhbiB9XG5cdFx0XSkgYXMgYW55O1xuXG5cdFx0aWYgKHR5cGVvZiBjb25maWcuZGVwQ2hlY2sgPT09IFwic3RyaW5nXCIpXG5cdFx0XHRjb25maWcuZGVwQ2hlY2sgPSBCb29sZWFuKGNvbmZpZy5kZXBDaGVjayk7XG5cdFx0aWYgKHR5cGVvZiBjb25maWcuZGVsZXRlT2Jzb2xldGUgPT09IFwic3RyaW5nXCIpXG5cdFx0XHRjb25maWcuZGVsZXRlT2Jzb2xldGUgPSBCb29sZWFuKGNvbmZpZy5kZWxldGVPYnNvbGV0ZSk7XG5cblx0XHQvLyogVGFrZSBwb3NzaWJsZSBjb25maWcgdmFsdWVzIGZyb20gcGFja2FnZS5qc29uIG9mIHByb2plY3Rcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgcGtnSnNvbiA9IHJlcXVpcmUocmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCBcInBhY2thZ2UuanNvblwiKSk7XG5cblx0XHRcdGlmIChwa2dKc29uLmRldlNjcmlwdCkge1xuXHRcdFx0XHRmb3IgKGxldCBrZXkgaW4gcGtnSnNvbi5kZXZTY3JpcHQpIHtcblx0XHRcdFx0XHRpZiAoY29uZmlnW2tleV0pIGNvbmZpZ1trZXldID0gcGtnSnNvbi5kZXZTY3JpcHRba2V5XTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gY2F0Y2ggKGUpIHt9XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRjb25zb2xlLmxvZyhcblx0XHRcdGAke2RzQ29uc29sZVByZWZpeH0gJHtjaGFsay5oZXgoXCIjZTgzYTNhXCIpKFxuXHRcdFx0XHRgVW5rbm93biBhcmd1bWVudCBcIiR7Y2hhbGsuYm9sZChlLm9wdGlvbk5hbWUpfVwi4oCmYFxuXHRcdFx0KX1gXG5cdFx0KTtcblx0XHRzaG93QXZhaWxhYmxlQXJncygpO1xuXHRcdHByb2Nlc3MuZXhpdCgpO1xuXHR9XG5cblx0cmV0dXJuIGNvbmZpZztcbn1cblxuZnVuY3Rpb24gc2hvd0F2YWlsYWJsZUFyZ3MoKTogdm9pZCB7XG5cdGNvbnN0IGNvbmZpZ0Rlc2NyaXB0aW9uczoge1xuXHRcdFtuYW1lOiBzdHJpbmddOiB7XG5cdFx0XHR0eXBlOiBzdHJpbmc7XG5cdFx0XHRkZXNjcmlwdGlvbjogc3RyaW5nO1xuXHRcdH07XG5cdH0gPSB7XG5cdFx0c3JjOiB7XG5cdFx0XHR0eXBlOiBcInN0cmluZ1wiLFxuXHRcdFx0ZGVzY3JpcHRpb246IFwiRGlyZWN0b3J5IGNvbnRhaW5pbmcgdGhlIHNvdXJjZSBjb2RlLlwiXG5cdFx0fSxcblx0XHRvdXQ6IHtcblx0XHRcdHR5cGU6IFwic3RyaW5nXCIsXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJEaXJlY3RvcnkgdGhhdCB3aWxsIGNvbnRhaW4gdGhlIG91dHB1dC5cIlxuXHRcdH0sXG5cdFx0ZGVsZXRlT2Jzb2xldGU6IHtcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxuXHRcdFx0ZGVzY3JpcHRpb246XG5cdFx0XHRcdFwiV2hldGhlciBvciBub3QgdG8gZGVsZXRlIGZpbGVzIGZyb20gb3V0IHRoYXQgYXJlIG5vdCBpbiB0aGUgc3JjLlwiXG5cdFx0fSxcblx0XHR0c2NvbmZpZzoge1xuXHRcdFx0dHlwZTogXCJzdHJpbmdcIixcblx0XHRcdGRlc2NyaXB0aW9uOiBcIlBhdGggdG8gYSB2YWxpZCB0c2NvbmZpZy5qc29uIGZpbGUuXCJcblx0XHR9LFxuXHRcdGVudHJ5OiB7XG5cdFx0XHR0eXBlOiBcInN0cmluZ1wiLFxuXHRcdFx0ZGVzY3JpcHRpb246IFwiRW50cnkgZmlsZSB0byBiZSBleGVjdXRlZCBhZnRlciBjb21waWxhdGlvbi5cIlxuXHRcdH0sXG5cdFx0ZGVwQ2hlY2s6IHtcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxuXHRcdFx0ZGVzY3JpcHRpb246IFwiV2hldGhlciBvciBub3QgdG8gY2hlY2sgdGhlIGRlcGVuZGVuY2llcy5cIlxuXHRcdH0sXG5cdFx0Y29weU9ubHk6IHtcblx0XHRcdHR5cGU6IFwiYm9vbGVhblwiLFxuXHRcdFx0ZGVzY3JpcHRpb246IFwiV2hldGhlciBvciBub3Qgb25seSB0byBjb3B5IHRoZSBmaWxlcyBmcm9tIHNyYyB0byBvdXRcIlxuXHRcdH0sXG5cdFx0aWdub3JlOiB7XG5cdFx0XHR0eXBlOiBcInN0cmluZ1wiLFxuXHRcdFx0ZGVzY3JpcHRpb246XG5cdFx0XHRcdFwiRmlsZXMgdGhhdCBzaG91bGQgYmUgaWdub3JlZCB3aGVuIHdhdGNoaW5nIGZpbGVzLiAoZ2xvYiBwYXR0ZXJuKVwiXG5cdFx0fSxcblx0XHRpbmNsdWRlOiB7XG5cdFx0XHR0eXBlOiBcInN0cmluZ1wiLFxuXHRcdFx0ZGVzY3JpcHRpb246XG5cdFx0XHRcdFwiRmlsZXMgdGhhdCBzaG91bGQgYmUgaW5jbHVkZWQgd2hlbiB3YXRjaGluZyBmaWxlcy4gKGdsb2IgcGF0dGVybilcIlxuXHRcdH0sXG5cdFx0c2lsZW50OiB7XG5cdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcblx0XHRcdGRlc2NyaXB0aW9uOiBcIldoZXRoZXIgb3Igbm90IHRvIHByaW50IGNvbnNvbGUgbG9ncy5cIlxuXHRcdH1cblx0fTtcblx0bGV0IHNldHRpbmdzOiBzdHJpbmdbXSA9IFtdO1xuXHRmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhjb25maWdEZXNjcmlwdGlvbnMpKSB7XG5cdFx0c2V0dGluZ3MucHVzaChcblx0XHRcdGAke2NoYWxrLnllbGxvd0JyaWdodChcIi0tXCIgKyBrKX0gJHtjaGFsay51bmRlcmxpbmUoXG5cdFx0XHRcdGNoYWxrLmhleChcIiNiZWJlYmVcIikodi50eXBlKVxuXHRcdFx0KX0g4oCiICR7Y2hhbGsuaGV4KFwiIzcyODlEQVwiKSh2LmRlc2NyaXB0aW9uKX1gXG5cdFx0KTtcblx0fVxuXHRvdXRsaW5lKHNldHRpbmdzLCBcIuKAolwiKTtcblx0ZGlzcGxheUFzVHJlZShcblx0XHRgJHtkc0NvbnNvbGVQcmVmaXh9ICR7Y2hhbGsuYm9sZChjaGFsay5ncmVlbihcIkF2YWlsYWJsZSBhcmd1bWVudHNcIikpfWAsXG5cdFx0c2V0dGluZ3Ncblx0KTtcbn1cbiJdfQ==