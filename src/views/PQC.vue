<template>
  <Layout :auth="true">
    <h2>PQC檢驗作業</h2>
    <el-form
      class="search-bar"
      @submit.native.prevent
      :model="form1"
      :rules="rules1"
      ref="formRef1"
      status-icon
      label-width="80px"
      :label-position="'top'"
    >
      <div class="search-input">
        <el-form-item :label="$t('QCBA003')" prop="QCBA003">
          <el-input
            :placeholder="$t('QCBA003')"
            type="text"
            v-model="form1.QCBA003"
            :style="{ width: '100%' }"
            @input="setIsSearch(false)"
          />
        </el-form-item>
      </div>
      <div class="search-btns">
        <el-space :style="{ width: '100%', justifyContent: 'flex-end' }">
          <el-button
            :disabled="!form1.QCBA003"
            type="warning"
            plain
            @click="setDrawer(true)"
          >
            紀錄
            <el-icon class="el-icon--right"><List /></el-icon>
          </el-button>
          <el-button
            native-type="submit"
            type="primary"
            @click="search"
            :disabled="!form1.QCBA003"
          >
            {{ $t("search") }}
            <el-icon class="el-icon--right">
              <Search />
            </el-icon>
          </el-button>
        </el-space>
      </div>
    </el-form>
    <el-divider />
    <el-form
      v-if="isSearch"
      @submit.native.prevent
      ref="formRef"
      :model="form"
      :rules="rules2"
      status-icon
      label-width="80px"
      class="form"
      :label-position="'top'"
    >
      <el-row :gutter="24">
        <el-col :xs="24" :sm="8">
          <!-- 檢驗單號 -->
          <el-form-item :label="$t('QCBADOCNO')">
            <el-input
              type="text"
              v-model="form.QCBADOCNO"
              :placeholder="'QCBADOCNO'"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="8">
          <!-- 料件編號 -->
          <el-form-item :label="$t('QCBA010')">
            <el-input
              type="text"
              v-model="form.QCBA010"
              :placeholder="'QCBA010'"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="8">
          <!-- 品管分群 -->
          <el-form-item :label="$t('QCBA013')">
            <el-input type="text" v-model="form.QCBA013" disabled />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="8">
          <!-- 送驗量 -->
          <el-form-item :label="$t('QCBA017')">
            <el-input
              type="number"
              v-model="form.QCBA017"
              :placeholder="'送驗量'"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="8">
          <!-- 合格量 -->
          <el-form-item :label="$t('QCBA023')">
            <el-input type="text" v-model="form.QCBA023" disabled />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="8">
          <!-- 不良數 -->
          <el-form-item :label="$t('QCBA027')">
            <el-input type="text" v-model="form.QCBA027" disabled />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="8">
          <!-- 檢驗員 -->
          <el-form-item :label="$t('QCBA024')">
            <el-input type="text" v-model="form.QCBA024" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="8">
          <el-form-item :label="$t('QCBA022')">
            <el-select
              v-model="form.QCBA022"
              placeholder="請選擇判定結果"
              :style="{ width: '100%' }"
              @change="
                (val) => {
                  if (val === '2') {
                    setModalOpen(true);
                  }
                }
              "
            >
              <el-option :key="0" :label="'檢驗中'" :value="'0'" />
              <el-option :key="1" :label="'合格'" :value="'1'" />
              <el-option :key="2" :label="'驗退'" :value="'2'" />
              <el-option :key="3" :label="'重工'" :value="'3'" />
              <el-option :key="4" :label="'特採'" :value="'4'" />
              <el-option :key="5" :label="'報廢'" :value="'5'" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="footer">
        <div class="footer-content">
          <el-button
            type="primary"
            size="large"
            @click="submitForm('form')"
            :loading="loading"
            native-type="submit"
          >
            存檔
          </el-button>
        </div>
      </div>

      <!-- NO NODATA -->
    </el-form>
    <el-empty :image-size="200" v-if="!isSearch" />
  </Layout>
  <PQCModal
    :data="form"
    :isOpen="modalOpen"
    :toggleOpen="(val) => setModalOpen(val)"
  />
  <PQCHistoryDrawer
    :siteData="form1"
    :isOpen="drawer"
    @update:isOpen="setDrawer($event)"
  />
