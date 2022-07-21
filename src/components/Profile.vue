<template>
  <el-button link ref="buttonRef" v-if="profile.accessToken">
    <el-icon class="avatar"><User /></el-icon>
    <span>{{ profile?.username }}</span>
  </el-button>
  <el-popover
    ref="popoverRef"
    :virtual-ref="buttonRef"
    trigger="click"
    virtual-triggering
    placement="bottom-end"
    width="300px"
  >
    <div class="profile-box">
      <div class="profile-card">
        <div class="profile-avatar" :style="{ backgroundImage: `` }"></div>
        <div class="username">{{ profile?.username }}</div>
        <p>{{ profile?.email }}</p>
      </div>
      <el-divider></el-divider>
      <div class="profile-menu">
        <a @click="logout()">Logout</a>
      </div>
    </div>
  </el-popover>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, unref, computed } from "vue";
import { ClickOutside as vClickOutside } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { useState } from "../utils";

const store = useStore();
const router = useRouter();

const profile = computed(() => {
  return store?.state?.global?.profile || {};
});

const buttonRef = ref();
const popoverRef = ref();
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.();
};

function logout() {
  router.push({ name: "login" });
  store.commit("global/logout");
}
</script>
