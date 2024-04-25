---
sidebar_position: 1
---


# 路由

项目基于[React Router V6](https://reactrouter.com/en/main)来实现路由，相关配置及组件放在`src/router`目录下

```bash
├── src 
│   ├── router 
│       ├── component 
│       ├── hooks 
│       ├── routes 
│           ├── modules
│               ├── dashborad.tsx
│       ├── index.tsx
│       ├── utils.ts 
```

## 配置
在`src/router/routes/modules`目录下的`.tsx`文件会被视为一个路由模块，并被自动注册到路由表中。

一个基本的路由模块文件如下所示👇
```tsx title='src/router/routes/modules/dashboard.tsx'
import { Suspense, lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { SvgIcon } from '@/components/icon';
import { CircleLoading } from '@/components/loading';

import { AppRouteObject } from '#/router';

const HomePage = lazy(() => import(`@/pages/dashboard/workbench`));
const Analysis = lazy(() => import('@/pages/dashboard/analysis'));

const dashboard: AppRouteObject = {
  order: 1,
  path: 'dashboard',
  element: (
    <Suspense fallback={<CircleLoading />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: 'sys.menu.dashboard',
    icon: <SvgIcon icon="ic-analysis" className="ant-menu-item-icon" size="24" />,
    key: '/dashboard',
  },
  children: [
    {
      index: true,
      element: <Navigate to="workbench" replace />,
    },
    {
      path: 'workbench',
      element: <HomePage />,
      meta: { label: 'sys.menu.workbench', key: '/dashboard/workbench' },
    },
    {
      path: 'analysis',
      element: <Analysis />,
      meta: { label: 'sys.menu.analysis', key: '/dashboard/analysis' },
    },
  ],
};

export default dashboard;
```
当新增路由时，只需在更新指定模块，或者直接新增一个路由模块即可。

## 几种特殊路由
### 多级路由
```tsx
const menulevel: AppRouteObject = {
  order: 5,
  path: 'menu_level',
  element: (
    <Suspense fallback={<CircleLoading />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: 'sys.menu.menulevel.index',
    icon: <SvgIcon icon="ic-menulevel" className="ant-menu-item-icon" size="24" />,
    key: '/menu_level',
  },
  children: [
    {
      path: 'menu_level_1a',
      element: <MenuLevel title="1a" />,
      meta: { label: 'sys.menu.menulevel.1a', key: '/menu_level/menu_level_1a' },
    },
    {
      path: 'menu_level_1b',
      meta: { label: 'sys.menu.menulevel.1b.index', key: '/menu_level/menu_level_1b' },
      children: [
        {
          index: true,
          element: <Navigate to="menu_level_2a" replace />,
        },
        {
          path: 'menu_level_2a',
          element: <MenuLevel title="2a" />,
          meta: {
            label: 'sys.menu.menulevel.1b.2a',
            key: '/menu_level/menu_level_1b/menu_level_2a',
          },
        },
        {
          path: 'menu_level_2b',
          meta: {
            label: 'sys.menu.menulevel.1b.2b.index',
            key: '/menu_level/menu_level_1b/menu_level_2b',
          },
          children: [
            {
              index: true,
              element: <Navigate to="menu_level_3a" replace />,
            },
            {
              path: 'menu_level_3a',
              element: <MenuLevel title="3a" />,
              meta: {
                label: 'sys.menu.menulevel.1b.2b.3a',
                key: '/menu_level/menu_level_1b/menu_level_2b/menu_level_3a',
              },
            },
            {
              path: 'menu_level_3b',
              element: <MenuLevel title="3b" />,
              meta: {
                label: 'sys.menu.menulevel.1b.2b.3b',
                key: '/menu_level/menu_level_1b/menu_level_2b/menu_level_3b',
              },
            },
          ],
        },
      ],
    },
  ],
};

export default menulevel;
```

### 外链
```tsx 
  {
    path: 'frame',
    meta: {
      label: 'sys.menu.frame',
      icon: <SvgIcon icon="ic_external" className="ant-menu-item-icon" size="24" />,
      key: '/frame',
    },
    children: [
      {
        path: 'external_link',
        element: (
          <Wrapper>
            <ExternalLink src="https://ant.design/index-cn" />
          </Wrapper>
        ),
        meta: {
          label: 'sys.menu.external_link',
          key: '/frame/external_link',
        },
      },
      {
        path: 'iframe',
        element: (
          <Wrapper>
            <Iframe src="https://ant.design/index-cn" />
          </Wrapper>
        ),
        meta: {
          label: 'sys.menu.iframe',
          key: '/frame/iframe',
        },
      },
    ],
  },
```

## 相关类型定义

### AppRouteObject
```ts
import { RouteObject } from 'react-router-dom';
export type AppRouteObject = {
  order?: number;
  meta?: RouteMeta;
  children?: AppRouteObject[];
} & Omit<RouteObject, 'children'>;
```
我们拓展基于`React Router`的 `RouteObject`类型, 拓展了
+ order: 定义路由队员菜单的顺序
+ meta: 路由相关元数据

### RouteMeta
```ts
import { Params } from 'react-router-dom';
export interface RouteMeta {
  /**
   * antd menu selectedKeys
   */
  key: string;
  /**
   * menu label, i18n
   */
  label: string;
  /**
   * menu prefix icon
   */
  icon?: ReactNode;
  /**
   * menu suffix icon
   */
  suffix?: ReactNode;
  /**
   * hide in menu
   */
  hideMenu?: boolean;
  /**
   * hide in multi tab
   */
  hideTab?: boolean;
  /**
   * disable in menu
   */
  disabled?: boolean;
  /**
   * react router outlet
   */
  outlet?: any;
  /**
   * use to refresh tab
   */
  timeStamp?: string;
  /**
   * external link and iframe need
   */
  frameSrc?: string;
  /**
   * dynamic route params
   *
   * @example /user/:id
   */
  params?: Params<string>;
}
```

