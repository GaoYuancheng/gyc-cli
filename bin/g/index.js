import inquirer from "inquirer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import fse from "fs-extra";

const destDirName = "demoPage";

// 当前文件地址
const dirname = fileURLToPath(import.meta.url);

const templateList = [
  {
    templateName: "测试页面",
    dirPath: "./template/testPage",
  },
  {
    templateName: "增删改查页面",
    dirPath: "./template/crudPage",
  },
];

const g = async (options) => {
  console.log("g", options);
  const targetPath = path.resolve(process.env.pwd, "./src/pages", destDirName);

  if (fse.existsSync(targetPath)) {
    console.log(`目标文件夹 ${destDirName} 已存在, 请先删除`);
    return;
  }

  const { templateName } = await inquirer.prompt([
    {
      type: "list",
      name: "templateName",
      message: "请选择模板",
      choices: templateList.map((item) => item.templateName),
    },
  ]);

  const dirPath = templateList.find(
    (item) => item.templateName === templateName
  ).dirPath;

  const currentPath = path.resolve(dirname, "../", dirPath);

  console.log(currentPath, targetPath);
  try {
    fse.copy(currentPath, targetPath);
  } catch (err) {
    console.log("err", err);
  }
};

export default g;
