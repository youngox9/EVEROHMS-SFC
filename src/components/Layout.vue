<template>
  <div>
    <Navbar />
    <div class="container">
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import i18nJSON from "@/i18n/lib.js";

import { useStore } from "vuex";
import { ref, unref, computed, reactive, watch, toRefs, onMounted } from "vue";
import { ElNotification, ClickOutside as vClickOutside } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import axios from "@/axios";
import { VALIDATIONS, useState } from "@/utils";

const props = defineProps(["auth"]);
const { locale } = useI18n();
const store = useStore();
const router = useRouter();
const [isLogin, setIsLogin] = useState(false);

const isLoading = computed(() => {
  return store?.state?.global?.isLoading;
});

const downloadList = computed(() => {
  return store?.state?.global?.downloadList;
});

onMounted(() => {
  const pathname = router?.currentRoute?.value?.name;

  const profile = store?.state?.global?.profile || {};
  const { accessToken = "" } = profile;

  if (accessToken) {
    setIsLogin(true);
    store.commit("global/setProfile", profile);
    if (pathname === "index") {
      router.push({ name: "index" });
    } else if (pathname === "login") {
      router.push({ name: "index" });
    }
  } else {
    setIsLogin(false);

    if (props.auth) {
      router.push({ name: "login" });
    }
  }

  const langs = Object.keys(i18nJSON) || [];
  store.commit("global/setLangList", langs);
});
</script>
