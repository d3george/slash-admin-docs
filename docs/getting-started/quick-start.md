---
sidebar_position: 2
---

# 快速开始

## 环境准备
+ [VS Code](https://code.visualstudio.com/) (推荐)
    :::tip
    如果您使用的 IDE 是[vscode](https://code.visualstudio.com/)(推荐)的话，可以安装以下工具来提高开发效率及代码格式化

    + [Iconify IntelliSense](https://marketplace.visualstudio.com/items?itemName=antfu.iconify) - Iconify图标预览插件
    + [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) - Tailwind智能提示插件
    + [I18n-ally](https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally) - i18n国际化插件
    + [Eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - 代码检查
    + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - 代码格式化
    + [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) - CSS格式化
    :::
+ [Node.js](https://nodejs.org/en) 18.x(推荐)
+ [Pnpm](https://pnpm.io/zh/) (推荐)
+ [Git](https://git-scm.com/)

## 拉取代码
```bash
# clone 代码
git clone https://github.com/d3george/slash-admin.git
```

## 安装依赖
在项目的根目录中，运行以下命令以安装项目依赖项：s
```bash
pnpm install
```

## 运行项目
运行以下命令以启动开发服务器：
```bash
pnpm dev
```
访问 http://localhost:3001 查看您的应用程序。
:::tip
启动端口可在`vite.config.ts`中修改
:::
## 目录说明
```bash
.
├── src # 主目录
│   ├── _mock # MSW 接口模拟
│   ├── api # 接口文件
│   ├── assets # 资源文件
│   │   ├── icons # icon sprite 图标文件夹
│   │   ├── images # 项目存放图片的文件夹
│   ├── components # 公共组件
│   ├── hooks # hook
│   ├── layouts # 布局文件
│   │   ├── dashboard # 控制台布局
│   │   └── simple # 简单布局(登录、异常等页面)
│   ├── locales # 多语言
│   ├── pages # 页面
│   ├── router # 路由配置
│   ├── store # 数据仓库
│   ├── theme # 主题样式配置
│   │   ├── antd # ant design 相关配置
│   │   ├── hook # 主题相关hook
│   ├── utils # 工具类
│   ├── main.tsx # 主入口
├── types # 类型文件
├── vite.config.ts # vite配置文件
└── tailwind.config.js # tailwind配置文件
```