#!/usr/bin/env node
// https://github.com/shelljs/shelljs

import inquirer from "inquirer";
import { gitClone } from "../../utils/gitClone.js";

const gitReposList = [
  {
    templateName: "chrome-extension-template",
    gitUrl: "https://github.com/GaoYuancheng/chrome-extension-template.git",
  },
];

const init = async (options) => {
  // const { useDefault } = options;

  // if (useDefault) {
  //   console.log("使用默认配置生成模板");
  //   // TODO: 使用默认配置
  //   gitClone({ projectName, author: "" });

  //   return;
  // }

  const { templateName, ...packageJsonConfig } = await inquirer.prompt([
    {
      type: "list",
      name: "templateName",
      message: "请选择模板",
      choices: gitReposList.map((item) => item.templateName),
    },

    {
      type: "input",
      name: "name",
      message: "请输入项目名称",
      validate: (value) => {
        // 不能为空
        return !!value;
      },
    },
    {
      type: "input",
      name: "author",
      message: "请输入作者名称",
    },
  ]);

  const gitUrl = gitReposList.find(
    (item) => templateName === item.templateName
  )?.gitUrl;
  console.log("gitUrl", gitUrl);
  gitClone(gitUrl, packageJsonConfig);
};

// const options = program.opts();
// if(options.foo){
//   console.log('foo',options)
// }

export default init;
