<template>
  <Layout :auth="true">
    <h2>即時報工作業</h2>
    <SearchBar />
    <el-divider />
    <el-empty :image-size="200" v-show="!isSearch" />
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

const props = defineProps([]);
const { siteData } = props;
const { locale } = useI18n();
const store = useStore();
const router = useRouter();
const formRef = ref();

const searchForm = computed(() => {
  return store?.state?.global?.searchForm || {};
});
</script>
