#!/usr/bin/env node
// import packageJson from "./package.json" assert { type: "json" };
import program from "commander";
import fs from "fs";
import path from "path";
import init from "./bin/init/index.js";
import g from "./bin/g/index.js";
import { fileURLToPath } from "url";

// 当前文件地址
const dirname = fileURLToPath(import.meta.url);

const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(dirname, "../package.json"), {
    encoding: "utf-8",
  })
);

program.version(packageJson.version, "-v,--version");

// 初始化子应用模板
program.command("init").action(async (options) => {
  init(options);
});

// 生成模板页面组件
program.command("g").action(async (options) => {
  g(options);
});

// 测试
program.command("test <testString>").action(async (testString, options) => {
  console.log("testString---", testString);
});

program.parseAsync(process.argv);
