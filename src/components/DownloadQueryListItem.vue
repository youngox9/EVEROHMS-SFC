<template>
  <div class="download-query-list-item">
    <p>{{ item.filename }}</p>

    <el-space :style="{ width: '100%', justifyContent: 'flex-end' }">
      <el-button
        size="small"
        type="success"
        @click="onExport"
        :loading="!item.file"
        v-if="!item.error"
        plain
      >
        下載
        <el-icon class="el-icon--right">
          <Download />
        </el-icon>
      </el-button>
      <el-button
        size="small"
        type="warning"
        @click="callApi"
        v-if="item.error"
        plain
      >
        重整
        <el-icon class="el-icon--right">
          <RefreshRight />
        </el-icon>
      </el-button>
      <el-button
        size="small"
        type="danger"
        @click="onRemove(item)"
        plain
        circle
      >
        <el-icon>
          <Delete />
        </el-icon>
      </el-button>
    </el-space>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import {
  ref,
  unref,
  computed,
  reactive,
  watch,
  toRefs,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { ElNotification, ClickOutside as vClickOutside } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import axios from "@/axios";
import { VALIDATIONS, useState, saveExcel } from "@/utils";
import FileSaver from "file-saver";

import { convertArrayToCSV } from "convert-array-to-csv";
import xlsx from "json-as-xlsx";

import DownloadQueryListItem from "@/components/DownloadQueryListItem.vue";

const CancelToken = axios.CancelToken;

const buttonRef = ref();
const popoverRef = ref();
const props = defineProps(["item"]);

const { locale, t } = useI18n();

const store = useStore();
const router = useRouter();

onMounted(() => {
  const { func, index, file, cancel } = props.item;
  if (!file) {
    callApi();
  }
});

onBeforeUnmount(() => {
  const { item } = props;
  if (typeof item?.cancel === "function") {
    item.cancel();
  }
});

const downloadList = computed(() => {
  return store?.state?.global?.downloadList;
});

async function callApi() {
  const { func, index, id, filename = "download.xlsx" } = props.item;

  setItem(id, {
    ...props.item,
    file: null,
    error: false,
  });
  try {
    const res = await func();

    let newFilename = filename;
    const disposition = res?.headers?.["content-disposition"];
    if (disposition) {
      newFilename = /attachment; filename="(.*)"$/g.exec(disposition);
    }
    const file = res?.data || null;

    setItem(id, {
      ...props.item,
      file,
      filename: newFilename,
      error: false,
    });
  } catch (e) {
    setItem(id, {
      ...props.item,
      file: null,
      error: true,
    });
  }
}

function setItem(id, item) {
  const temp = downloadList.value.map((o) => {
    if (o.id === id) {
      return { ...o, ...item };
    }
    return o;
  });
  store.commit("global/setDownloadList", [...temp]);
}

function onRemove(item) {
  if (typeof item?.cancel === "function") {
    item.cancel();
  }
  const temp = downloadList.value.filter((o) => {
    if (o.id === item.id) {
      return false;
    }
    return true;
  });
  store.commit("global/setDownloadList", temp);
}

function onExport() {
  const { file, filename = "download.xlsx" } = props.item;
  if (file) {
    FileSaver.saveAs(new Blob([file]), filename);
  }
}
</script>
