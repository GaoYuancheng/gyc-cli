const fs = require("fs");
const { exec } = require("child_process");
var shell = require("shelljs");

// 下载仓库到指定目录
const gitClone = async (gitUrl, packageJsonConfig, options = {}) => {
  const { name } = packageJsonConfig;

  if(!gitUrl){
    throw new Error('gitUrl cannot be empty')
  }

  // 判断是否已经有同名文件夹
  if (fs.existsSync(name)) {
    throw new Error(`current dir already exists ${name} folder`);
  }

  console.log(`正在下载模板---------到 ${name}/`);

  exec(`git clone ${gitUrl} ${name}`, (err, stdout, stderr) => {
    if (err) console.log("err", err);

    // 删除.git 文件
    shell.rm("-rf", `${name}/.git`);

    const packageJson = JSON.parse(fs.readFileSync(`${name}/package.json`));

    const newPackageJson = {
      ...packageJson,
      ...packageJsonConfig,
    };

    fs.writeFileSync(
      `${name}/package.json`,
      JSON.stringify(newPackageJson, null, 2)
    );

    console.log("模板下载完成-----------");
  });
};

module.exports = gitClone;
