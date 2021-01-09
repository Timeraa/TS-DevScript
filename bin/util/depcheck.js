"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var debug_1 = __importDefault(require("debug"));
var depcheck_1 = __importDefault(require("depcheck"));
var index_1 = require("../index");
var displayAsTree_1 = __importDefault(require("./functions/displayAsTree"));
var logger = debug_1.default(index_1.name + ":depcheck");
function checkDeps() {
    return __awaiter(this, void 0, void 0, function () {
        var deps;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(index_1.dsConsolePrefix + " " + chalk_1.default.hex("#ebc14d")("Checking dependencies…"));
                    logger("Running dependency check...");
                    return [4, depcheck_1.default(process.cwd(), { ignoreDirs: [index_1.config.out] })];
                case 1:
                    deps = _a.sent();
                    logger("Dependency check finished. " + (deps.dependencies.length + deps.devDependencies.length) + " unused, " + Object.keys(deps.missing).length + " missing");
                    if (Object.keys(deps.missing).length > 0)
                        displayAsTree_1.default(index_1.dsConsolePrefix + " " + chalk_1.default.red(chalk_1.default.bold("Missing dependencies")), Object.keys(deps.missing), chalk_1.default.red);
                    if (deps.dependencies.length > 0)
                        displayAsTree_1.default(index_1.dsConsolePrefix + " " + chalk_1.default.bold(chalk_1.default.yellowBright("Unused dependencies")), deps.dependencies, chalk_1.default.yellowBright);
                    if (deps.devDependencies.length > 0)
                        displayAsTree_1.default(index_1.dsConsolePrefix + " " + chalk_1.default.hex("#ea5e00")(chalk_1.default.bold("Unused devDependencies")), deps.devDependencies, chalk_1.default.hex("#e8811c"));
                    return [2];
            }
        });
    });
}
exports.default = checkDeps;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwQ2hlY2suanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInV0aWwvZGVwQ2hlY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxnREFBMEI7QUFDMUIsZ0RBQTBCO0FBQzFCLHNEQUFnQztBQUVoQyxrQ0FBeUQ7QUFDekQsNEVBQXNEO0FBRXRELElBQU0sTUFBTSxHQUFHLGVBQUssQ0FBSSxZQUFJLGNBQVcsQ0FBQyxDQUFDO0FBRXpDLFNBQThCLFNBQVM7Ozs7OztvQkFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FDUCx1QkFBZSxTQUFJLGVBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsd0JBQXdCLENBQUcsQ0FDdEUsQ0FBQztvQkFDRixNQUFNLENBQUMsNkJBQTZCLENBQUMsQ0FBQztvQkFDekIsV0FBTSxrQkFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLGNBQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUE7O29CQUFsRSxJQUFJLEdBQUcsU0FBMkQ7b0JBQ3hFLE1BQU0sQ0FDTCxpQ0FDQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sa0JBQzNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sYUFBVSxDQUN0RCxDQUFDO29CQUVGLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUM7d0JBQ3ZDLHVCQUFhLENBQ1QsdUJBQWUsU0FBSSxlQUFLLENBQUMsR0FBRyxDQUFDLGVBQUssQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBRyxFQUNyRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFDekIsZUFBSyxDQUFDLEdBQUcsQ0FDVCxDQUFDO29CQUVILElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQzt3QkFDL0IsdUJBQWEsQ0FDVCx1QkFBZSxTQUFJLGVBQUssQ0FBQyxJQUFJLENBQy9CLGVBQUssQ0FBQyxZQUFZLENBQUMscUJBQXFCLENBQUMsQ0FDdkMsRUFDSCxJQUFJLENBQUMsWUFBWSxFQUNqQixlQUFLLENBQUMsWUFBWSxDQUNsQixDQUFDO29CQUVILElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQzt3QkFDbEMsdUJBQWEsQ0FDVCx1QkFBZSxTQUFJLGVBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQ3pDLGVBQUssQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FDbEMsRUFDSCxJQUFJLENBQUMsZUFBZSxFQUNwQixlQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUNwQixDQUFDOzs7OztDQUNIO0FBcENELDRCQW9DQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjaGFsayBmcm9tIFwiY2hhbGtcIjtcclxuaW1wb3J0IGRlYnVnIGZyb20gXCJkZWJ1Z1wiO1xyXG5pbXBvcnQgZGVwY2hlY2sgZnJvbSBcImRlcGNoZWNrXCI7XHJcblxyXG5pbXBvcnQgeyBjb25maWcsIGRzQ29uc29sZVByZWZpeCwgbmFtZSB9IGZyb20gXCIuLi9pbmRleFwiO1xyXG5pbXBvcnQgZGlzcGxheUFzVHJlZSBmcm9tIFwiLi9mdW5jdGlvbnMvZGlzcGxheUFzVHJlZVwiO1xyXG5cclxuY29uc3QgbG9nZ2VyID0gZGVidWcoYCR7bmFtZX06ZGVwY2hlY2tgKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGNoZWNrRGVwcygpIHtcclxuXHRjb25zb2xlLmxvZyhcclxuXHRcdGAke2RzQ29uc29sZVByZWZpeH0gJHtjaGFsay5oZXgoXCIjZWJjMTRkXCIpKFwiQ2hlY2tpbmcgZGVwZW5kZW5jaWVz4oCmXCIpfWBcclxuXHQpO1xyXG5cdGxvZ2dlcihcIlJ1bm5pbmcgZGVwZW5kZW5jeSBjaGVjay4uLlwiKTtcclxuXHRjb25zdCBkZXBzID0gYXdhaXQgZGVwY2hlY2socHJvY2Vzcy5jd2QoKSwgeyBpZ25vcmVEaXJzOiBbY29uZmlnLm91dF0gfSk7XHJcblx0bG9nZ2VyKFxyXG5cdFx0YERlcGVuZGVuY3kgY2hlY2sgZmluaXNoZWQuICR7XHJcblx0XHRcdGRlcHMuZGVwZW5kZW5jaWVzLmxlbmd0aCArIGRlcHMuZGV2RGVwZW5kZW5jaWVzLmxlbmd0aFxyXG5cdFx0fSB1bnVzZWQsICR7T2JqZWN0LmtleXMoZGVwcy5taXNzaW5nKS5sZW5ndGh9IG1pc3NpbmdgXHJcblx0KTtcclxuXHJcblx0aWYgKE9iamVjdC5rZXlzKGRlcHMubWlzc2luZykubGVuZ3RoID4gMClcclxuXHRcdGRpc3BsYXlBc1RyZWUoXHJcblx0XHRcdGAke2RzQ29uc29sZVByZWZpeH0gJHtjaGFsay5yZWQoY2hhbGsuYm9sZChcIk1pc3NpbmcgZGVwZW5kZW5jaWVzXCIpKX1gLFxyXG5cdFx0XHRPYmplY3Qua2V5cyhkZXBzLm1pc3NpbmcpLFxyXG5cdFx0XHRjaGFsay5yZWRcclxuXHRcdCk7XHJcblxyXG5cdGlmIChkZXBzLmRlcGVuZGVuY2llcy5sZW5ndGggPiAwKVxyXG5cdFx0ZGlzcGxheUFzVHJlZShcclxuXHRcdFx0YCR7ZHNDb25zb2xlUHJlZml4fSAke2NoYWxrLmJvbGQoXHJcblx0XHRcdFx0Y2hhbGsueWVsbG93QnJpZ2h0KFwiVW51c2VkIGRlcGVuZGVuY2llc1wiKVxyXG5cdFx0XHQpfWAsXHJcblx0XHRcdGRlcHMuZGVwZW5kZW5jaWVzLFxyXG5cdFx0XHRjaGFsay55ZWxsb3dCcmlnaHRcclxuXHRcdCk7XHJcblxyXG5cdGlmIChkZXBzLmRldkRlcGVuZGVuY2llcy5sZW5ndGggPiAwKVxyXG5cdFx0ZGlzcGxheUFzVHJlZShcclxuXHRcdFx0YCR7ZHNDb25zb2xlUHJlZml4fSAke2NoYWxrLmhleChcIiNlYTVlMDBcIikoXHJcblx0XHRcdFx0Y2hhbGsuYm9sZChcIlVudXNlZCBkZXZEZXBlbmRlbmNpZXNcIilcclxuXHRcdFx0KX1gLFxyXG5cdFx0XHRkZXBzLmRldkRlcGVuZGVuY2llcyxcclxuXHRcdFx0Y2hhbGsuaGV4KFwiI2U4ODExY1wiKVxyXG5cdFx0KTtcclxufVxyXG4iXX0=