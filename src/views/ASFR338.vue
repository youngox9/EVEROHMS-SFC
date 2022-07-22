<template>
  <Layout :auth="true">
    <h2>ASFR338重工轉出報表</h2>
    <el-form
      class="search-bar"
      @submit.native.prevent
      :model="form1"
      :rules="rules1"
      ref="formRef1"
      status-icon
      label-width="100px"
      :label-position="'top'"
    >
      <div class="search-input">
        <el-row :gutter="24">
          <el-col :xs="24" :sm="8">
            <el-form-item :label="$t('SFIADOCNO')" prop="SFIADOCNO">
              <el-input
                :placeholder="$t('SFIADOCNO')"
                type="text"
                v-model="form1.SFIADOCNO"
                :style="{ width: '100%' }"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item :label="'單據日期'" prop="dateRange">
              <el-date-picker
                v-model="form1.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="開始日期"
                end-placeholder="結束日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                :style="{ width: '10%%' }"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="search-btns">
        <el-space :style="{ width: '100%', justifyContent: 'flex-end' }">
          <el-button native-type="submit" type="primary" @click="onSearch">
            {{ $t("search") }}
            <el-icon class="el-icon--right">
              <Search />
            </el-icon>
          </el-button>
        </el-space>
      </div>
    </el-form>
    <el-divider />
    <div
      :style="{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }"
    >
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
      <el-space
        :style="{ width: '100%', justifyContent: 'flex-end', marginBottom: 12 }"
        v-if="list.length"
      >
        <el-button type="warning" @click="onExport" plain>
          匯出
          <el-icon class="el-icon--right">
            <Download />
          </el-icon>
        </el-button>
        <el-button type="warning" @click="onExportQuery" plain>
          下載佇列
          <el-icon class="el-icon--right">
            <Download />
          </el-icon>
        </el-button>
      </el-space>
    </div>

    <el-table :data="list" :style="{ margin: '20px 0' }">
      <el-table-column
        prop="SFIADOCNO"
        :label="$t('SFIADOCNO')"
        align="center"
        :width="200"
      />

      <el-table-column
        prop="SFIADOCDT"
        :label="$t('SFIADOCDT')"
        align="center"
        :width="150"
      >
        <template #default="scope">
          {{
            scope.row.SFIADOCDT
              ? moment(scope.row.SFIADOCDT).format("YYYY-MM-DD")
              : ""
          }}
        </template></el-table-column
      >
      <el-table-column
        prop="SFIASTUS"
        :label="$t('SFIASTUS')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="SFIA001"
        :label="$t('SFIA001')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="SFIA002"
        :label="$t('SFIA002')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="SFIA003"
        :label="$t('SFIA003')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="SFIA005"
        :label="$t('SFIA005')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="SFIA007"
        :label="$t('SFIA007')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="SFAA010"
        :label="$t('SFAA010')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="IMAAL003"
        :label="$t('IMAAL003')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="IMAAL004"
        :label="$t('IMAAL004')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="SFAA013"
        :label="$t('SFAA013')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="SFFD001"
        :label="$t('SFFD001')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="OOCQL004"
        :label="$t('OOCQL004')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="SFFD003"
        :label="$t('SFFD003')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="SFIA009"
        :label="$t('SFIA009')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="ROW_ID"
        :label="$t('ROW_ID')"
        align="center"
        :width="150"
      />
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
import { v4 as uuidv4 } from "uuid";
import { useStore } from "vuex";
import { ref, unref, computed, reactive, watch, toRefs, onMounted } from "vue";
import { ElNotification } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import axiosGlobal from "axios";
import axios from "@/axios";
import { VALIDATIONS, useState, axiosExcel, saveExcel } from "@/utils";
import moment from "moment";
import FileSaver from "file-saver";

const INITIAL_PAGECONFIG = { page: 1, total: 1, pageSize: 10 };

const props = defineProps(["isOpen", "siteData"]);
const { locale } = useI18n();
const store = useStore();
const router = useRouter();
const route = useRoute();

const ENT = computed(() => {
  return store?.state?.global?.ENT || "";
});

const formRef1 = ref();
const [form1] = useState({
  dateRange: [],
  // SFIADOCNO: "K-ACRB-1904010001",
  // SFCB011: "5 PACKAGE",
  // SFAA010: "",
});
const [list, setList] = useState([]);
const [pageConfig, setPageConfig] = useState(INITIAL_PAGECONFIG);

const rules1 = reactive({
  // SFIADOCNO: [VALIDATIONS.isEmpty()],
  // SFCB011: [VALIDATIONS.isEmpty()],
});

onMounted(() => {
  console.log(route);
});

watch(
  () => [props.isOpen],
  (val, prev) => {
    const [isOpen] = val;
    if (!isOpen) {
      const formBbj = formRef1.value;
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
  const formBbj = formRef1.value;
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
    const { page: currentPage = 1, pageSize = 10 } = pageConfig?.value || {};
    const [S_SFIADOCDT = "", E_SFIADOCDT = ""] = form1?.value?.dateRange || [];

    const res = await axios({
      url: `/report/asfr338_get01`,
      method: "post",
      data: {
        ENT: ENT.value,
        PAGE: currentPage,
        PAGENUM: pageSize,
        ...form1.value,
        S_SFIADOCDT,
        E_SFIADOCDT,
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

function getExportFile() {
  const { page: currentPage = 1, pageSize = 10 } = pageConfig?.value || {};
  const [S_SFIADOCDT = "", E_SFIADOCDT = ""] = form1?.value?.dateRange || [];

  return axiosExcel({
    url: `/report/asfr338_exp01`,
    method: "post",
    showError: false,
    data: {
      ENT: ENT.value,
      PAGE: currentPage,
      PAGENUM: pageSize,
      ...form1.value,
      S_SFIADOCDT,
      E_SFIADOCDT,
    },
  });
}

async function onExportQuery() {
  const [func, cancel] = getExportFile();
  store.commit("global/addDownloadListFile", {
    func,
    cancel,
    type: route.path.replace("/", ""),
  });
}

async function onExport() {
  store.commit("global/setIsLoading", true);
  try {
    const { page: currentPage = 1, pageSize = 10 } = pageConfig?.value || {};

    const [func] = getExportFile();
    const res = await func();
    saveExcel(res);
  } catch (e) {
    console.log(e);
  }
  store.commit("global/setIsLoading", false);
}
</script>
