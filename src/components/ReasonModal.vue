<template>
  <el-dialog
    width="400px"
    :title="mode === 'add' ? '新增不良原因' : '編輯不良原因'"
    v-model="isOpen"
    @close="onChange(false)"
  >
    <el-form
      :model="reasonForm"
      :rules="rules"
      ref="reasonFormEl"
      label-width="120px"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="SFFDSEQ1" prop="SFFDSEQ1">
            <el-input
              type="text"
              v-model="reasonForm.SFFDSEQ1"
              disabled
              placeholder="SFFDSEQ1"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="異常原因" prop="SFFD001">
            <el-input
              type="text"
              v-model="reasonForm.SFFD001"
              placeholder="SFFD001"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="數量" prop="SFFD002">
            <el-input
              type="number"
              min="1.000"
              max="500.000"
              step="0.001"
              v-model="reasonForm.SFFD002"
              placeholder="SFFD002"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="備註" prop="SFFD003">
            <el-input
              type="text"
              v-model="reasonForm.SFFD003"
              placeholder="SFFD003"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onChange(false)" v-if="!force">取消</el-button>
        <el-button type="primary" @click="submitReasonForm">送出 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, unref, computed, reactive, watch, toRefs, onMounted } from "vue";
import { ElNotification, ClickOutside as vClickOutside } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import axios from "@/axios";
import { VALIDATIONS, useState } from "@/utils";

const INITIAL_FORMDATA = {
  SFFDSEQ1: 1,
  SFFD001: "",
  SFFD002: "",
  SFFD003: "",
};

const props = defineProps([
  "siteData",
  "isOpen",
  "mode",
  // "infoList",
  "onChange",
  "rowData",
  "force",
  "callback",
]);
const { siteData } = props;
const { locale } = useI18n();
const store = useStore();
const router = useRouter();

const [reasonForm, setReasonForm] = useState(INITIAL_FORMDATA);
const [infoList, setInfoList] = useState([]);

const rules = reactive({
  SFFD001: [VALIDATIONS.isEmpty()],
  SFFD002: [VALIDATIONS.isEmpty()],
  SFFD003: [VALIDATIONS.isEmpty()],
});

const reasonFormEl = ref(null);

const ENT = computed(() => {
  return store?.state?.global?.ENT || "";
});

watch(
  () => [props.isOpen, props.mode, props.rowData, props.siteData],
  (val, prev) => {
    const [isOpen] = val;
    if (isOpen) {
      onInit();
    } else {
      const formBbj = reasonFormEl?.value;
      if (formBbj) {
        formBbj.resetFields();
      }
    }

    // onInit();
  },
  { deep: true }
);

async function onInit() {
  // const [isOpen, mode, rowData] = props;
  let temp = {
    ...INITIAL_FORMDATA,
    ...props.rowData,
  };
  const list = await getReasonList();
  if (props.mode === "add") {
    const maxList = list.map((o) => o.SFFDSEQ1);
    const max = Math.max(...maxList);
    const maxCount = !isFinite(max) ? 1 : max + 1;
    temp.SFFDSEQ1 = maxCount;
  }
  setReasonForm(temp);
}

async function getReasonList() {
  const { SFFBDOCNO } = props.siteData;
  if (SFFBDOCNO) {
    store.commit("global/setIsLoading", true);
    const res = await axios({
      url: "/common/sfc/csft335_sffd_get01",
      method: "post",
      data: {
        ENT: ENT.value,
        SFFDDOCNO: SFFBDOCNO,
      },
    });
    const list = res?.data || [];
    setInfoList(list);
    store.commit("global/setIsLoading", false);
    return list;
  }
  return [];
}

async function submitReasonForm() {
  const formBbj = reasonFormEl?.value;
  if (formBbj) {
    await formBbj.validate((valid, fields) => {
      if (valid) {
        postReason();
      } else {
        console.log("error submit!!");
      }
    });
  }
}

async function postReason() {
  store.commit("global/setIsLoading", true);
  try {
    const { SFFBDOCNO } = props.siteData;

    const data = {
      ENT: ENT.value,
      SITE: "0001",
      SFFDDOCNO: SFFBDOCNO,
      ...reasonForm.value,
    };
    const res = await axios({
      url: "/common/sfc/csft335_sffd_save01",
      method: "post",
      data,
    });
    ElNotification({
      title: "Success",
      message: "新增成功",
      type: "success",
    });

    props.onChange(false);
  } catch (e) {
    console.log(e);
  }
  store.commit("global/setIsLoading", false);
}
</script>
