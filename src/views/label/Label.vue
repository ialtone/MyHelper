<template>
    <div class="label-container" @mouseover="showCloseButton = true" @mouseleave="showCloseButton = false"
        @contextmenu="showContextMenu" data-tauri-drag-region>
        <img v-if="showCloseButton" class="close-button" src="../../assets/images/close.svg" @click="handleClose">
        <Mochi shiba="random" mood="happy" blush left-eye="laugh" right-eye="laugh" left-ear="down" right-ear="down">
            <div class="content">
                <input class="title" placeholder="输入标题..." spellcheck="false">
                <textarea class="textarea" placeholder="输入内容..." spellcheck="false"></textarea>
            </div>
        </Mochi>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Mochi from './Mochi/Mochi.vue';
import { invoke } from '@tauri-apps/api/core';
import { showContextMenu } from './utils/contextMenu';

const showCloseButton = ref(false);

const handleClose = () => {
    invoke("close_new_window", {
        windowId: 'label'
    })
}
</script>

<style lang="less" scoped>
.label-container {
    height: 100vh;
    width: 100vw;

    .content {
        height: inherit;
        width: 100%;

        .title {
            font-size: 22px;
            font-weight: bold;
            width: 100%;
            border: 0;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .textarea {
            border: 0;
            background-color: transparent;
            width: 100%;
            height: 50%;
            font-size: 18px;
            font-weight: bold;
            resize: none;
            color: #666464;

            /* 隐藏滚动条的样式 */
            &::-webkit-scrollbar {
                width: 0;
            }

            -ms-overflow-style: none;
            scrollbar-width: none;
            overflow-y: auto;

            &::-webkit-scrollbar-track {
                background: transparent;
            }
        }
    }

    .close-button {
        position: absolute;
        top: 2px;
        right: 0;
        width: 32px;
        height: 32px;
        cursor: pointer;
    }
}
</style>
