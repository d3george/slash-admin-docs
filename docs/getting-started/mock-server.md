---
sidebar_position: 3
---

# Mock服务

在前端开发中，模拟数据是一种常见的技术，尤其是在开发和测试阶段。这种技术可以帮助开发者在没有后端服务的情况下，模拟出真实的数据交互，从而加快开发进度和提高开发效率。在本项目中，我使用 MSW (Mock Service Worker) 和 Faker.js 来实现前端模拟数据。

:::info 什么是MSW和Faker.js?
+ [MSW (Mock Service Worker)](https://mswjs.io/)：MSW 是一个库，它允许你在浏览器中借助 [Web Workers](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers)拦截网络请求，并返回模拟的响应。这对于前端开发者来说非常有用，因为它可以让你在没有后端服务的情况下，模拟出真实的 API 响应。
+ [Faker.js](https://fakerjs.dev/)：Faker.js 是一个用于生成大量假数据的库，包括姓名、地址、电话号码等。它可以帮助你快速生成大量的模拟数据，而不需要手动编写。
:::

## MSW相关目录
```bash
├── public 
│   ├── mockServiceWorker.js # MSW自动生成,不用改动
├── src # 主目录
│   ├── _mock # MSW 接口模拟
│       ├── handlers # Request Handlers
│           ├── _org.js
│           ├── _user.js
│       ├── assets.js # 响应数据
│       ├── index.js # 注册 Request Handlers
```

## 如何新增Mock

### 设置 Request Handler
[Requset Handler](https://mswjs.io/docs/concepts/request-handler) 是一个函数，用于描述要拦截哪些请求以及如何处理这些请求。
```js title='src/_mock/handlers/_org.js'
import { http, HttpResponse } from 'msw';

import { ORG_LIST } from '@/_mock/assets';
import { OrgApi } from '@/api/services/orgService';

const orgList = http.get(`/api${OrgApi.Org}`, () => {
  return HttpResponse.json({
    status: 0,
    message: '',
    data: ORG_LIST,
  });
});

export default [orgList];
```
:::tip 提示

+ [MSW中如何设置各种请求方式(get、post...)](https://mswjs.io/docs/api/http#standard-methods)
+ [MSW中如何处理响应](https://mswjs.io/docs/basics/mocking-responses)
:::
### 注册 Request Handler, 设置 Worker

```js title='src/_mock/index.js'
import { setupWorker } from 'msw/browser';

import orgMockApi from './handlers/_org';
import userMockApi from './handlers/_user';

const handlers = [...userMockApi, ...orgMockApi];

// 注册 Request Handlers, 生成Worker
export const worker = setupWorker(...handlers);
```

### 启动Worker
```js title='main.tsx'
import { worker } from './_mock';

// 可以根据env环境变量判断是否开启(dev: 开启， prod: 关闭)
worker.start({ onUnhandledRequest: 'bypass' });
```

### 验证
启动程序后，打开浏览器控制台，切换到`Console`, 如果你发现下面的打印信息则证明配置成功
```bash
[MSW] Mocking enabled.
```