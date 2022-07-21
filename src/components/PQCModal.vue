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
    <el-table :data="list" @selection-change="onSelectionChange">
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
          v-if="!canSave"
          class="box-item"
          effect="dark"
          content="請至少新增一項缺點原因"
          placement="top"
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

        <el-button
          size="large"
          @click="onSave"
          :disabled="!canSave"
          :style="{ width: '100%' }"
          v-if="canSave"
          >關閉
        </el-button>
      </span>
    </template>
  </el-dialog>
  <PQCReasonListModal
    :data="{ ...siteData, ...selectedData }"
    :isOpen="isModalOpen"
    :setCanSave="setCanSave"
    @update:isOpen="setIsModalOpen($event)"
    :getMainList="getList"
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

const props = defineProps(["siteData", "isOpen"]);
const emit = defineEmits(["update:isOpen", "isOpen"]);
const store = useStore();
const router = useRouter();
const [list, setList] = useState([]);
const [selectedData, setSelectedData] = useState({});
const [isModalOpen, setIsModalOpen] = useState(false);
const [canSave, setCanSave] = useState(false);

const { locale } = useI18n();

watch(
  () => [props.isOpen, props.siteData],
  (val, prev) => {
    const [isOpen, siteData] = val;
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

function onSelectionChange(val) {
  console.log(val);
  setSelectedList(val);
}

async function getList() {
  const { QCBADOCNO } = props.siteData;
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
      console.log(res.data);
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
  emit("update:isOpen", false);
  // store.commit("global/setIsLoading", true);
  // try {
  //   const { QCBADOCNO } = props.siteData;
  //   console.log(selectedList);
  //   const data = selectedList.value.map((o) => {
  //     const { QCBDSEQ, QCBD001, QCBD002, QCBD003, QCBD004 } = o;
  //     return {
  //       ENT: ENT.value,
  //       QCBEDOCNO: QCBADOCNO,
  //       QCBESEQ: QCBDSEQ,
  //       QCBE001: QCBD001,
  //       QCBE002: QCBD002,
  //       QCBE003: QCBD003,
  //       QCBE004: QCBD004,
  //     };
  //   });
  //   const res = await axios({
  //     url: "/common/sfc/aqct300_qcbe_save01",
  //     method: "post",
  //     data,
  //   });
  //   emit("update:isOpen", false);
  // } catch (e) {
  //   console.log(e);
  // }

  // store.commit("global/setIsLoading", false);
}
</script>
