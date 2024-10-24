import "@/assets/css/main.css";
import "@/assets//css/base.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "primeicons/primeicons.css";
import { Window } from "@tauri-apps/api/window";
import PrimeVue from "primevue/config";
import Lara from "@primevue/themes/lara";
import { ipcSetWindowSize } from "./api/ipc/window.api";
import {
  handleSettingChange,
  runStartupTasks,
} from "./views/setting/utils/startupManager";
import { initSetting } from "./views/setting/utils/settingRegistry";
import { getConfig } from "./utils/config";
import { listen } from "@tauri-apps/api/event";
import Tooltip from "primevue/tooltip";

if (Window.getCurrent().label === "main") {
  ipcSetWindowSize(65, 65);
  async function initializeApp() {
    try {
      // 初始化设置
      initSetting();
      let settingData: Record<string, boolean> = await getConfig([
        "settingConfig",
      ]);
      if (!settingData) {
        settingData = {};
      }
      // 监听设置变化,将所有设置都放在main窗口里执行
      listen(
        "setting-change",
        (event: { payload: { key: string; value: boolean } }) => {
          const { key, value } = event.payload;
          handleSettingChange(key, value);
        },
      );
      await runStartupTasks((key) => {
        return settingData[key] === true;
      });
    } catch (error) {
      console.error("初始化失败:", error);
    }
  }

  initializeApp();
}

const app = createApp(App);
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Lara,
  },
});
app.directive("tooltip", Tooltip);

app.mount("#app");
