<!-- 登入頁面 -->
<template>
  <Layout :auth="true">
    <div class="page-not-found">Page Not Found</div>
  </Layout>
</template>
<script setup>
import { useStore } from "vuex";
import { ref, unref, computed, reactive, watch, toRefs, onMounted } from "vue";
import { ElNotification, ClickOutside as vClickOutside } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import axios from "@/axios";
import { VALIDATIONS, useState } from "@/utils";
import SearchBar from "@/components/SearchBar.vue";
import ReasonListModal from "@/components/ReasonListModal.vue";
import ForceReasonModal from "@/components/ForceReasonModal.vue";

const props = defineProps([]);
const { siteData } = props;
const { locale } = useI18n();
const store = useStore();
const router = useRouter();
const formRef = ref();
const defaultForm = {
  SFFDSEQ1: 1,
  SFFD001: "F0170",
  SFFD002: "1",
  SFFD003: "",
};

const searchForm = computed(() => {
  return store?.state?.global?.searchForm || {};
});

const isSearch = computed(() => {
  return store?.state?.global?.isSearch || false;
});

const [form, setForm] = useState({});

const [modalOpen, setModalOpen] = useState(false);
const [reasonModalOpen, setReasonModalOpen] = useState(false);
</script>
