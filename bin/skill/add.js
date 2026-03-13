#!/usr/bin/env node

import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { gitClonePartialDir } from "../../utils/gitClone.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const skillNameUrlMap = {
  pptx: {
    gitUrl: "https://github.com/anthropics/skills.git",
    dir: "skills/pptx",
  },
  pdf: {
    gitUrl: "https://github.com/anthropics/skills.git",
    dir: "skills/pdf",
  },
};

/**
 * 添加技能模板
 * @param {Object} options - 命令选项
 * @param {string} skillName - 技能名称
 * @param {string} editorName - 编辑器名称
 * @param {string} addType - 添加类型 (global/local)
 */
const add = async (skillName, editorName, addType, options) => {
  try {
    // 从 skillNameUrlMap 中获取技能名称选项
    const skillOptions = Object.keys(skillNameUrlMap);

    // 如果没有提供 skillName，提示用户选择
    let selectedSkillName = skillName;
    if (!selectedSkillName) {
      const { skill } = await inquirer.prompt([
        {
          type: "list",
          name: "skill",
          message: "请选择技能",
          choices: skillOptions,
        },
      ]);
      selectedSkillName = skill;
    }

    // 检查技能是否存在于 skillNameUrlMap 中
    if (!skillNameUrlMap[selectedSkillName]) {
      console.log(`❌ 技能 "${selectedSkillName}" 不存在`);
      return;
    }

    // 获取技能的 GitHub 链接
    const { gitUrl, dir } = skillNameUrlMap[selectedSkillName];

    // 如果没有提供 editorName，提示用户选择
    let selectedEditorName = editorName;
    if (!selectedEditorName) {
      const { editor } = await inquirer.prompt([
        {
          type: "list",
          name: "editor",
          message: "请选择编辑器",
          choices: ["cursor", "trae"],
        },
      ]);
      selectedEditorName = editor;
    }

    // 如果没有提供 addType，提示用户选择
    let selectedAddType = addType;
    if (!selectedAddType) {
      const { type } = await inquirer.prompt([
        {
          type: "list",
          name: "type",
          message: "请选择添加类型",
          choices: ["global", "local"],
        },
      ]);
      selectedAddType = type;
    }

    // 确定目标目录
    let targetDir;
    // 使用项目根目录作为基准目录
    const projectRoot = process.env.pwd || process.env.PWD;
    if (selectedAddType === "local") {
      targetDir = path.resolve(projectRoot, `.${selectedEditorName}`);
    } else {
      // global 类型的处理，这里简化处理，实际可能需要根据不同编辑器的全局目录来确定
      targetDir = path.resolve(projectRoot, `.${selectedEditorName}`);
    }

    // 确保目标目录存在
    await fs.ensureDir(targetDir);

    try {
      gitClonePartialDir({
        repoUrl: gitUrl,
        targetDir,
        includeDirs: [dir],
        branch: "main",
        shallow: true,
      });

      // 移动技能目录到正确的位置
      const sourceSkillPath = path.join(targetDir, dir);
      const destSkillPath = path.join(targetDir, selectedSkillName);

      if (await fs.pathExists(sourceSkillPath)) {
        // 如果目标目录已存在，先删除
        if (await fs.pathExists(destSkillPath)) {
          await fs.remove(destSkillPath);
        }

        // 移动目录
        await fs.rename(sourceSkillPath, destSkillPath);

        // 清理空的 skills 目录
        const skillsDir = path.join(targetDir, "skills");
        if (
          (await fs.pathExists(skillsDir)) &&
          (await fs.readdir(skillsDir)).length === 0
        ) {
          await fs.remove(skillsDir);
        }

        console.log(
          `🎉 技能 "${selectedSkillName}" 已成功添加到 ${targetDir} 目录`,
        );
      } else {
        console.log(`❌ 技能 "${selectedSkillName}" 在仓库中不存在`);
      }
    } catch (error) {
      console.error("❌ 克隆技能失败:", error.message);
    }
  } catch (error) {
    console.error("❌ 添加技能失败:", error.message);
  }
};

export default add;
