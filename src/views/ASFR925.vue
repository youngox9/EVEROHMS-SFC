<template>
  <Layout :auth="true">
    <h2>ASFR925工作站在制狀態</h2>

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
            <el-form-item :label="$t('SFCBDOCNO')" prop="SFCBDOCNO">
              <el-input
                :placeholder="$t('SFCBDOCNO')"
                type="text"
                v-model="form1.SFCBDOCNO"
                :style="{ width: '100%' }"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item :label="$t('SFCB011')" prop="SFCB011">
              <el-input
                :placeholder="$t('SFCB011')"
                type="text"
                v-model="form1.SFCB011"
                :style="{ width: '100%' }"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item :label="$t('SFAA010')" prop="SFAA010">
              <el-input
                :placeholder="$t('SFAA010')"
                type="text"
                v-model="form1.SFAA010"
                :style="{ width: '100%' }"
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
    <el-space
      :style="{
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        width: '100%',
      }"
    >
      <el-pagination
        :style="{ marginBottom: '20px' }"
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
      <el-space :style="{ justifyContent: 'flex-end' }" v-if="list.length">
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
        <el-button type="warning" @click="onExportPdf" plain>
          匯出PDF
          <el-icon class="el-icon--right">
            <Download />
          </el-icon>
        </el-button>
      </el-space>
    </el-space>
    <el-table :data="list" :style="{ margin: '0 0 20px 0' }">
      <el-table-column
        prop="SFCBDOCNO"
        :label="$t('SFCBDOCNO')"
        align="center"
        :width="200"
      />
      <el-table-column
        prop="SFCB003"
        :label="$t('SFCB003')"
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
        prop="SFCB011"
        :label="$t('SFCB011')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="SFAA016"
        :label="$t('SFAA016')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="SFAA016"
        :label="$t('SFAA016')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="SFCB033"
        :label="$t('SFCB033')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="SFCB050"
        :label="$t('SFCB050')"
        align="center"
        :width="200"
      />
      <el-table-column
        prop="SFCB051"
        :label="$t('SFCB051')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="SFCB052"
        :label="$t('SFCB052')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="SFAA010"
        :label="$t('SFAA010')"
        align="center"
        :width="250"
      />
      <el-table-column
        prop="SFAA012"
        :label="$t('SFAA012')"
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
        prop="SFAASTUS"
        :label="$t('SFAASTUS')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="IMAA127"
        :label="$t('IMAA127')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="IMAA138"
        :label="$t('IMAA138')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="IMAA128"
        :label="$t('IMAA128')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="IMAA129"
        :label="$t('IMAA129')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="IMAA132"
        :label="$t('IMAA132')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="MOVEIN_TIME"
        :label="$t('MOVEIN_TIME')"
        align="center"
        :width="150"
      />

      <el-table-column
        prop="LEAD_TIME"
        :label="$t('LEAD_TIME')"
        align="center"
        :width="150"
      />

      <el-table-column
        prop="SFCBUD021"
        :label="$t('SFCBUD021')"
        align="center"
        :width="150"
      >
        <template #default="scope">
          {{
            scope.row.SFCBUD021
              ? moment(scope.row.SFCBUD021).format("YYYY-MM-DD")
              : ""
          }}
        </template>
      </el-table-column>

      <el-table-column
        prop="HOURS"
        :label="$t('HOURS')"
        align="center"
        :width="150"
      />

      <el-table-column
        prop="INTERVAL_TIME"
        :label="$t('INTERVAL_TIME')"
        align="center"
        :width="250"
      />

      <el-table-column
        prop="SFCB002"
        :label="$t('SFCB002')"
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
  // SFCBDOCNO: "K-ACRB-1904010001",
  // SFCB011: "5 PACKAGE",
  // SFAA010: "",
});
const [list, setList] = useState([]);
const [pageConfig, setPageConfig] = useState(INITIAL_PAGECONFIG);

const rules1 = reactive({
  // SFCBDOCNO: [VALIDATIONS.isEmpty()],
  // SFCB011: [VALIDATIONS.isEmpty()],
});

onMounted(() => {
  // console.log(route);
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

    const res = await axios({
      url: `/report/asfr925_get01`,
      method: "post",
      data: {
        ENT: ENT.value,
        PAGE: currentPage,
        PAGENUM: pageSize,
        ...form1.value,
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

const downloadList = computed(() => {
  return store?.state?.global?.downloadList;
});

function getExportFile() {
  const { page: currentPage = 1, pageSize = 10 } = pageConfig?.value || {};

  return axiosExcel({
    url: `/report/asfr925_exp01`,
    method: "post",
    showError: false,
    data: {
      ENT: ENT.value,
      PAGE: currentPage,
      PAGENUM: pageSize,
      ...form1.value,
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

async function onExportPdf() {
  store.commit("global/setIsLoading", true);
  try {
    const { page: currentPage = 1, pageSize = 10 } = pageConfig?.value || {};

    const [func] = await axiosExcel({
      url: `/report/asfr925_exp02`,
      method: "post",
      showError: false,
      data: {
        ENT: ENT.value,
        PAGE: currentPage,
        PAGENUM: pageSize,
        ...form1.value,
      },
    });
    const { data } = await func();

    const file = new Blob([data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  } catch (e) {
    console.log(e);
  }
  store.commit("global/setIsLoading", false);
}
</script>
