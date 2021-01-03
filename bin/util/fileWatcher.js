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
        ignored: [/(\.ts)/g, __1.config.ignore],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZVdhdGNoZXIuanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInV0aWwvZmlsZVdhdGNoZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsd0RBQWdDO0FBQ2hDLCtCQUFnQztBQUVoQywyQkFBOEM7QUFDOUMsa0VBQXNDO0FBQ3RDLDBEQUFrQztBQUVuQixLQUFLLFVBQVUsY0FBYztJQUMzQyxNQUFNLE9BQU8sR0FBRyxrQkFBUSxDQUFDLEtBQUssQ0FBQyxVQUFNLENBQUMsR0FBRyxFQUFFO1FBQzFDLE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBRSxVQUFNLENBQUMsTUFBTSxDQUFDO1FBQ25DLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxFQUFFO1FBQ2xCLGFBQWEsRUFBRSxJQUFJO0tBQ25CLENBQUMsQ0FBQztJQUVILElBQUksVUFBTSxDQUFDLE9BQU87UUFDakIsa0JBQVE7YUFDTixLQUFLLENBQUMsVUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxDQUFDO2FBQ2hFLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVsRCxPQUFPLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO1FBQ3ZDLElBQUksU0FBUyxHQUFXLFNBQVMsQ0FBQztRQUNsQyxRQUFRLEtBQUssRUFBRTtZQUNkLEtBQUssS0FBSztnQkFDVCxTQUFTLEdBQUcsT0FBTyxDQUFDO2dCQUNwQixNQUFNO1lBQ1AsS0FBSyxRQUFRO2dCQUNaLFNBQVMsR0FBRyxTQUFTLENBQUM7Z0JBQ3RCLE1BQU07U0FDUDtRQUVELElBQUksQ0FBQyxVQUFNLENBQUMsTUFBTTtZQUNqQixPQUFPLENBQUMsR0FBRyxDQUNWLG1CQUFlO2dCQUNkLGVBQUssQ0FBQyxZQUFZLENBQ2pCLElBQUksZUFBSyxDQUFDLElBQUksQ0FBQyxlQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxTQUFTLGVBQWUsQ0FDMUQsQ0FDRixDQUFDO1FBRUgsTUFBTSxrQkFBUSxFQUFFLENBQUM7UUFDakIsc0JBQVEsRUFBRSxDQUFDO0lBQ1osQ0FBQyxDQUFDLENBQUM7QUFDSixDQUFDO0FBbkNELGlDQW1DQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjaGFsayBmcm9tIFwiY2hhbGtcIjtcbmltcG9ydCBjaG9raWRhciBmcm9tIFwiY2hva2lkYXJcIjtcbmltcG9ydCB7IGJhc2VuYW1lIH0gZnJvbSBcInBhdGhcIjtcblxuaW1wb3J0IHsgY29uZmlnLCBkc0NvbnNvbGVQcmVmaXggfSBmcm9tIFwiLi4vXCI7XG5pbXBvcnQgcnVuQ2hpbGQgZnJvbSBcIi4vY2hpbGRIYW5kbGVyXCI7XG5pbXBvcnQgY29weVRhc2sgZnJvbSBcIi4vY29weVRhc2tcIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gcnVuRmlsZVdhdGNoZXIoKSB7XG5cdGNvbnN0IHdhdGNoZXIgPSBjaG9raWRhci53YXRjaChjb25maWcuc3JjLCB7XG5cdFx0aWdub3JlZDogWy8oXFwudHMpL2csIGNvbmZpZy5pZ25vcmVdLFxuXHRcdHBlcnNpc3RlbnQ6IHRydWUsXG5cdFx0Y3dkOiBwcm9jZXNzLmN3ZCgpLFxuXHRcdGlnbm9yZUluaXRpYWw6IHRydWVcblx0fSk7XG5cblx0aWYgKGNvbmZpZy5pbmNsdWRlKVxuXHRcdGNob2tpZGFyXG5cdFx0XHQud2F0Y2goY29uZmlnLmluY2x1ZGUsIHsgcGVyc2lzdGVudDogdHJ1ZSwgaWdub3JlSW5pdGlhbDogdHJ1ZSB9KVxuXHRcdFx0Lm9uKFwiYWxsXCIsIChlLCBwKSA9PiB3YXRjaGVyLmVtaXQoXCJhbGxcIiwgZSwgcCkpO1xuXG5cdHdhdGNoZXIub24oXCJhbGxcIiwgYXN5bmMgKGV2ZW50LCBwYXRoKSA9PiB7XG5cdFx0bGV0IGZpbGVFdmVudDogc3RyaW5nID0gXCJjaGFuZ2VkXCI7XG5cdFx0c3dpdGNoIChldmVudCkge1xuXHRcdFx0Y2FzZSBcImFkZFwiOlxuXHRcdFx0XHRmaWxlRXZlbnQgPSBcImFkZGVkXCI7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInVubGlua1wiOlxuXHRcdFx0XHRmaWxlRXZlbnQgPSBcImRlbGV0ZWRcIjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0aWYgKCFjb25maWcuc2lsZW50KVxuXHRcdFx0Y29uc29sZS5sb2coXG5cdFx0XHRcdGRzQ29uc29sZVByZWZpeCArXG5cdFx0XHRcdFx0Y2hhbGsueWVsbG93QnJpZ2h0KFxuXHRcdFx0XHRcdFx0YCAke2NoYWxrLmN5YW4oYmFzZW5hbWUocGF0aCkpfSAke2ZpbGVFdmVudH0sIHJlc3RhcnRpbmfigKZgXG5cdFx0XHRcdFx0KVxuXHRcdFx0KTtcblxuXHRcdGF3YWl0IGNvcHlUYXNrKCk7XG5cdFx0cnVuQ2hpbGQoKTtcblx0fSk7XG59XG4iXX0=