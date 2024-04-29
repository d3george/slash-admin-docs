---
sidebar_position: 1
---

# Icon
项目中关于Icon的使用方式有三种
+ Iconify
+ Svg Icon
+ Ant Design Icon

## Iconify
对[Iconify](https://iconify.design/)的二次封装

使用方式如下
```tsx
import { Iconify } from '@/components/icon';

<Iconify icon="solar:emoji-funny-square-bold-duotone" size={24} color={colorPrimary} />
```
:::tip 
如果你使用的是vscode编辑器，推荐安装[Iconify IntelliSense](https://marketplace.visualstudio.com/items?itemName=antfu.iconify)
:::

## Svg Icon
通过[vite-plugin-svg-icons](https://github.com/vbenjs/vite-plugin-svg-icons) vite插件将本地`src/assets/icons`目录下的`svg`生成svg雪碧图。只需在`vite.config.ts`中按如下方式配置
```ts title='vite.config.ts'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

// https://vitejs.dev/config/
export default defineConfig({
  // ...
  plugins: [
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
    }),
  ],
  // ...
});
```
其使用方式如下：
```tsx
import { SvgIcon } from '@/components/icon';

// icon是svg文件名
<SvgIcon icon="ic_file_audio" size={48} />
```
## Ant Design Icon

使用 Ant Design 语义化的矢量图标，详细内容请参考[官方文档](https://ant.design/components/icon-cn)
```ts
import { StepBackwardOutlined } from '@ant-design/icons';

<StepBackwardOutlined />
```