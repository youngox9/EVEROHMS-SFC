<template>
  <!-- 不良原因列表 -->
  <el-dialog
    title="不良原因"
    v-model="isOpen"
    @close="$emit('update:isOpen', false)"
  >
    <div class="flex-box right">
      <el-button class="submit" type="primary" plain @click="addReason()">
        新增不良原因
        <el-icon><Plus /></el-icon>
      </el-button>
    </div>
    <!-- <el-divider></el-divider> -->
    <el-table :data="infoList" :style="{ marginTop: '20px' }">
      <el-table-column prop="SFFDSEQ1" label="SFFDSEQ1"></el-table-column>
      <el-table-column
        prop="SFFD001"
        label="異常原因"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="SFFD002"
        label="數量"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="SFFD003"
        label="備註"
        align="center"
      ></el-table-column>

      <!--第二步  开始进行修改和查询操作-->
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
            @click="removeReason(scope.row)"
          >
            <el-icon><Delete /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('update:isOpen', false)">關閉</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 新增不良原因 -->
  <ReasonModal
    :infoList="infoList"
    :mode="resaonModalMode"
    :isOpen="reasonModalOpen"
    :onChange="(val) => setReasonModalOpen(val)"
    :siteData="siteData"
    :rowData="rowData"
  />
</template>

<script setup>
import ReasonModal from "@/components/ReasonModal.vue";
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

const props = defineProps(["siteData", "isOpen"]);

const store = useStore();
const router = useRouter();
const [infoList, setInfoList] = useState([]);

const [reasonModalOpen, setReasonModalOpen] = useState(false);
const [rowData, setRowData] = useState({});
const [resaonModalMode, setResaonModalMode] = useState("add");
const { locale } = useI18n();

watch(
  () => [props.isOpen, props.siteData],
  (val, prev) => {
    const [isOpen, siteData] = val;

    if (isOpen) {
      getReasonList();
    } else {
      setInfoList([]);
    }
  },
  { deep: true }
);

watch(
  () => [reasonModalOpen.value],
  (val, prev) => {
    const [a] = val;
    if (!a) {
      getReasonList();
    }
  },
  { deep: true }
);

const ENT = computed(() => {
  return store?.state?.global?.ENT || "";
});

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
    setInfoList(res?.data || []);
    store.commit("global/setIsLoading", false);
  }
}

const addReason = () => {
  setRowData({});
  setReasonModalOpen(true);
  setResaonModalMode("add");
};

const editReason = (data) => {
  setRowData(data);
  setReasonModalOpen(true);
  setResaonModalMode("edit");
};

const removeReason = (data) => {
  ElMessageBox.confirm("確認刪除?", "警告", {
    confirmButtonText: "Submit",
    cancelButtonText: "Cancel",
    type: "warning",
  })
    .then(async () => {
      store.commit("global/setIsLoading", true);
      try {
        const { SFFBDOCNO } = props.siteData;

        const res = await axios({
          url: "/common/sfc/csft335_sffd_del01",
          method: "post",
          data: {
            SITE: "0001",
            ENT: ENT.value,
            SFFDDOCNO: SFFBDOCNO,
            SFFDSEQ1: data.SFFDSEQ1,
          },
        });
        ElNotification({
          title: "Success",
          message: "刪除成功",
          type: "success",
        });
        getReasonList();
      } catch (e) {
        console.log(e);
      }
      store.commit("global/setIsLoading", false);
    })
    .catch(() => {});
  console.log();
};
</script>
