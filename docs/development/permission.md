---
sidebar_position: 2
---

# 权限
上一章中我们介绍了路由相关的知识，而权限与路由则是密不可分的。

项目中权限处理方式可以通过两种方式实现：
1. 静态路由表：前端通过角色来控制路由。
2. 动态路由表：后端接口返回用户角色(权限)，动态生成路由表

在这里我们重点介绍下第二种

## 动态路由表
### 类型定义
实际开发中，下面类型可直接用于后端设计数据库表结构
```ts
// 角色
export interface Role {
  id: string;
  name: string;
  label: string;
  status: BasicStatus;
  order?: number;
  desc?: string;
  permission?: Permission[];
}
// 权限
export interface Permission {
  id: string;
  parentId: string;
  name: string;
  label: string;
  type: PermissionType;
  route: string;
  status?: BasicStatus;
  order?: number;
  icon?: string;
  component?: string;
  hide?: boolean;
  hideTab?: boolean;
  frameSrc?: string;
  newFeature?: boolean;
  children?: Permission[];
}
// 权限类型
export enum PermissionType {
  CATALOGUE, // 目录
  MENU, // 菜单
  BUTTON, // 按钮
}
```

### usePermissionRoutes
项目中，我们通过`usePermissionRoutes`钩子来动态生成路由表
```tsx title='src/router/index.tsx'
export default function Router() {
  // 获取用户权限
  // highlight-next-line
  const permissionRoutes = usePermissionRoutes();
  const asyncRoutes: AppRouteObject = {
    path: '/',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    // 将权限转换后的动态路由表配置到路由中
    // highlight-next-line
    children: [{ index: true, element: <Navigate to={HOMEPAGE} replace /> }, ...permissionRoutes],
  };

  const routes = [LoginRoute, asyncRoutes, ErrorRoutes, PAGE_NOT_FOUND_ROUTE];

  const router = createHashRouter(routes as unknown as RouteObject[]);

  return <RouterProvider router={router} />;
}

```
其方法定义如下
```ts title='src/router/hooks/use-permission-routes.tsx'
export function usePermissionRoutes() {
  // 从 store中获取用户权限， 类型为 Permission[]
  const permissions = useUserPermission();

  return useMemo(() => {
    // 拍平： 因为Permission是树形结构的
    const flattenedPermissions = flattenTrees(permissions!);
    // 将权限转换成路由表
    const permissionRoutes = transformPermissionToMenuRoutes(
      permissions || [],
      flattenedPermissions,
    );
    return [...permissionRoutes];
  }, [permissions]);
}
```

## 静态路由表
因为项目采用的是动态路由表的方式，路由是根据权限动态生成的，并不是你在`src/router/routes/modules`目录下配置的路由，因此这就是个无用的目录，之所以不删除，是为了方便想使用静态路由表的用户。

那如何切换回静态路由表呢？

很简单，直接修改 `usePermissionRoutes`函数
```tsx
export function usePermissionRoutes() {
  // highlight-start
  return useMemo(() => {
    return getRoutesFromModules();
  }, []);
  // highlight-end


//   const permissions = useUserPermission();

//   return useMemo(() => {
//     const flattenedPermissions = flattenTrees(permissions!);
//     const permissionRoutes = transformPermissionToMenuRoutes(
//       permissions || [],
//       flattenedPermissions,
//     );
//     return [...permissionRoutes];
//   }, [permissions]);
}
```
其中`getRoutesFromModules`的作用就是基于 `src/router/routes/modules` 文件结构生成路由
```ts title='src/router/utils.ts'
export function getRoutesFromModules() {
  const menuModules: AppRouteObject[] = [];

  const modules = import.meta.glob('./routes/modules/**/*.tsx', { eager: true });
  Object.keys(modules).forEach((key) => {
    const mod = (modules as any)[key].default || {};
    const modList = Array.isArray(mod) ? [...mod] : [mod];
    menuModules.push(...modList);
  });
  return menuModules;
}
```


