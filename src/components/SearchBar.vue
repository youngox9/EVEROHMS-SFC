<template>
  <el-form
    ref="formRef"
    class="search-bar"
    @submit.native.prevent
    :model="form"
    :rules="rules"
    label-width="80px"
    :label-position="'top'"
  >
    <div class="search-input">
      <!-- 工單單號 -->
      <el-form-item :label="$t('v_sffbdocno')" prop="SFFB005">
        <el-autocomplete
          :fetch-suggestions="querySearch"
          :placeholder="$t('v_sffbdocno')"
          type="text"
          v-model="form.SFFB005"
          :style="{ width: '100%' }"
          @input="onChange"
        >
          <template #default="{ item }">
            <el-row :gutter="24">
              <el-col :xs="6" :sm="6">
                {{ item.link }}
              </el-col>
              <el-col :xs="18" :sm="12">
                {{ item.value }}
              </el-col>
            </el-row>
          </template>
        </el-autocomplete>
      </el-form-item>
    </div>
    <div class="search-btns">
      <el-space :style="{ width: '100%', justifyContent: 'flex-end' }">
        <!-- 歷史紀錄 -->
        <el-button
          type="warning"
          plain
          @click="setDrawer(true)"
          :disabled="!form.SFFB005"
        >
          紀錄
          <el-icon class="el-icon--right"><List /></el-icon>
        </el-button>
        <!-- 搜尋按鈕 -->
        <el-button
          native-type="submit"
          type="primary"
          @click="search"
          :disabled="!form.SFFB005"
        >
          {{ $t("search") }}
          <el-icon class="el-icon--right">
            <Search />
          </el-icon>
        </el-button>
      </el-space>
    </div>
  </el-form>
  <!-- 歷史訊息抽屜 -->
  <HistoryDrawer
    :siteData="searchForm"
    :isOpen="drawer"
    @update:isOpen="setDrawer($event)"
  />
</template>

<script setup>
import { useStore } from "vuex";
import { ref, unref, computed, reactive, watch, toRefs, onMounted } from "vue";
import { ElNotification, ClickOutside as vClickOutside } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import axios from "@/axios";
import { VALIDATIONS, useState, SEARCHBAR_AUTOCOMPLETE_LIST } from "@/utils";
import HistoryDrawer from "@/components/HistoryDrawer.vue";

const props = defineProps(["path"]);
const { path = "5package" } = props;
const { locale } = useI18n();
const store = useStore();
const router = useRouter();
const formRef = ref();

const ENT = computed(() => {
  return store?.state?.global?.ENT || "";
});

onMounted(() => {
  // store.commit("global/setIsSearch", false);
  // search();
});

const searchForm = computed(() => {
  return store?.state?.global?.searchForm || {};
});

let [form] = useState(searchForm);

const [drawer, setDrawer] = useState(false);

const rules = reactive({
  SFFB005: [VALIDATIONS.isEmpty()],
});

async function search() {
  const formBbj = formRef.value;

  if (formBbj) {
    formBbj.validate((valid) => {
      if (valid) {
        onSearch();
      } else {
        console.log("error submit!!");
      }
    });
  }
}

/** autocompolete 下拉選單 */
function querySearch(queryString, cb) {
  cb(SEARCHBAR_AUTOCOMPLETE_LIST);
}

function onChange() {
  store.commit("global/setIsSearch", false);
}

/**
 * 搜尋工單
 */
async function onSearch() {
  store.commit("global/setIsLoading", true);
  try {
    const res = await axios({
      url: `/common/sfc/csft335_sffb_get01`,
      method: "post",
      data: {
        ENT: ENT.value,
        SFFB005: form.value.SFFB005,
      },
    });
    const data = res?.data?.[0];
    if (data) {
      const { SFFB007, SFFB009 } = data;
      const siteStr = SFFB007 ? SFFB007 : SFFB009 || "";
      const SITE_NAME = siteStr.replace(/ /g, "");
      if (SITE_NAME && data) {
        router.push({ name: SITE_NAME });
        store.commit("global/setSearchForm", {
          ...form.value,
          ...data,
        });

        formRef.value.resetFields();
        store.commit("global/setIsSearch", true);
      }
    } else {
      throw new Error();
    }
  } catch (e) {
    console.log(e);
    // ElNotification({
    //   title: "Error",
    //   message: "查無報工資料",
    //   type: "error",
    // });
  }
  store.commit("global/setIsLoading", false);
}
</script>
