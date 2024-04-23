---
sidebar_position: 4
---

# 接口请求

## 请求流程
在本项目中，我们对接口请求做了分层封装, 分别是`Client`、 `Service`和`应用层`
```bash
├── src # 主目录
│   ├── api # 接口文件
│       ├── services # service层
│           ├── userService.ts # userService
│           ├── orgService.ts # orgService
│       ├── apiClient.ts # client层
```



### Client层
`client`层主要做两件事情：
1. 封装[axios](https://axios-http.com/zh/docs/intro)实例
    + 请求拦截
    + 响应拦截
    + 统一异常处理
2. 封装[APIClient](https://github.com/d3george/slash-admin/blob/main/src/api/apiClient.ts#L64)
    + 底层依赖axios实例
    + 暴露公共方法(get、post、put、delete)

```ts title='src/api/apiClient.ts'
import { message as Message } from 'antd';
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { isEmpty } from 'ramda';

import { t } from '@/locales/i18n';

import { Result } from '#/api';
import { ResultEnum } from '#/enum';

// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
});

// 请求拦截
axiosInstance.interceptors.request.use(
  (config) => {
    // 在请求被发送之前做些什么
    config.headers.Authorization = 'Bearer Token';
    return config;
  },
  (error) => {
    // 请求错误时做些什么
    return Promise.reject(error);
  },
);

// 响应拦截
axiosInstance.interceptors.response.use(
  (res: AxiosResponse<Result>) => {
    if (!res.data) throw new Error(t('sys.api.apiRequestFailed'));

    const { status, data, message } = res.data;
    // 业务请求成功
    const hasSuccess = data && Reflect.has(res.data, 'status') && status === ResultEnum.SUCCESS;
    if (hasSuccess) {
      return data;
    }

    // 业务请求错误
    throw new Error(message || t('sys.api.apiRequestFailed'));
  },
  (error: AxiosError<Result>) => {
    const { response, message } = error || {};
    let errMsg = '';
    try {
      errMsg = response?.data?.message || message;
    } catch (error) {
      throw new Error(error as unknown as string);
    }
    // 对响应错误做点什么
    if (isEmpty(errMsg)) {
      // checkStatus
      // errMsg = checkStatus(response.data.status);
      errMsg = t('sys.api.errorMessage');
    }
    Message.error(errMsg);
    return Promise.reject(error);
  },
);

class APIClient {
  get<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'GET' });
  }

  post<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'POST' });
  }

  put<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'PUT' });
  }

  delete<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'DELETE' });
  }

  request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      axiosInstance
        .request<any, AxiosResponse<Result>>(config)
        .then((res: AxiosResponse<Result>) => {
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error | AxiosError) => {
          reject(e);
        });
    });
  }
}
export default new APIClient();

```

### Service层
这一层只做一件事： 列出某个具体模块的所有请求。

比如用户模块的所有请求都放到了`userService`下👇
```ts title='src/api/services/userService.ts'
import apiClient from '../apiClient';

import { UserInfo, UserToken } from '#/entity';

export interface SignInReq {
  username: string;
  password: string;
}

export interface SignUpReq extends SignInReq {
  email: string;
}
export type SignInRes = UserToken & { user: UserInfo };

export enum UserApi {
  SignIn = '/auth/signin',
  SignUp = '/auth/signup',
  Logout = '/auth/logout',
  Refresh = '/auth/refresh',
  User = '/user',
}

const signin = (data: SignInReq) => apiClient.post<SignInRes>({ url: UserApi.SignIn, data });
const signup = (data: SignUpReq) => apiClient.post<SignInRes>({ url: UserApi.SignUp, data });
const logout = () => apiClient.get({ url: UserApi.Logout });
const findById = (id: string) => apiClient.get<UserInfo[]>({ url: `${UserApi.User}/${id}` });

export default {
  signin,
  signup,
  findById,
  logout,
};
```

### 应用层
应用层的动作就是发送请求，在本项目中我们统一使用 [React Query](https://tanstack.com/query/latest/docs/framework/react/overview)发送请求
:::info
React Query 是一个用于 React 的数据获取和状态管理库，它提供了一种高效、灵活的方式来处理异步数据。React Query 的核心概念包括：数据获取（Fetching Data）、数据缓存（Caching）、数据同步（Synchronization）、数据更新（Updating Data）和数据预取（Prefetching）
:::

+ 使用 [useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) 钩子做数据获取
```ts title='src/pages/management/system/organization/index.tsx'
import { useQuery } from '@tanstack/react-query';

// 在组织列表页面，获取组织列表数据
const { data } = useQuery({
    queryKey: ['orgs'],
    queryFn: orgService.getOrgList,
});
```


+ 使用 [useMutation](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation) 钩子做数据更新
```ts title='src/store/userStore.ts'
// 封装在store层中的action
const signInMutation = useMutation(userService.signin);
const res = await signInMutation.mutateAsync(data);
```


## 配置
`apiClient.ts`中用到了`import.meta.env.VITE_APP_BASE_API`变量， 该变量设置在
```sh title='.env.development 或 .env.production'
VITE_APP_BASE_API=/api
VITE_APP_HOMEPAGE=/dashboard/workbench
```
然后 `Vite`会拦截所有以`/api`开头的请求, 从而解决开发环境跨域问题
```ts
// https://vitejs.dev/config/
export default defineConfig({
  // ....
  server: {
    // 自动打开浏览器
    open: true,
    host: true,
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  // ...
});
```