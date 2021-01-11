"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayAsTree = void 0;
var chalk_1 = __importDefault(require("chalk"));
function displayAsTree(children, prefix, color) {
    if (prefix === void 0) { prefix = ""; }
    if (color === void 0) { color = chalk_1.default.reset; }
    console.log((children.length > 1
        ? prefix + "\u251C\u2500 " +
            children
                .slice(0, -1)
                .map(function (s) { return color(s); })
                .join("\n" + prefix + "\u251C\u2500 ") +
            "\n"
        : "") +
        (prefix + "\u2570\u2500 ") +
        color(children.slice(-1)[0]));
}
exports.displayAsTree = displayAsTree;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzcGxheUFzVHJlZVByZWZpeC5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsidXRpbC9mdW5jdGlvbnMvZGlzcGxheUFzVHJlZVByZWZpeC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxnREFBMEI7QUFFMUIsU0FBZ0IsYUFBYSxDQUM1QixRQUFrQixFQUNsQixNQUFXLEVBQ1gsS0FBZ0M7SUFEaEMsdUJBQUEsRUFBQSxXQUFXO0lBQ1gsc0JBQUEsRUFBQSxRQUFxQixlQUFLLENBQUMsS0FBSztJQUVoQyxPQUFPLENBQUMsR0FBRyxDQUNWLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDO1FBQ25CLENBQUMsQ0FBSSxNQUFNLGtCQUFLO1lBQ2QsUUFBUTtpQkFDUCxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUNaLEdBQUcsQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBUixDQUFRLENBQUM7aUJBQ3BCLElBQUksQ0FBQyxPQUFLLE1BQU0sa0JBQUssQ0FBQztZQUN2QixJQUFJO1FBQ04sQ0FBQyxDQUFDLEVBQUUsQ0FBQztTQUNGLE1BQU0sa0JBQUssQ0FBQTtRQUNkLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDN0IsQ0FBQztBQUNILENBQUM7QUFqQkQsc0NBaUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNoYWxrIGZyb20gXCJjaGFsa1wiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlBc1RyZWUoXHJcblx0Y2hpbGRyZW46IHN0cmluZ1tdLFxyXG5cdHByZWZpeCA9IFwiXCIsXHJcblx0Y29sb3I6IGNoYWxrLkNoYWxrID0gY2hhbGsucmVzZXRcclxuKSB7XHJcblx0Y29uc29sZS5sb2coXHJcblx0XHQoY2hpbGRyZW4ubGVuZ3RoID4gMVxyXG5cdFx0XHQ/IGAke3ByZWZpeH3ilJzilIAgYCArXHJcblx0XHRcdCAgY2hpbGRyZW5cclxuXHRcdFx0XHRcdC5zbGljZSgwLCAtMSlcclxuXHRcdFx0XHRcdC5tYXAoKHMpID0+IGNvbG9yKHMpKVxyXG5cdFx0XHRcdFx0LmpvaW4oYFxcbiR7cHJlZml4feKUnOKUgCBgKSArXHJcblx0XHRcdCAgXCJcXG5cIlxyXG5cdFx0XHQ6IFwiXCIpICtcclxuXHRcdFx0YCR7cHJlZml4feKVsOKUgCBgICtcclxuXHRcdFx0Y29sb3IoY2hpbGRyZW4uc2xpY2UoLTEpWzBdKVxyXG5cdCk7XHJcbn1cclxuIl19