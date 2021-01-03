#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.contributors = exports.author = exports.version = exports.description = exports.name = exports.dsConsolePrefix = void 0;
exports.dsConsolePrefix = "● ", (_a = require("../package.json"), exports.name = _a.name, exports.description = _a.description, exports.version = _a.version, exports.author = _a.author, exports.contributors = _a.contributors);
const chalk_1 = __importDefault(require("chalk"));
const path_1 = require("path");
const configHandler_1 = __importDefault(require("./util/configHandler"));
const copyTask_1 = __importDefault(require("./util/copyTask"));
const depCheck_1 = __importDefault(require("./util/depCheck"));
const fileWatcher_1 = __importDefault(require("./util/fileWatcher"));
const tsCompiler_1 = __importDefault(require("./util/tsCompiler"));
exports.config = configHandler_1.default();
async function run() {
    if (exports.config.copyOnly)
        return await copyTask_1.default();
    if (!exports.config.silent)
        console.log(chalk_1.default.green(`${chalk_1.default.white(exports.dsConsolePrefix)} Launching ${chalk_1.default.bold("DevScript")} ${chalk_1.default.hex("#bebebe")("(v" + exports.version + ")")} on ${chalk_1.default.bold(path_1.basename(process.cwd()))}…`));
    fileWatcher_1.default();
    if (exports.config.depCheck)
        await depCheck_1.default();
    tsCompiler_1.default();
}
run();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRWEsUUFBQSxlQUFlLEdBQUcsSUFBSSxHQUNsQyxLQVlJLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxFQVg3QixZQUFJLFlBQ0osbUJBQVcsbUJBQ1gsZUFBTyxlQUNQLGNBQU0sY0FDTixvQkFBWSxvQkFPa0I7QUFFaEMsa0RBQTBCO0FBQzFCLCtCQUFnQztBQUVoQyx5RUFBdUM7QUFDdkMsK0RBQXVDO0FBQ3ZDLCtEQUF3QztBQUN4QyxxRUFBZ0Q7QUFDaEQsbUVBQThDO0FBRWpDLFFBQUEsTUFBTSxHQUFHLHVCQUFHLEVBQUUsQ0FBQztBQUU1QixLQUFLLFVBQVUsR0FBRztJQUNqQixJQUFJLGNBQU0sQ0FBQyxRQUFRO1FBQUUsT0FBTyxNQUFNLGtCQUFRLEVBQUUsQ0FBQztJQUU3QyxJQUFJLENBQUMsY0FBTSxDQUFDLE1BQU07UUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FDVixlQUFLLENBQUMsS0FBSyxDQUNWLEdBQUcsZUFBSyxDQUFDLEtBQUssQ0FBQyx1QkFBZSxDQUFDLGNBQWMsZUFBSyxDQUFDLElBQUksQ0FDdEQsV0FBVyxDQUNYLElBQUksZUFBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLEdBQUcsZUFBTyxHQUFHLEdBQUcsQ0FBQyxPQUFPLGVBQUssQ0FBQyxJQUFJLENBQy9ELGVBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FDdkIsR0FBRyxDQUNKLENBQ0QsQ0FBQztJQUVILHFCQUFjLEVBQUUsQ0FBQztJQUVqQixJQUFJLGNBQU0sQ0FBQyxRQUFRO1FBQUUsTUFBTSxrQkFBUyxFQUFFLENBQUM7SUFFdkMsb0JBQWEsRUFBRSxDQUFDO0FBQ2pCLENBQUM7QUFFRCxHQUFHLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcblxuZXhwb3J0IGNvbnN0IGRzQ29uc29sZVByZWZpeCA9IFwi4pePIFwiLFxuXHR7XG5cdFx0bmFtZSxcblx0XHRkZXNjcmlwdGlvbixcblx0XHR2ZXJzaW9uLFxuXHRcdGF1dGhvcixcblx0XHRjb250cmlidXRvcnNcblx0fToge1xuXHRcdG5hbWU6IHN0cmluZztcblx0XHRkZXNjcmlwdGlvbjogc3RyaW5nO1xuXHRcdHZlcnNpb246IHN0cmluZztcblx0XHRhdXRob3I6IHN0cmluZztcblx0XHRjb250cmlidXRvcnM6IHN0cmluZ1tdO1xuXHR9ID0gcmVxdWlyZShcIi4uL3BhY2thZ2UuanNvblwiKTtcblxuaW1wb3J0IGNoYWxrIGZyb20gXCJjaGFsa1wiO1xuaW1wb3J0IHsgYmFzZW5hbWUgfSBmcm9tIFwicGF0aFwiO1xuXG5pbXBvcnQgY2ZnIGZyb20gXCIuL3V0aWwvY29uZmlnSGFuZGxlclwiO1xuaW1wb3J0IGNvcHlUYXNrIGZyb20gXCIuL3V0aWwvY29weVRhc2tcIjtcbmltcG9ydCBjaGVja0RlcHMgZnJvbSBcIi4vdXRpbC9kZXBDaGVja1wiO1xuaW1wb3J0IHJ1bkZpbGVXYXRjaGVyIGZyb20gXCIuL3V0aWwvZmlsZVdhdGNoZXJcIjtcbmltcG9ydCBydW5UU0NvbXBpbGVyIGZyb20gXCIuL3V0aWwvdHNDb21waWxlclwiO1xuXG5leHBvcnQgY29uc3QgY29uZmlnID0gY2ZnKCk7XG5cbmFzeW5jIGZ1bmN0aW9uIHJ1bigpIHtcblx0aWYgKGNvbmZpZy5jb3B5T25seSkgcmV0dXJuIGF3YWl0IGNvcHlUYXNrKCk7XG5cblx0aWYgKCFjb25maWcuc2lsZW50KVxuXHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0Y2hhbGsuZ3JlZW4oXG5cdFx0XHRcdGAke2NoYWxrLndoaXRlKGRzQ29uc29sZVByZWZpeCl9IExhdW5jaGluZyAke2NoYWxrLmJvbGQoXG5cdFx0XHRcdFx0XCJEZXZTY3JpcHRcIlxuXHRcdFx0XHQpfSAke2NoYWxrLmhleChcIiNiZWJlYmVcIikoXCIodlwiICsgdmVyc2lvbiArIFwiKVwiKX0gb24gJHtjaGFsay5ib2xkKFxuXHRcdFx0XHRcdGJhc2VuYW1lKHByb2Nlc3MuY3dkKCkpXG5cdFx0XHRcdCl94oCmYFxuXHRcdFx0KVxuXHRcdCk7XG5cblx0cnVuRmlsZVdhdGNoZXIoKTtcblxuXHRpZiAoY29uZmlnLmRlcENoZWNrKSBhd2FpdCBjaGVja0RlcHMoKTtcblxuXHRydW5UU0NvbXBpbGVyKCk7XG59XG5cbnJ1bigpO1xuIl19