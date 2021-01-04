"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const chokidar_1 = __importDefault(require("chokidar"));
const path_1 = require("path");
const __1 = require("../");
const childHandler_1 = __importDefault(require("./childHandler"));
const copyTask_1 = __importDefault(require("./copyTask"));
async function runFileWatcher() {
    const watcher = chokidar_1.default.watch(__1.config.src, {
        ignored: ["**/*.ts", __1.config.ignore],
        persistent: true,
        cwd: process.cwd(),
        ignoreInitial: true
    });
    if (__1.config.include)
        chokidar_1.default
            .watch(__1.config.include, { persistent: true, ignoreInitial: true })
            .on("all", (e, p) => watcher.emit("all", e, p));
    watcher.on("all", async (event, path) => {
        let fileEvent = "changed";
        switch (event) {
            case "add":
                fileEvent = "added";
                break;
            case "unlink":
                fileEvent = "deleted";
                break;
        }
        if (!__1.config.silent)
            console.log(__1.dsConsolePrefix +
                chalk_1.default.yellowBright(` ${chalk_1.default.cyan(path_1.basename(path))} ${fileEvent}, restarting…`));
        await copyTask_1.default();
        childHandler_1.default();
    });
}
exports.default = runFileWatcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZVdhdGNoZXIuanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInV0aWwvZmlsZVdhdGNoZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsd0RBQWdDO0FBQ2hDLCtCQUFnQztBQUVoQywyQkFBOEM7QUFDOUMsa0VBQXNDO0FBQ3RDLDBEQUFrQztBQUVuQixLQUFLLFVBQVUsY0FBYztJQUMzQyxNQUFNLE9BQU8sR0FBRyxrQkFBUSxDQUFDLEtBQUssQ0FBQyxVQUFNLENBQUMsR0FBRyxFQUFFO1FBQzFDLE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBRSxVQUFNLENBQUMsTUFBTSxDQUFDO1FBQ25DLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxFQUFFO1FBQ2xCLGFBQWEsRUFBRSxJQUFJO0tBQ25CLENBQUMsQ0FBQztJQUVILElBQUksVUFBTSxDQUFDLE9BQU87UUFDakIsa0JBQVE7YUFDTixLQUFLLENBQUMsVUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxDQUFDO2FBQ2hFLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVsRCxPQUFPLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO1FBQ3ZDLElBQUksU0FBUyxHQUFXLFNBQVMsQ0FBQztRQUNsQyxRQUFRLEtBQUssRUFBRTtZQUNkLEtBQUssS0FBSztnQkFDVCxTQUFTLEdBQUcsT0FBTyxDQUFDO2dCQUNwQixNQUFNO1lBQ1AsS0FBSyxRQUFRO2dCQUNaLFNBQVMsR0FBRyxTQUFTLENBQUM7Z0JBQ3RCLE1BQU07U0FDUDtRQUVELElBQUksQ0FBQyxVQUFNLENBQUMsTUFBTTtZQUNqQixPQUFPLENBQUMsR0FBRyxDQUNWLG1CQUFlO2dCQUNkLGVBQUssQ0FBQyxZQUFZLENBQ2pCLElBQUksZUFBSyxDQUFDLElBQUksQ0FBQyxlQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxTQUFTLGVBQWUsQ0FDMUQsQ0FDRixDQUFDO1FBRUgsTUFBTSxrQkFBUSxFQUFFLENBQUM7UUFDakIsc0JBQVEsRUFBRSxDQUFDO0lBQ1osQ0FBQyxDQUFDLENBQUM7QUFDSixDQUFDO0FBbkNELGlDQW1DQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjaGFsayBmcm9tIFwiY2hhbGtcIjtcbmltcG9ydCBjaG9raWRhciBmcm9tIFwiY2hva2lkYXJcIjtcbmltcG9ydCB7IGJhc2VuYW1lIH0gZnJvbSBcInBhdGhcIjtcblxuaW1wb3J0IHsgY29uZmlnLCBkc0NvbnNvbGVQcmVmaXggfSBmcm9tIFwiLi4vXCI7XG5pbXBvcnQgcnVuQ2hpbGQgZnJvbSBcIi4vY2hpbGRIYW5kbGVyXCI7XG5pbXBvcnQgY29weVRhc2sgZnJvbSBcIi4vY29weVRhc2tcIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gcnVuRmlsZVdhdGNoZXIoKSB7XG5cdGNvbnN0IHdhdGNoZXIgPSBjaG9raWRhci53YXRjaChjb25maWcuc3JjLCB7XG5cdFx0aWdub3JlZDogW1wiKiovKi50c1wiLCBjb25maWcuaWdub3JlXSxcblx0XHRwZXJzaXN0ZW50OiB0cnVlLFxuXHRcdGN3ZDogcHJvY2Vzcy5jd2QoKSxcblx0XHRpZ25vcmVJbml0aWFsOiB0cnVlXG5cdH0pO1xuXG5cdGlmIChjb25maWcuaW5jbHVkZSlcblx0XHRjaG9raWRhclxuXHRcdFx0LndhdGNoKGNvbmZpZy5pbmNsdWRlLCB7IHBlcnNpc3RlbnQ6IHRydWUsIGlnbm9yZUluaXRpYWw6IHRydWUgfSlcblx0XHRcdC5vbihcImFsbFwiLCAoZSwgcCkgPT4gd2F0Y2hlci5lbWl0KFwiYWxsXCIsIGUsIHApKTtcblxuXHR3YXRjaGVyLm9uKFwiYWxsXCIsIGFzeW5jIChldmVudCwgcGF0aCkgPT4ge1xuXHRcdGxldCBmaWxlRXZlbnQ6IHN0cmluZyA9IFwiY2hhbmdlZFwiO1xuXHRcdHN3aXRjaCAoZXZlbnQpIHtcblx0XHRcdGNhc2UgXCJhZGRcIjpcblx0XHRcdFx0ZmlsZUV2ZW50ID0gXCJhZGRlZFwiO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJ1bmxpbmtcIjpcblx0XHRcdFx0ZmlsZUV2ZW50ID0gXCJkZWxldGVkXCI7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdGlmICghY29uZmlnLnNpbGVudClcblx0XHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0XHRkc0NvbnNvbGVQcmVmaXggK1xuXHRcdFx0XHRcdGNoYWxrLnllbGxvd0JyaWdodChcblx0XHRcdFx0XHRcdGAgJHtjaGFsay5jeWFuKGJhc2VuYW1lKHBhdGgpKX0gJHtmaWxlRXZlbnR9LCByZXN0YXJ0aW5n4oCmYFxuXHRcdFx0XHRcdClcblx0XHRcdCk7XG5cblx0XHRhd2FpdCBjb3B5VGFzaygpO1xuXHRcdHJ1bkNoaWxkKCk7XG5cdH0pO1xufVxuIl19