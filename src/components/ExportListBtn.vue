<template>
  <el-button
    ref="buttonRef"
    v-click-outside="onClickOutside"
    :disabled="list.length <= 0"
    type="warning"
    plain
  >
    匯出
    <el-icon class="el-icon--right"><Download /></el-icon>
  </el-button>
  <el-popover
    ref="popoverRef"
    :virtual-ref="buttonRef"
    trigger="click"
    virtual-triggering
  >
    <el-space
      :direction="'vertical'"
      fill
      wrap
      :fill-ratio="100"
      :style="{ width: '100%' }"
    >
      <el-button
        type="success"
        plain
        @click="downloadXlsx"
        :style="{ width: '100%' }"
      >
        下載 xlsx
      </el-button>

      <el-button
        type="success"
        plain
        @click="downloadJson"
        :style="{ width: '100%' }"
      >
        下載 json
      </el-button>
    </el-space>
  </el-popover>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, unref, computed, reactive, watch, toRefs, onMounted } from "vue";
import { ElNotification, ClickOutside as vClickOutside } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import axios from "@/axios";
import { VALIDATIONS, useState } from "@/utils";
import FileSaver from "file-saver";

import { convertArrayToCSV } from "convert-array-to-csv";
import xlsx from "json-as-xlsx";

const buttonRef = ref();
const popoverRef = ref();
const props = defineProps(["list"]);

const { locale, t } = useI18n();

const store = useStore();
const router = useRouter();

const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.();
};

function downloadJson() {
  const data = props.list;
  var blob = new Blob([JSON.stringify(data)], {
    type: "application/json",
  });
  FileSaver(blob, "test.json");
}

function downloadXlsx() {
  const data = props.list || [];
  if (data.length) {
    const obj = data[0];
    const test = [
      {
        sheet: "test",
        columns: [
          ...Object.keys(obj).map((k) => {
            return { label: t(k) || k, value: k };
          }),
        ],
        content: data,
      },
    ];
    let settings = {
      fileName: "test", // Name of the resulting spreadsheet
      extraLength: 3, // A bigger number means that columns will be wider
      writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
    };
    xlsx(test, settings);
  }
}
</script>