</template>
<script setup>
import { useStore } from "vuex";
import { ref, unref, computed, reactive, watch, toRefs, onMounted } from "vue";
import { ElNotification, ClickOutside as vClickOutside } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import axios from "@/axios";
import { VALIDATIONS, useState } from "@/utils";
import PQCModal from "@/components/PQCModal.vue";
import PQCHistoryDrawer from "@/components/PQCHistoryDrawer.vue";

const props = defineProps([]);

const { locale } = useI18n();
const store = useStore();
const router = useRouter();
const formRef1 = ref();
const formRef = ref();
const [isSearch, setIsSearch] = useState(false);
const [drawer, setDrawer] = useState(false);

const ENT = computed(() => {
  return store?.state?.global?.ENT || "";
});

const profile = computed(() => {
  return store?.state?.global?.profile || {};
});

const [form1, setForm1] = useState({
  QCBA003: "K-ACRA-1904030089",
});

const [form, setForm] = useState({
  QCBA022: 0,
});

const [modalOpen, setModalOpen] = useState(false);

const rules1 = reactive({
  QCBA003: [VALIDATIONS.isEmpty()],
});

const rules2 = reactive({});

function submitForm() {
  const formBbj = formRef.value;
  if (formBbj) {
    formBbj.validate((valid) => {
      if (valid) {
        postSave();
      } else {
        console.log("error submit!!");
      }
    });
  }
}

async function postSave() {
  store.commit("global/setIsLoading", true);
  try {
    // 報工
    const formData = form.value;
    const res1 = await axios({
      url: "/common/sfc/aqct300_qcba_save01",
      method: "post",
      data: {
        ...form.value,
        ENT: ENT.value,
        // QCBADOCNO: formData.QCBADOCNO,
        // QCBA024: formData.QCBA024,
        // QCBA023: formData.QCBA023,
        // QCBA027: formData.QCBA027,
        // QCBA022: `${formData.QCBA022}`,
      },
    });
    const msg = res1?.data?.v_message || "";
    resetForm();
    ElNotification({
      title: "Success",
      message: msg || "存檔成功",
      type: "success",
    });
  } catch (e) {
    console.log(e);
  }
  store.commit("global/setIsLoading", false);
}

function resetForm() {
  const formObj = formRef.value;
  const formObj1 = formRef1.value;
  if (formObj) {
    formObj.resetFields();
  }

  if (formObj1) {
    formObj1.resetFields();
  }
  setForm1({});
  setForm({});
  setIsSearch(false);
}

function search() {
  const formBbj = formRef1.value;

  if (formBbj) {
    formBbj.validate((valid) => {
      if (valid) {
        onSearch();
      } else {
        console.log("error submit!!");
      }
    });
  }
}
async function onSearch() {
  store.commit("global/setIsLoading", true);
  try {
    const res = await axios({
      url: `/common/sfc/aqct300_qcba_get01`,
      method: "post",
      data: {
        ENT: ENT.value,
        ...form1.value,
      },
    });
    const data = res?.data?.[0];
    if (data) {
      setForm({
        ...data,
        QCBA024:
          !data.QCBA024 || data.QCBA024 === "0"
            ? profile.value.id
            : data.QCBA024,
      });
      setIsSearch(true);
    } else {
      setForm({});
      ElNotification({
        title: "Error",
        message: "查無資料",
        type: "error",
      });
    }
  } catch (e) {
    console.log(e);
  }
  store.commit("global/setIsLoading", false);
}
</script>
