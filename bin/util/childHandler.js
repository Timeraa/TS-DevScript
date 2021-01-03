"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
const debug_1 = __importDefault(require("debug"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const tree_kill_1 = __importDefault(require("tree-kill"));
const __1 = require("../");
let currentChild = null;
const logger = debug_1.default(`${__1.name}:childHandler`);
async function runChild() {
    let projectJSON = null;
    try {
        projectJSON = require(path_1.resolve(process.cwd(), "package.json"));
    }
    catch (err) {
        logger("No package.json found");
    }
    await killOldChild();
    if (!__1.config.entry && projectJSON?.scripts?.start) {
        logger("Starting with start script from project.json");
        currentChild = child_process_1.spawn((await fs_extra_1.pathExists(process.cwd() + "/yarn.lock"))
            ? "yarn run --silent start"
            : "npm run --silent start", {
            cwd: process.cwd(),
            shell: true,
            stdio: "inherit"
        });
        currentChild.once("exit", onChildDeath);
        return;
    }
    if (fs_extra_1.pathExists(__1.config.entry ? __1.config.entry : path_1.resolve(__1.config.out, "index.js"))) {
        logger("Starting with entry index.js");
        currentChild = child_process_1.fork(__1.config.entry ? __1.config.entry : path_1.resolve(__1.config.out, "index.js"), [], {
            cwd: __1.config.entry ? process.cwd() : __1.config.out
        });
        return;
    }
    throw new Error("No entry found");
}
exports.default = runChild;
function onChildDeath(code, signal) {
    if (!__1.config.silent)
        console.log(`${__1.dsConsolePrefix} ${chalk_1.default.yellow("Process exit with code " +
            chalk_1.default.white(code) +
            ", signal: " +
            chalk_1.default.white(signal) +
            "")}`);
}
async function killOldChild() {
    if (currentChild && !currentChild.killed) {
        try {
            currentChild.removeListener("exit", onChildDeath);
            await new Promise((resolve, reject) => tree_kill_1.default(currentChild.pid, "SIGKILL", (err) => err ? reject(err) : resolve()));
            logger("Kill old child");
        }
        catch (err) {
            logger("Failed to kill old child");
        }
        currentChild = null;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpbGRIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJ1dGlsL2NoaWxkSGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUEwQjtBQUMxQixpREFBMEQ7QUFDMUQsa0RBQTBCO0FBQzFCLHVDQUFzQztBQUN0QywrQkFBK0I7QUFDL0IsMERBQWlDO0FBRWpDLDJCQUFvRDtBQUVwRCxJQUFJLFlBQVksR0FBd0IsSUFBSSxDQUFDO0FBQzdDLE1BQU0sTUFBTSxHQUFHLGVBQUssQ0FBQyxHQUFHLFFBQUksZUFBZSxDQUFDLENBQUM7QUFFOUIsS0FBSyxVQUFVLFFBQVE7SUFDckMsSUFBSSxXQUFXLEdBQVEsSUFBSSxDQUFDO0lBRTVCLElBQUk7UUFDSCxXQUFXLEdBQUcsT0FBTyxDQUFDLGNBQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQztLQUM5RDtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ2IsTUFBTSxDQUFDLHVCQUF1QixDQUFDLENBQUM7S0FDaEM7SUFFRCxNQUFNLFlBQVksRUFBRSxDQUFDO0lBRXJCLElBQUksQ0FBQyxVQUFNLENBQUMsS0FBSyxJQUFJLFdBQVcsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO1FBQ2pELE1BQU0sQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO1FBQ3ZELFlBQVksR0FBRyxxQkFBSyxDQUNuQixDQUFDLE1BQU0scUJBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsWUFBWSxDQUFDLENBQUM7WUFDL0MsQ0FBQyxDQUFDLHlCQUF5QjtZQUMzQixDQUFDLENBQUMsd0JBQXdCLEVBQzNCO1lBQ0MsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUU7WUFDbEIsS0FBSyxFQUFFLElBQUk7WUFDWCxLQUFLLEVBQUUsU0FBUztTQUNoQixDQUNELENBQUM7UUFFRixZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztRQUN4QyxPQUFPO0tBQ1A7SUFFRCxJQUNDLHFCQUFVLENBQUMsVUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsVUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsY0FBTyxDQUFDLFVBQU0sQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUMsRUFDeEU7UUFDRCxNQUFNLENBQUMsOEJBQThCLENBQUMsQ0FBQztRQUN2QyxZQUFZLEdBQUcsb0JBQUksQ0FDbEIsVUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsVUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsY0FBTyxDQUFDLFVBQU0sQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLEVBQzdELEVBQUUsRUFDRjtZQUNDLEdBQUcsRUFBRSxVQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQU0sQ0FBQyxHQUFHO1NBQzlDLENBQ0QsQ0FBQztRQUNGLE9BQU87S0FDUDtJQUdELE1BQU0sSUFBSSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBNUNELDJCQTRDQztBQUVELFNBQVMsWUFBWSxDQUFDLElBQVksRUFBRSxNQUFzQjtJQUN6RCxJQUFJLENBQUMsVUFBTSxDQUFDLE1BQU07UUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FDVixHQUFHLG1CQUFlLElBQUksZUFBSyxDQUFDLE1BQU0sQ0FDakMseUJBQXlCO1lBQ3hCLGVBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQ2pCLFlBQVk7WUFDWixlQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUNuQixFQUFFLENBQ0gsRUFBRSxDQUNILENBQUM7QUFDSixDQUFDO0FBRUQsS0FBSyxVQUFVLFlBQVk7SUFDMUIsSUFBSSxZQUFZLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFO1FBQ3pDLElBQUk7WUFDSCxZQUFZLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztZQUNsRCxNQUFNLElBQUksT0FBTyxDQUFPLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQzNDLG1CQUFRLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUM3QyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQzdCLENBQ0QsQ0FBQztZQUNGLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1NBQ3pCO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDYixNQUFNLENBQUMsMEJBQTBCLENBQUMsQ0FBQztTQUNuQztRQUNELFlBQVksR0FBRyxJQUFJLENBQUM7S0FDcEI7QUFDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNoYWxrIGZyb20gXCJjaGFsa1wiO1xuaW1wb3J0IHsgQ2hpbGRQcm9jZXNzLCBmb3JrLCBzcGF3biB9IGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XG5pbXBvcnQgZGVidWcgZnJvbSBcImRlYnVnXCI7XG5pbXBvcnQgeyBwYXRoRXhpc3RzIH0gZnJvbSBcImZzLWV4dHJhXCI7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSBcInBhdGhcIjtcbmltcG9ydCB0cmVlS2lsbCBmcm9tIFwidHJlZS1raWxsXCI7XG5cbmltcG9ydCB7IGNvbmZpZywgZHNDb25zb2xlUHJlZml4LCBuYW1lIH0gZnJvbSBcIi4uL1wiO1xuXG5sZXQgY3VycmVudENoaWxkOiBDaGlsZFByb2Nlc3MgfCBudWxsID0gbnVsbDtcbmNvbnN0IGxvZ2dlciA9IGRlYnVnKGAke25hbWV9OmNoaWxkSGFuZGxlcmApO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBydW5DaGlsZCgpIHtcblx0bGV0IHByb2plY3RKU09OOiBhbnkgPSBudWxsO1xuXG5cdHRyeSB7XG5cdFx0cHJvamVjdEpTT04gPSByZXF1aXJlKHJlc29sdmUocHJvY2Vzcy5jd2QoKSwgXCJwYWNrYWdlLmpzb25cIikpO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHRsb2dnZXIoXCJObyBwYWNrYWdlLmpzb24gZm91bmRcIik7XG5cdH1cblxuXHRhd2FpdCBraWxsT2xkQ2hpbGQoKTtcblxuXHRpZiAoIWNvbmZpZy5lbnRyeSAmJiBwcm9qZWN0SlNPTj8uc2NyaXB0cz8uc3RhcnQpIHtcblx0XHRsb2dnZXIoXCJTdGFydGluZyB3aXRoIHN0YXJ0IHNjcmlwdCBmcm9tIHByb2plY3QuanNvblwiKTtcblx0XHRjdXJyZW50Q2hpbGQgPSBzcGF3bihcblx0XHRcdChhd2FpdCBwYXRoRXhpc3RzKHByb2Nlc3MuY3dkKCkgKyBcIi95YXJuLmxvY2tcIikpXG5cdFx0XHRcdD8gXCJ5YXJuIHJ1biAtLXNpbGVudCBzdGFydFwiXG5cdFx0XHRcdDogXCJucG0gcnVuIC0tc2lsZW50IHN0YXJ0XCIsXG5cdFx0XHR7XG5cdFx0XHRcdGN3ZDogcHJvY2Vzcy5jd2QoKSxcblx0XHRcdFx0c2hlbGw6IHRydWUsXG5cdFx0XHRcdHN0ZGlvOiBcImluaGVyaXRcIlxuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRjdXJyZW50Q2hpbGQub25jZShcImV4aXRcIiwgb25DaGlsZERlYXRoKTtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRpZiAoXG5cdFx0cGF0aEV4aXN0cyhjb25maWcuZW50cnkgPyBjb25maWcuZW50cnkgOiByZXNvbHZlKGNvbmZpZy5vdXQsIFwiaW5kZXguanNcIikpXG5cdCkge1xuXHRcdGxvZ2dlcihcIlN0YXJ0aW5nIHdpdGggZW50cnkgaW5kZXguanNcIik7XG5cdFx0Y3VycmVudENoaWxkID0gZm9yayhcblx0XHRcdGNvbmZpZy5lbnRyeSA/IGNvbmZpZy5lbnRyeSA6IHJlc29sdmUoY29uZmlnLm91dCwgXCJpbmRleC5qc1wiKSxcblx0XHRcdFtdLFxuXHRcdFx0e1xuXHRcdFx0XHRjd2Q6IGNvbmZpZy5lbnRyeSA/IHByb2Nlc3MuY3dkKCkgOiBjb25maWcub3V0XG5cdFx0XHR9XG5cdFx0KTtcblx0XHRyZXR1cm47XG5cdH1cblxuXHQvL1RPRE8gQmV0dGVyIG1lc3NhZ2Vcblx0dGhyb3cgbmV3IEVycm9yKFwiTm8gZW50cnkgZm91bmRcIik7XG59XG5cbmZ1bmN0aW9uIG9uQ2hpbGREZWF0aChjb2RlOiBudW1iZXIsIHNpZ25hbDogTm9kZUpTLlNpZ25hbHMpIHtcblx0aWYgKCFjb25maWcuc2lsZW50KVxuXHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0YCR7ZHNDb25zb2xlUHJlZml4fSAke2NoYWxrLnllbGxvdyhcblx0XHRcdFx0XCJQcm9jZXNzIGV4aXQgd2l0aCBjb2RlIFwiICtcblx0XHRcdFx0XHRjaGFsay53aGl0ZShjb2RlKSArXG5cdFx0XHRcdFx0XCIsIHNpZ25hbDogXCIgK1xuXHRcdFx0XHRcdGNoYWxrLndoaXRlKHNpZ25hbCkgK1xuXHRcdFx0XHRcdFwiXCJcblx0XHRcdCl9YFxuXHRcdCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGtpbGxPbGRDaGlsZCgpIHtcblx0aWYgKGN1cnJlbnRDaGlsZCAmJiAhY3VycmVudENoaWxkLmtpbGxlZCkge1xuXHRcdHRyeSB7XG5cdFx0XHRjdXJyZW50Q2hpbGQucmVtb3ZlTGlzdGVuZXIoXCJleGl0XCIsIG9uQ2hpbGREZWF0aCk7XG5cdFx0XHRhd2FpdCBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PlxuXHRcdFx0XHR0cmVlS2lsbChjdXJyZW50Q2hpbGQucGlkLCBcIlNJR0tJTExcIiwgKGVycikgPT5cblx0XHRcdFx0XHRlcnIgPyByZWplY3QoZXJyKSA6IHJlc29sdmUoKVxuXHRcdFx0XHQpXG5cdFx0XHQpO1xuXHRcdFx0bG9nZ2VyKFwiS2lsbCBvbGQgY2hpbGRcIik7XG5cdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRsb2dnZXIoXCJGYWlsZWQgdG8ga2lsbCBvbGQgY2hpbGRcIik7XG5cdFx0fVxuXHRcdGN1cnJlbnRDaGlsZCA9IG51bGw7XG5cdH1cbn1cbiJdfQ==