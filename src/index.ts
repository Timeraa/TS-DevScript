#!/usr/bin/env node

import { existsSync, readFile, readFileSync } from "fs";
import * as ts from "typescript";
import chalk from "chalk";
import { ChildProcess, fork } from "child_process";
import glob from "fast-glob";
import { removeSync, copySync } from "fs-extra";
import { extname } from "path";

let config = {
    srcDir: "src",
    outDir: "dist",
    deleteObsolete: true,
    tsconfig: "tsconfig.json",
    file: "dist/index.js"
  },
  child: ChildProcess = null,
  copyTask: Promise<any>;

if (existsSync(`${process.cwd()}/.devScript.json`)) {
  try {
    config = JSON.parse(
      readFileSync(`${process.cwd()}/.devScript.json`, "utf-8")
    );
  } catch (e) {
    console.error("Invalid Syntax:", e.message);
    process.exit();
  }
}

if (!config.srcDir) config.srcDir = "src";
if (!config.outDir) config.outDir = "dist";
if (!config.deleteObsolete) config.deleteObsolete = true;
if (!config.tsconfig) config.tsconfig = "tsconfig.json";
if (!config.file) config.file = "index.js";

const formatHost: ts.FormatDiagnosticsHost = {
  getCanonicalFileName: path => path,
  getCurrentDirectory: ts.sys.getCurrentDirectory,
  getNewLine: () => ts.sys.newLine
};

//* Create ts program
const createProgram = ts.createSemanticDiagnosticsBuilderProgram;

//* Create Watch compoile host
const host = ts.createWatchCompilerHost(
  `${process.cwd()}/${config.tsconfig}`,
  {},
  ts.sys,
  createProgram,
  reportDiagnostic,
  fileChange
);

function reportDiagnostic(diagnostic: ts.Diagnostic) {
  console.log(chalk.redBright(ts.formatDiagnostic(diagnostic, formatHost)));
}

ts.createWatchProgram(host);

async function fileChange(diagnostic: ts.Diagnostic) {
  if ([6031, 6032].includes(diagnostic.code)) {
    console.log(chalk.blue(diagnostic.messageText.toString()));
    copyTask = copyFiles();
  } else if ([6194].includes(diagnostic.code)) {
    console.log(chalk.green(diagnostic.messageText.toString()));

    //* Kill old child
    //* Spawn new child
    if (child && !child.killed) child.kill("SIGINT");

    await copyTask;
    if (config.file) child = fork(process.cwd() + "/" + config.file);
  } else console.log(chalk.yellow(diagnostic.messageText.toString()));
}

async function copyFiles() {
  if (config.deleteObsolete) await deleteObsolete();

  //* Copy files from src to dist
  copySync("src", "dist", {
    filter: function(path) {
      if (path.includes("/node_modules")) return false;
      return extname(path) !== ".ts";
    }
  });
}

async function deleteObsolete() {
  //* Select files
  let dist = await glob(config.outDir + "/**/*", {
      onlyFiles: true
    }),
    src = await glob(config.srcDir + "/**/*", {
      onlyFiles: true
    });

  //* Filter file differences
  let nDist = dist.map(f => [f.replace(config.outDir, ""), f]);
  src = src
    .map(f => f.replace(config.srcDir, "").split(".")[0])
    .filter(sf => nDist.find(d => d[0].split(".")[0] == sf));

  //* Old files, delete
  Promise.all(
    dist
      .filter(f => !src.includes(f.replace(config.outDir, "").split(".")[0]))
      .map(f => removeSync(f))
  );
}
