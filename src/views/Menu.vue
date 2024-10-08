<template>
  <div class="menu-container" @click.capture="handleClickOutside">
    <span class="parting-line"></span>
    <Search class="search" />
    <div class="menu-list">
      <div class="menu-item" @click="openCommon('commonWeb')">
        <div class="menu-text">常用网站</div>
        <Transition name="fade">
          <CommonWeb v-if="commonState.commonWeb" @click.stop />
        </Transition>
      </div>
      <div class="menu-item" @click="openCommon('commonApp')">
        <div class="menu-text">常用软件</div>
        <Transition name="fade">
          <CommonApp v-if="commonState.commonApp" @click.stop />
        </Transition>
      </div>
      <div class="menu-item" @click="openLabel">
        <div class="menu-text">桌面便签</div>
      </div>
      <div class="menu-item" @click="openCommon('quickInput')">
        <div class="menu-text">快捷输入</div>
        <Transition name="fade">
          <QuickInput v-if="commonState.quickInput" @click.stop />
        </Transition>
      </div>
      <div class="menu-item">
        <div class="menu-text">CHATGPT</div>
      </div>
      <div class="menu-item">
        <div class="menu-text">使用教程</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { invoke } from "@tauri-apps/api/core";
import Search from "@/views/Search.vue";
import CommonWeb from "@/views/web/CommonWeb.vue";
import CommonApp from "@/views/app/CommonApp.vue";
import QuickInput from "@/views/quick-input/QuickInput.vue";
import { provide, ref } from "vue";
import { CommonState, ContainState } from "@/interface/menu";


// 控制每个菜单项的展开与关闭状态
const commonState = ref<CommonState>({
  commonWeb: false,
  commonApp: false,
  quickInput: false,
});
const containState = ref<ContainState>({
  label: false,
})


/** 关闭所有菜单 */
const closeAllMenu = () => {
  // 断言 Object.keys 返回的键是 CommonState 的键
  (Object.keys(commonState.value) as (keyof CommonState)[]).forEach((k) => {
    commonState.value[k] = false;
  });
};

/** 打开菜单项 */
const openCommon = (key: keyof CommonState) => {
  // 如果当前点击的项已经是打开的，则关闭它
  if (commonState.value[key]) {
    commonState.value[key] = false;
  } else {
    closeAllMenu();
    commonState.value[key] = true;
  }
};

/** 打开桌面便签 */
const openLabel = () => {
  /** 创建桌面便签 */
  const createLabelWindow = () => {
    containState.value.label = true;
    invoke("create_new_window", {
      windowId: "label",
      title: "桌面便签",
      url: "#/label",
      size: [210, 250]
    });
  }
  if (containState.value.label) {
    containState.value.label = false;
    invoke("close_new_window", {
      windowId: 'label'
    }).catch((err) => {
      if (err === 'label') {
        createLabelWindow();
      }

    })
  } else {
    createLabelWindow();
  }
};

/** 点击外侧时关闭菜单项 */
const handleClickOutside = (event: MouseEvent) => {
  // 检查点击事件的目标元素是否是 .menu-container 元素本身
  if (event.target === event.currentTarget) {
    // 如果是，说明点击事件发生在 .menu-container 的空白区域，关闭所有打开的菜单项
    closeAllMenu();
  }
};

provide("closeAllMenu", closeAllMenu);
</script>

<style lang="less" scoped>
.menu-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 1px solid rgba(230, 235, 240, 0.7);
  border-radius: 20px;
  background: linear-gradient(#e5edf1, #9fc0cf);
  list-style-type: none;
  -webkit-font-smoothing: antialiased;

  .menu-list {
    display: flex;
    flex-wrap: wrap;
    margin: 65px 0 0 30px;

    .menu-item {
      display: inline-block;
      vertical-align: top;
      border: none;
      cursor: pointer;
      margin-top: 10px;
      position: relative;

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 2px;
        height: 30%;
        background-color: rgb(54, 56, 55);
        transition: height 0.2s 0.35s ease-out;
        z-index: 1;
      }

      &:hover {
        .menu-text {
          color: rgb(54, 56, 55);
          background-color: rgb(245, 245, 245);

          &::before {
            width: 100%;
            height: 96%;
            opacity: 1;
            transition: width 0.2s 0.1s linear, height 0.15s 0.3s ease-out,
              opacity 0s 0.1s;
          }

          &::after {
            width: 100%;
            opacity: 1;
            transition: width 0.25s 0.2s ease-out, opacity 0s 0.2s;
          }
        }

        &::before {
          height: 100%;
          transition: height 0.2s ease-in;
        }
      }

      .menu-text {
        width: 140px;
        height: 10px;
        position: relative;
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 2px;
        text-transform: uppercase;
        padding: 15px 20px;
        color: rgb(28, 31, 30);
        transition: 0.3s;

        &::before,
        &::after {
          content: "";
          position: absolute;
          left: 0;
          transition: all 0.25s ease;
          width: 0;
          height: 0;
          background: transparent;
          opacity: 0;
        }

        &::before {
          top: 0;
          border-top: 2px solid rgb(54, 56, 55);
          border-right: 2px solid rgb(54, 56, 55);
          transition: height 0.15s ease-in, width 0.2s 0.15s linear,
            opacity 0s 0.35s;
        }

        &::after {
          bottom: 0;
          border-bottom: 2px solid rgb(54, 56, 55);
          transition: width 0.25s ease-in, opacity 0s 0.35s;
        }
      }
    }
  }

  .search {
    position: relative;
    top: 72px;
  }

  .parting-line {
    position: absolute;
    top: 65px;
    width: 100%;
    margin-left: -1px;
    border: none;
    border-top: 1px solid rgba(58, 69, 80, 0.2);
  }
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
</style>
