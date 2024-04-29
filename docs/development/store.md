---
sidebar_position: 2
---

# 状态管理
项目基于[Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)实现全局状态管理。按模块进行管理，定义在目录`src/store`中

```bash
├── src 
│   ├── store
│       ├── settingStore.ts
│       ├── userStore.ts
```


## 约定
定义Store时有一些约定需要注意, 以`settingStore.ts`为例
```ts
import { create } from 'zustand';

import { getItem, removeItem, setItem } from '@/utils/storage';

import { StorageEnum, ThemeColorPresets, ThemeLayout, ThemeMode } from '#/enum';

type SettingsType = {
  themeColorPresets: ThemeColorPresets;
  themeMode: ThemeMode;
  themeLayout: ThemeLayout;
  themeStretch: boolean;
  breadCrumb: boolean;
  multiTab: boolean;
};
type SettingStore = {
  settings: SettingsType;
  // 1: 🚀 使用 actions 命名空间来存放所有的 action
  // highlight-start
  actions: {
    setSettings: (settings: SettingsType) => void;
    clearSettings: () => void;
  };
  // highlight-end
};

const useSettingStore = create<SettingStore>((set) => ({
  settings: getItem<SettingsType>(StorageEnum.Settings) || {
    themeColorPresets: ThemeColorPresets.Default,
    themeMode: ThemeMode.Light,
    themeLayout: ThemeLayout.Vertical,
    themeStretch: false,
    breadCrumb: true,
    multiTab: true,
  },
  actions: {
    setSettings: (settings) => {
      set({ settings });
      setItem(StorageEnum.Settings, settings);
    },
    clearSettings() {
      removeItem(StorageEnum.Settings);
    },
  },
}));

// 2: 🚀 将state和actions分别导出
// highlight-start
export const useSettings = () => useSettingStore((state) => state.settings);
export const useSettingActions = () => useSettingStore((state) => state.actions);
// highlight-end
```

## 使用

+ 使用`useSettings`获取`SettingStore`中存储的状态
    ```tsx
    const { themeMode } = useSettings();
    ```
+ 使用`useSettingActions`获取，操作`SettingStore`状态的`action`
    ```tsx
    const { setSettings } = useSettingActions();

    const setThemeLayout = (themeLayout: ThemeLayout) => {
      setSettings({
        ...settings,
        themeLayout,
      });
    };
    ```