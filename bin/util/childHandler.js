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
            logger("Failed to kill old child", err);
        }
        currentChild = null;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpbGRIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJ1dGlsL2NoaWxkSGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUEwQjtBQUMxQixpREFBMEQ7QUFDMUQsa0RBQTBCO0FBQzFCLHVDQUFzQztBQUN0QywrQkFBK0I7QUFDL0IsMERBQWlDO0FBRWpDLDJCQUFvRDtBQUVwRCxJQUFJLFlBQVksR0FBd0IsSUFBSSxDQUFDO0FBQzdDLE1BQU0sTUFBTSxHQUFHLGVBQUssQ0FBQyxHQUFHLFFBQUksZUFBZSxDQUFDLENBQUM7QUFFOUIsS0FBSyxVQUFVLFFBQVE7SUFDckMsSUFBSSxXQUFXLEdBQVEsSUFBSSxDQUFDO0lBRTVCLElBQUk7UUFDSCxXQUFXLEdBQUcsT0FBTyxDQUFDLGNBQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQztLQUM5RDtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ2IsTUFBTSxDQUFDLHVCQUF1QixDQUFDLENBQUM7S0FDaEM7SUFFRCxNQUFNLFlBQVksRUFBRSxDQUFDO0lBRXJCLElBQUksQ0FBQyxVQUFNLENBQUMsS0FBSyxJQUFJLFdBQVcsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO1FBQ2pELE1BQU0sQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO1FBQ3ZELFlBQVksR0FBRyxxQkFBSyxDQUNuQixDQUFDLE1BQU0scUJBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsWUFBWSxDQUFDLENBQUM7WUFDL0MsQ0FBQyxDQUFDLHlCQUF5QjtZQUMzQixDQUFDLENBQUMsd0JBQXdCLEVBQzNCO1lBQ0MsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUU7WUFDbEIsS0FBSyxFQUFFLElBQUk7WUFDWCxLQUFLLEVBQUUsU0FBUztTQUNoQixDQUNELENBQUM7UUFFRixZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztRQUN4QyxPQUFPO0tBQ1A7SUFFRCxJQUNDLHFCQUFVLENBQUMsVUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsVUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsY0FBTyxDQUFDLFVBQU0sQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUMsRUFDeEU7UUFDRCxNQUFNLENBQUMsOEJBQThCLENBQUMsQ0FBQztRQUN2QyxZQUFZLEdBQUcsb0JBQUksQ0FDbEIsVUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsVUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsY0FBTyxDQUFDLFVBQU0sQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLEVBQzdELEVBQUUsRUFDRjtZQUNDLEdBQUcsRUFBRSxVQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQU0sQ0FBQyxHQUFHO1NBQzlDLENBQ0QsQ0FBQztRQUNGLE9BQU87S0FDUDtJQUdELE1BQU0sSUFBSSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBNUNELDJCQTRDQztBQUVELFNBQVMsWUFBWSxDQUFDLElBQVksRUFBRSxNQUFzQjtJQUN6RCxJQUFJLENBQUMsVUFBTSxDQUFDLE1BQU07UUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FDVixHQUFHLG1CQUFlLElBQUksZUFBSyxDQUFDLE1BQU0sQ0FDakMseUJBQXlCO1lBQ3hCLGVBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQ2pCLFlBQVk7WUFDWixlQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUNuQixFQUFFLENBQ0gsRUFBRSxDQUNILENBQUM7QUFDSixDQUFDO0FBRUQsS0FBSyxVQUFVLFlBQVk7SUFDMUIsSUFBSSxZQUFZLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFO1FBQ3pDLElBQUk7WUFDSCxZQUFZLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztZQUNsRCxNQUFNLElBQUksT0FBTyxDQUFPLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQzNDLG1CQUFRLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUM3QyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQzdCLENBQ0QsQ0FBQztZQUNGLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1NBQ3pCO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDYixNQUFNLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDeEM7UUFDRCxZQUFZLEdBQUcsSUFBSSxDQUFDO0tBQ3BCO0FBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjaGFsayBmcm9tIFwiY2hhbGtcIjtcbmltcG9ydCB7IENoaWxkUHJvY2VzcywgZm9yaywgc3Bhd24gfSBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiO1xuaW1wb3J0IGRlYnVnIGZyb20gXCJkZWJ1Z1wiO1xuaW1wb3J0IHsgcGF0aEV4aXN0cyB9IGZyb20gXCJmcy1leHRyYVwiO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgdHJlZUtpbGwgZnJvbSBcInRyZWUta2lsbFwiO1xuXG5pbXBvcnQgeyBjb25maWcsIGRzQ29uc29sZVByZWZpeCwgbmFtZSB9IGZyb20gXCIuLi9cIjtcblxubGV0IGN1cnJlbnRDaGlsZDogQ2hpbGRQcm9jZXNzIHwgbnVsbCA9IG51bGw7XG5jb25zdCBsb2dnZXIgPSBkZWJ1ZyhgJHtuYW1lfTpjaGlsZEhhbmRsZXJgKTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gcnVuQ2hpbGQoKSB7XG5cdGxldCBwcm9qZWN0SlNPTjogYW55ID0gbnVsbDtcblxuXHR0cnkge1xuXHRcdHByb2plY3RKU09OID0gcmVxdWlyZShyZXNvbHZlKHByb2Nlc3MuY3dkKCksIFwicGFja2FnZS5qc29uXCIpKTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0bG9nZ2VyKFwiTm8gcGFja2FnZS5qc29uIGZvdW5kXCIpO1xuXHR9XG5cblx0YXdhaXQga2lsbE9sZENoaWxkKCk7XG5cblx0aWYgKCFjb25maWcuZW50cnkgJiYgcHJvamVjdEpTT04/LnNjcmlwdHM/LnN0YXJ0KSB7XG5cdFx0bG9nZ2VyKFwiU3RhcnRpbmcgd2l0aCBzdGFydCBzY3JpcHQgZnJvbSBwcm9qZWN0Lmpzb25cIik7XG5cdFx0Y3VycmVudENoaWxkID0gc3Bhd24oXG5cdFx0XHQoYXdhaXQgcGF0aEV4aXN0cyhwcm9jZXNzLmN3ZCgpICsgXCIveWFybi5sb2NrXCIpKVxuXHRcdFx0XHQ/IFwieWFybiBydW4gLS1zaWxlbnQgc3RhcnRcIlxuXHRcdFx0XHQ6IFwibnBtIHJ1biAtLXNpbGVudCBzdGFydFwiLFxuXHRcdFx0e1xuXHRcdFx0XHRjd2Q6IHByb2Nlc3MuY3dkKCksXG5cdFx0XHRcdHNoZWxsOiB0cnVlLFxuXHRcdFx0XHRzdGRpbzogXCJpbmhlcml0XCJcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0Y3VycmVudENoaWxkLm9uY2UoXCJleGl0XCIsIG9uQ2hpbGREZWF0aCk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0aWYgKFxuXHRcdHBhdGhFeGlzdHMoY29uZmlnLmVudHJ5ID8gY29uZmlnLmVudHJ5IDogcmVzb2x2ZShjb25maWcub3V0LCBcImluZGV4LmpzXCIpKVxuXHQpIHtcblx0XHRsb2dnZXIoXCJTdGFydGluZyB3aXRoIGVudHJ5IGluZGV4LmpzXCIpO1xuXHRcdGN1cnJlbnRDaGlsZCA9IGZvcmsoXG5cdFx0XHRjb25maWcuZW50cnkgPyBjb25maWcuZW50cnkgOiByZXNvbHZlKGNvbmZpZy5vdXQsIFwiaW5kZXguanNcIiksXG5cdFx0XHRbXSxcblx0XHRcdHtcblx0XHRcdFx0Y3dkOiBjb25maWcuZW50cnkgPyBwcm9jZXNzLmN3ZCgpIDogY29uZmlnLm91dFxuXHRcdFx0fVxuXHRcdCk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly9UT0RPIEJldHRlciBtZXNzYWdlXG5cdHRocm93IG5ldyBFcnJvcihcIk5vIGVudHJ5IGZvdW5kXCIpO1xufVxuXG5mdW5jdGlvbiBvbkNoaWxkRGVhdGgoY29kZTogbnVtYmVyLCBzaWduYWw6IE5vZGVKUy5TaWduYWxzKSB7XG5cdGlmICghY29uZmlnLnNpbGVudClcblx0XHRjb25zb2xlLmxvZyhcblx0XHRcdGAke2RzQ29uc29sZVByZWZpeH0gJHtjaGFsay55ZWxsb3coXG5cdFx0XHRcdFwiUHJvY2VzcyBleGl0IHdpdGggY29kZSBcIiArXG5cdFx0XHRcdFx0Y2hhbGsud2hpdGUoY29kZSkgK1xuXHRcdFx0XHRcdFwiLCBzaWduYWw6IFwiICtcblx0XHRcdFx0XHRjaGFsay53aGl0ZShzaWduYWwpICtcblx0XHRcdFx0XHRcIlwiXG5cdFx0XHQpfWBcblx0XHQpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBraWxsT2xkQ2hpbGQoKSB7XG5cdGlmIChjdXJyZW50Q2hpbGQgJiYgIWN1cnJlbnRDaGlsZC5raWxsZWQpIHtcblx0XHR0cnkge1xuXHRcdFx0Y3VycmVudENoaWxkLnJlbW92ZUxpc3RlbmVyKFwiZXhpdFwiLCBvbkNoaWxkRGVhdGgpO1xuXHRcdFx0YXdhaXQgbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT5cblx0XHRcdFx0dHJlZUtpbGwoY3VycmVudENoaWxkLnBpZCwgXCJTSUdLSUxMXCIsIChlcnIpID0+XG5cdFx0XHRcdFx0ZXJyID8gcmVqZWN0KGVycikgOiByZXNvbHZlKClcblx0XHRcdFx0KVxuXHRcdFx0KTtcblx0XHRcdGxvZ2dlcihcIktpbGwgb2xkIGNoaWxkXCIpO1xuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0bG9nZ2VyKFwiRmFpbGVkIHRvIGtpbGwgb2xkIGNoaWxkXCIsIGVycik7XG5cdFx0fVxuXHRcdGN1cnJlbnRDaGlsZCA9IG51bGw7XG5cdH1cbn1cbiJdfQ==