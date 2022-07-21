<!-- 登入頁面 -->
<template>
  <Layout :auth="true">
    <h2>即時報工作業</h2>
    <SearchBar :path="'4plating'" />
    <!-- 表單內容 -->
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="form"
      status-icon
      @submit.native.prevent
      :label-position="'top'"
      v-if="isSearch"
    >
      <el-divider />
      <h2>{{ form.SFFB009 }} / {{ form.SFFB009_DESC }}</h2>
      <el-row :gutter="24">
        <el-col :xs="24" :sm="8">
          <!-- 報工單號 -->
          <el-form-item :label="$t('SFFBDOCNO')">
            <el-input
              type="text"
              v-model="form.SFFBDOCNO"
              disabled
              :placeholder="$t('SFFBDOCNO')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="8">
          <!-- 作業編號 -->
          <el-form-item :label="$t('SFFB007')">
            <el-input
              type="text"
              v-model="form.SFFB007"
              disabled
              :placeholder="$t('SFFB007')"
            ></el-input>
            <!-- 作業編號說明 -->
            <p class="form-item-info">{{ form.SFFB007_DESC }}</p>
          </el-form-item>
        </el-col>
        <!-- 報工料號 -->
        <el-col :xs="24" :sm="8">
          <el-form-item :label="$t('SFFB029')">
            <el-input
              type="text"
              v-model="form.SFFB029"
              disabled
              :placeholder="$t('SFFB029')"
            ></el-input>
            <!-- 料號說明 -->
            <p class="form-item-info">{{ form.SFB029_DESC1 }}</p>
            <p class="form-item-info">{{ form.SFB029_DESC2 }}</p>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :xs="24" :sm="12">
          <!-- 報工人員 -->
          <el-form-item :label="$t('SFFB002')" prop="SFFB002">
            <el-input type="text" v-model="form.SFFB002" placeholder="SFFB002">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <!-- 報工機器 -->
          <el-form-item :label="$t('SFFB010')" prop="SFFB010">
            <el-input
              type="text"
              :formatter="(value) => `${value.toUpperCase()}`"
              :parser="(value) => value"
              v-model="form.SFFB010"
              :placeholder="$t('SFFB010')"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :xs="24" :sm="8">
          <!-- 待處理量 -->
          <el-form-item label="待處理量">
            <el-input
              type="text"
              v-model="form.SFFB017"
              disabled
              placeholder="SFFB017"
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- 良品數量 -->
        <el-col :xs="24" :sm="8">
          <el-form-item label="良品數量" prop="SFFB017_1">
            <el-input
              v-model="form.SFFB017_1"
              :min="1"
              :max="form.SFFB017"
              label="SFFB017"
              type="number"
              :controls="false"
              @blur="checkReason"
            />
          </el-form-item>
        </el-col>
        <!-- 報廢數量 -->
        <el-col :xs="24" :sm="8">
          <el-form-item :label="$t('SFFB018')">
            <el-input
              type="number"
              :value="garbageCount"
              :placeholder="$t('SFFB018')"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <!--  Ni 安培  -->
        <el-col :xs="24" :sm="12">
          <el-form-item :label="$t('SFFBUA001')" prop="SFFBUA001">
            <el-input
              type="numbter"
              v-model="form.SFFBUA001"
              :placeholder="$t('SFFBUA001')"
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- Ni 分鐘 -->
        <el-col :xs="24" :sm="12">
          <el-form-item :label="$t('SFFBUA003')" prop="SFFBUA003">
            <el-input
              type="number"
              v-model="form.SFFBUA003"
              :placeholder="$t('SFFBUA003')"
            ></el-input>
          </el-form-item>
        </el-col>
        <!--  Sn 安培  -->
        <el-col :xs="24" :sm="12">
          <el-form-item :label="$t('SFFBUA002')" prop="SFFBUA002">
            <el-input
              type="number"
              v-model="form.SFFBUA002"
              :placeholder="$t('SFFBUA002')"
            ></el-input>
          </el-form-item>
        </el-col>

        <!-- Sn 分鐘 -->
        <el-col :xs="24" :sm="12">
          <el-form-item :label="$t('SFFBUA004')" prop="SFFBUA004">
            <el-input
              type="number"
              v-model="form.SFFBUA004"
              :placeholder="$t('SFFBUA004')"
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- 鐵珠重量 -->
        <el-col :xs="24" :sm="12">
          <el-form-item :label="$t('SFFBUA005')" prop="SFFBUA005">
            <el-input
              type="number"
              v-model="form.SFFBUA005"
              :placeholder="$t('SFFBUA005')"
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- 陶珠重量 -->
        <el-col :xs="24" :sm="12">
          <el-form-item :label="$t('SFFBUS011')" prop="SFFBUS011">
            <el-input
              type="number"
              v-model="form.SFFBUS011"
              :placeholder="$t('SFFBUS011')"
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- 備註 -->
        <el-col :xs="24" :sm="8">
          <el-form-item :label="$t('SFFB023')" prop="SFFB023">
            <el-input
              type="text"
              v-model="form.SFFB023"
              :placeholder="$t('SFFB023')"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="flex-box right">
        <el-button type="primary" plain @click="setModalOpen(true)">
          {{ $t("bad_reason") }}
          <el-icon class="el-icon--right"><QuestionFilled /></el-icon>
        </el-button>
      </div>
      <div class="footer">
        <div class="footer-content">
          <el-button
            type="primary"
            size="large"
            @click="submitForm('form')"
            :loading="loading"
            native-type="submit"
          >
            報工
          </el-button>
        </div>
      </div>
    </el-form>
    <!-- NO NODATA -->
    <el-empty :image-size="200" v-show="!isSearch" />
    <!-- 不良原因Modal -->
    <ReasonListModal
      :siteData="form"
      :isOpen="modalOpen"
      @update:isOpen="setModalOpen($event)"
    />
    <!-- 不良原因Modal -->
    <ForceReasonModal
      :mode="'add'"
      :isOpen="reasonModalOpen"
      :onChange="(val) => setReasonModalOpen(val)"
      :siteData="{ ...form, garbageCount }"
      :callback="postSave"
      :garbageCount="garbageCount"
      :defaultForm="defaultForm"
    />
  </Layout>
