<template>
  <el-dialog
    title="template"
    v-model="isOpen"
    @close="$emit('update:isOpen', false)"
  >
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('update:isOpen', false)">關閉</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, unref, computed, reactive, watch, toRefs } from "vue";
import { ElNotification, ClickOutside as vClickOutside } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import axios from "@/axios";
import { VALIDATIONS } from "@/utils";

const props = defineProps([]);
const { SFFDDOCNO, SFFBDOCNO } = props;

const store = useStore();
const router = useRouter();
const infoList = ref([]);
const resaonModalMode = ref(false);
const reasonModalOpen = ref(false);
const reasonForm = reactive({
  SFFDSEQ1: 0,
  SFFD001: "1",
  SFFD002: "1",
  SFFD003: "1",
});

const reasonFormRules = reactive({
  // SFFD001: [VALIDATIONS.isEmpty()],
  // SFFD002: [VALIDATIONS.isEmpty()],
  // SFFD003: [VALIDATIONS.isEmpty()],
});
watch(
  () => [props.isOpen, props.SFFBDOCNO],
  (val, prev) => {
    const [a, b] = val;
    if (a && b) {
      getReasonList();
    }
  },
  { deep: true }
);

const { locale } = useI18n();
const emit = defineEmits(["update:isOpen", "isOpen"]);

const isOpen = computed({
  get() {
    return props.isOpen;
  },
  set(value) {
    emit("update:isOpen", value);
  },
});

const ENT = computed(() => {
  return store?.state?.global?.ENT || "";
});

async function getReasonList() {
  store.commit("global/setIsLoading", true);
  const res = await axios({
    url: "/5package/sfc/csft335_sffd_get01",
    method: "post",
    data: {
      ENT: ENT.value,
      SFFDDOCNO: SFFDDOCNO,
    },
  });
  infoList.value = res?.data || [];
  store.commit("global/setIsLoading", false);
}

const addReason = () => {
  const maxList = infoList.value.map((o) => o.SFFDSEQ1);
  const max = Math.max(...maxList);
  const maxCount = !isFinite(max) ? 0 : max;

  reasonForm.SFFDSEQ1 = maxCount + 1;
  resaonModalMode.value = "add";
  reasonModalOpen.value = true;
};

const reasonFormEl = ref(null);

async function submitReasonForm() {
  const formBbj = reasonFormEl?.value;
  console.log("formBbj >>>", formBbj);
  if (formBbj) {
    await formBbj.validate((valid, fields) => {
      console.log(formBbj, valid, fields);
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
    console.log(props);
    const data = {
      ENT: ENT.value,
      SITE: "0001",
      SFFDDOCNO: props.SFFBDOCNO,
      ...reasonForm,
    };
    const res = await axios({
      url: "/5package/sfc/csft335_sffd_save01",
      method: "post",
      data,
    });
    ElNotification({
      title: "Success",
      message: "新增成功",
      type: "success",
    });
    reasonModalOpen.value = false;
    getReasonList();
  } catch (e) {
    console.log(e);
  }
  $store.commit("global/setIsLoading", false);
}
</script>
