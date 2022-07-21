<template>
  <Layout :auth="true">
    <h2>ASFR007報工明細表</h2>
    <el-form
      class="search-bar"
      @submit.native.prevent
      :model="form"
      status-icon
      :rules="rules"
      ref="formRef"
      label-width="80px"
      :label-position="'top'"
    >
      <div class="search-input">
        <el-row :gutter="24">
          <el-col :xs="24" :sm="8">
            <el-form-item :label="$t('v_sffbdocno')" prop="SFFB005">
              <el-input
                :placeholder="$t('v_sffbdocno')"
                type="text"
                v-model="form.SFFB005"
                autocomplete="off"
                @input="onChange"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item :label="'完成日期'" prop="SFFB012">
              <el-date-picker
                v-model="form.SFFB012"
                type="date"
                placeholder="完成日期"
                :style="{ width: '100%' }"
              /> </el-form-item
          ></el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item :label="'單據日期'" prop="dateRange">
              <el-date-picker
                v-model="form.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="開始日期"
                end-placeholder="結束日期"
              /> </el-form-item
          ></el-col>
        </el-row>
      </div>
      <div class="search-btns">
        <el-space :style="{ width: '100%', justifyContent: 'flex-end' }">
          <el-button type="primary" @click="onSearch">
            搜尋
            <el-icon class="el-icon--right">
              <Search />
            </el-icon> </el-button
        ></el-space>
      </div>
    </el-form>
    <el-divider />

    <el-space
      :style="{ width: '100%', justifyContent: 'flex-end', margin: '12px 0' }"
    >
      <el-button type="warning" @click="onExport" plain v-if="list.length">
        匯出
        <el-icon class="el-icon--right">
          <Download />
        </el-icon>
      </el-button>
    </el-space>

    <el-pagination
      :style="{ justifyContent: 'flex-end' }"
      background
      v-if="list.length"
      v-model:currentPage="pageConfig.page"
      v-model:page-size="pageConfig.pageSize"
      :page-count="pageConfig.total"
      :page-sizes="[10, 20, 30, 40]"
      layout="sizes, prev, pager, next"
      @size-change="
        (val) => {
          onPageChange({ page: 1, pageSize: val });
        }
      "
      @current-change="
        (val) => {
          onPageChange({ page: val });
        }
      "
    />
    <el-table :data="list" :style="{ margin: '20px 0' }">
      <el-table-column prop="SFFBDOCNO" :label="'報工單號'" align="center" />
      <el-table-column prop="SFFB002" :label="'報工人員'" align="center" />
      <el-table-column prop="SFFB005" :label="'工單單號'" align="center" />
      <el-table-column prop="SFFB007" :label="'作業編號'" align="center" />
      <el-table-column prop="SFFB009" :label="'工作站'" align="center" />
      <el-table-column prop="SFFB012" :label="'完成日期'" align="center">
        <template #default="scope">
          {{
            scope.row.SFFB012
              ? moment(scope.row.SFFB012).format("YYYY-MM-DD")
              : ""
          }}
        </template></el-table-column
      >
      <el-table-column prop="SFFB017" :label="'良品數量'" align="center" />
      <el-table-column prop="SFFB018" :label="'報廢數量'" align="center" />
      <el-table-column prop="SFFB029" :label="'報工料號'" align="center" />
      <el-table-column prop="SFFBDOCDT" :label="'單據日期'" align="center">
        <template #default="scope">
          {{
            scope.row.SFFB012
              ? moment(scope.row.SFFBDOCDT).format("YYYY-MM-DD")
              : ""
          }}
        </template>
      </el-table-column>
      <el-table-column prop="SFFBSTUS" :label="'狀態碼'" align="center">
      </el-table-column>
    </el-table>

    <el-pagination
      :style="{ justifyContent: 'flex-end' }"
      background
      hide-on-single-page
      v-model:currentPage="pageConfig.page"
      v-model:page-size="pageConfig.pageSize"
      :page-count="pageConfig.total"
      :page-sizes="[10, 20, 30, 40]"
      layout="sizes, prev, pager, next"
      @size-change="
        (val) => {
          onPageChange({ page: 1, pageSize: val });
        }
      "
      @current-change="
        (val) => {
          onPageChange({ page: val });
        }
      "
    />
  </Layout>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, unref, computed, reactive, watch, toRefs } from "vue";
