<template>
  <el-dialog
    width="400px"
    :title="`抽樣與結果 ${mode === 'add' ? '新增缺點原因' : '編輯缺點原因'}`"
    v-model="isOpen"
    :before-close="onClose"
  >
    <el-form :model="form" :rules="rules" ref="formEl" label-width="120px">
      <!-- <el-form-item :label="$t('QCBESEQ')" prop="QCBESEQ">
        <el-input
          type="text"
          v-model="form.QCBESEQ"
          disabled
          placeholder="QCBDSEQ"
        />
      </el-form-item> -->
      <el-form-item :label="$t('QCBE001')" prop="QCBE001">
        <div :style="{ display: 'flex', 'align-items': 'flex-end' }">
          <div :style="{ flex: '0 100%' }">
            <el-input
              type="text"
              v-model="form.QCBE001"
              placeholder="QCBE001"
              :style="{ width: '100%' }"
            />
          </div>
          <div :style="{ flex: '0 auto' }">
            <el-button
              type="primary"
              ref="buttonRef"
              v-click-outside="onClickOutside"
            >
              <el-icon><Search /></el-icon>
              <el-icon> <ArrowDown /></el-icon>
            </el-button>

            <el-popover
              placement="bottom-end"
              ref="popoverRef"
              :virtual-ref="buttonRef"
              trigger="click"
              virtual-triggering
              :width="350"
              @show="getReasonOpts"
            >
              <el-select
                :loading="reasonLoading"
                filterable
                placeholder="Select Reason"
                @change="onReasonSelectChange"
                v-model="form.QCBE001"
                :fit-input-width="true"
                :size="'large'"
                :style="{ width: '100%' }"
              >
                <el-option
                  v-for="item in reasonOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-popover>
          </div>
        </div>
        <el-space :fill-ratio="100" :style="{ width: '100%' }"> </el-space>
      </el-form-item>
      <el-form-item :label="$t('QCBE002')" prop="QCBE002">
        <el-input-number
          :controls="false"
          type="number"
          v-model="form.QCBE002"
          placeholder="QCBE002"
          :style="{ width: '100%', textAlign: 'left' }"
        />
      </el-form-item>

      <el-form-item :label="$t('QCBE004')" prop="QCBE004">
        <el-input-number
          :controls="false"
          type="number"
          v-model="form.QCBE004"
          placeholder="QCBE004"
          :style="{ width: '100%', textAlign: 'left' }"
        />
      </el-form-item>
      <el-form-item :label="$t('QCBE003')" prop="QCBE003">
        <el-input type="text" v-model="form.QCBE003" placeholder="QCBE003" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="toggleOpen(false)">取消</el-button>
        <el-button type="primary" @click="submitform">送出 </el-button>
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

const buttonRef = ref();
const popoverRef = ref();

const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.();
};

const props = defineProps([
  "setCanSave",
  "list",
  "siteData",
  "isOpen",
  "mode",
  // "infoList",
  "onChange",
  "data",
  "rowData",
  "toggleOpen",
  "updateList",
]);
const emit = defineEmits(["update:isOpen", "isOpen"]);
const { siteData } = props;
const { locale } = useI18n();
const store = useStore();
const router = useRouter();

const [form, setForm] = useState({
  QCBE001: "",
  QCBE002: 0,
  QCBE003: "",
  QCBE004: 0,
});

const rules = reactive({
  QCBE001: [VALIDATIONS.isEmpty({ trigger: "change" })],
  QCBE002: [VALIDATIONS.isEmpty()],
  QCBE003: [VALIDATIONS.isEmpty()],
  QCBE004: [VALIDATIONS.isEmpty()],
});

const formEl = ref(null);

const [reasonOptions, setReasonOptions] = useState([]);
const [reasonLoading, setReasonLoading] = useState(false);

watch(
  () => [props.isOpen],
  (val) => {
    const [isOpen] = val;

    if (isOpen) {
      onInit();
    }

    const formBbj = formEl?.value;
    if (formBbj) {
      formBbj.resetFields();
    }
  },
  { deep: true }
);

const ENT = computed(() => {
  return store?.state?.global?.ENT || "";
});

async function onInit() {
  const formData = props?.rowData || {};

  setForm({ ...formData });
}

function onReasonSelectChange(val) {
  // unref(popoverRef).popperRef?.delayHide?.();
  // setForm({ ...form.value, QCBE001: val });
}

async function getReasonOpts() {
  const { QCBD001 } = props.data;
  setReasonLoading(true);

  if (QCBD001) {
    try {
      const { data = [] } = await axios({
        url: "/common/sfc/aqct300_qcbe_get02",
        method: "post",
        data: {
          ENT: ENT.value,
          QCBD001: QCBD001,
        },
      });
      const opts = data.map((o) => {
        const { OOCQ002 = "", OOCQL004 = "" } = o;
        return { label: `${OOCQ002} ${OOCQL004}`, value: OOCQ002 };
      });
      setReasonOptions(opts);
    } catch (e) {
      console.log(e);
    }
  }
  setReasonLoading(false);
}

async function getList() {
  let result = [];
  const { QCBADOCNO, QCBDSEQ } = props.data;

  if (QCBADOCNO && QCBDSEQ) {
    store.commit("global/setIsLoading", true);
    try {
      const res = await axios({
        url: "/common/sfc/aqct300_qcbe_get01",
        method: "post",
        data: {
          ENT: ENT.value,
          QCBDDOCNO: QCBADOCNO,
        },
      });

      result = res?.data || [];
    } catch (e) {
      console.log(e);
    }
    store.commit("global/setIsLoading", false);
    return result;
  }
}

async function submitform() {
  const formBbj = formEl?.value;
  if (formBbj) {
    await formBbj.validate((valid, fields) => {
      if (valid) {
        if (props.mode === "add") {
          onAddReason();
        } else {
          onEditReason();
        }
      } else {
        console.log("error submit!!");
      }
    });
  }
}

async function onEditReason() {
  store.commit("global/setIsLoading", true);
  try {
    const res = await axios({
      url: "/common/sfc/aqct300_qcbe_upd01",
      method: "post",
      data: {
        ENT: ENT.value,
        QCBEDOCNO: props.data.QCBADOCNO,
        QCBESEQ: props.data.QCBDSEQ,
        ...form.value,
      },
    });

    ElNotification({
      title: "Success",
      message: "新增成功",
      type: "success",
    });
    props.setCanSave(true);
    props.updateList();
    props.toggleOpen(false);
  } catch (e) {
    console.log(e);
  }
  store.commit("global/setIsLoading", false);
}

async function onAddReason() {
  store.commit("global/setIsLoading", true);
  try {
    const res = await axios({
      url: "/common/sfc/aqct300_qcbe_ins01",
      method: "post",
      data: {
        ENT: ENT.value,
        QCBEDOCNO: props.data.QCBADOCNO,
        QCBESEQ: props.data.QCBDSEQ,
        ...form.value,
      },
    });

    ElNotification({
      title: "Success",
      message: "新增成功",
      type: "success",
    });
    props.setCanSave(true);
    props.updateList();
    props.toggleOpen(false);
  } catch (e) {
    console.log(e);
  }
  store.commit("global/setIsLoading", false);
}
</script>
