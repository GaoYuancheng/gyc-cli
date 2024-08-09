import inquirer from "inquirer";
import path from "path";
import { fileURLToPath } from "url";
import fse from "fs-extra";

// 当前文件地址
const dirname = fileURLToPath(import.meta.url);

const templateList = [
  {
    templateName: "测试页面",
    dirPath: "./template/testPage",
  },
  {
    templateName: "增删改查页面",
    dirPath: "./template/curdPage",
  },
];

const g = async (options) => {
  console.log("g", options);

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

  // 模板名
  const templateDirName = dirPath.split("/").pop();

  // 目标路径
  const targetPath = path.resolve(
    process.env.pwd,
    "./src/pages",
    templateDirName
  );

  if (fse.existsSync(targetPath)) {
    console.log(`目标文件夹 ${templateDirName} 已存在, 请先删除`);
    return;
  }
  const currentPath = path.resolve(dirname, "../", dirPath);

  console.log(`成功生成 ${targetPath} !`);
  try {
    fse.copy(currentPath, targetPath);
  } catch (err) {
    console.log("err", err);
  }
};

export default g;
