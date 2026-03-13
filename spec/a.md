实现添加技能模板的功能

1. 新增skill add命令
2. 命令格式：`gyc skill add <skillName> <editorName> <addType>`
3. 功能：根据用户输入的技能名称，从skills目录下获取对应目录。
4. skillName 可选择可输入 选项是从 skills 目录下获取的文件夹名，editorName可选择可输入 默认选项为 cursor trae，addType 可选择 值为 global local
5. 提示用户输入 skillName 后，根据名称从skills目录下获取对应文件夹。
6. 如果 addType 是 local 就把内容加到 .{editorName}/ 下
7. 提示操作成功

修改方法
skillName 的选项是从 skillNameUrlMap 中获取到的
在复制skill 时根据 skillName 去 skillNameUrlMap 获取到对应的链接，获取到链接后，从链接中获取到目录下的所有文件，复制到对应的目录下。

比如我选择 pptx 就会复制 [pptx](https://github.com/anthropics/skills/tree/main/skills/pptx) 目录下的所有文件到对应的目录下
