# DevScript

Simple **TypeScript** script I use in all of my project.

## Why

I wrote this script to simplify my TypeScript workflow as I like to have all my files organised and hate having multiple terminals open at the same time. This script copies and compiles everything in `srcDir` to `outDir` and then runs and automatically restarts the set `file`.

## Installation

```bash
# Yarn
$ npm i Timeraa/DevScript

# NPM
$ yarn add Timeraa/DevScript
```

## Usage

```bash
$ devScript
```

## Configuration

Put a `.devScript.json` file in the root of your project and add the options you want to change:

| Options        | Type      | Description                                         | Default         |
| -------------- | --------- | --------------------------------------------------- | --------------- |
| srcDir         | `string`  | Source directory                                    | `src`           |
| outDir         | `string`  | Output directory                                    | `dist`          |
| deleteObsolete | `boolean` | Delete files not included in `srcDir` from `outDir` | `true`          |
| file           | `string`  | File to run                                         | `index.js`      |
| tsconfig       | `string`  | Path to `.tsconfig.json`                            | `tsconfig.json` |
