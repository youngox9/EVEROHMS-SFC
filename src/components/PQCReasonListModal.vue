<template>
  <!-- PQC -->
  <el-dialog
    title="缺點原因"
    v-model="isOpen"
    @close="$emit('update:isOpen', false)"
    width="1200px"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
  >
    <div class="flex-box right">
      <el-button class="submit" type="primary" plain @click="onAddReason()">
        新增缺點原因
        <el-icon><Plus /></el-icon>
      </el-button>
    </div>

    <el-table
      :data="list"
      @selection-change="onSelectionChange"
      :style="{
        marginTop: '20px',
      }"
    >
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column
        prop="QCBESEQ"
        :label="$t('QCBESEQ')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="QCBE001"
        :label="$t('QCBE001')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="QCBE001_DESC"
        :label="$t('QCBE001_DESC')"
        align="center"
      ></el-table-column>

      <el-table-column
        prop="QCBE003"
        :label="$t('QCBE003')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="QCBE002"
        :label="$t('QCBE002')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="QCBE004"
        :label="$t('QCBE004')"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            size="mini"
            type="primary"
            :icon="Edit"
            circle
            @click="editReason(scope.row)"
          >
            <el-icon><Edit /></el-icon>
          </el-button>
          <el-button
            size="mini"
            type="danger"
            :icon="Delete"
            circle
            @click="removeReason(scope.row, scope.$index)"
          >
            <el-icon><Delete /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
  <PQCReasonModal
    :list="list"
    :mode="modalMode"
    :data="data"
    :rowData="selectedRowData"
    :isOpen="isModalOpen"
    @update:isOpen="setIsModalOpen($event)"
    @update:getList="getList($event)"
    :setCanSave="setCanSave"
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

import PQCReasonModal from "@/components/PQCReasonModal.vue";

const props = defineProps(["data", "isOpen", "setCanSave", "getMainList"]);
const emit = defineEmits(["update:isOpen", "isOpen"]);
const store = useStore();
const router = useRouter();
const [list, setList] = useState([]);
const [isModalOpen, setIsModalOpen] = useState(false);
const [modalMode, setModalMode] = useState("add");
const [selectedRowData, setSelectedRowData] = useState({});
const { locale } = useI18n();

const ENT = computed(() => {
  return store?.state?.global?.ENT || "";
});

watch(
  () => [props.isOpen, props.data],
  (val, prev) => {
    const [isOpen, data] = val;

    if (isOpen) {
      getList();
    } else {
      setList([]);
      props.getMainList();
    }
  },
  { deep: true }
);

const [selectedList, setSelectedList] = useState([]);

function onSelectionChange(val) {
  setSelectedList(val);
}

/**
 * 取得缺點原因列表
 */
async function getList() {
  const { QCBADOCNO, QCBDDOCNO, QCBDSEQ } = props.data;

  if (QCBADOCNO && QCBDSEQ) {
    store.commit("global/setIsLoading", true);
    try {
      const res = await axios({
        url: "/common/sfc/aqct300_qcbe_get01",
        method: "post",
        data: {
          ENT: ENT.value,
          QCBDDOCNO: QCBADOCNO,
          QCBDSEQ,
        },
      });
      setList(res?.data || []);
    } catch (e) {
      console.log(e);
    }

    store.commit("global/setIsLoading", false);
  }
}

function onAddReason() {
  setSelectedRowData({});
  setModalMode("add");
  setIsModalOpen(true);
}

function editReason(rawData) {
  setSelectedRowData(rawData);
  setModalMode("edit");
  setIsModalOpen(true);
}

async function removeReason(rawData, index) {
  store.commit("global/setIsLoading", true);
  try {
    const res = await axios({
      url: "/common/sfc/aqct300_qcbe_del01",
      method: "post",
      data: {
        ENT: ENT.value,
        QCBEDOCNO: props.data.QCBADOCNO,
        QCBESEQ: props.data.QCBDSEQ,
        ...rawData,
      },
    });

    ElNotification({
      title: "Success",
      message: "刪除成功",
      type: "success",
    });

    getList();
  } catch (e) {
    console.log(e);
  }
  store.commit("global/setIsLoading", false);
}
</script>
