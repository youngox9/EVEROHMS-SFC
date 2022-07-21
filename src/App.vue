<template>
  <DownloadQueryList v-if="downloadList.length" />
  <div class="loading" :class="isLoading ? 'active' : ''"></div>
  <router-view></router-view>
</template>

<script setup>
import DownloadQueryList from "@/components/DownloadQueryList.vue";
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
import $ from "jquery";
import { VALIDATIONS, useState } from "@/utils";

const props = defineProps([]);
const { locale } = useI18n();
const store = useStore();
const router = useRouter();
const [isLogin, setIsLogin] = useState(false);

const isLoading = computed(() => {
  return store?.state?.global?.isLoading;
});

const downloadList = computed(() => {
  return store?.state?.global?.downloadList;
});
onMounted(() => {
  $("body").on(
    "keydown",
    "input:not(:disabled), select:not(:disabled)",
    function (e) {
      if (e.which === 13) {
        const $this = $(this);
        const form = $this.parents("form:eq(0)");
        const allInput = form.find("input:not(:disabled), select");
        const index = allInput.index(this);
        const next = allInput.eq(index + 1);
        if (next.length) {
          next.focus();
        } else {
          const $dialog = $this.parents(".el-dialog:eq(0)");
          const $dialogSubmit = $dialog.find('[type="submit"]');
          const $formSubmit = form.find('[type="submit"]');
          const $submit = $formSubmit.length ? $formSubmit : $dialogSubmit;
          if ($submit.length) {
            $submit.click();
          }
        }
        return false;
      }
    }
  );
});
</script>
