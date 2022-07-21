<template>
  <div class="download-query-list" :style="style">
    <el-space
      :style="{
        width: '100%',
        justifyContent: 'space-between',
        padding: '0 0 0 12px',
      }"
    >
      <div id="download-query-list-drag" size="small" plain>
        <el-icon>
          <Rank />
        </el-icon>
      </div>
      <el-button size="small" type="danger" @click="onRemoveAll" plain>
        Clear All
        <el-icon class="el-icon--right">
          <Delete />
        </el-icon>
      </el-button>
    </el-space>
    <el-divider :style="{ margin: '12px 0 0 0' }" />
    <div class="download-query-list-wrap">
      <DownloadQueryListItem
        v-for="(item, index) in downloadList"
        :item="{ ...item, index }"
      />
    </div>
  </div>
  <Moveable
    className="moveable"
    :target="['.download-query-list']"
    :draggable="true"
    :resizable="false"
    @drag="onDrag"
  />
</template>

<script setup>
import Moveable from "vue3-moveable";
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

import DownloadQueryListItem from "@/components/DownloadQueryListItem.vue";

const buttonRef = ref();
const popoverRef = ref();
const props = defineProps(["list"]);

const { locale, t } = useI18n();

const store = useStore();
const router = useRouter();

const [style, setStyle] = useState({});

const downloadList = computed(() => {
  return store?.state?.global?.downloadList;
});

function onDrag(transform) {
  const { left, top } = transform;

  setStyle({ ...style.value, left: `${left}px`, top: `${top}px` });
}

function onScale(transform) {
  const { width, height } = transform;

  setStyle({ ...style.value, width: `${width}px`, height: `${height}px` });
}
function onRemoveAll() {
  store.commit("global/setDownloadList", []);
}
</script>