</template>
<script setup>
import { useStore } from "vuex";
import { ref, unref, computed, reactive, watch, toRefs, onMounted } from "vue";
import { ElNotification, ClickOutside as vClickOutside } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import axios from "@/axios";
import { VALIDATIONS, useState } from "@/utils";
import SearchBar from "@/components/SearchBar.vue";
import ReasonListModal from "@/components/ReasonListModal.vue";
import ForceReasonModal from "@/components/ForceReasonModal.vue";

const INITIAL_FORMDATA = {
  SFFBUD017: 0,
};
const props = defineProps([]);
const { siteData } = props;
const { locale } = useI18n();
const store = useStore();
const router = useRouter();
const formRef = ref();

const defaultForm = {
  // SFFDSEQ1: 1,
  // SFFD001: "",
  // SFFD002: "",
  // SFFD003: "",
  // SFFBUA001: 0,
};

const ENT = computed(() => {
  return store?.state?.global?.ENT || "";
});

onMounted(() => {
  console.log(searchForm.value);
  if (searchForm.value.SFFB005) {
    onSearch();
  }
});
const searchForm = computed(() => {
  return store?.state?.global?.searchForm || {};
});

const isSearch = computed(() => {
  return store?.state?.global?.isSearch || false;
});

const [form, setForm] = useState({});

const [modalOpen, setModalOpen] = useState(false);
const [reasonModalOpen, setReasonModalOpen] = useState(false);

watch(
  () => ({ ...searchForm.value }),
  (val, prev) => {
    setForm({ ...INITIAL_FORMDATA, ...val, SFFBUS011: val?.SFFBUS011 || 0 });
  },
  { deep: true, immediate: true }
);

