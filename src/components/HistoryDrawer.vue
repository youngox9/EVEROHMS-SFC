<template>
  <el-drawer
    size="80%"
    v-model="isOpen"
    :title="$t('history_header')"
    :with-header="true"
    @close="$emit('update:isOpen', false)"
  >
    <el-table :data="historyList">
      <el-table-column
        prop="SFFBDOCNO"
        :label="$t('SFFBDOCNO')"
        align="center"
      />
      <el-table-column prop="SFFB005" :label="$t('SFFB005')" align="center" />
      <el-table-column prop="SFFB007" :label="$t('SFFB007')" align="center" />
      <el-table-column prop="SFFB009" :label="$t('SFFB009')" align="center" />
      <el-table-column label="操作" align="center" fixed="right">
        <template #default="scope">
          <el-button
            size="mini"
            type="primary"
            :icon="Edit"
            round
            @click="historyBack(scope.row)"
          >
            <el-icon>退回</el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-drawer>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, unref, computed, reactive, watch, toRefs } from "vue";
import { ElNotification, ClickOutside as vClickOutside } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import axios from "@/axios";
import { VALIDATIONS, useState } from "@/utils";

const props = defineProps(["isOpen", "siteData"]);
const { siteData } = props;
const { locale } = useI18n();
const store = useStore();
const router = useRouter();

const [historyList, setHistoryList] = useState([]);

const ENT = computed(() => {
  return store?.state?.global?.ENT || "";
});

watch(
  () => [props.isOpen],
  (val, prev) => {
    const [isOpen] = val;

    if (isOpen) getHistory();
  },
  { deep: true }
);

async function getHistory() {
  store.commit("global/setIsLoading", true);

  try {
    const res = await axios({
      url: "/common/sfc/csft335_sffb_get02",
      method: "post",
      data: {
        ENT: ENT.value,
        SFFB005: siteData.SFFB005,
      },
    });
    if (Array.isArray(res?.data)) {
      setHistoryList(res?.data || []);
    } else {
      setHistoryList([]);
    }
  } catch (e) {
    console.log(e);
  }
  store.commit("global/setIsLoading", false);
}

async function historyBack(rowData) {
  store.commit("global/setIsLoading", true);
  try {
    const res = await axios({
      url: "/csft335_pkg/EXEC_P_CSFT335_01_03",
      method: "post",
      data: {
        ENT: ENT.value,
        SITE: "0001",
        SFFBDOCNO: rowData.SFFBDOCNO,
        SFFB002: rowData.SFFB002,
      },
    });
    ElNotification({
      title: "Success",
      message: "退回成功",
      type: "success",
    });
    getHistory();
  } catch (e) {
    console.log(e);
  }
  store.commit("global/setIsLoading", false);
}
</script>
