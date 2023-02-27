#!/usr/bin/env node
const package = require("./package.json");
const program = require("commander");
const init = require("./bin/init");

program.version(package.version, "-v, --version").description("描述。。。。。");
// .option("-f, --foo <foo>", "enable some foo")
// .option("-b, --bar", "enable some bar")
// .option("-B, --baz", "enable some baz")

// 初始化子应用模板
program.command("init").action(async (options) => {
  init(options);
});

program.command("test <testString>").action(async (testString, options) => {
  console.log("testString---", testString);
});

program.parseAsync(process.argv);
