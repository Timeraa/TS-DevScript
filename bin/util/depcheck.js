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
var autopm_1 = __importDefault(require("autopm"));
var chalk_1 = __importDefault(require("chalk"));
var compare_versions_1 = require("compare-versions");
var debug_1 = __importDefault(require("debug"));
var displayastree_1 = require("displayastree");
var fast_glob_1 = require("fast-glob");
var inquirer_1 = __importDefault(require("inquirer"));
var ora_1 = __importDefault(require("ora"));
var index_1 = require("../index");
var outlineStrings_1 = __importDefault(require("./functions/outlineStrings"));
var lockHandler_1 = require("./lockHandler");
var logger = debug_1.default(index_1.name + ":depcheck"), spinnerSettings = {
    interval: 80,
    frames: [
        chalk_1.default.hex("#bebebe")("( " + chalk_1.default.white("●") + "   )"),
        chalk_1.default.hex("#bebebe")("(  " + chalk_1.default.white("●") + "  )"),
        chalk_1.default.hex("#bebebe")("(   " + chalk_1.default.white("●") + " )"),
        chalk_1.default.hex("#bebebe")("(    " + chalk_1.default.white("●") + ")"),
        chalk_1.default.hex("#bebebe")("(   " + chalk_1.default.white("●") + " )"),
        chalk_1.default.hex("#bebebe")("(  " + chalk_1.default.white("●") + "  )"),
        chalk_1.default.hex("#bebebe")("( " + chalk_1.default.white("●") + "   )"),
        chalk_1.default.hex("#bebebe")("(" + chalk_1.default.white("●") + "    )")
    ]
}, defaultChoices = [
    "Latest",
    "Don't update (Ignore this session)",
    "Ignore until next MAJOR",
    "Ignore until next MINOR",
    "Ignore until next PATCH",
    new inquirer_1.default.Separator("──────────────────────────────────")
], ignoreThisSession = [];
function checkDeps(showErrors) {
    var _a;
    if (showErrors === void 0) { showErrors = true; }
    return __awaiter(this, void 0, void 0, function () {
        var jsFiles, aPM, sections, deprecatedModules, updated_1, updated_2, length_1, ies, spinner, updated_3, updated_4, length_2, ies, spinner, updated_5, updated_6, length_3, ies, spinner, updated_7, updated_8, length_4, ies, spinner, installed, updated, removed, tree, stringArray, stringArray, stringArray;
        var _b;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!index_1.config.silent)
                        console.log("" + index_1.dsConsolePrefix + chalk_1.default.hex("#ebc14d")("Checking dependencies…"));
                    jsFiles = fast_glob_1.sync("**.js"), aPM = new autopm_1.default({
                        exclude: ((_a = index_1.config.excludeDeps) === null || _a === void 0 ? void 0 : (_b = _a.split(",")).concat.apply(_b, jsFiles)) || jsFiles
                    });
                    return [4, aPM.recheck()];
                case 1:
                    _c.sent();
                    lockHandler_1.validateLock(aPM.pkgJson.dependencies, aPM.pkgJson.devDependencies || {});
                    logger("Dependency check results: " + aPM.unusedModules.length + " unused, " + aPM.missingModules.length + " missing");
                    sections = [];
                    if (!index_1.config.silent && aPM.deprecatedModules.length && showErrors) {
                        deprecatedModules = aPM.deprecatedModules.map(function (m) {
                            return chalk_1.default.hex("#cf47de")(m.module) + " \u2022 " + chalk_1.default.hex("#7289DA")(m.deprecatedMessage);
                        });
                        outlineStrings_1.default(deprecatedModules, "•");
                        sections.push(new displayastree_1.TreeSection(chalk_1.default.hex("#cf47de")(chalk_1.default.bold("Deprecated dependencies"))).addSection(deprecatedModules));
                    }
                    if (!index_1.config.silent && aPM.outdatedModules.length && showErrors)
                        sections.push(new displayastree_1.TreeSection(chalk_1.default.hex("#3242a8")(chalk_1.default.bold("Outdated dependencies"))).addSection(aPM.outdatedModules.map(function (m) { return chalk_1.default.hex("#6ea2f5")(m.module); })));
                    if (!index_1.config.silent && aPM.missingModules.length && showErrors)
                        sections.push(new displayastree_1.TreeSection(chalk_1.default.red(chalk_1.default.bold("Missing dependencies"))).addSection(aPM.missingModules.map(function (c) { return chalk_1.default.red(c); })));
                    if (!index_1.config.silent && aPM.unusedModules.length && showErrors)
                        sections.push(new displayastree_1.TreeSection(chalk_1.default.yellowBright(chalk_1.default.bold("Unused dependencies"))).addSection(aPM.unusedModules.map(function (c) { return chalk_1.default.yellowBright(c); })));
                    if (sections.length) {
                        console.log(new displayastree_1.DisplayAsTree("", { startChar: index_1.dsConsolePrefix })
                            .addSection(sections)
                            .getAsString()
                            .split("\n")
                            .filter(function (s) { return s !== index_1.dsConsolePrefix; })
                            .join("\n"));
                    }
                    if (!(index_1.config.autoUpdateDeprecated && aPM.deprecatedModules.length)) return [3, 6];
                    if (!index_1.config.silent) return [3, 3];
                    updated_1 = false;
                    aPM.deprecatedModules.forEach(function (module) {
                        if (lockHandler_1.lockData[module.module]) {
                            delete lockHandler_1.lockData[module.module];
                            updated_1 = true;
                        }
                    });
                    if (updated_1)
                        lockHandler_1.updateLock();
                    return [4, aPM.upgradeAllDeprecatedToLatest()];
                case 2:
                    _c.sent();
                    return [3, 5];
                case 3:
                    updated_2 = false;
                    aPM.deprecatedModules.forEach(function (module) {
                        if (lockHandler_1.lockData[module.module]) {
                            delete lockHandler_1.lockData[module.module];
                            updated_2 = true;
                        }
                    });
                    if (updated_2)
                        lockHandler_1.updateLock();
                    length_1 = aPM.deprecatedModules.length, ies = length_1 === 1 ? "y" : "ies", spinner = ora_1.default({
                        text: chalk_1.default.green("Updating " + chalk_1.default.bold(length_1) + " deprecated depedenc" + ies + "\u2026"),
                        color: "bold"
                    });
                    spinner._spinner = spinnerSettings;
                    spinner.start();
                    return [4, aPM.upgradeAllDeprecatedToLatest()];
                case 4:
                    _c.sent();
                    spinner.succeed(chalk_1.default.green(" Updated " + chalk_1.default.bold(length_1) + " deprecated depedenc" + ies + "!"));
                    _c.label = 5;
                case 5: return [3, 8];
                case 6:
                    if (!(index_1.config.updateSelector && aPM.deprecatedModules.length)) return [3, 8];
                    return [4, inquirer_1.default
                            .prompt(aPM.deprecatedModules
                            .filter(function (dep) { return !ignoreThisSession.includes(dep.module); })
                            .filter(function (dep) {
                            if (Object.keys(lockHandler_1.lockData).includes(dep.module)) {
                                var ignoredFromVersion = lockHandler_1.lockData[dep.module].version, latestVersion = dep.latestVersion;
                                switch (lockHandler_1.lockData[dep.module].ignoreUntilNext) {
                                    case "MAJOR": {
                                        if (compare_versions_1.compare(ignoredFromVersion.split(".")[0] + ".0.0", latestVersion.split(".")[0] + ".0.0", "<")) {
                                            delete lockHandler_1.lockData[dep.module];
                                            lockHandler_1.updateLock();
                                            return true;
                                        }
                                        else {
                                            return false;
                                        }
                                    }
                                    case "MINOR": {
                                        if (compare_versions_1.compare(ignoredFromVersion.split(".")[0] +
                                            "." +
                                            ignoredFromVersion.split(".")[1] +
                                            ".0", latestVersion.split(".")[0] +
                                            "." +
                                            latestVersion.split(".")[1] +
                                            ".0", "<")) {
                                            delete lockHandler_1.lockData[dep.module];
                                            lockHandler_1.updateLock();
                                            return true;
                                        }
                                        else {
                                            return false;
                                        }
                                    }
                                    default: {
                                        if (compare_versions_1.compare(ignoredFromVersion, latestVersion, "<")) {
                                            delete lockHandler_1.lockData[dep.module];
                                            lockHandler_1.updateLock();
                                            return true;
                                        }
                                        else {
                                            return false;
                                        }
                                    }
                                }
                            }
                            else {
                                return true;
                            }
                        })
                            .map(function (dep) {
                            return {
                                type: "list",
                                message: chalk_1.default.green("Pick to which version you want to update the " + chalk_1.default.hex("#cf47de")("deprecated") + " " + chalk_1.default.hex("#ebc14d")(dep.module) + " module:"),
                                name: dep.module,
                                choices: defaultChoices
                                    .concat(dep.newerNonDeprecatedVersions)
                                    .concat([
                                    new inquirer_1.default.Separator("──────────────────────────────────")
                                ])
                                    .map(function (choice) {
                                    return typeof choice === "string" && choice === "Latest"
                                        ? "Latest " +
                                            chalk_1.default.hex("#bebebe")("(v" + dep.latestVersion + ")")
                                        : choice;
                                })
                                    .filter(function (choice) { return choice !== dep.latestVersion; })
                                    .filter(function (_, index, array) {
                                    return array.length - 1 === defaultChoices.length &&
                                        index >= defaultChoices.length - 1
                                        ? false
                                        : true;
                                }),
                                prefix: index_1.dsConsolePrefix.trim()
                            };
                        }))
                            .then(function (answers) { return __awaiter(_this, void 0, void 0, function () {
                            var toUpdate, _loop_1, _i, _a, _b, k, v, length_5, ies, spinner;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        toUpdate = [];
                                        _loop_1 = function (k, v) {
                                            switch (v) {
                                                case "Ignore until next MAJOR":
                                                    {
                                                        var module_1 = aPM.deprecatedModules.find(function (m) { return m.module === k; });
                                                        lockHandler_1.lockData[k] = {
                                                            version: module_1.newerNonDeprecatedVersions.length
                                                                ? module_1.newerNonDeprecatedVersions[0]
                                                                : module_1.currentVersion,
                                                            ignoreUntilNext: "MAJOR"
                                                        };
                                                    }
                                                    break;
                                                case "Ignore until next MINOR":
                                                    {
                                                        var module_2 = aPM.deprecatedModules.find(function (m) { return m.module === k; });
                                                        lockHandler_1.lockData[k] = {
                                                            version: module_2.newerNonDeprecatedVersions.length
                                                                ? module_2.newerNonDeprecatedVersions[0]
                                                                : module_2.currentVersion,
                                                            ignoreUntilNext: "MINOR"
                                                        };
                                                    }
                                                    break;
                                                case "Ignore until next PATCH":
                                                    {
                                                        var module_3 = aPM.deprecatedModules.find(function (m) { return m.module === k; });
                                                        lockHandler_1.lockData[k] = {
                                                            version: module_3.newerNonDeprecatedVersions.length
                                                                ? module_3.newerNonDeprecatedVersions[0]
                                                                : module_3.currentVersion,
                                                            ignoreUntilNext: "PATCH"
                                                        };
                                                    }
                                                    break;
                                                case "Don't update (Ignore this session)":
                                                    ignoreThisSession.push(k);
                                                    break;
                                                default: {
                                                    if (v.includes("Latest")) {
                                                        toUpdate.push({ module: k, version: "latest" });
                                                    }
                                                    else {
                                                        toUpdate.push({ module: k, version: v });
                                                    }
                                                }
                                            }
                                        };
                                        for (_i = 0, _a = Object.entries(answers); _i < _a.length; _i++) {
                                            _b = _a[_i], k = _b[0], v = _b[1];
                                            _loop_1(k, v);
                                        }
                                        lockHandler_1.updateLock();
                                        if (!toUpdate.length) return [3, 2];
                                        length_5 = toUpdate.length, ies = length_5 === 1 ? "y" : "ies", spinner = ora_1.default({
                                            text: chalk_1.default.hex("#6ea2f5")("Updating " + chalk_1.default.bold(length_5) + " deprecated depedenc" + ies + "\u2026"),
                                            color: "bold"
                                        });
                                        spinner._spinner = spinnerSettings;
                                        spinner.start();
                                        return [4, aPM.upgradeModulesToVersions(toUpdate.filter(function (k) {
                                                return Object.keys(aPM.pkgJson.dependencies).includes(k.module);
                                            }), toUpdate.filter(function (k) {
                                                return Object.keys(aPM.pkgJson.devDependencies).includes(k.module);
                                            }))];
                                    case 1:
                                        _c.sent();
                                        spinner.succeed(chalk_1.default.hex("#6ea2f5")(" Updated " + chalk_1.default.bold(length_5) + " deprecated depedenc" + ies + "!"));
                                        _c.label = 2;
                                    case 2: return [2];
                                }
                            });
                        }); })
                            .catch(function (error) {
                            if (error.isTtyError) {
                                console.log(chalk_1.default.red("ERROR | Prompt couldn't be rendered in the current environment."));
                            }
                            else {
                                console.log(chalk_1.default.red("ERROR | Please report the following error on GitHub!"));
                                console.log(error);
                            }
                        })];
                case 7:
                    _c.sent();
                    _c.label = 8;
                case 8:
                    if (!(index_1.config.autoUpdateOutdated && aPM.outdatedModules.length)) return [3, 13];
                    if (!index_1.config.silent) return [3, 10];
                    updated_3 = false;
                    aPM.outdatedModules.forEach(function (module) {
                        if (lockHandler_1.lockData[module.module]) {
                            delete lockHandler_1.lockData[module.module];
                            updated_3 = true;
                        }
                    });
                    if (updated_3)
                        lockHandler_1.updateLock();
                    return [4, aPM.upgradeAllOutdatedToLatest()];
                case 9:
                    _c.sent();
                    return [3, 12];
                case 10:
                    updated_4 = false;
                    aPM.outdatedModules.forEach(function (module) {
                        if (lockHandler_1.lockData[module.module]) {
                            delete lockHandler_1.lockData[module.module];
                            updated_4 = true;
                        }
                    });
                    if (updated_4)
                        lockHandler_1.updateLock();
                    length_2 = aPM.outdatedModules.length, ies = length_2 === 1 ? "y" : "ies", spinner = ora_1.default({
                        text: chalk_1.default.green("Updating " + chalk_1.default.bold(length_2) + " outdated depedenc" + ies + "\u2026"),
                        color: "bold"
                    });
                    spinner._spinner = spinnerSettings;
                    spinner.start();
                    return [4, aPM.upgradeAllOutdatedToLatest()];
                case 11:
                    _c.sent();
                    spinner.succeed(chalk_1.default.green(" Updated " + chalk_1.default.bold(length_2) + " outdated depedenc" + ies + "!"));
                    _c.label = 12;
                case 12: return [3, 15];
                case 13:
                    if (!(index_1.config.updateSelector && aPM.outdatedModules.length)) return [3, 15];
                    return [4, inquirer_1.default
                            .prompt(aPM.outdatedModules
                            .filter(function (dep) { return !ignoreThisSession.includes(dep.module); })
                            .filter(function (dep) {
                            if (Object.keys(lockHandler_1.lockData).includes(dep.module)) {
                                var ignoredFromVersion = lockHandler_1.lockData[dep.module].version, latestVersion = dep.latestVersion;
                                switch (lockHandler_1.lockData[dep.module].ignoreUntilNext) {
                                    case "MAJOR": {
                                        if (compare_versions_1.compare(ignoredFromVersion.split(".")[0] + ".0.0", latestVersion.split(".")[0] + ".0.0", "<")) {
                                            delete lockHandler_1.lockData[dep.module];
                                            lockHandler_1.updateLock();
                                            return true;
                                        }
                                        else {
                                            return false;
                                        }
                                    }
                                    case "MINOR": {
                                        if (compare_versions_1.compare(ignoredFromVersion.split(".")[0] +
                                            "." +
                                            ignoredFromVersion.split(".")[1] +
                                            ".0", latestVersion.split(".")[0] +
                                            "." +
                                            latestVersion.split(".")[1] +
                                            ".0", "<")) {
                                            delete lockHandler_1.lockData[dep.module];
                                            lockHandler_1.updateLock();
                                            return true;
                                        }
                                        else {
                                            return false;
                                        }
                                    }
                                    default: {
                                        if (compare_versions_1.compare(ignoredFromVersion, latestVersion, "<")) {
                                            delete lockHandler_1.lockData[dep.module];
                                            lockHandler_1.updateLock();
                                            return true;
                                        }
                                        else {
                                            return false;
                                        }
                                    }
                                }
                            }
                            else {
                                return true;
                            }
                        })
                            .map(function (dep) {
                            return {
                                type: "list",
                                message: chalk_1.default.green("Pick to which version you want to update the " + chalk_1.default.hex("#6ea2f5")("outdated") + " " + chalk_1.default.hex("#ebc14d")(dep.module) + " module:"),
                                name: dep.module,
                                choices: defaultChoices
                                    .concat(dep.newerNonDeprecatedVersions)
                                    .concat([
                                    new inquirer_1.default.Separator("──────────────────────────────────")
                                ])
                                    .map(function (choice) {
                                    return typeof choice === "string" && choice === "Latest"
                                        ? "Latest " +
                                            chalk_1.default.hex("#bebebe")("(v" + dep.latestVersion + ")")
                                        : choice;
                                })
                                    .filter(function (choice) { return choice !== dep.latestVersion; })
                                    .filter(function (_, index, array) {
                                    return array.length - 1 === defaultChoices.length &&
                                        index >= defaultChoices.length - 1
                                        ? false
                                        : true;
                                }),
                                prefix: index_1.dsConsolePrefix.trim()
                            };
                        }))
                            .then(function (answers) { return __awaiter(_this, void 0, void 0, function () {
                            var toUpdate, _loop_2, _i, _a, _b, k, v, length_6, ies, spinner;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        toUpdate = [];
                                        _loop_2 = function (k, v) {
                                            switch (v) {
                                                case "Ignore until next MAJOR":
                                                    {
                                                        var module_4 = aPM.outdatedModules.find(function (m) { return m.module === k; });
                                                        lockHandler_1.lockData[k] = {
                                                            version: module_4.newerNonDeprecatedVersions.length
                                                                ? module_4.newerNonDeprecatedVersions[0]
                                                                : module_4.currentVersion,
                                                            ignoreUntilNext: "MAJOR"
                                                        };
                                                    }
                                                    break;
                                                case "Ignore until next MINOR":
                                                    {
                                                        var module_5 = aPM.outdatedModules.find(function (m) { return m.module === k; });
                                                        lockHandler_1.lockData[k] = {
                                                            version: module_5.newerNonDeprecatedVersions.length
                                                                ? module_5.newerNonDeprecatedVersions[0]
                                                                : module_5.currentVersion,
                                                            ignoreUntilNext: "MINOR"
                                                        };
                                                    }
                                                    break;
                                                case "Ignore until next PATCH":
                                                    {
                                                        var module_6 = aPM.outdatedModules.find(function (m) { return m.module === k; });
                                                        lockHandler_1.lockData[k] = {
                                                            version: module_6.newerNonDeprecatedVersions.length
                                                                ? module_6.newerNonDeprecatedVersions[0]
                                                                : module_6.currentVersion,
                                                            ignoreUntilNext: "PATCH"
                                                        };
                                                    }
                                                    break;
                                                case "Don't update (Ignore this session)":
                                                    ignoreThisSession.push(k);
                                                    break;
                                                default: {
                                                    if (v.includes("Latest")) {
                                                        toUpdate.push({ module: k, version: "latest" });
                                                    }
                                                    else {
                                                        toUpdate.push({ module: k, version: v });
                                                    }
                                                }
                                            }
                                        };
                                        for (_i = 0, _a = Object.entries(answers); _i < _a.length; _i++) {
                                            _b = _a[_i], k = _b[0], v = _b[1];
                                            _loop_2(k, v);
                                        }
                                        lockHandler_1.updateLock();
                                        if (!toUpdate.length) return [3, 2];
                                        length_6 = toUpdate.length, ies = length_6 === 1 ? "y" : "ies", spinner = ora_1.default({
                                            text: chalk_1.default.hex("#6ea2f5")("Updating " + chalk_1.default.bold(length_6) + " outdated depedenc" + ies + "\u2026"),
                                            color: "bold"
                                        });
                                        spinner._spinner = spinnerSettings;
                                        spinner.start();
                                        return [4, aPM.upgradeModulesToVersions(toUpdate.filter(function (k) {
                                                return Object.keys(aPM.pkgJson.dependencies).includes(k.module);
                                            }), toUpdate.filter(function (k) {
                                                return Object.keys(aPM.pkgJson.devDependencies).includes(k.module);
                                            }))];
                                    case 1:
                                        _c.sent();
                                        spinner.succeed(chalk_1.default.hex("#6ea2f5")(" Updated " + chalk_1.default.bold(length_6) + " outdated depedenc" + ies + "!"));
                                        _c.label = 2;
                                    case 2: return [2];
                                }
                            });
                        }); })
                            .catch(function (error) {
                            if (error.isTtyError) {
                                console.log(chalk_1.default.red("ERROR | Prompt couldn't be rendered in the current environment."));
                            }
                            else {
                                console.log(chalk_1.default.red("ERROR | Please report the following error on GitHub!"));
                                console.log(error);
                            }
                        })];
                case 14:
                    _c.sent();
                    _c.label = 15;
                case 15:
                    if (!(index_1.config.autoInstallDep && aPM.missingModules.length)) return [3, 19];
                    if (!index_1.config.silent) return [3, 17];
                    updated_5 = false;
                    aPM.missingModules.forEach(function (module) {
                        if (lockHandler_1.lockData[module]) {
                            delete lockHandler_1.lockData[module];
                            updated_5 = true;
                        }
                    });
                    if (updated_5)
                        lockHandler_1.updateLock();
                    return [4, aPM.installMissing(index_1.config.autoInstallTypes)];
                case 16:
                    _c.sent();
                    return [3, 19];
                case 17:
                    updated_6 = false;
                    aPM.missingModules.forEach(function (module) {
                        if (lockHandler_1.lockData[module]) {
                            delete lockHandler_1.lockData[module];
                            updated_6 = true;
                        }
                    });
                    if (updated_6)
                        lockHandler_1.updateLock();
                    length_3 = aPM.missingModules.length, ies = length_3 === 1 ? "y" : "ies", spinner = ora_1.default({
                        text: chalk_1.default.green("Installing " + chalk_1.default.bold(length_3) + " missing depedenc" + ies + "\u2026"),
                        color: "bold"
                    });
                    spinner._spinner = spinnerSettings;
                    spinner.start();
                    return [4, aPM.installMissing(index_1.config.autoInstallTypes)];
                case 18:
                    _c.sent();
                    spinner.succeed(chalk_1.default.green(" Installed " + chalk_1.default.bold(length_3) + " missing depedenc" + ies + "!"));
                    _c.label = 19;
                case 19:
                    if (!(index_1.config.autoRemoveDep && aPM.unusedModules.length)) return [3, 23];
                    if (!index_1.config.silent) return [3, 21];
                    updated_7 = false;
                    aPM.unusedModules.forEach(function (module) {
                        if (lockHandler_1.lockData[module]) {
                            delete lockHandler_1.lockData[module];
                            updated_7 = true;
                        }
                    });
                    if (updated_7)
                        lockHandler_1.updateLock();
                    return [4, aPM.uninstallUnused(index_1.config.autoRemoveTypes)];
                case 20:
                    _c.sent();
                    return [3, 23];
                case 21:
                    updated_8 = false;
                    aPM.unusedModules.forEach(function (module) {
                        if (lockHandler_1.lockData[module]) {
                            delete lockHandler_1.lockData[module];
                            updated_8 = true;
                        }
                    });
                    if (updated_8)
                        lockHandler_1.updateLock();
                    length_4 = aPM.unusedModules.length, ies = length_4 === 1 ? "y" : "ies", spinner = ora_1.default({
                        text: chalk_1.default.red(chalk_1.default.bold("Removing " + chalk_1.default.reset(chalk_1.default.red(length_4)) + " " + chalk_1.default.red(chalk_1.default.bold("unused depedenc" + ies + "\u2026")))),
                        color: "bold"
                    });
                    spinner._spinner = spinnerSettings;
                    spinner.start();
                    return [4, aPM.uninstallUnused(index_1.config.autoRemoveTypes)];
                case 22:
                    _c.sent();
                    spinner.succeed(chalk_1.default.red(chalk_1.default.bold(" Removed " + chalk_1.default.reset(chalk_1.default.red(length_4)) + " " + chalk_1.default.red(chalk_1.default.bold("unused depedenc" + ies + "!")))));
                    _c.label = 23;
                case 23:
                    if (aPM.changedModules.length && !index_1.config.silent) {
                        installed = aPM.changedModules.filter(function (m) { return m.type === "INSTALLED"; }), updated = aPM.changedModules.filter(function (m) { return m.type === "UPDATED"; }), removed = aPM.changedModules.filter(function (m) { return m.type === "REMOVED"; }), tree = new displayastree_1.DisplayAsTree(chalk_1.default.hex("#17E35E")("Summary of dependency changes…"));
                        if (installed.length) {
                            stringArray = installed.map(function (m) {
                                return chalk_1.default.hex("#ebc14d")(m.module) + " \u2022 " + (chalk_1.default.hex("#bebebe")("Version: ") +
                                    chalk_1.default.green(chalk_1.default.bold(m.version.replace("^", "")))) + (m.devDependency ? " | " + chalk_1.default.cyan("devDependency") : "");
                            });
                            outlineStrings_1.default(stringArray, "•");
                            outlineStrings_1.default(stringArray, "|");
                            tree.addSection([
                                new displayastree_1.TreeSection(chalk_1.default.green("Installed")).addSection(stringArray.map(function (m) { return m.replace("|", "•"); }))
                            ]);
                        }
                        if (updated.length) {
                            stringArray = updated.map(function (m) {
                                return chalk_1.default.hex("#ebc14d")(m.module) + " \u2022 " + chalk_1.default.hex("#bebebe")("from: " +
                                    chalk_1.default.green(chalk_1.default.bold(m.fromVersion.replace("^", ""))) +
                                    "! to: " +
                                    chalk_1.default.green(chalk_1.default.bold(m.version.replace("^", "")))) + (m.devDependency ? " | " + chalk_1.default.cyan("devDependency") : "");
                            });
                            outlineStrings_1.default(stringArray, "•");
                            outlineStrings_1.default(stringArray, "!");
                            outlineStrings_1.default(stringArray, "|");
                            tree.addSection([
                                new displayastree_1.TreeSection(chalk_1.default.hex("#6ea2f5")("Updated")).addSection(stringArray.map(function (m) { return m.replace("!", "").replace("|", "•"); }))
                            ]);
                        }
                        if (removed.length) {
                            stringArray = removed.map(function (m) {
                                return chalk_1.default.hex("#ebc14d")(m.module) + " \u2022 " + (chalk_1.default.hex("#bebebe")("Version: ") +
                                    chalk_1.default.green(chalk_1.default.bold(m.version.replace("^", "")))) + (m.devDependency ? " | " + chalk_1.default.cyan("devDependency") : "");
                            });
                            outlineStrings_1.default(stringArray, "•");
                            outlineStrings_1.default(stringArray, "|");
                            tree.addSection([
                                new displayastree_1.TreeSection(chalk_1.default.red("Removed")).addSection(stringArray.map(function (m) { return m.replace("|", "•"); }))
                            ]);
                        }
                        tree.log();
                    }
                    return [2, aPM.changedModules.length > 0];
            }
        });
    });
}
exports.default = checkDeps;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwQ2hlY2suanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInV0aWwvZGVwQ2hlY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrREFBNEI7QUFDNUIsZ0RBQTBCO0FBQzFCLHFEQUEyQztBQUMzQyxnREFBMEI7QUFDMUIsK0NBQTJEO0FBQzNELHVDQUF5QztBQUN6QyxzREFBZ0M7QUFDaEMsNENBQXNCO0FBRXRCLGtDQUF5RDtBQUN6RCw4RUFBaUQ7QUFDakQsNkNBQW1FO0FBRW5FLElBQU0sTUFBTSxHQUFHLGVBQUssQ0FBSSxZQUFJLGNBQVcsQ0FBQyxFQUN2QyxlQUFlLEdBQUc7SUFDakIsUUFBUSxFQUFFLEVBQUU7SUFDWixNQUFNLEVBQUU7UUFDUCxlQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQUssZUFBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBTSxDQUFDO1FBQ2pELGVBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBTSxlQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFLLENBQUM7UUFDakQsZUFBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFPLGVBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQUksQ0FBQztRQUNqRCxlQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFVBQVEsZUFBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBRyxDQUFDO1FBQ2pELGVBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBTyxlQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFJLENBQUM7UUFDakQsZUFBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFNLGVBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQUssQ0FB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QUFXLENBQUM7b0NBQ2pDLGVBQUssQ0FBQyxLQUFLLENBQUMsZUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUNqRCxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsZUFBSyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFFOzRCQUgvRCxDQUcrRCxDQUNoRSxDQUFDOzRCQUNGLHdCQUFPLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDOzRCQUMxQix3QkFBTyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQzs0QkFDMUIsSUFBSSxDQUFDLFVBQVUsQ0FBQztnQ0FDZixJQUFJLDJCQUFXLENBQUMsZUFBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FDL0MsV0FBVyxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFuQixDQUFtQixDQUFDLENBQzNDOzZCQUNELENBQUMsQ0FBQzt5QkFDSDt3QkFFRCxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7cUJBQ1g7b0JBRUQsV0FBTyxHQUFHLENBQUMsY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUM7Ozs7Q0FDckM7QUFsckJELDRCQWtyQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXV0b1BNIGZyb20gXCJhdXRvcG1cIjtcclxuaW1wb3J0IGNoYWxrIGZyb20gXCJjaGFsa1wiO1xyXG5pbXBvcnQgeyBjb21wYXJlIH0gZnJvbSBcImNvbXBhcmUtdmVyc2lvbnNcIjtcclxuaW1wb3J0IGRlYnVnIGZyb20gXCJkZWJ1Z1wiO1xyXG5pbXBvcnQgeyBEaXNwbGF5QXNUcmVlLCBUcmVlU2VjdGlvbiB9IGZyb20gXCJkaXNwbGF5YXN0cmVlXCI7XHJcbmltcG9ydCB7IHN5bmMgYXMgZ2xvYiB9IGZyb20gXCJmYXN0LWdsb2JcIjtcclxuaW1wb3J0IGlucXVpcmVyIGZyb20gXCJpbnF1aXJlclwiO1xyXG5pbXBvcnQgb3JhIGZyb20gXCJvcmFcIjtcclxuXHJcbmltcG9ydCB7IGNvbmZpZywgZHNDb25zb2xlUHJlZml4LCBuYW1lIH0gZnJvbSBcIi4uL2luZGV4XCI7XHJcbmltcG9ydCBvdXRsaW5lIGZyb20gXCIuL2Z1bmN0aW9ucy9vdXRsaW5lU3RyaW5nc1wiO1xyXG5pbXBvcnQgeyBsb2NrRGF0YSwgdXBkYXRlTG9jaywgdmFsaWRhdGVMb2NrIH0gZnJvbSBcIi4vbG9ja0hhbmRsZXJcIjtcclxuXHJcbmNvbnN0IGxvZ2dlciA9IGRlYnVnKGAke25hbWV9OmRlcGNoZWNrYCksXHJcblx0c3Bpbm5lclNldHRpbmdzID0ge1xyXG5cdFx0aW50ZXJ2YWw6IDgwLFxyXG5cdFx0ZnJhbWVzOiBbXHJcblx0XHRcdGNoYWxrLmhleChcIiNiZWJlYmVcIikoYCggJHtjaGFsay53aGl0ZShcIuKXj1wiKX0gICApYCksXHJcblx0XHRcdGNoYWxrLmhleChcIiNiZWJlYmVcIikoYCggICR7Y2hhbGsud2hpdGUoXCLil49cIil9ICApYCksXHJcblx0XHRcdGNoYWxrLmhleChcIiNiZWJlYmVcIikoYCggICAke2NoYWxrLndoaXRlKFwi4pePXCIpfSApYCksXHJcblx0XHRcdGNoYWxrLmhleChcIiNiZWJlYmVcIikoYCggICAgJHtjaGFsay53aGl0ZShcIuKXj1wiKX0pYCksXHJcblx0XHRcdGNoYWxrLmhleChcIiNiZWJlYmVcIikoYCggICAke2NoYWxrLndoaXRlKFwi4pePXCIpfSApYCksXHJcblx0XHRcdGNoYWxrLmhleChcIiNiZWJlYmVcIikoYCggICR7Y2hhbGsud2hpdGUoXCLil49cIil9ICApYCksXHJcblx0XHRcdGNoYWxrLmhleChcIiNiZWJlYmVcIikoYCggJHtjaGFsay53aGl0ZShcIuKXj1wiKX0gICApYCksXHJcblx0XHRcdGNoYWxrLmhleChcIiNiZWJlYmVcIikoYCgke2NoYWxrLndoaXRlKFwi4pePXCIpfSAgICApYClcclxuXHRcdF1cclxuXHR9LFxyXG5cdGRlZmF1bHRDaG9pY2VzID0gW1xyXG5cdFx0XCJMYXRlc3RcIixcclxuXHRcdFwiRG9uJ3QgdXBkYXRlIChJZ25vcmUgdGhpcyBzZXNzaW9uKVwiLFxyXG5cdFx0XCJJZ25vcmUgdW50aWwgbmV4dCBNQUpPUlwiLFxyXG5cdFx0XCJJZ25vcmUgdW50aWwgbmV4dCBNSU5PUlwiLFxyXG5cdFx0XCJJZ25vcmUgdW50aWwgbmV4dCBQQVRDSFwiLFxyXG5cdFx0bmV3IGlucXVpcmVyLlNlcGFyYXRvcihcIuKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFwiKVxyXG5cdF0sXHJcblx0aWdub3JlVGhpc1Nlc3Npb246IHN0cmluZ1tdID0gW107XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBjaGVja0RlcHMoc2hvd0Vycm9ycyA9IHRydWUpIHtcclxuXHRpZiAoIWNvbmZpZy5zaWxlbnQpXHJcblx0XHRjb25zb2xlLmxvZyhcclxuXHRcdFx0YCR7ZHNDb25zb2xlUHJlZml4fSR7Y2hhbGsuaGV4KFwiI2ViYzE0ZFwiKShcIkNoZWNraW5nIGRlcGVuZGVuY2llc+KAplwiKX1gXHJcblx0XHQpO1xyXG5cclxuXHRjb25zdCBqc0ZpbGVzID0gZ2xvYihcIioqLmpzXCIpLFxyXG5cdFx0YVBNID0gbmV3IEF1dG9QTSh7XHJcblx0XHRcdGV4Y2x1ZGU6IGNvbmZpZy5leGNsdWRlRGVwcz8uc3BsaXQoXCIsXCIpLmNvbmNhdCguLi5qc0ZpbGVzKSB8fCBqc0ZpbGVzXHJcblx0XHR9KTtcclxuXHQvLyEgQXdhaXQgcmVjaGVjayBzaW5jZSB5b3UgY2FudCBhd2FpdCBhIG5ldyBjbGFzcy5cclxuXHRhd2FpdCBhUE0ucmVjaGVjaygpO1xyXG5cdHZhbGlkYXRlTG9jayhhUE0ucGtnSnNvbi5kZXBlbmRlbmNpZXMsIGFQTS5wa2dKc29uLmRldkRlcGVuZGVuY2llcyB8fCB7fSk7XHJcblx0bG9nZ2VyKFxyXG5cdFx0YERlcGVuZGVuY3kgY2hlY2sgcmVzdWx0czogJHthUE0udW51c2VkTW9kdWxlcy5sZW5ndGh9IHVudXNlZCwgJHthUE0ubWlzc2luZ01vZHVsZXMubGVuZ3RofSBtaXNzaW5nYFxyXG5cdCk7XHJcblxyXG5cdGNvbnN0IHNlY3Rpb25zOiBUcmVlU2VjdGlvbltdID0gW107XHJcblx0aWYgKCFjb25maWcuc2lsZW50ICYmIGFQTS5kZXByZWNhdGVkTW9kdWxlcy5sZW5ndGggJiYgc2hvd0Vycm9ycykge1xyXG5cdFx0Y29uc3QgZGVwcmVjYXRlZE1vZHVsZXMgPSBhUE0uZGVwcmVjYXRlZE1vZHVsZXMubWFwKFxyXG5cdFx0XHQobSkgPT5cclxuXHRcdFx0XHRgJHtjaGFsay5oZXgoXCIjY2Y0N2RlXCIpKG0ubW9kdWxlKX0g4oCiICR7Y2hhbGsuaGV4KFwiIzcyODlEQVwiKShcclxuXHRcdFx0XHRcdG0uZGVwcmVjYXRlZE1lc3NhZ2VcclxuXHRcdFx0XHQpfWBcclxuXHRcdCk7XHJcblxyXG5cdFx0Ly8qIFNwYWNpbmcgYmV0d2VlbiBtb2R1bGUgYW5kIGRlcHJlY2F0ZWQgbWVzc2FnZS5cclxuXHRcdG91dGxpbmUoZGVwcmVjYXRlZE1vZHVsZXMsIFwi4oCiXCIpO1xyXG5cclxuXHRcdHNlY3Rpb25zLnB1c2goXHJcblx0XHRcdG5ldyBUcmVlU2VjdGlvbihcclxuXHRcdFx0XHRjaGFsay5oZXgoXCIjY2Y0N2RlXCIpKGNoYWxrLmJvbGQoXCJEZXByZWNhdGVkIGRlcGVuZGVuY2llc1wiKSlcclxuXHRcdFx0KS5hZGRTZWN0aW9uKGRlcHJlY2F0ZWRNb2R1bGVzKVxyXG5cdFx0KTtcclxuXHR9XHJcblxyXG5cdGlmICghY29uZmlnLnNpbGVudCAmJiBhUE0ub3V0ZGF0ZWRNb2R1bGVzLmxlbmd0aCAmJiBzaG93RXJyb3JzKVxyXG5cdFx0c2VjdGlvbnMucHVzaChcclxuXHRcdFx0bmV3IFRyZWVTZWN0aW9uKFxyXG5cdFx0XHRcdGNoYWxrLmhleChcIiMzMjQyYThcIikoY2hhbGsuYm9sZChcIk91dGRhdGVkIGRlcGVuZGVuY2llc1wiKSlcclxuXHRcdFx0KS5hZGRTZWN0aW9uKFxyXG5cdFx0XHRcdGFQTS5vdXRkYXRlZE1vZHVsZXMubWFwKChtKSA9PiBjaGFsay5oZXgoXCIjNmVhMmY1XCIpKG0ubW9kdWxlKSlcclxuXHRcdFx0KVxyXG5cdFx0KTtcclxuXHJcblx0aWYgKCFjb25maWcuc2lsZW50ICYmIGFQTS5taXNzaW5nTW9kdWxlcy5sZW5ndGggJiYgc2hvd0Vycm9ycylcclxuXHRcdHNlY3Rpb25zLnB1c2goXHJcblx0XHRcdG5ldyBUcmVlU2VjdGlvbihjaGFsay5yZWQoY2hhbGsuYm9sZChcIk1pc3NpbmcgZGVwZW5kZW5jaWVzXCIpKSkuYWRkU2VjdGlvbihcclxuXHRcdFx0XHRhUE0ubWlzc2luZ01vZHVsZXMubWFwKChjKSA9PiBjaGFsay5yZWQoYykpXHJcblx0XHRcdClcclxuXHRcdCk7XHJcblxyXG5cdGlmICghY29uZmlnLnNpbGVudCAmJiBhUE0udW51c2VkTW9kdWxlcy5sZW5ndGggJiYgc2hvd0Vycm9ycylcclxuXHRcdHNlY3Rpb25zLnB1c2goXHJcblx0XHRcdG5ldyBUcmVlU2VjdGlvbihcclxuXHRcdFx0XHRjaGFsay55ZWxsb3dCcmlnaHQoY2hhbGsuYm9sZChcIlVudXNlZCBkZXBlbmRlbmNpZXNcIikpXHJcblx0XHRcdCkuYWRkU2VjdGlvbihhUE0udW51c2VkTW9kdWxlcy5tYXAoKGMpID0+IGNoYWxrLnllbGxvd0JyaWdodChjKSkpXHJcblx0XHQpO1xyXG5cclxuXHRpZiAoc2VjdGlvbnMubGVuZ3RoKSB7XHJcblx0XHRjb25zb2xlLmxvZyhcclxuXHRcdFx0bmV3IERpc3BsYXlBc1RyZWUoXCJcIiwgeyBzdGFydENoYXI6IGRzQ29uc29sZVByZWZpeCB9KVxyXG5cdFx0XHRcdC5hZGRTZWN0aW9uKHNlY3Rpb25zKVxyXG5cdFx0XHRcdC5nZXRBc1N0cmluZygpXHJcblx0XHRcdFx0LnNwbGl0KFwiXFxuXCIpXHJcblx0XHRcdFx0LmZpbHRlcigocykgPT4gcyAhPT0gZHNDb25zb2xlUHJlZml4KVxyXG5cdFx0XHRcdC5qb2luKFwiXFxuXCIpXHJcblx0XHQpO1xyXG5cdH1cclxuXHJcblx0aWYgKGNvbmZpZy5hdXRvVXBkYXRlRGVwcmVjYXRlZCAmJiBhUE0uZGVwcmVjYXRlZE1vZHVsZXMubGVuZ3RoKSB7XHJcblx0XHRpZiAoY29uZmlnLnNpbGVudCkge1xyXG5cdFx0XHRsZXQgdXBkYXRlZCA9IGZhbHNlO1xyXG5cdFx0XHRhUE0uZGVwcmVjYXRlZE1vZHVsZXMuZm9yRWFjaCgobW9kdWxlKSA9PiB7XHJcblx0XHRcdFx0aWYgKGxvY2tEYXRhW21vZHVsZS5tb2R1bGVdKSB7XHJcblx0XHRcdFx0XHRkZWxldGUgbG9ja0RhdGFbbW9kdWxlLm1vZHVsZV07XHJcblx0XHRcdFx0XHR1cGRhdGVkID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRpZiAodXBkYXRlZCkgdXBkYXRlTG9jaygpO1xyXG5cdFx0XHRhd2FpdCBhUE0udXBncmFkZUFsbERlcHJlY2F0ZWRUb0xhdGVzdCgpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bGV0IHVwZGF0ZWQgPSBmYWxzZTtcclxuXHRcdFx0YVBNLmRlcHJlY2F0ZWRNb2R1bGVzLmZvckVhY2goKG1vZHVsZSkgPT4ge1xyXG5cdFx0XHRcdGlmIChsb2NrRGF0YVttb2R1bGUubW9kdWxlXSkge1xyXG5cdFx0XHRcdFx0ZGVsZXRlIGxvY2tEYXRhW21vZHVsZS5tb2R1bGVdO1xyXG5cdFx0XHRcdFx0dXBkYXRlZCA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0aWYgKHVwZGF0ZWQpIHVwZGF0ZUxvY2soKTtcclxuXHRcdFx0Y29uc3QgbGVuZ3RoID0gYVBNLmRlcHJlY2F0ZWRNb2R1bGVzLmxlbmd0aCxcclxuXHRcdFx0XHRpZXMgPSBsZW5ndGggPT09IDEgPyBcInlcIiA6IFwiaWVzXCIsXHJcblx0XHRcdFx0c3Bpbm5lciA9IG9yYSh7XHJcblx0XHRcdFx0XHR0ZXh0OiBjaGFsay5ncmVlbihcclxuXHRcdFx0XHRcdFx0YFVwZGF0aW5nICR7Y2hhbGsuYm9sZChsZW5ndGgpfSBkZXByZWNhdGVkIGRlcGVkZW5jJHtpZXN94oCmYFxyXG5cdFx0XHRcdFx0KSxcclxuXHRcdFx0XHRcdC8vIEB0cy1leHBlY3QtZXJyb3JcclxuXHRcdFx0XHRcdGNvbG9yOiBcImJvbGRcIlxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHQvLyBAdHMtZXhwZWN0LWVycm9yXHJcblx0XHRcdHNwaW5uZXIuX3NwaW5uZXIgPSBzcGlubmVyU2V0dGluZ3M7XHJcblx0XHRcdHNwaW5uZXIuc3RhcnQoKTtcclxuXHRcdFx0YXdhaXQgYVBNLnVwZ3JhZGVBbGxEZXByZWNhdGVkVG9MYXRlc3QoKTtcclxuXHRcdFx0c3Bpbm5lci5zdWNjZWVkKFxyXG5cdFx0XHRcdGNoYWxrLmdyZWVuKGAgVXBkYXRlZCAke2NoYWxrLmJvbGQobGVuZ3RoKX0gZGVwcmVjYXRlZCBkZXBlZGVuYyR7aWVzfSFgKVxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdH0gZWxzZSBpZiAoY29uZmlnLnVwZGF0ZVNlbGVjdG9yICYmIGFQTS5kZXByZWNhdGVkTW9kdWxlcy5sZW5ndGgpIHtcclxuXHRcdGF3YWl0IGlucXVpcmVyXHJcblx0XHRcdC5wcm9tcHQoXHJcblx0XHRcdFx0YVBNLmRlcHJlY2F0ZWRNb2R1bGVzXHJcblx0XHRcdFx0XHQvLyogRmlsdGVyIG91dCBvbmVzIHRoYXQgYXJlIGlnbm9yZWQgdGhpcyBzZXNzaW9uLlxyXG5cdFx0XHRcdFx0LmZpbHRlcigoZGVwKSA9PiAhaWdub3JlVGhpc1Nlc3Npb24uaW5jbHVkZXMoZGVwLm1vZHVsZSkpXHJcblx0XHRcdFx0XHQvLyogRmlsdGVyIG91dCB0aGUgb25lcyB0aGF0IGFyZSBpbiBsb2NrZGF0YS4gVW5sZXNzIHRoZWlyIHZlcnNpb24gaXMgaGlnaGVyIHRoYW4gdGhleSBzcGVjaWZpZWQuXHJcblx0XHRcdFx0XHQuZmlsdGVyKChkZXApID0+IHtcclxuXHRcdFx0XHRcdFx0aWYgKE9iamVjdC5rZXlzKGxvY2tEYXRhKS5pbmNsdWRlcyhkZXAubW9kdWxlKSkge1xyXG5cdFx0XHRcdFx0XHRcdGNvbnN0IGlnbm9yZWRGcm9tVmVyc2lvbiA9IGxvY2tEYXRhW2RlcC5tb2R1bGVdLnZlcnNpb24sXHJcblx0XHRcdFx0XHRcdFx0XHRsYXRlc3RWZXJzaW9uID0gZGVwLmxhdGVzdFZlcnNpb247XHJcblx0XHRcdFx0XHRcdFx0c3dpdGNoIChsb2NrRGF0YVtkZXAubW9kdWxlXS5pZ25vcmVVbnRpbE5leHQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGNhc2UgXCJNQUpPUlwiOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb21wYXJlKFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWdub3JlZEZyb21WZXJzaW9uLnNwbGl0KFwiLlwiKVswXSArIFwiLjAuMFwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGF0ZXN0VmVyc2lvbi5zcGxpdChcIi5cIilbMF0gKyBcIi4wLjBcIixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFwiPFwiXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0XHRcdFx0XHQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkZWxldGUgbG9ja0RhdGFbZGVwLm1vZHVsZV07XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dXBkYXRlTG9jaygpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSBcIk1JTk9SXCI6IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvbXBhcmUoXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZ25vcmVkRnJvbVZlcnNpb24uc3BsaXQoXCIuXCIpWzBdICtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XCIuXCIgK1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZ25vcmVkRnJvbVZlcnNpb24uc3BsaXQoXCIuXCIpWzFdICtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XCIuMFwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGF0ZXN0VmVyc2lvbi5zcGxpdChcIi5cIilbMF0gK1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcIi5cIiArXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxhdGVzdFZlcnNpb24uc3BsaXQoXCIuXCIpWzFdICtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XCIuMFwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XCI8XCJcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdFx0XHRcdCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRlbGV0ZSBsb2NrRGF0YVtkZXAubW9kdWxlXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR1cGRhdGVMb2NrKCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0OiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChjb21wYXJlKGlnbm9yZWRGcm9tVmVyc2lvbiwgbGF0ZXN0VmVyc2lvbiwgXCI8XCIpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVsZXRlIGxvY2tEYXRhW2RlcC5tb2R1bGVdO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHVwZGF0ZUxvY2soKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHQubWFwKChkZXApID0+IHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcImxpc3RcIixcclxuXHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBjaGFsay5ncmVlbihcclxuXHRcdFx0XHRcdFx0XHRcdGBQaWNrIHRvIHdoaWNoIHZlcnNpb24geW91IHdhbnQgdG8gdXBkYXRlIHRoZSAke2NoYWxrLmhleChcclxuXHRcdFx0XHRcdFx0XHRcdFx0XCIjY2Y0N2RlXCJcclxuXHRcdFx0XHRcdFx0XHRcdCkoXCJkZXByZWNhdGVkXCIpfSAke2NoYWxrLmhleChcIiNlYmMxNGRcIikoZGVwLm1vZHVsZSl9IG1vZHVsZTpgXHJcblx0XHRcdFx0XHRcdFx0KSxcclxuXHRcdFx0XHRcdFx0XHRuYW1lOiBkZXAubW9kdWxlLFxyXG5cdFx0XHRcdFx0XHRcdGNob2ljZXM6IGRlZmF1bHRDaG9pY2VzXHJcblx0XHRcdFx0XHRcdFx0XHQuY29uY2F0KGRlcC5uZXdlck5vbkRlcHJlY2F0ZWRWZXJzaW9ucylcclxuXHRcdFx0XHRcdFx0XHRcdC5jb25jYXQoW1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRuZXcgaW5xdWlyZXIuU2VwYXJhdG9yKFwi4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXCIpXHJcblx0XHRcdFx0XHRcdFx0XHRdKVxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8qIGFkZCB2ZXJzaW9uIG5hbWUgdG8gdGhlIExhdGVzdCBjaG9pY2VcclxuXHRcdFx0XHRcdFx0XHRcdC5tYXAoKGNob2ljZSkgPT5cclxuXHRcdFx0XHRcdFx0XHRcdFx0dHlwZW9mIGNob2ljZSA9PT0gXCJzdHJpbmdcIiAmJiBjaG9pY2UgPT09IFwiTGF0ZXN0XCJcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ/IFwiTGF0ZXN0IFwiICtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQgIGNoYWxrLmhleChcIiNiZWJlYmVcIikoYCh2JHtkZXAubGF0ZXN0VmVyc2lvbn0pYClcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ6IGNob2ljZVxyXG5cdFx0XHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8qIFJlbW92ZSB0aGUgbGF0ZXN0IHZlcnNpb24gbmFtZSBmcm9tIGNob2ljZXNcclxuXHRcdFx0XHRcdFx0XHRcdC5maWx0ZXIoKGNob2ljZSkgPT4gY2hvaWNlICE9PSBkZXAubGF0ZXN0VmVyc2lvbilcclxuXHRcdFx0XHRcdFx0XHRcdC8vKiBJZiB0aGVyZSBpcyBvbmx5IExhdGVzdCBhbmQgRG9uJ3QgdXBkYXRlIGFzIGNob2ljZXMgcmVtb3ZlIHRoZSBzZXBhcmF0b3JcclxuXHRcdFx0XHRcdFx0XHRcdC5maWx0ZXIoKF8sIGluZGV4LCBhcnJheSkgPT5cclxuXHRcdFx0XHRcdFx0XHRcdFx0YXJyYXkubGVuZ3RoIC0gMSA9PT0gZGVmYXVsdENob2ljZXMubGVuZ3RoICYmXHJcblx0XHRcdFx0XHRcdFx0XHRcdGluZGV4ID49IGRlZmF1bHRDaG9pY2VzLmxlbmd0aCAtIDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ/IGZhbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0OiB0cnVlXHJcblx0XHRcdFx0XHRcdFx0XHQpLFxyXG5cdFx0XHRcdFx0XHRcdHByZWZpeDogZHNDb25zb2xlUHJlZml4LnRyaW0oKVxyXG5cdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0KVxyXG5cdFx0XHQudGhlbihhc3luYyAoYW5zd2VyczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSkgPT4ge1xyXG5cdFx0XHRcdGNvbnN0IHRvVXBkYXRlOiB7XHJcblx0XHRcdFx0XHRtb2R1bGU6IHN0cmluZztcclxuXHRcdFx0XHRcdHZlcnNpb246IHN0cmluZztcclxuXHRcdFx0XHR9W10gPSBbXTtcclxuXHRcdFx0XHRmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhhbnN3ZXJzKSkge1xyXG5cdFx0XHRcdFx0c3dpdGNoICh2KSB7XHJcblx0XHRcdFx0XHRcdGNhc2UgXCJJZ25vcmUgdW50aWwgbmV4dCBNQUpPUlwiOlxyXG5cdFx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IG1vZHVsZSA9IGFQTS5kZXByZWNhdGVkTW9kdWxlcy5maW5kKFxyXG5cdFx0XHRcdFx0XHRcdFx0XHQobSkgPT4gbS5tb2R1bGUgPT09IGtcclxuXHRcdFx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHRcdFx0XHRsb2NrRGF0YVtrXSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dmVyc2lvbjogbW9kdWxlLm5ld2VyTm9uRGVwcmVjYXRlZFZlcnNpb25zLmxlbmd0aFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdD8gbW9kdWxlLm5ld2VyTm9uRGVwcmVjYXRlZFZlcnNpb25zWzBdXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0OiBtb2R1bGUuY3VycmVudFZlcnNpb24sXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlnbm9yZVVudGlsTmV4dDogXCJNQUpPUlwiXHJcblx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0Y2FzZSBcIklnbm9yZSB1bnRpbCBuZXh0IE1JTk9SXCI6XHJcblx0XHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgbW9kdWxlID0gYVBNLmRlcHJlY2F0ZWRNb2R1bGVzLmZpbmQoXHJcblx0XHRcdFx0XHRcdFx0XHRcdChtKSA9PiBtLm1vZHVsZSA9PT0ga1xyXG5cdFx0XHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdFx0XHRcdGxvY2tEYXRhW2tdID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR2ZXJzaW9uOiBtb2R1bGUubmV3ZXJOb25EZXByZWNhdGVkVmVyc2lvbnMubGVuZ3RoXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PyBtb2R1bGUubmV3ZXJOb25EZXByZWNhdGVkVmVyc2lvbnNbMF1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ6IG1vZHVsZS5jdXJyZW50VmVyc2lvbixcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWdub3JlVW50aWxOZXh0OiBcIk1JTk9SXCJcclxuXHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlIFwiSWdub3JlIHVudGlsIG5leHQgUEFUQ0hcIjpcclxuXHRcdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBtb2R1bGUgPSBhUE0uZGVwcmVjYXRlZE1vZHVsZXMuZmluZChcclxuXHRcdFx0XHRcdFx0XHRcdFx0KG0pID0+IG0ubW9kdWxlID09PSBrXHJcblx0XHRcdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0bG9ja0RhdGFba10gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHZlcnNpb246IG1vZHVsZS5uZXdlck5vbkRlcHJlY2F0ZWRWZXJzaW9ucy5sZW5ndGhcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ/IG1vZHVsZS5uZXdlck5vbkRlcHJlY2F0ZWRWZXJzaW9uc1swXVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdDogbW9kdWxlLmN1cnJlbnRWZXJzaW9uLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZ25vcmVVbnRpbE5leHQ6IFwiUEFUQ0hcIlxyXG5cdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgXCJEb24ndCB1cGRhdGUgKElnbm9yZSB0aGlzIHNlc3Npb24pXCI6XHJcblx0XHRcdFx0XHRcdFx0aWdub3JlVGhpc1Nlc3Npb24ucHVzaChrKTtcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0ZGVmYXVsdDoge1xyXG5cdFx0XHRcdFx0XHRcdGlmICh2LmluY2x1ZGVzKFwiTGF0ZXN0XCIpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR0b1VwZGF0ZS5wdXNoKHsgbW9kdWxlOiBrLCB2ZXJzaW9uOiBcImxhdGVzdFwiIH0pO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHR0b1VwZGF0ZS5wdXNoKHsgbW9kdWxlOiBrLCB2ZXJzaW9uOiB2IH0pO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR1cGRhdGVMb2NrKCk7XHJcblx0XHRcdFx0aWYgKHRvVXBkYXRlLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0Y29uc3QgbGVuZ3RoID0gdG9VcGRhdGUubGVuZ3RoLFxyXG5cdFx0XHRcdFx0XHRpZXMgPSBsZW5ndGggPT09IDEgPyBcInlcIiA6IFwiaWVzXCIsXHJcblx0XHRcdFx0XHRcdHNwaW5uZXIgPSBvcmEoe1xyXG5cdFx0XHRcdFx0XHRcdHRleHQ6IGNoYWxrLmhleChcIiM2ZWEyZjVcIikoXHJcblx0XHRcdFx0XHRcdFx0XHRgVXBkYXRpbmcgJHtjaGFsay5ib2xkKGxlbmd0aCl9IGRlcHJlY2F0ZWQgZGVwZWRlbmMke2llc33igKZgXHJcblx0XHRcdFx0XHRcdFx0KSxcclxuXHRcdFx0XHRcdFx0XHQvLyBAdHMtZXhwZWN0LWVycm9yXHJcblx0XHRcdFx0XHRcdFx0Y29sb3I6IFwiYm9sZFwiXHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0Ly8gQHRzLWV4cGVjdC1lcnJvclxyXG5cdFx0XHRcdFx0c3Bpbm5lci5fc3Bpbm5lciA9IHNwaW5uZXJTZXR0aW5ncztcclxuXHRcdFx0XHRcdHNwaW5uZXIuc3RhcnQoKTtcclxuXHRcdFx0XHRcdGF3YWl0IGFQTS51cGdyYWRlTW9kdWxlc1RvVmVyc2lvbnMoXHJcblx0XHRcdFx0XHRcdHRvVXBkYXRlLmZpbHRlcigoaykgPT5cclxuXHRcdFx0XHRcdFx0XHRPYmplY3Qua2V5cyhhUE0ucGtnSnNvbi5kZXBlbmRlbmNpZXMpLmluY2x1ZGVzKGsubW9kdWxlKVxyXG5cdFx0XHRcdFx0XHQpLFxyXG5cdFx0XHRcdFx0XHR0b1VwZGF0ZS5maWx0ZXIoKGspID0+XHJcblx0XHRcdFx0XHRcdFx0T2JqZWN0LmtleXMoYVBNLnBrZ0pzb24uZGV2RGVwZW5kZW5jaWVzKS5pbmNsdWRlcyhrLm1vZHVsZSlcclxuXHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdHNwaW5uZXIuc3VjY2VlZChcclxuXHRcdFx0XHRcdFx0Y2hhbGsuaGV4KFwiIzZlYTJmNVwiKShcclxuXHRcdFx0XHRcdFx0XHRgIFVwZGF0ZWQgJHtjaGFsay5ib2xkKGxlbmd0aCl9IGRlcHJlY2F0ZWQgZGVwZWRlbmMke2llc30hYFxyXG5cdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdFx0LmNhdGNoKChlcnJvcikgPT4ge1xyXG5cdFx0XHRcdGlmIChlcnJvci5pc1R0eUVycm9yKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcclxuXHRcdFx0XHRcdFx0Y2hhbGsucmVkKFxyXG5cdFx0XHRcdFx0XHRcdFwiRVJST1IgfCBQcm9tcHQgY291bGRuJ3QgYmUgcmVuZGVyZWQgaW4gdGhlIGN1cnJlbnQgZW52aXJvbm1lbnQuXCJcclxuXHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXHJcblx0XHRcdFx0XHRcdGNoYWxrLnJlZChcIkVSUk9SIHwgUGxlYXNlIHJlcG9ydCB0aGUgZm9sbG93aW5nIGVycm9yIG9uIEdpdEh1YiFcIilcclxuXHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGlmIChjb25maWcuYXV0b1VwZGF0ZU91dGRhdGVkICYmIGFQTS5vdXRkYXRlZE1vZHVsZXMubGVuZ3RoKSB7XHJcblx0XHRpZiAoY29uZmlnLnNpbGVudCkge1xyXG5cdFx0XHRsZXQgdXBkYXRlZCA9IGZhbHNlO1xyXG5cdFx0XHRhUE0ub3V0ZGF0ZWRNb2R1bGVzLmZvckVhY2goKG1vZHVsZSkgPT4ge1xyXG5cdFx0XHRcdGlmIChsb2NrRGF0YVttb2R1bGUubW9kdWxlXSkge1xyXG5cdFx0XHRcdFx0ZGVsZXRlIGxvY2tEYXRhW21vZHVsZS5tb2R1bGVdO1xyXG5cdFx0XHRcdFx0dXBkYXRlZCA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0aWYgKHVwZGF0ZWQpIHVwZGF0ZUxvY2soKTtcclxuXHRcdFx0YXdhaXQgYVBNLnVwZ3JhZGVBbGxPdXRkYXRlZFRvTGF0ZXN0KCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsZXQgdXBkYXRlZCA9IGZhbHNlO1xyXG5cdFx0XHRhUE0ub3V0ZGF0ZWRNb2R1bGVzLmZvckVhY2goKG1vZHVsZSkgPT4ge1xyXG5cdFx0XHRcdGlmIChsb2NrRGF0YVttb2R1bGUubW9kdWxlXSkge1xyXG5cdFx0XHRcdFx0ZGVsZXRlIGxvY2tEYXRhW21vZHVsZS5tb2R1bGVdO1xyXG5cdFx0XHRcdFx0dXBkYXRlZCA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0aWYgKHVwZGF0ZWQpIHVwZGF0ZUxvY2soKTtcclxuXHRcdFx0Y29uc3QgbGVuZ3RoID0gYVBNLm91dGRhdGVkTW9kdWxlcy5sZW5ndGgsXHJcblx0XHRcdFx0aWVzID0gbGVuZ3RoID09PSAxID8gXCJ5XCIgOiBcImllc1wiLFxyXG5cdFx0XHRcdHNwaW5uZXIgPSBvcmEoe1xyXG5cdFx0XHRcdFx0dGV4dDogY2hhbGsuZ3JlZW4oXHJcblx0XHRcdFx0XHRcdGBVcGRhdGluZyAke2NoYWxrLmJvbGQobGVuZ3RoKX0gb3V0ZGF0ZWQgZGVwZWRlbmMke2llc33igKZgXHJcblx0XHRcdFx0XHQpLFxyXG5cdFx0XHRcdFx0Ly8gQHRzLWV4cGVjdC1lcnJvclxyXG5cdFx0XHRcdFx0Y29sb3I6IFwiYm9sZFwiXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdC8vIEB0cy1leHBlY3QtZXJyb3JcclxuXHRcdFx0c3Bpbm5lci5fc3Bpbm5lciA9IHNwaW5uZXJTZXR0aW5ncztcclxuXHRcdFx0c3Bpbm5lci5zdGFydCgpO1xyXG5cdFx0XHRhd2FpdCBhUE0udXBncmFkZUFsbE91dGRhdGVkVG9MYXRlc3QoKTtcclxuXHRcdFx0c3Bpbm5lci5zdWNjZWVkKFxyXG5cdFx0XHRcdGNoYWxrLmdyZWVuKGAgVXBkYXRlZCAke2NoYWxrLmJvbGQobGVuZ3RoKX0gb3V0ZGF0ZWQgZGVwZWRlbmMke2llc30hYClcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHR9IGVsc2UgaWYgKGNvbmZpZy51cGRhdGVTZWxlY3RvciAmJiBhUE0ub3V0ZGF0ZWRNb2R1bGVzLmxlbmd0aCkge1xyXG5cdFx0YXdhaXQgaW5xdWlyZXJcclxuXHRcdFx0LnByb21wdChcclxuXHRcdFx0XHRhUE0ub3V0ZGF0ZWRNb2R1bGVzXHJcblx0XHRcdFx0XHQvLyogRmlsdGVyIG91dCBvbmVzIHRoYXQgYXJlIGlnbm9yZWQgdGhpcyBzZXNzaW9uLlxyXG5cdFx0XHRcdFx0LmZpbHRlcigoZGVwKSA9PiAhaWdub3JlVGhpc1Nlc3Npb24uaW5jbHVkZXMoZGVwLm1vZHVsZSkpXHJcblx0XHRcdFx0XHQvLyogRmlsdGVyIG91dCB0aGUgb25lcyB0aGF0IGFyZSBpbiBsb2NrZGF0YS4gVW5sZXNzIHRoZWlyIHZlcnNpb24gaXMgaGlnaGVyIHRoYW4gdGhleSBzcGVjaWZpZWQuXHJcblx0XHRcdFx0XHQuZmlsdGVyKChkZXApID0+IHtcclxuXHRcdFx0XHRcdFx0aWYgKE9iamVjdC5rZXlzKGxvY2tEYXRhKS5pbmNsdWRlcyhkZXAubW9kdWxlKSkge1xyXG5cdFx0XHRcdFx0XHRcdGNvbnN0IGlnbm9yZWRGcm9tVmVyc2lvbiA9IGxvY2tEYXRhW2RlcC5tb2R1bGVdLnZlcnNpb24sXHJcblx0XHRcdFx0XHRcdFx0XHRsYXRlc3RWZXJzaW9uID0gZGVwLmxhdGVzdFZlcnNpb247XHJcblx0XHRcdFx0XHRcdFx0c3dpdGNoIChsb2NrRGF0YVtkZXAubW9kdWxlXS5pZ25vcmVVbnRpbE5leHQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGNhc2UgXCJNQUpPUlwiOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb21wYXJlKFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWdub3JlZEZyb21WZXJzaW9uLnNwbGl0KFwiLlwiKVswXSArIFwiLjAuMFwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGF0ZXN0VmVyc2lvbi5zcGxpdChcIi5cIilbMF0gKyBcIi4wLjBcIixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFwiPFwiXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0XHRcdFx0XHQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkZWxldGUgbG9ja0RhdGFbZGVwLm1vZHVsZV07XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dXBkYXRlTG9jaygpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSBcIk1JTk9SXCI6IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvbXBhcmUoXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZ25vcmVkRnJvbVZlcnNpb24uc3BsaXQoXCIuXCIpWzBdICtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XCIuXCIgK1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZ25vcmVkRnJvbVZlcnNpb24uc3BsaXQoXCIuXCIpWzFdICtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XCIuMFwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGF0ZXN0VmVyc2lvbi5zcGxpdChcIi5cIilbMF0gK1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcIi5cIiArXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxhdGVzdFZlcnNpb24uc3BsaXQoXCIuXCIpWzFdICtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XCIuMFwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XCI8XCJcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdFx0XHRcdCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRlbGV0ZSBsb2NrRGF0YVtkZXAubW9kdWxlXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR1cGRhdGVMb2NrKCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0OiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChjb21wYXJlKGlnbm9yZWRGcm9tVmVyc2lvbiwgbGF0ZXN0VmVyc2lvbiwgXCI8XCIpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVsZXRlIGxvY2tEYXRhW2RlcC5tb2R1bGVdO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHVwZGF0ZUxvY2soKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHQubWFwKChkZXApID0+IHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcImxpc3RcIixcclxuXHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBjaGFsay5ncmVlbihcclxuXHRcdFx0XHRcdFx0XHRcdGBQaWNrIHRvIHdoaWNoIHZlcnNpb24geW91IHdhbnQgdG8gdXBkYXRlIHRoZSAke2NoYWxrLmhleChcclxuXHRcdFx0XHRcdFx0XHRcdFx0XCIjNmVhMmY1XCJcclxuXHRcdFx0XHRcdFx0XHRcdCkoXCJvdXRkYXRlZFwiKX0gJHtjaGFsay5oZXgoXCIjZWJjMTRkXCIpKGRlcC5tb2R1bGUpfSBtb2R1bGU6YFxyXG5cdFx0XHRcdFx0XHRcdCksXHJcblx0XHRcdFx0XHRcdFx0bmFtZTogZGVwLm1vZHVsZSxcclxuXHRcdFx0XHRcdFx0XHRjaG9pY2VzOiBkZWZhdWx0Q2hvaWNlc1xyXG5cdFx0XHRcdFx0XHRcdFx0LmNvbmNhdChkZXAubmV3ZXJOb25EZXByZWNhdGVkVmVyc2lvbnMpXHJcblx0XHRcdFx0XHRcdFx0XHQuY29uY2F0KFtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bmV3IGlucXVpcmVyLlNlcGFyYXRvcihcIuKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFwiKVxyXG5cdFx0XHRcdFx0XHRcdFx0XSlcclxuXHRcdFx0XHRcdFx0XHRcdC8vKiBhZGQgdmVyc2lvbiBuYW1lIHRvIHRoZSBMYXRlc3QgY2hvaWNlXHJcblx0XHRcdFx0XHRcdFx0XHQubWFwKChjaG9pY2UpID0+XHJcblx0XHRcdFx0XHRcdFx0XHRcdHR5cGVvZiBjaG9pY2UgPT09IFwic3RyaW5nXCIgJiYgY2hvaWNlID09PSBcIkxhdGVzdFwiXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PyBcIkxhdGVzdCBcIiArXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ICBjaGFsay5oZXgoXCIjYmViZWJlXCIpKGAodiR7ZGVwLmxhdGVzdFZlcnNpb259KWApXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0OiBjaG9pY2VcclxuXHRcdFx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdFx0XHRcdC8vKiBSZW1vdmUgdGhlIGxhdGVzdCB2ZXJzaW9uIG5hbWUgZnJvbSBjaG9pY2VzXHJcblx0XHRcdFx0XHRcdFx0XHQuZmlsdGVyKChjaG9pY2UpID0+IGNob2ljZSAhPT0gZGVwLmxhdGVzdFZlcnNpb24pXHJcblx0XHRcdFx0XHRcdFx0XHQvLyogSWYgdGhlcmUgaXMgb25seSBMYXRlc3QgYW5kIERvbid0IHVwZGF0ZSBhcyBjaG9pY2VzIHJlbW92ZSB0aGUgc2VwYXJhdG9yXHJcblx0XHRcdFx0XHRcdFx0XHQuZmlsdGVyKChfLCBpbmRleCwgYXJyYXkpID0+XHJcblx0XHRcdFx0XHRcdFx0XHRcdGFycmF5Lmxlbmd0aCAtIDEgPT09IGRlZmF1bHRDaG9pY2VzLmxlbmd0aCAmJlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpbmRleCA+PSBkZWZhdWx0Q2hvaWNlcy5sZW5ndGggLSAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PyBmYWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdDogdHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdFx0KSxcclxuXHRcdFx0XHRcdFx0XHRwcmVmaXg6IGRzQ29uc29sZVByZWZpeC50cmltKClcclxuXHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdClcclxuXHRcdFx0LnRoZW4oYXN5bmMgKGFuc3dlcnM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0pID0+IHtcclxuXHRcdFx0XHRjb25zdCB0b1VwZGF0ZToge1xyXG5cdFx0XHRcdFx0bW9kdWxlOiBzdHJpbmc7XHJcblx0XHRcdFx0XHR2ZXJzaW9uOiBzdHJpbmc7XHJcblx0XHRcdFx0fVtdID0gW107XHJcblx0XHRcdFx0Zm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMoYW5zd2VycykpIHtcclxuXHRcdFx0XHRcdHN3aXRjaCAodikge1xyXG5cdFx0XHRcdFx0XHRjYXNlIFwiSWdub3JlIHVudGlsIG5leHQgTUFKT1JcIjpcclxuXHRcdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBtb2R1bGUgPSBhUE0ub3V0ZGF0ZWRNb2R1bGVzLmZpbmQoKG0pID0+IG0ubW9kdWxlID09PSBrKTtcclxuXHRcdFx0XHRcdFx0XHRcdGxvY2tEYXRhW2tdID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR2ZXJzaW9uOiBtb2R1bGUubmV3ZXJOb25EZXByZWNhdGVkVmVyc2lvbnMubGVuZ3RoXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PyBtb2R1bGUubmV3ZXJOb25EZXByZWNhdGVkVmVyc2lvbnNbMF1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ6IG1vZHVsZS5jdXJyZW50VmVyc2lvbixcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWdub3JlVW50aWxOZXh0OiBcIk1BSk9SXCJcclxuXHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlIFwiSWdub3JlIHVudGlsIG5leHQgTUlOT1JcIjpcclxuXHRcdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBtb2R1bGUgPSBhUE0ub3V0ZGF0ZWRNb2R1bGVzLmZpbmQoKG0pID0+IG0ubW9kdWxlID09PSBrKTtcclxuXHRcdFx0XHRcdFx0XHRcdGxvY2tEYXRhW2tdID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR2ZXJzaW9uOiBtb2R1bGUubmV3ZXJOb25EZXByZWNhdGVkVmVyc2lvbnMubGVuZ3RoXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PyBtb2R1bGUubmV3ZXJOb25EZXByZWNhdGVkVmVyc2lvbnNbMF1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ6IG1vZHVsZS5jdXJyZW50VmVyc2lvbixcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWdub3JlVW50aWxOZXh0OiBcIk1JTk9SXCJcclxuXHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlIFwiSWdub3JlIHVudGlsIG5leHQgUEFUQ0hcIjpcclxuXHRcdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBtb2R1bGUgPSBhUE0ub3V0ZGF0ZWRNb2R1bGVzLmZpbmQoKG0pID0+IG0ubW9kdWxlID09PSBrKTtcclxuXHRcdFx0XHRcdFx0XHRcdGxvY2tEYXRhW2tdID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR2ZXJzaW9uOiBtb2R1bGUubmV3ZXJOb25EZXByZWNhdGVkVmVyc2lvbnMubGVuZ3RoXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PyBtb2R1bGUubmV3ZXJOb25EZXByZWNhdGVkVmVyc2lvbnNbMF1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ6IG1vZHVsZS5jdXJyZW50VmVyc2lvbixcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWdub3JlVW50aWxOZXh0OiBcIlBBVENIXCJcclxuXHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlIFwiRG9uJ3QgdXBkYXRlIChJZ25vcmUgdGhpcyBzZXNzaW9uKVwiOlxyXG5cdFx0XHRcdFx0XHRcdGlnbm9yZVRoaXNTZXNzaW9uLnB1c2goayk7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGRlZmF1bHQ6IHtcclxuXHRcdFx0XHRcdFx0XHRpZiAodi5pbmNsdWRlcyhcIkxhdGVzdFwiKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dG9VcGRhdGUucHVzaCh7IG1vZHVsZTogaywgdmVyc2lvbjogXCJsYXRlc3RcIiB9KTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0dG9VcGRhdGUucHVzaCh7IG1vZHVsZTogaywgdmVyc2lvbjogdiB9KTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dXBkYXRlTG9jaygpO1xyXG5cdFx0XHRcdGlmICh0b1VwZGF0ZS5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdGNvbnN0IGxlbmd0aCA9IHRvVXBkYXRlLmxlbmd0aCxcclxuXHRcdFx0XHRcdFx0aWVzID0gbGVuZ3RoID09PSAxID8gXCJ5XCIgOiBcImllc1wiLFxyXG5cdFx0XHRcdFx0XHRzcGlubmVyID0gb3JhKHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBjaGFsay5oZXgoXCIjNmVhMmY1XCIpKFxyXG5cdFx0XHRcdFx0XHRcdFx0YFVwZGF0aW5nICR7Y2hhbGsuYm9sZChsZW5ndGgpfSBvdXRkYXRlZCBkZXBlZGVuYyR7aWVzfeKApmBcclxuXHRcdFx0XHRcdFx0XHQpLFxyXG5cdFx0XHRcdFx0XHRcdC8vIEB0cy1leHBlY3QtZXJyb3JcclxuXHRcdFx0XHRcdFx0XHRjb2xvcjogXCJib2xkXCJcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHQvLyBAdHMtZXhwZWN0LWVycm9yXHJcblx0XHRcdFx0XHRzcGlubmVyLl9zcGlubmVyID0gc3Bpbm5lclNldHRpbmdzO1xyXG5cdFx0XHRcdFx0c3Bpbm5lci5zdGFydCgpO1xyXG5cdFx0XHRcdFx0YXdhaXQgYVBNLnVwZ3JhZGVNb2R1bGVzVG9WZXJzaW9ucyhcclxuXHRcdFx0XHRcdFx0dG9VcGRhdGUuZmlsdGVyKChrKSA9PlxyXG5cdFx0XHRcdFx0XHRcdE9iamVjdC5rZXlzKGFQTS5wa2dKc29uLmRlcGVuZGVuY2llcykuaW5jbHVkZXMoay5tb2R1bGUpXHJcblx0XHRcdFx0XHRcdCksXHJcblx0XHRcdFx0XHRcdHRvVXBkYXRlLmZpbHRlcigoaykgPT5cclxuXHRcdFx0XHRcdFx0XHRPYmplY3Qua2V5cyhhUE0ucGtnSnNvbi5kZXZEZXBlbmRlbmNpZXMpLmluY2x1ZGVzKGsubW9kdWxlKVxyXG5cdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0c3Bpbm5lci5zdWNjZWVkKFxyXG5cdFx0XHRcdFx0XHRjaGFsay5oZXgoXCIjNmVhMmY1XCIpKFxyXG5cdFx0XHRcdFx0XHRcdGAgVXBkYXRlZCAke2NoYWxrLmJvbGQobGVuZ3RoKX0gb3V0ZGF0ZWQgZGVwZWRlbmMke2llc30hYFxyXG5cdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdFx0LmNhdGNoKChlcnJvcikgPT4ge1xyXG5cdFx0XHRcdGlmIChlcnJvci5pc1R0eUVycm9yKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcclxuXHRcdFx0XHRcdFx0Y2hhbGsucmVkKFxyXG5cdFx0XHRcdFx0XHRcdFwiRVJST1IgfCBQcm9tcHQgY291bGRuJ3QgYmUgcmVuZGVyZWQgaW4gdGhlIGN1cnJlbnQgZW52aXJvbm1lbnQuXCJcclxuXHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXHJcblx0XHRcdFx0XHRcdGNoYWxrLnJlZChcIkVSUk9SIHwgUGxlYXNlIHJlcG9ydCB0aGUgZm9sbG93aW5nIGVycm9yIG9uIEdpdEh1YiFcIilcclxuXHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGlmIChjb25maWcuYXV0b0luc3RhbGxEZXAgJiYgYVBNLm1pc3NpbmdNb2R1bGVzLmxlbmd0aCkge1xyXG5cdFx0aWYgKGNvbmZpZy5zaWxlbnQpIHtcclxuXHRcdFx0bGV0IHVwZGF0ZWQgPSBmYWxzZTtcclxuXHRcdFx0YVBNLm1pc3NpbmdNb2R1bGVzLmZvckVhY2goKG1vZHVsZSkgPT4ge1xyXG5cdFx0XHRcdGlmIChsb2NrRGF0YVttb2R1bGVdKSB7XHJcblx0XHRcdFx0XHRkZWxldGUgbG9ja0RhdGFbbW9kdWxlXTtcclxuXHRcdFx0XHRcdHVwZGF0ZWQgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdGlmICh1cGRhdGVkKSB1cGRhdGVMb2NrKCk7XHJcblx0XHRcdGF3YWl0IGFQTS5pbnN0YWxsTWlzc2luZyhjb25maWcuYXV0b0luc3RhbGxUeXBlcyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsZXQgdXBkYXRlZCA9IGZhbHNlO1xyXG5cdFx0XHRhUE0ubWlzc2luZ01vZHVsZXMuZm9yRWFjaCgobW9kdWxlKSA9PiB7XHJcblx0XHRcdFx0aWYgKGxvY2tEYXRhW21vZHVsZV0pIHtcclxuXHRcdFx0XHRcdGRlbGV0ZSBsb2NrRGF0YVttb2R1bGVdO1xyXG5cdFx0XHRcdFx0dXBkYXRlZCA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0aWYgKHVwZGF0ZWQpIHVwZGF0ZUxvY2soKTtcclxuXHRcdFx0Y29uc3QgbGVuZ3RoID0gYVBNLm1pc3NpbmdNb2R1bGVzLmxlbmd0aCxcclxuXHRcdFx0XHRpZXMgPSBsZW5ndGggPT09IDEgPyBcInlcIiA6IFwiaWVzXCIsXHJcblx0XHRcdFx0c3Bpbm5lciA9IG9yYSh7XHJcblx0XHRcdFx0XHR0ZXh0OiBjaGFsay5ncmVlbihcclxuXHRcdFx0XHRcdFx0YEluc3RhbGxpbmcgJHtjaGFsay5ib2xkKGxlbmd0aCl9IG1pc3NpbmcgZGVwZWRlbmMke2llc33igKZgXHJcblx0XHRcdFx0XHQpLFxyXG5cdFx0XHRcdFx0Ly8gQHRzLWV4cGVjdC1lcnJvclxyXG5cdFx0XHRcdFx0Y29sb3I6IFwiYm9sZFwiXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdC8vIEB0cy1leHBlY3QtZXJyb3JcclxuXHRcdFx0c3Bpbm5lci5fc3Bpbm5lciA9IHNwaW5uZXJTZXR0aW5ncztcclxuXHRcdFx0c3Bpbm5lci5zdGFydCgpO1xyXG5cdFx0XHRhd2FpdCBhUE0uaW5zdGFsbE1pc3NpbmcoY29uZmlnLmF1dG9JbnN0YWxsVHlwZXMpO1xyXG5cdFx0XHRzcGlubmVyLnN1Y2NlZWQoXHJcblx0XHRcdFx0Y2hhbGsuZ3JlZW4oYCBJbnN0YWxsZWQgJHtjaGFsay5ib2xkKGxlbmd0aCl9IG1pc3NpbmcgZGVwZWRlbmMke2llc30hYClcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGlmIChjb25maWcuYXV0b1JlbW92ZURlcCAmJiBhUE0udW51c2VkTW9kdWxlcy5sZW5ndGgpIHtcclxuXHRcdGlmIChjb25maWcuc2lsZW50KSB7XHJcblx0XHRcdGxldCB1cGRhdGVkID0gZmFsc2U7XHJcblx0XHRcdGFQTS51bnVzZWRNb2R1bGVzLmZvckVhY2goKG1vZHVsZSkgPT4ge1xyXG5cdFx0XHRcdGlmIChsb2NrRGF0YVttb2R1bGVdKSB7XHJcblx0XHRcdFx0XHRkZWxldGUgbG9ja0RhdGFbbW9kdWxlXTtcclxuXHRcdFx0XHRcdHVwZGF0ZWQgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdGlmICh1cGRhdGVkKSB1cGRhdGVMb2NrKCk7XHJcblx0XHRcdGF3YWl0IGFQTS51bmluc3RhbGxVbnVzZWQoY29uZmlnLmF1dG9SZW1vdmVUeXBlcyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsZXQgdXBkYXRlZCA9IGZhbHNlO1xyXG5cdFx0XHRhUE0udW51c2VkTW9kdWxlcy5mb3JFYWNoKChtb2R1bGUpID0+IHtcclxuXHRcdFx0XHRpZiAobG9ja0RhdGFbbW9kdWxlXSkge1xyXG5cdFx0XHRcdFx0ZGVsZXRlIGxvY2tEYXRhW21vZHVsZV07XHJcblx0XHRcdFx0XHR1cGRhdGVkID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRpZiAodXBkYXRlZCkgdXBkYXRlTG9jaygpO1xyXG5cdFx0XHRjb25zdCBsZW5ndGggPSBhUE0udW51c2VkTW9kdWxlcy5sZW5ndGgsXHJcblx0XHRcdFx0aWVzID0gbGVuZ3RoID09PSAxID8gXCJ5XCIgOiBcImllc1wiLFxyXG5cdFx0XHRcdHNwaW5uZXIgPSBvcmEoe1xyXG5cdFx0XHRcdFx0dGV4dDogY2hhbGsucmVkKFxyXG5cdFx0XHRcdFx0XHRjaGFsay5ib2xkKFxyXG5cdFx0XHRcdFx0XHRcdGBSZW1vdmluZyAke2NoYWxrLnJlc2V0KGNoYWxrLnJlZChsZW5ndGgpKX0gJHtjaGFsay5yZWQoXHJcblx0XHRcdFx0XHRcdFx0XHRjaGFsay5ib2xkKGB1bnVzZWQgZGVwZWRlbmMke2llc33igKZgKVxyXG5cdFx0XHRcdFx0XHRcdCl9YFxyXG5cdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHQpLFxyXG5cdFx0XHRcdFx0Ly8gQHRzLWV4cGVjdC1lcnJvclxyXG5cdFx0XHRcdFx0Y29sb3I6IFwiYm9sZFwiXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdC8vIEB0cy1leHBlY3QtZXJyb3JcclxuXHRcdFx0c3Bpbm5lci5fc3Bpbm5lciA9IHNwaW5uZXJTZXR0aW5ncztcclxuXHRcdFx0c3Bpbm5lci5zdGFydCgpO1xyXG5cdFx0XHRhd2FpdCBhUE0udW5pbnN0YWxsVW51c2VkKGNvbmZpZy5hdXRvUmVtb3ZlVHlwZXMpO1xyXG5cdFx0XHRzcGlubmVyLnN1Y2NlZWQoXHJcblx0XHRcdFx0Y2hhbGsucmVkKFxyXG5cdFx0XHRcdFx0Y2hhbGsuYm9sZChcclxuXHRcdFx0XHRcdFx0YCBSZW1vdmVkICR7Y2hhbGsucmVzZXQoY2hhbGsucmVkKGxlbmd0aCkpfSAke2NoYWxrLnJlZChcclxuXHRcdFx0XHRcdFx0XHRjaGFsay5ib2xkKGB1bnVzZWQgZGVwZWRlbmMke2llc30hYClcclxuXHRcdFx0XHRcdFx0KX1gXHJcblx0XHRcdFx0XHQpXHJcblx0XHRcdFx0KVxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aWYgKGFQTS5jaGFuZ2VkTW9kdWxlcy5sZW5ndGggJiYgIWNvbmZpZy5zaWxlbnQpIHtcclxuXHRcdGNvbnN0IGluc3RhbGxlZCA9IGFQTS5jaGFuZ2VkTW9kdWxlcy5maWx0ZXIoKG0pID0+IG0udHlwZSA9PT0gXCJJTlNUQUxMRURcIiksXHJcblx0XHRcdHVwZGF0ZWQgPSBhUE0uY2hhbmdlZE1vZHVsZXMuZmlsdGVyKChtKSA9PiBtLnR5cGUgPT09IFwiVVBEQVRFRFwiKSxcclxuXHRcdFx0cmVtb3ZlZCA9IGFQTS5jaGFuZ2VkTW9kdWxlcy5maWx0ZXIoKG0pID0+IG0udHlwZSA9PT0gXCJSRU1PVkVEXCIpLFxyXG5cdFx0XHR0cmVlID0gbmV3IERpc3BsYXlBc1RyZWUoXHJcblx0XHRcdFx0Y2hhbGsuaGV4KFwiIzE3RTM1RVwiKShcIlN1bW1hcnkgb2YgZGVwZW5kZW5jeSBjaGFuZ2Vz4oCmXCIpXHJcblx0XHRcdCk7XHJcblxyXG5cdFx0aWYgKGluc3RhbGxlZC5sZW5ndGgpIHtcclxuXHRcdFx0Y29uc3Qgc3RyaW5nQXJyYXkgPSBpbnN0YWxsZWQubWFwKFxyXG5cdFx0XHRcdChtKSA9PlxyXG5cdFx0XHRcdFx0YCR7Y2hhbGsuaGV4KFwiI2ViYzE0ZFwiKShtLm1vZHVsZSl9IOKAoiAke1xyXG5cdFx0XHRcdFx0XHRjaGFsay5oZXgoXCIjYmViZWJlXCIpKFwiVmVyc2lvbjogXCIpICtcclxuXHRcdFx0XHRcdFx0Y2hhbGsuZ3JlZW4oY2hhbGsuYm9sZChtLnZlcnNpb24ucmVwbGFjZShcIl5cIiwgXCJcIikpKVxyXG5cdFx0XHRcdFx0fSR7bS5kZXZEZXBlbmRlbmN5ID8gXCIgfCBcIiArIGNoYWxrLmN5YW4oXCJkZXZEZXBlbmRlbmN5XCIpIDogXCJcIn1gXHJcblx0XHRcdCk7XHJcblx0XHRcdG91dGxpbmUoc3RyaW5nQXJyYXksIFwi4oCiXCIpO1xyXG5cdFx0XHRvdXRsaW5lKHN0cmluZ0FycmF5LCBcInxcIik7XHJcblx0XHRcdHRyZWUuYWRkU2VjdGlvbihbXHJcblx0XHRcdFx0bmV3IFRyZWVTZWN0aW9uKGNoYWxrLmdyZWVuKFwiSW5zdGFsbGVkXCIpKS5hZGRTZWN0aW9uKFxyXG5cdFx0XHRcdFx0c3RyaW5nQXJyYXkubWFwKChtKSA9PiBtLnJlcGxhY2UoXCJ8XCIsIFwi4oCiXCIpKVxyXG5cdFx0XHRcdClcclxuXHRcdFx0XSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHVwZGF0ZWQubGVuZ3RoKSB7XHJcblx0XHRcdGNvbnN0IHN0cmluZ0FycmF5ID0gdXBkYXRlZC5tYXAoXHJcblx0XHRcdFx0KG0pID0+XHJcblx0XHRcdFx0XHRgJHtjaGFsay5oZXgoXCIjZWJjMTRkXCIpKG0ubW9kdWxlKX0g4oCiICR7Y2hhbGsuaGV4KFwiI2JlYmViZVwiKShcclxuXHRcdFx0XHRcdFx0XCJmcm9tOiBcIiArXHJcblx0XHRcdFx0XHRcdFx0Y2hhbGsuZ3JlZW4oY2hhbGsuYm9sZChtLmZyb21WZXJzaW9uLnJlcGxhY2UoXCJeXCIsIFwiXCIpKSkgK1xyXG5cdFx0XHRcdFx0XHRcdFwiISB0bzogXCIgK1xyXG5cdFx0XHRcdFx0XHRcdGNoYWxrLmdyZWVuKGNoYWxrLmJvbGQobS52ZXJzaW9uLnJlcGxhY2UoXCJeXCIsIFwiXCIpKSlcclxuXHRcdFx0XHRcdCl9JHttLmRldkRlcGVuZGVuY3kgPyBcIiB8IFwiICsgY2hhbGsuY3lhbihcImRldkRlcGVuZGVuY3lcIikgOiBcIlwifWBcclxuXHRcdFx0KTtcclxuXHRcdFx0b3V0bGluZShzdHJpbmdBcnJheSwgXCLigKJcIik7XHJcblx0XHRcdG91dGxpbmUoc3RyaW5nQXJyYXksIFwiIVwiKTtcclxuXHRcdFx0b3V0bGluZShzdHJpbmdBcnJheSwgXCJ8XCIpO1xyXG5cdFx0XHR0cmVlLmFkZFNlY3Rpb24oW1xyXG5cdFx0XHRcdG5ldyBUcmVlU2VjdGlvbihjaGFsay5oZXgoXCIjNmVhMmY1XCIpKFwiVXBkYXRlZFwiKSkuYWRkU2VjdGlvbihcclxuXHRcdFx0XHRcdHN0cmluZ0FycmF5Lm1hcCgobSkgPT4gbS5yZXBsYWNlKFwiIVwiLCBcIlwiKS5yZXBsYWNlKFwifFwiLCBcIuKAolwiKSlcclxuXHRcdFx0XHQpXHJcblx0XHRcdF0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChyZW1vdmVkLmxlbmd0aCkge1xyXG5cdFx0XHRjb25zdCBzdHJpbmdBcnJheSA9IHJlbW92ZWQubWFwKFxyXG5cdFx0XHRcdChtKSA9PlxyXG5cdFx0XHRcdFx0YCR7Y2hhbGsuaGV4KFwiI2ViYzE0ZFwiKShtLm1vZHVsZSl9IOKAoiAke1xyXG5cdFx0XHRcdFx0XHRjaGFsay5oZXgoXCIjYmViZWJlXCIpKFwiVmVyc2lvbjogXCIpICtcclxuXHRcdFx0XHRcdFx0Y2hhbGsuZ3JlZW4oY2hhbGsuYm9sZChtLnZlcnNpb24ucmVwbGFjZShcIl5cIiwgXCJcIikpKVxyXG5cdFx0XHRcdFx0fSR7bS5kZXZEZXBlbmRlbmN5ID8gXCIgfCBcIiArIGNoYWxrLmN5YW4oXCJkZXZEZXBlbmRlbmN5XCIpIDogXCJcIn1gXHJcblx0XHRcdCk7XHJcblx0XHRcdG91dGxpbmUoc3RyaW5nQXJyYXksIFwi4oCiXCIpO1xyXG5cdFx0XHRvdXRsaW5lKHN0cmluZ0FycmF5LCBcInxcIik7XHJcblx0XHRcdHRyZWUuYWRkU2VjdGlvbihbXHJcblx0XHRcdFx0bmV3IFRyZWVTZWN0aW9uKGNoYWxrLnJlZChcIlJlbW92ZWRcIikpLmFkZFNlY3Rpb24oXHJcblx0XHRcdFx0XHRzdHJpbmdBcnJheS5tYXAoKG0pID0+IG0ucmVwbGFjZShcInxcIiwgXCLigKJcIikpXHJcblx0XHRcdFx0KVxyXG5cdFx0XHRdKTtcclxuXHRcdH1cclxuXHJcblx0XHR0cmVlLmxvZygpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIGFQTS5jaGFuZ2VkTW9kdWxlcy5sZW5ndGggPiAwO1xyXG59XHJcbiJdfQ==