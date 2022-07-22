<template>
  <!-- PQC -->
  <el-dialog
    title="抽樣與結果"
    v-model="isOpen"
    @close="$emit('update:isOpen', false)"
    width="1200px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="canSave"
    fullscreen
  >
    <el-table :data="list">
      <el-table-column
        prop="QCBDSEQ"
        :label="$t('QCBDSEQ')"
        width="60"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="QCBD001"
        :label="$t('QCBD001')"
        align="left"
      ></el-table-column>
      <el-table-column
        prop="QCBD002"
        :label="$t('QCBD002')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="QCBD010"
        :label="$t('QCBD010')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="QCBD011"
        :label="$t('QCBD011')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="QCBD021"
        :label="$t('QCBD021')"
        align="center"
      ></el-table-column>

      <el-table-column width="100" align="center" :label="$t('操作')">
        <template #default="scope">
          <el-button type="primary" @click="onSelect(scope.row)"
            >選取
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <span class="dialog-footer">
        <el-tooltip
          class="box-item"
          effect="dark"
          content="請至少新增一項缺點原因"
          placement="top"
          :disabled="canSave"
        >
          <div :style="{ width: '100%' }">
            <el-button
              size="large"
              @click="onSave"
              :disabled="!canSave"
              :style="{ width: '100%' }"
              >關閉
            </el-button>
          </div>
        </el-tooltip>
      </span>
    </template>
  </el-dialog>
  <PQCReasonListModal
    :data="{ ...data, ...selectedData }"
    :isOpen="isModalOpen"
    :setCanSave="setCanSave"
    :toggleOpen="(val) => setIsModalOpen(val)"
    :updateList="getList"
  />
</template>

<script setup>
import { useStore } from "vuex";
import { ref, unref, computed, reactive, watch, toRefs } from "vue";
import {
  ElMessageBox,
  ElNotification,
  ClickOutside as vClickOutside,
} from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import axios from "@/axios";
import { VALIDATIONS, useState } from "@/utils";
import PQCReasonListModal from "@/components/PQCReasonListModal.vue";

const props = defineProps(["data", "isOpen", "toggleOpen"]);
const emit = defineEmits(["update:isOpen", "isOpen"]);
const store = useStore();
const router = useRouter();
const [list, setList] = useState([]);
const [selectedData, setSelectedData] = useState({});
const [isModalOpen, setIsModalOpen] = useState(false);
const [canSave, setCanSave] = useState(false);

const { locale } = useI18n();

watch(
  () => [props.isOpen, props.data],
  (val, prev) => {
    const [isOpen, data] = val;
    if (isOpen) {
      getList();
    } else {
      setList([]);
      setCanSave(false);
    }
  },
  { deep: true }
);

const [selectedList, setSelectedList] = useState([]);

const ENT = computed(() => {
  return store?.state?.global?.ENT || "";
});

async function getList() {
  const { QCBADOCNO } = props.data;
  if (QCBADOCNO) {
    store.commit("global/setIsLoading", true);
    try {
      const res = await axios({
        url: "/common/sfc/aqct300_qcbd_get01",
        method: "post",
        data: {
          ENT: ENT.value,
          QCBDDOCNO: QCBADOCNO,
        },
      });
      console.log(res?.data);
      setList(res?.data || []);
    } catch (e) {
      console.log(e);
    }

    store.commit("global/setIsLoading", false);
  }
}

async function onSelect(rowData) {
  setIsModalOpen(true);
  setSelectedData(rowData);
}

async function onSave() {
  props.toggleOpen(false);
}
</script>
