---
sidebar_position: 5
---
# 项目规范
:::tip 
前端 Lint 是一个重要的工程化环节，它通过静态分析代码来发现错误并纠正它们，同时规范编码习惯，使团队的代码风格保持统一。
:::

项目内集成了以下几种代码校验方式

+ eslint 用于校验代码格式规范
+ prettier 代码格式化
+ stylelint 用于校验 css/less 规范
+ commitlint 用于校验 git 提交信息规范

## ESLint
用于规范并校验 ECMAScript/JavaScript code 的编写。

其配置文件为
+ .eslintrc.cjs
+ .eslintignore

## prettier
用于统一代码排版格式

其配置文件为
+ .prettierrc
+ .prettierignore

## stylelint
用于规范并校验 CSS/SCSS/LESS code 的编写

其配置文件为
+ .stylelintrc
+ .stylelintignore

## commitlint
负责校验 commit msg 是否符合规范

```js
export default {
  // 继承的规则
  extends: ['@commitlint/config-conventional'],
  // 定义规则类型
  rules: {
    'body-leading-blank': [2, 'always'], // 确保提交消息正文之前有一行空白行
    'type-empty': [2, 'never'], // 不允许提交消息的 type 类型为空
    'subject-case': [0], // subject 大小写不做校验
    // type 类型定义，表示 git 提交的 type 必须在以下类型范围内
    'type-enum': [
      2,
      'always',
      // highlight-start
      [
        'feat', // 新功能 feature
        'fix', // 修复 bug
        'docs', // 文档注释
        'style', // 代码格式(不影响代码运行的变动)
        'refactor', // 重构(既不增加新功能，也不是修复bug)
        'perf', // 性能优化
        'test', // 添加疏漏测试或已有测试改动
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回滚commit
        'build', // 构建流程、外部依赖变更 (如升级 npm 包、修改打包配置等)',
        'ci', // 修改CI配置、脚本
        'types', // 类型定义文件修改
        'wip', // 开发中
      ],
      // highlight-end
    ],
  },
};
```
还有一些辅助工具，如：

+ husky：能够监听 git hooks 的 nodejs 包，让 nodejs 开发者处理 git hooks 任务变得更加容易。
+ lint-staged：可以将 git 的“已暂存(staged)”的文件作为参数传入你要执行的 shell script 之中。

## vscode 配置
如果你使用的vscode, 则推荐使用 [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)、[prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)以及[stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)这三个插件配合开发。
```js title='.vscode/extensions.json'
{
  "recommendations": [
    // highlight-start
    "dbaeumer.vscode-eslint",
    "stylelint.vscode-stylelint",
    "esbenp.prettier-vscode",
    // highlight-end
    "lokalise.i18n-ally",
  ]
}
```