import { exec, execSync } from "child_process";
import path from "path";

import fs from "fs";
import fse from "fs-extra";

// 下载仓库到指定目录
export const gitClone = async (gitUrl, packageJsonConfig, options = {}) => {
  const { name } = packageJsonConfig;

  if (!gitUrl) {
    throw new Error("gitUrl cannot be empty");
  }

  // 判断是否已经有同名文件夹
  if (fs.existsSync(name)) {
    throw new Error(`current dir already exists ${name} folder`);
  }

  console.log(`正在下载模板---------到 ${name}/`);

  exec(`git clone ${gitUrl} ${name}`, (err, stdout, stderr) => {
    if (err) console.log("err", err);

    // 删除.git 文件
    fse.remove(`${name}/.git`);

    const packageJson = JSON.parse(fs.readFileSync(`${name}/package.json`));
    const manifestJson = JSON.parse(fs.readFileSync(`${name}/manifest.json`));

    const newPackageJson = {
      ...packageJson,
      ...packageJsonConfig,
    };

    const newManifestJson = {
      ...manifestJson,
      name: name,
    };

    fs.writeFileSync(
      `${name}/package.json`,
      JSON.stringify(newPackageJson, null, 2),
    );

    fs.writeFileSync(
      `${name}/manifest.json`,
      JSON.stringify(newManifestJson, null, 2),
    );

    console.log("模板下载完成-----------");
  });
};

/**
 * Node.js 实现 Git 克隆指定目录（稀疏检出）
 * @param {Object} options 配置项
 * @param {string} options.repoUrl Git 仓库地址（HTTPS/SSH 均可）
 * @param {string} options.targetDir 本地目标目录（最终文件输出路径）
 * @param {string[]} options.includeDirs 需要克隆的目录列表（如 ['src/utils/', 'docs/']）
 * @param {string} [options.branch='main'] 目标分支
 * @param {boolean} [options.shallow=true] 是否浅克隆（仅拉取最新提交，减少下载量）
 * @returns {void}
 */
function gitClonePartialDir(options) {
  const {
    repoUrl,
    targetDir,
    includeDirs,
    branch = "main",
    shallow = true,
  } = options;

  // 校验必填参数
  if (!repoUrl || !targetDir || !includeDirs || includeDirs.length === 0) {
    throw new Error("参数错误：repoUrl、targetDir、includeDirs 为必填项");
  }

  // 标准化路径
  const absTargetDir = path.resolve(targetDir);
  const tempRepoDir = path.join(absTargetDir, ".temp-git"); // 临时存储 Git 元数据

  try {
    console.log(`[1/6] 初始化临时目录：${tempRepoDir}`);
    // 如果临时目录已存在，先删除
    if (fs.existsSync(tempRepoDir)) {
      fs.rmSync(tempRepoDir, { recursive: true, force: true });
    }
    // 创建目录（递归创建父目录）
    fs.mkdirSync(tempRepoDir, { recursive: true });

    // 1. 克隆仓库元数据（不检出文件）
    console.log(`[2/6] 拉取仓库元数据：${repoUrl} (分支：${branch})`);
    let cloneCmd = `git clone --no-checkout ${repoUrl} ${tempRepoDir}`;
    // 浅克隆：仅拉取最新 1 次提交
    if (shallow) {
      cloneCmd += " --depth 1";
    }
    // 执行命令（静默模式，减少冗余输出）
    execSync(cloneCmd, { stdio: "pipe" });

    // 2. 进入临时仓库目录，启用稀疏检出
    console.log(`[3/6] 启用稀疏检出模式`);
    execSync(`git config core.sparseCheckout true`, {
      cwd: tempRepoDir,
      stdio: "pipe",
    });

    // 3. 写入需要检出的目录规则
    console.log(`[4/6] 配置需要克隆的目录：${includeDirs.join(", ")}`);
    const sparseCheckoutPath = path.join(
      tempRepoDir,
      ".git",
      "info",
      "sparse-checkout",
    );
    // 覆盖写入规则（目录末尾加 / 确保匹配目录）
    fs.writeFileSync(
      sparseCheckoutPath,
      includeDirs
        .map((dir) => (dir.endsWith("/") ? dir : `${dir}/`))
        .join("\n"),
      "utf8",
    );

    // 4. 检出指定目录文件
    console.log(`[5/6] 检出指定目录文件`);
    execSync(`git checkout ${branch}`, {
      cwd: tempRepoDir,
      stdio: "pipe",
    });

    // 5. 复制指定目录到目标目录
    console.log(`[6/6] 复制文件到目标目录：${absTargetDir}`);
    includeDirs.forEach((dir) => {
      const srcDir = path.join(tempRepoDir, dir);
      if (fs.existsSync(srcDir)) {
        // 递归复制目录（覆盖已有文件）
        copyDir(srcDir, path.join(absTargetDir, dir));
      } else {
        console.warn(`警告：目录 ${dir} 在仓库中不存在`);
      }
    });

    // 清理临时 Git 目录
    fs.rmSync(tempRepoDir, { recursive: true, force: true });
    console.log(`✅ 克隆完成！文件已输出到：${absTargetDir}`);
  } catch (err) {
    // 异常时清理临时目录
    if (fs.existsSync(tempRepoDir)) {
      fs.rmSync(tempRepoDir, { recursive: true, force: true });
    }
    throw new Error(`克隆失败：${err.message}`);
  }
}

export { gitClonePartialDir };

/**
 * 递归复制目录（Node.js 原生 fs 无复制目录方法，需自定义）
 * @param {string} src 源目录
 * @param {string} dest 目标目录
 */
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const files = fs.readdirSync(src);
  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stat = fs.statSync(srcPath);
    if (stat.isFile()) {
      fs.copyFileSync(srcPath, destPath); // 复制文件
    } else if (stat.isDirectory()) {
      copyDir(srcPath, destPath); // 递归复制子目录
    }
  }
}