import { ElNotification, ClickOutside as vClickOutside } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import axios from "@/axios";
import { VALIDATIONS, useState } from "@/utils";
import moment from "moment";
import FileSaver from "file-saver";

const INITIAL_PAGECONFIG = { page: 1, total: 1, pageSize: 10 };

const props = defineProps(["isOpen", "siteData"]);
const { locale } = useI18n();
const store = useStore();
const router = useRouter();

const [historyList, setHistoryList] = useState([]);

const ENT = computed(() => {
  return store?.state?.global?.ENT || "";
});

const formRef = ref();
const [list, setList] = useState([]);
const [pageConfig, setPageConfig] = useState(INITIAL_PAGECONFIG);
let [form] = useState({
  SFFB005: "",
  dateRange: [
    moment(new Date()).subtract(1, "months").format("YYYY-MM-DD"),
    moment(new Date()).format("YYYY-MM-DD"),
  ],
});
const rules = reactive({
  // SFFB005: [VALIDATIONS.isEmpty()],
  dateRange: [VALIDATIONS.isEmpty()],
});

watch(
  () => [props.isOpen],
  (val, prev) => {
    const [isOpen] = val;
    if (!isOpen) {
      const formBbj = formRef.value;
      setList([]);
      setPageConfig(INITIAL_PAGECONFIG);
      if (formBbj) {
        formBbj.resetFields();
      }
    }
  },
  { deep: true }
);

function onPageChange(config) {
  setPageConfig({ ...pageConfig.value, ...config });
  getList();
}

async function onSearch() {
  const formBbj = formRef.value;
  if (formBbj) {
    formBbj.validate((valid) => {
      if (valid) {
        getList();
      } else {
        console.log("error submit!!");
      }
    });
  }
}
async function getList() {
  store.commit("global/setIsLoading", true);
  try {
    const [startDate, endDate] = form?.value?.dateRange || [];
    const { page: currentPage = 1, pageSize = 10 } = pageConfig?.value || {};

    const res = await axios({
      url: `/common/sfc/csft335_sffb_get03`,
      method: "post",
      data: {
        ENT: ENT.value,
        PAGE: currentPage,
        PAGENUM: pageSize,
        S_SFFBDOCDT: startDate,
        E_SFFBDOCDT: endDate,
        SFFBDOCNO: form.value.SFFB005,
        SFFB005: form.value.SFFB005,
        SFFB012: form.value.SFFB012
          ? moment(form.value.SFFB012).format("YYYY-MM-DD")
          : "",
      },
    });

    const { result = [], total, page } = res?.data || {};

    if (result.length) {
      setPageConfig({ ...pageConfig.value, total, page });
      setList(result);
    } else {
      setList([]);
      ElNotification({
        title: "Error",
        message: "查無報工資料",
        type: "error",
      });
    }
  } catch (e) {
    console.log(e);
    setList([]);
  }
  store.commit("global/setIsLoading", false);
}

async function onExport() {
  store.commit("global/setIsLoading", true);
  try {
    const [startDate, endDate] = form?.value?.dateRange || [];
    const { page: currentPage = 1, pageSize = 10 } = pageConfig?.value || {};

    const res = await axios({
      url: `/common/sfc/csft335_sffb_exp01`,
      method: "post",
      responseType: "blob",
      headers: {
        Accept: "application/vnd.openxmlformats;charset=utf-8",
        "Access-Control-Expose-Headers": "Content-Disposition",
        // "Content-Type": "application/json",
      },
      data: {
        ENT: ENT.value,
        PAGE: currentPage,
        PAGENUM: pageSize,
        S_SFFBDOCDT: startDate,
        E_SFFBDOCDT: endDate,
        SFFB012: form.value.SFFB012
          ? moment(form.value.SFFB012).format("YYYY-MM-DD")
          : "",
        SFFB005: form.value.SFFB005,
      },
    });

    let filename = "download.xlsx";

    const disposition = res?.headers?.["content-disposition"];
    if (disposition) {
      filename = /attachment; filename="(.*)"$/g.exec(disposition);
    }
    FileSaver.saveAs(new Blob([res.data]), filename);
  } catch (e) {
    console.log(e);
  }
  store.commit("global/setIsLoading", false);
}
</script>
