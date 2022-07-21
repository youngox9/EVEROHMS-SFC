<template>
  <div
    v-if="profile?.username"
    class="profile"
    ref="buttonRef"
    v-click-outside="onClickOutside"
  >
    <el-icon class="avatar"><User /></el-icon>
    <span>{{ profile?.username }}</span>
  </div>
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
        <el-avatar :icon="UserFilled" size="large" />
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
  router.push({ name: "index" });
  store.commit("global/logout");
}
</script>
