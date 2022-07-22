<template>
  <Layout :auth="true">
    <h2>限定批號不能出貨資料</h2>

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
            <el-form-item :label="$t('INAD001')" prop="INAD001">
              <el-input
                :placeholder="'INAD001'"
                type="text"
                v-model="form.INAD001"
                autocomplete="off"
                @input="onChange"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item :label="$t('INAD003')" prop="INAD003">
              <el-input
                :placeholder="'INAD003'"
                type="text"
                v-model="form.INAD003"
                autocomplete="off"
                @input="onChange"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="search-btns">
        <el-space :style="{ width: '100%', justifyContent: 'flex-end' }">
          <el-button
            type="primary"
            @click="onSearch"
            :disabled="!form.INAD001 && !form.INAD003"
          >
            搜尋
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
        width: '100%',
        justifyContent: 'flex-end',
      }"
    >
      <el-upload
        action=""
        v-model="file"
        :multiple="false"
        :before-upload="onUpload"
        :show-file-list="false"
        :auto-upload="true"
      >
        <el-button ref="buttonRef" type="success" plain>
          上傳
          <el-icon class="el-icon--right"><Upload></Upload></el-icon>
        </el-button>
      </el-upload>
      <ExportListBtn :list="list" v-if="list.length" />
    </el-space>

    <el-table
      :data="list"
      @selection-change="handleSelectionChange"
      :style="{
        margin: '20px 0',
      }"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="INAD001" :label="$t('INAD001')" align="left" />
      <el-table-column prop="INAD003" :label="$t('INAD003')" align="center" />

      <el-table-column prop="INADUD007" :label="'不可出貨註記'" align="center">
        <template #header>
          <el-checkbox
            v-model="isChecked"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
            >不可出貨註記
          </el-checkbox>
        </template>
        <template #default="scope">
          <el-checkbox
            v-model="scope.row.INADUD007"
            true-label="Y"
            false-label="N"
          />
        </template>
      </el-table-column>
      <el-table-column prop="INAD014" :label="$t('INAD014')" align="center" />
      <el-table-column prop="INAD011" :label="$t('INAD011')" align="right">
        <template #default="scope">
          {{
            scope.row.INAD011
              ? moment(scope.row.INAD011).format("YYYY-MM-DD")
              : ""
          }}
        </template></el-table-column
      >
    </el-table>
    <div :style="{ display: 'flex', justifyContent: 'flex-end' }">
      <el-button
        type="warning"
        @click="onSave"
        plain
        v-if="selectedList.length"
      >
        存檔
        <el-icon class="el-icon--right">
          <Download />
        </el-icon>
      </el-button>
    </div>
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
import ExportListBtn from "@/components/ExportListBtn.vue";

const INITIAL_PAGECONFIG = { page: 1, total: 1, pageSize: 10 };

const props = defineProps([]);
const { locale, t } = useI18n();
const store = useStore();
const router = useRouter();

const ENT = computed(() => {
  return store?.state?.global?.ENT || "";
});

const formRef = ref();
const [list, setList] = useState([]);
const [file, setFile] = useState();
const [pageConfig, setPageConfig] = useState(INITIAL_PAGECONFIG);

let [form] = useState({
  INAD001: "EXTR0805B243K54",
});

const rules = reactive({
  // INAD001: [VALIDATIONS.isEmpty()],
});

const [selectedList, setSelectedList] = useState([]);

const profile = computed(() => {
  return store?.state?.global?.profile || {};
});

const isChecked = computed(() => {
  const res =
    list.value.length > 0 && list.value.every((o) => o.INADUD007 === "Y");
  return res;
});

const isIndeterminate = computed(() => {
  const listValue = list?.value || [];
  const count = listValue.reduce((prev, curr) => {
    if (curr.INADUD007 === "Y") {
      return prev + 1;
    }
    return prev;
  }, 0);
  return listValue.length && count > 0 && count < listValue.length;
});

async function onUpload(file) {
  console.log(file);
  store.commit("global/setIsLoading", true);
  const formData = new FormData();
  formData.append("upload", file);
  try {
    const res = await axios({
      url: `/t100/aini010_upload01`,
      method: "post",
      data: formData,
    });

    const result = res?.data || [];
    ElNotification({
      title: "Success",
      message: "上傳成功",
      type: "success",
    });
  } catch (e) {
    console.log(e);
  }
  store.commit("global/setIsLoading", false);
}

function handleCheckAllChange() {
  if (isChecked.value) {
    const temp = list.value.map((obj) => {
      obj.INADUD007 = "N";
      return { ...obj, INADUD007: "N" };
    });
    setList(temp);
  } else {
    const temp = list.value.map((obj) => {
      return { ...obj, INADUD007: "Y" };
    });
    setList(temp);
  }
}
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
    const { INAD001, INAD003 } = form.value || {};

    const res = await axios({
      url: `/t100/aini010_get01`,
      method: "post",
      data: {
        ENT: ENT.value,
        INAD001,
        INAD003,
        USERID: profile.value.username,
      },
    });

    const result = res?.data || [];

    if (result.length) {
      setList([...result]);
    } else {
      setList([]);
      ElNotification({
        title: "Error",
        message: "查無資料",
        type: "error",
      });
    }
  } catch (e) {
    console.log(e);
    setList([]);
  }
  store.commit("global/setIsLoading", false);
}

function handleSelectionChange(val) {
  setSelectedList(val);
}

async function onSave() {
  store.commit("global/setIsLoading", true);
  try {
    if (selectedList?.value?.length) {
      const data = selectedList?.value || [];
      const res = await axios({
        url: `/t100/aini010_save01`,
        method: "post",
        data,
      });
      ElNotification({
        title: "Success",
        message: "存檔成功",
        type: "success",
      });
      getList();
    }
  } catch (e) {
    console.log(e);
  }
  store.commit("global/setIsLoading", false);
}
</script>
