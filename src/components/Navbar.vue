<template>
  <div :class="`navbar ${isMenuOpen ? 'active' : ''}`">
    <el-button
      class="toggle"
      ref="buttonRef"
      @click="setIsMenuOpen(!isMenuOpen)"
      size="small"
    >
      {{ isMenuOpen ? "Close" : "Menu" }}
    </el-button>

    <div class="nav-wrap">
      <div class="nav nav-left" v-if="isLogin">
        <router-link class="logo" :to="'/site'">
          <img src="@/assets/logo_w.png" />
        </router-link>
        <router-link :to="'/PQC'" custom v-slot="{ navigate, isActive }">
          <el-button
            link
            ref="buttonRef"
            @click="
              (e) => {
                navigate(e);
                setIsMenuOpen(false);
              }
            "
            :class="isActive ? 'active' : ''"
          >
            PQC檢驗作業
          </el-button>
        </router-link>
        <router-link
          :to="{ name: 'index' }"
          custom
          v-slot="{ navigate, isActive }"
        >
          <el-button
            link
            ref="buttonRef"
            @click="
              (e) => {
                navigate(e);
                setIsMenuOpen(false);
              }
            "
            :class="isSite ? 'active' : ''"
          >
            即時報工作業
          </el-button>
        </router-link>

        <router-link
          :to="'/reportedList'"
          custom
          v-slot="{ navigate, isActive }"
        >
          <el-button
            link
            ref="buttonRef"
            @click="
              (e) => {
                navigate(e);
                setIsMenuOpen(false);
              }
            "
            :class="isActive ? 'active' : ''"
          >
            ASFR007報工明細表
          </el-button>
        </router-link>
        <router-link
          :to="'/cantShipping'"
          custom
          v-slot="{ navigate, isActive }"
        >
          <el-button
            link
            ref="buttonRef"
            @click="
              (e) => {
                navigate(e);
                setIsMenuOpen(false);
              }
            "
            :class="isActive ? 'active' : ''"
          >
            限定批號不能出貨資料
          </el-button>
        </router-link>
        <router-link :to="'/ASFR925'" custom v-slot="{ navigate, isActive }">
          <el-button
            link
            ref="buttonRef"
            @click="
              (e) => {
                navigate(e);
                setIsMenuOpen(false);
              }
            "
            :class="isActive ? 'active' : ''"
          >
            ASFR925工作站在制狀態
          </el-button>
        </router-link>
        <router-link :to="'/ASFR338'" custom v-slot="{ navigate, isActive }">
          <el-button
            link
            ref="buttonRef"
            @click="
              (e) => {
                navigate(e);
                setIsMenuOpen(false);
              }
            "
            :class="isActive ? 'active' : ''"
          >
            ASFR338重工轉出報表
          </el-button>
        </router-link>
      </div>
      <div class="nav nav-right">
        <Global />
        <p v-if="isLogin">區域：{{ areaText }}</p>
        <Profile v-if="isLogin" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Profile from "@/components/Profile.vue";
import Global from "@/components/Global.vue";

import { useStore } from "vuex";
import { ref, unref, computed, reactive, watch, toRefs, onMounted } from "vue";
import { ElNotification, ClickOutside as vClickOutside } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import axios from "@/axios";
import { AREA_OPTIONS, VALIDATIONS, useState } from "@/utils";

const props = defineProps(["auth"]);
const { locale } = useI18n();
const store = useStore();
const router = useRouter();

const [isMenuOpen, setIsMenuOpen] = useState(false);

const areaText = computed(() => {
  const ENT = store?.state?.global?.ENT;
  const text = AREA_OPTIONS.find((o) => o.value === ENT)?.label || "";
  return text;
});

const isLogin = computed(() => {
  return store?.state?.global?.profile?.accessToken || false;
});

const isSite = computed(() => {
  return window.location.href.includes("site/");
});
</script>
