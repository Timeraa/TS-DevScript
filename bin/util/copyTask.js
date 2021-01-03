"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const fast_glob_1 = __importDefault(require("fast-glob"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const __1 = require("../");
const logger = debug_1.default(`${__1.name}:copyTask`);
async function copyTask() {
    logger(`Copying files to ${__1.config.out}`);
    const pkgChecks = await Promise.all([
        fs_extra_1.pathExists("package.json"),
        fs_extra_1.pathExists("package-lock.json"),
        fs_extra_1.pathExists("yarn.lock")
    ]);
    let copyTasks = [];
    if (pkgChecks[0])
        copyTasks.push(fs_extra_1.copy("package.json", path_1.resolve(__1.config.out, `package.json`)));
    if (pkgChecks[1])
        copyTasks.push(fs_extra_1.copy("package-lock.json", path_1.resolve(__1.config.out, `package-lock.json`)));
    if (pkgChecks[2])
        copyTasks.push(fs_extra_1.copy("yarn.lock", path_1.resolve(__1.config.out, `yarn.lock`)));
    copyTasks.push(fs_extra_1.copy(__1.config.src, __1.config.out, {
        filter: function (path) {
            if (path.includes("/node_modules"))
                return false;
            return path_1.extname(path) !== ".ts";
        }
    }));
    if (__1.config.include)
        (await fast_glob_1.default(__1.config.include)).forEach((e) => copyTasks.push(fs_extra_1.copy(e, path_1.join(__1.config.out, path_1.basename(e)))));
    await Promise.all([copyTasks, deleteObsolete()]);
    logger(`Copied files from ${__1.config.src} to ${__1.config.out}`);
}
exports.default = copyTask;
async function deleteObsolete() {
    if (!__1.config.deleteObsolete || !(await fs_extra_1.pathExists(path_1.resolve(__1.config.out))))
        return;
    logger("Deleting obsolete files…");
    let dist = await fast_glob_1.default("**/*", {
        cwd: __1.config.out,
        onlyFiles: true
    }), src = await fast_glob_1.default("**/*", {
        cwd: __1.config.src,
        onlyFiles: true
    });
    if (__1.config.include)
        src.push(...(await fast_glob_1.default(__1.config.include, { onlyFiles: true })));
    src.push("package.json", "package-lock.json", "yarn.lock");
    src = src
        .map((f) => f.split(".")[0])
        .filter((sf) => dist.find((d) => d.split(".")[0] == sf));
    await Promise.all(dist
        .filter((f) => !src.includes(f.replace(__1.config.out, "").split(".")[0]))
        .map((f) => fs_extra_1.remove(path_1.resolve(__1.config.out, f))));
    logger("Deleted obsolete files");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29weVRhc2suanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInV0aWwvY29weVRhc2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsMERBQTZCO0FBQzdCLHVDQUFvRDtBQUNwRCwrQkFBd0Q7QUFFeEQsMkJBQW1DO0FBRW5DLE1BQU0sTUFBTSxHQUFHLGVBQUssQ0FBQyxHQUFHLFFBQUksV0FBVyxDQUFDLENBQUM7QUFFMUIsS0FBSyxVQUFVLFFBQVE7SUFDckMsTUFBTSxDQUFDLG9CQUFvQixVQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN6QyxNQUFNLFNBQVMsR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUM7UUFDbkMscUJBQVUsQ0FBQyxjQUFjLENBQUM7UUFDMUIscUJBQVUsQ0FBQyxtQkFBbUIsQ0FBQztRQUMvQixxQkFBVSxDQUFDLFdBQVcsQ0FBQztLQUN2QixDQUFDLENBQUM7SUFFSCxJQUFJLFNBQVMsR0FBb0IsRUFBRSxDQUFDO0lBRXBDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNmLFNBQVMsQ0FBQyxJQUFJLENBQUMsZUFBSSxDQUFDLGNBQWMsRUFBRSxjQUFPLENBQUMsVUFBTSxDQUFDLEdBQUcsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0UsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ2YsU0FBUyxDQUFDLElBQUksQ0FDYixlQUFJLENBQUMsbUJBQW1CLEVBQUUsY0FBTyxDQUFDLFVBQU0sQ0FBQyxHQUFHLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyxDQUNuRSxDQUFDO0lBQ0gsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ2YsU0FBUyxDQUFDLElBQUksQ0FBQyxlQUFJLENBQUMsV0FBVyxFQUFFLGNBQU8sQ0FBQyxVQUFNLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUdyRSxTQUFTLENBQUMsSUFBSSxD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Qyx3QkFBd0IsQ0FBQyxDQUFDO0FBQ2xDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZGVidWcgZnJvbSBcImRlYnVnXCI7XG5pbXBvcnQgZ2xvYiBmcm9tIFwiZmFzdC1nbG9iXCI7XG5pbXBvcnQgeyBjb3B5LCBwYXRoRXhpc3RzLCByZW1vdmUgfSBmcm9tIFwiZnMtZXh0cmFcIjtcbmltcG9ydCB7IGJhc2VuYW1lLCBleHRuYW1lLCBqb2luLCByZXNvbHZlIH0gZnJvbSBcInBhdGhcIjtcblxuaW1wb3J0IHsgY29uZmlnLCBuYW1lIH0gZnJvbSBcIi4uL1wiO1xuXG5jb25zdCBsb2dnZXIgPSBkZWJ1ZyhgJHtuYW1lfTpjb3B5VGFza2ApO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBjb3B5VGFzaygpIHtcblx0bG9nZ2VyKGBDb3B5aW5nIGZpbGVzIHRvICR7Y29uZmlnLm91dH1gKTtcblx0Y29uc3QgcGtnQ2hlY2tzID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuXHRcdHBhdGhFeGlzdHMoXCJwYWNrYWdlLmpzb25cIiksXG5cdFx0cGF0aEV4aXN0cyhcInBhY2thZ2UtbG9jay5qc29uXCIpLFxuXHRcdHBhdGhFeGlzdHMoXCJ5YXJuLmxvY2tcIilcblx0XSk7XG5cblx0bGV0IGNvcHlUYXNrczogUHJvbWlzZTx2b2lkPltdID0gW107XG5cblx0aWYgKHBrZ0NoZWNrc1swXSlcblx0XHRjb3B5VGFza3MucHVzaChjb3B5KFwicGFja2FnZS5qc29uXCIsIHJlc29sdmUoY29uZmlnLm91dCwgYHBhY2thZ2UuanNvbmApKSk7XG5cdGlmIChwa2dDaGVja3NbMV0pXG5cdFx0Y29weVRhc2tzLnB1c2goXG5cdFx0XHRjb3B5KFwicGFja2FnZS1sb2NrLmpzb25cIiwgcmVzb2x2ZShjb25maWcub3V0LCBgcGFja2FnZS1sb2NrLmpzb25gKSlcblx0XHQpO1xuXHRpZiAocGtnQ2hlY2tzWzJdKVxuXHRcdGNvcHlUYXNrcy5wdXNoKGNvcHkoXCJ5YXJuLmxvY2tcIiwgcmVzb2x2ZShjb25maWcub3V0LCBgeWFybi5sb2NrYCkpKTtcblxuXHQvLyogQ29weSBmaWxlcyBmcm9tIHNyYyB0byBkaXN0XG5cdGNvcHlUYXNrcy5wdXNoKFxuXHRcdGNvcHkoY29uZmlnLnNyYywgY29uZmlnLm91dCwge1xuXHRcdFx0ZmlsdGVyOiBmdW5jdGlvbiAocGF0aCkge1xuXHRcdFx0XHRpZiAocGF0aC5pbmNsdWRlcyhcIi9ub2RlX21vZHVsZXNcIikpIHJldHVybiBmYWxzZTtcblx0XHRcdFx0cmV0dXJuIGV4dG5hbWUocGF0aCkgIT09IFwiLnRzXCI7XG5cdFx0XHR9XG5cdFx0fSlcblx0KTtcblxuXHRpZiAoY29uZmlnLmluY2x1ZGUpXG5cdFx0KGF3YWl0IGdsb2IoY29uZmlnLmluY2x1ZGUpKS5mb3JFYWNoKChlKSA9PlxuXHRcdFx0Y29weVRhc2tzLnB1c2goY29weShlLCBqb2luKGNvbmZpZy5vdXQsIGJhc2VuYW1lKGUpKSkpXG5cdFx0KTtcblxuXHRhd2FpdCBQcm9taXNlLmFsbChbY29weVRhc2tzLCBkZWxldGVPYnNvbGV0ZSgpXSk7XG5cdGxvZ2dlcihgQ29waWVkIGZpbGVzIGZyb20gJHtjb25maWcuc3JjfSB0byAke2NvbmZpZy5vdXR9YCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGRlbGV0ZU9ic29sZXRlKCkge1xuXHRpZiAoIWNvbmZpZy5kZWxldGVPYnNvbGV0ZSB8fCAhKGF3YWl0IHBhdGhFeGlzdHMocmVzb2x2ZShjb25maWcub3V0KSkpKVxuXHRcdHJldHVybjtcblxuXHRsb2dnZXIoXCJEZWxldGluZyBvYnNvbGV0ZSBmaWxlc+KAplwiKTtcblx0Ly8qIFNlbGVjdCBmaWxlc1xuXHRsZXQgZGlzdCA9IGF3YWl0IGdsb2IoXCIqKi8qXCIsIHtcblx0XHRcdGN3ZDogY29uZmlnLm91dCxcblx0XHRcdG9ubHlGaWxlczogdHJ1ZVxuXHRcdH0pLFxuXHRcdHNyYyA9IGF3YWl0IGdsb2IoXCIqKi8qXCIsIHtcblx0XHRcdGN3ZDogY29uZmlnLnNyYyxcblx0XHRcdG9ubHlGaWxlczogdHJ1ZVxuXHRcdH0pO1xuXG5cdGlmIChjb25maWcuaW5jbHVkZSlcblx0XHRzcmMucHVzaCguLi4oYXdhaXQgZ2xvYihjb25maWcuaW5jbHVkZSwgeyBvbmx5RmlsZXM6IHRydWUgfSkpKTtcblxuXHRzcmMucHVzaChcInBhY2thZ2UuanNvblwiLCBcInBhY2thZ2UtbG9jay5qc29uXCIsIFwieWFybi5sb2NrXCIpO1xuXG5cdC8vKiBGaWx0ZXIgZmlsZSBkaWZmZXJlbmNlc1xuXHRzcmMgPSBzcmNcblx0XHQubWFwKChmKSA9PiBmLnNwbGl0KFwiLlwiKVswXSlcblx0XHQuZmlsdGVyKChzZikgPT4gZGlzdC5maW5kKChkKSA9PiBkLnNwbGl0KFwiLlwiKVswXSA9PSBzZikpO1xuXG5cdC8vKiBPbGQgZmlsZXMsIGRlbGV0ZVxuXHRhd2FpdCBQcm9taXNlLmFsbChcblx0XHRkaXN0XG5cdFx0XHQuZmlsdGVyKChmKSA9PiAhc3JjLmluY2x1ZGVzKGYucmVwbGFjZShjb25maWcub3V0LCBcIlwiKS5zcGxpdChcIi5cIilbMF0pKVxuXHRcdFx0Lm1hcCgoZikgPT4gcmVtb3ZlKHJlc29sdmUoY29uZmlnLm91dCwgZikpKVxuXHQpO1xuXHRsb2dnZXIoXCJEZWxldGVkIG9ic29sZXRlIGZpbGVzXCIpO1xufVxuIl19