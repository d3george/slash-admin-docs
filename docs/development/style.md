---
sidebar_position: 4
---

# 样式
项目中主要用到了以下几种方式进行样式开发：
+ Ant Design 样式
+ Tailwind CSS
+ Styled Components


## Ant Design样式
项目的基础骨架是基于Ant Design设计的, 其相关目录在`src/theme/`
```bash
├── src 
│   ├── theme
│       ├── antd 
│           ├── components # 复写的Ant Design 组件
│           ├── theme.ts # Ant Design 主题配置
│           ├── index.tsx # Ant Design 的 ConfigProvider
│       ├── hooks
│           ├── use-responsive.ts
│           ├── use-theme-token.ts # useThemeToken钩子
```
### 定制主题
主题相关配置定义在 `src/thems/antd/theme.ts`文件中
```ts title='src/thems/antd/theme.ts'
import { ThemeConfig } from 'antd';

import { ThemeColorPresets } from '#/enum';
/**
 * Antd theme editor: https://ant.design/theme-editor-cn
 */
const customThemeTokenConfig: ThemeConfig['token'] = {
  colorSuccess: '#22c55e',
  colorWarning: '#ff7849',
  colorError: '#ff5630',
  colorInfo: '#00b8d9',

  // 线性化
  wireframe: false,

  borderRadiusSM: 2,
  borderRadius: 4,
  borderRadiusLG: 8,
};

const customComponentConfig: ThemeConfig['components'] = {
  Breadcrumb: {
    fontSize: 12,
    separatorMargin: 4,
  },
  Menu: {
    fontSize: 14,
    colorFillAlter: 'transparent',
    itemColor: 'rgb(145, 158, 171)',
  },
};

const colorPrimarys: {
  [k in ThemeColorPresets]: string;
} = {
  default: '#00a76f',
  cyan: '#078DEE',
  purple: '#7635DC',
  blue: '#2065D1',
  orange: '#FDA92D',
  red: '#FF3030',
};

const themeModeToken: Record<'dark' | 'light', ThemeConfig> = {
  dark: {
    token: {
      colorBgLayout: '#161c24',
      colorBgContainer: '#212b36',
      colorBgElevated: '#161c24',
    },
    components: {
      Modal: {
        headerBg: '#212b36',
        contentBg: '#212b36',
        footerBg: '#212b36',
      },
      Notification: {},
    },
  },
  light: {},
};

export { customThemeTokenConfig, customComponentConfig, colorPrimarys, themeModeToken };

```
### useThemeToken
其中`useThemeToken`会在项目中大量使用
```ts
export function useThemeToken() {
  const { token } = theme.useToken();
  return useMemo(() => token, [token]);
}
```
用于获取Ant Design 的 [theme token](https://ant.design/docs/react/customize-theme-cn), 比如：
```tsx
import { NavLink } from 'react-router-dom';
import { useThemeToken } from '@/theme/hooks';
import { Iconify } from '../icon';

interface Props {
  size?: number | string;
}
function Logo({ size = 50 }: Props) {
  // highlight-next-line
  const { colorPrimary } = useThemeToken();

  return (
    <NavLink to="/">
      <Iconify icon="solar:code-square-bold" color={colorPrimary} size={size} />
    </NavLink>
  );
}

export default Logo;
```


## Tailwind
项目在组件中大量使用了[Tailwind ](https://tailwindcss.com/)

### 添加Tailwind指令
```css title='src/theme/global.css'
/* editor */
@import 'react-quill/dist/quill.snow.css';

/* simplebar */
@import 'simplebar-react/dist/simplebar.min.css';

/* highlight-start */
/* 将 Tailwind CSS 的基础样式（也称为 "base" 样式）导入到当前文件中，包括一些基本的 HTML 元素样式、重置元素默认样式等。 */
@import 'tailwindcss/base';

/* 导入 Tailwind CSS 的组件样式，包括预定义的按钮、表格、表单、卡片等组件样式。 */
@import 'tailwindcss/components';

/* 导入 Tailwind CSS 的实用类，这些类通常用于添加与布局、间距、响应式设计等相关的样式，使得可以快速构建出复杂的页面 */
@import 'tailwindcss/utilities';
/* highlight-end */
```

### tailwind配置
```js title='./tailwind.config.js'
/** @type {import('tailwindcss').Config} */
export default {
  // 使用 "class" 模式时，Tailwind 会将 "dark" 类添加到根元素（通常是 <body> 元素）上，以指示页面当前处于深色模式
  darkMode: 'class',
  // 通过配置 content，Tailwind CSS 将会检索和构建包含需要的 CSS 样式的文件，并生成最终的 CSS 输出文件
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '480px',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1600px',
    },
    colors: {
      black: '#000000',
      green: '#00A76F',
      blue: '#1fb6ff',
      purple: '#7e5bef',
      pink: '#ff49db',
      orange: '#ff7849',
      yellow: '#ffc82c',
      gray: '#637381',
      hover: '#63738114',

      success: '#22c55e',
      warning: '#ff7849',
      error: '#ff5630',
      info: '#00b8d9',

      code: '#d63384',

      'gray-100': '#F9FAFB',
      'gray-200': '#F4F6F8',
      'gray-300': '#DFE3E8',
      'gray-400': '#C4CDD5',
      'gray-500': '#F9FAFB',
      'gray-600': '#637381',
      'gray-700': '#454F5B',
      'gray-800': '#212B36',
      'gray-900': '#161C24',
    },
    extend: {
      transitionProperty: {
        height: 'height',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
      },
    },
  },
  corePlugins: {
    // Remove the Tailwind CSS preflight styles so it can use custom base style (src/theme/base.css)
    preflight: false, // https://tailwindcss.com/docs/preflight#disabling-preflight
  },
  plugins: [],
};

```

### 使用
基于Tailwind预先定义的大量原子类，进行快速开发。更多用法请阅读[Tailwind官方文档](https://tailwindcss.com/docs/installation)
```html
<figure class="bg-slate-100 rounded-xl p-8 dark:bg-slate-800">
  <img class="w-24 h-24 rounded-full mx-auto" src="/sarah-dayan.jpg" alt="" width="384" height="512">
  <div class="pt-6 space-y-4">
    <blockquote>
      <p class="text-lg font-medium">
        “Tailwind CSS is the only framework that I've seen scale
        on large teams. It’s easy to customize, adapts to any design,
        and the build size is tiny.”
      </p>
    </blockquote>
    <figcaption class="font-medium">
      <div class="text-sky-500 dark:text-sky-400">
        Sarah Dayan
      </div>
      <div class="text>
        Staff Engineer, Algolia
      </div>
    </figcaption>
  </div>
</figure>
```

## Styled Components
项目基于[styled-components](https://styled-components.com/)实现Styled Components。这是一种 CSS-in-js技术方案,它结合了 CSS 的强大功能和 JavaScript 的灵活性，为开发者提供了一种更加高效、可维护的方式来构建用户界面。

### 覆盖第三方组件样式
下面是一个覆盖 Ant Design Rate组件样式的例子
```tsx
export default function ProRate(props: RateProps) {
  return (
    <StyledRate>
      <Rate character={<Iconify icon="solar:star-bold" size={18} />} {...props} />
    </StyledRate>
  );
}

const StyledRate = styled.div`
  // highlight-start
  .ant-rate {
    color: rgb(250, 175, 0);
    .ant-rate-star:not(:last-child) {
      margin-inline-end: 0;
    }
  }
 // highlight-end
`;
```

### 动态样式
根据组件的属性或全局主题动态调整样式变得简单直观，无需手动管理大量类名。
```tsx
type OrganizationChartTreeNodeProps = {
  organization: Organization;
};
function OrganizationChartTreeNode({
  organization: { name, children },
}: OrganizationChartTreeNodeProps) {
  const themeToken = useThemeToken();
  const { themeMode } = useSettings();

  return (
    <TreeNode
      label={
        {/* highlight-start */}
        <StyledNode
          {/* 动态传入主题相关变量 */}
          $textColor={
            themeMode === ThemeMode.Light
              ? themeToken.colorPrimaryTextActive
              : themeToken.colorPrimaryText
          }
          $backgroundColor={Color(themeToken.colorPrimary).alpha(0.08).toString()}
          $borderColor={Color(themeToken.colorPrimaryBorder).alpha(0.24).toString()}
        >
          {name}
        </StyledNode>
        {/* highlight-end */}
      }
    >
      {children?.map((org) => (
        <OrganizationChartTreeNode key={org.id} organization={org} />
      ))}
    </TreeNode>
  );
}

type StyledNodeProps = {
  $textColor: string;
  $backgroundColor: string;
  $borderColor: string;
};
const StyledNode = styled.div<StyledNodeProps>`
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  overflow: hidden;
  position: relative;
  z-index: 0;
  padding: 16px;
  border-radius: 12px;
  display: inline-flex;
  text-transform: capitalize;
  color: ${(props) => props.$textColor};
  background-color: ${(props) => props.$backgroundColor};
  border: 1px solid ${(props) => props.$borderColor};
`;
```