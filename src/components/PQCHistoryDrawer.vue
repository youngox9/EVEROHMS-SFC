<template>
  <el-drawer
    size="80%"
    v-model="isOpen"
    :title="$t('PQC 歷史紀錄')"
    :with-header="true"
    @close="$emit('update:isOpen', false)"
  >
    <el-table :data="historyList">
      <el-table-column
        prop="SFFBDOCNO"
        :label="$t('SFFBDOCNO')"
        align="center"
        :width="250"
      />
      <el-table-column
        prop="QCBA010"
        :label="$t('QCBA010')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="QCBA006"
        :label="$t('QCBA006')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="QCBA013"
        :label="$t('QCBA013')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="QCBA017"
        :label="$t('QCBA017')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="QCBA022"
        :label="$t('QCBA022')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="QCBA023"
        :label="$t('QCBA023')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="QCBA027"
        :label="$t('QCBA027')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="QCBA024"
        :label="$t('QCBA024')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="QCBA000"
        :label="$t('QCBA000')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="QCBA000_DESC"
        :label="$t('QCBA000_DESC')"
        align="center"
        :width="150"
      />
      <el-table-column
        prop="IMAAL003"
        :label="$t('IMAAL003')"
        align="center"
        :width="250"
      />
      <el-table-column
        prop="IMAAL004"
        :label="$t('IMAAL004')"
        align="center"
        :width="250"
      />
      <el-table-column label="操作" align="center" fixed="right" :width="100">
        <template #default="scope">
          <el-button
            type="danger"
            @click="historyBack(scope.row, scope.$index)"
          >
            退回
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

/**
 * 取得歷史資訊
 */
async function getHistory() {
  store.commit("global/setIsLoading", true);

  try {
    const res = await axios({
      url: "/common/sfc/aqct300_qcba_get02",
      method: "post",
      data: {
        ENT: ENT.value,
        QCBA003: siteData.QCBA003,
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

/**
 * 退回工單
 */
async function historyBack(rowData) {
  store.commit("global/setIsLoading", true);
  try {
    const res = await axios({
      url: "/aqct300_pkg/EXEC_P_AQCT300_01_04",
      method: "post",
      data: {
        ENT: ENT.value,
        SITE: "0001",
        QCBADOCNO: rowData.QCBADOCNO,
        QCBA024: rowData.QCBA024,
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
