<!-- 登入頁面 -->
<template>
  <Layout :auth="false">
    <div class="login-container">
      <el-form
        :model="loginForm"
        status-icon
        :rules="rules"
        ref="formEl"
        label-width="80px"
        class="form"
      >
        <img class="logo" src="@/assets/logo.png" />
        <el-form-item :label="$t('account')" prop="username">
          <el-input
            type="username"
            v-model="loginForm.username"
            autocomplete="on"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('password')" prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            autocomplete="on"
          ></el-input>
        </el-form-item>
        <el-form-item :label="'區域'">
          <el-select
            v-model="ENT"
            placeholder="select area"
            @change="setArea"
            :style="{ width: '100%' }"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            class="submit"
            native-type="submit"
            type="primary"
            size="large"
            @click="submitForm('loginForm')"
            :loading="loading"
          >
            登入
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </Layout>
</template>
<script setup>
import { useStore } from "vuex";
import { ref, unref, computed, reactive, watch, toRefs, onMounted } from "vue";
import { ElNotification, ClickOutside as vClickOutside } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import axios from "@/axios";
import { AREA_OPTIONS, VALIDATIONS, useState } from "@/utils";

const props = defineProps([]);
const emit = defineEmits(["update:isOpen", "isOpen"]);
const { siteData } = props;
const { locale } = useI18n();
const store = useStore();
const router = useRouter();

const [loading, setLoading] = useState(false);
const [loginForm, setLoginForm] = useState({
  // username: "eray",
  // password: "670325",
});
const [options, setOptions] = useState(AREA_OPTIONS);

const rules = reactive({
  username: [VALIDATIONS.isEmpty()],
  password: [VALIDATIONS.isEmpty()],
});

const formEl = ref(null);

const ENT = computed(() => {
  return store?.state?.global?.ENT || "";
});

function setArea(val) {
  store.commit("global/setENT", val);
}

function submitForm() {
  const formBbj = formEl.value;
  if (formBbj) {
    formBbj.validate((valid) => {
      if (valid) {
        login();
      }
    });
  }
}

async function login() {
  setLoading(true);
  try {
    const res = await axios({
      auth: true,
      url: "/api/auth/signin",
      method: "post",
      data: {
        ...loginForm.value,
      },
    });
    const profile = res?.data || {};
    store.commit("global/setProfile", profile);
    router.push({ name: "index" });
  } catch (e) {
    console.log(e);
  }
  setLoading(false);
}
</script>