const garbageCount = computed(() => {
  const a = form.value.SFFB017 || 0;
  const b = form.value.SFFB017_1 || 0;
  if (!b) {
    return 0;
  }
  return a - b > 0 ? a - b : 0;
});

const rules = reactive({
  // 報工人員
  SFFB002: [VALIDATIONS.isEmpty()],
  // 報工機器
  SFFB010: [
    VALIDATIONS.isEmpty(),
    VALIDATIONS.custom(async (rule, value, callback) => {
      const res = await axios({
        url: "/common/sfc/csft335_sffb010_chk01",
        method: "post",
        data: {
          ENT: ENT.value,
          SFFB009: form.value.SFFB009,
          SFFB005: form.value.SFFB005,
          SFFB007: form.value.SFFB007,
          SFFB010: value,
        },
      });
      const result = res?.data === "OK";
      console.log("result >>>", result);
      if (result) {
        callback();
      } else {
        callback(new Error("機台輸入錯誤"));
      }
    }),
  ],
  // 良品數量
  SFFB017_1: [
    VALIDATIONS.isEmpty(),
    VALIDATIONS.custom((rule, value, callback) => {
      const a = parseFloat(form.value.SFFB017_1);
      const b = parseFloat(form.value.SFFB017);
      if (a > b) {
        callback(new Error("良品數量 不可大於 待處理量"));
      } else {
        callback();
      }
    }),
  ],
  SFFBUA001: [VALIDATIONS.isEmpty()],
  SFFBUA002: [VALIDATIONS.isEmpty()],
  SFFBUA003: [VALIDATIONS.isEmpty()],
  SFFBUA004: [VALIDATIONS.isEmpty()],
  SFFBUA005: [VALIDATIONS.isEmpty()],
  // SFFBUS011: [VALIDATIONS.isEmpty()],
});

function submitForm() {
  const formBbj = formRef.value;
  if (formBbj) {
    formBbj.validate((valid) => {
      if (valid) {
        postSave();
      } else {
        console.log("error submit!!");
      }
    });
  }
}

async function postSave() {
  store.commit("global/setIsLoading", true);
  try {
    // 報工
    const res1 = await axios({
      url: "/4plating/sfc/1500/csft335_sffb_save01",
      method: "post",
      data: {
        ENT: ENT.value,
        SFFDDOCNO: form.value.SFFBDOCNO,
        // 報廢數量
        SFFB018: garbageCount.value,
        ...form.value,
      },
    });
    const msg = res1?.data?.v_message || "";
    resetForm();
    ElNotification({
      title: "Success",
      message: msg || "報工成功！",
      type: "success",
    });
  } catch (e) {
    console.log(e);
  }
  store.commit("global/setIsLoading", false);
}

function resetForm() {
  const formObj = formRef.value;
  if (formObj) {
    formObj.resetFields();
    store.commit("global/setSearchForm", {});
    store.commit("global/setIsSearch", false);
  }
}

/**
 * 如果報廢數量 > 0, 則打開強制不良原因Modal
 */
async function checkReason() {
  if (garbageCount.value > 0) {
    console.log(garbageCount.value);
    setReasonModalOpen(true);
  }
}
async function onSearch() {
  store.commit("global/setIsLoading", true);
  try {
    const res = await axios({
      url: `/4plating/sfc/1500/csft335_sffb_get01`,
      method: "post",
      data: {
        ENT: ENT.value,
        SFFB005: searchForm.value.SFFB005,
      },
    });

    const data = res?.data?.[0];
    console.log(data);
    if (data) {
      store.commit("global/setSearchForm", {
        ...data,
        SFFB005: searchForm.value.SFFB005,
      });
      store.commit("global/setIsSearch", true);
    } else {
      store.commit("global/setSearchForm", {
        SFFB005: searchForm.value.SFFB005,
      });
      store.commit("global/setIsSearch", false);
      ElNotification({
        title: "Error",
        message: "查無報工資料",
        type: "error",
      });
    }
  } catch (e) {
    console.log(e);
  }
  store.commit("global/setIsLoading", false);
}
</script>
