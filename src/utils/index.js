import axios from "@/axios";
import axiosGlobal from "axios";
import FileSaver from "file-saver";
const CancelToken = axiosGlobal.CancelToken;
import { readonly, ref } from "vue";

async function checkMachine(data) {
  // console.log(e);
  const res = await axios({
    url: "/5package/sfc/csft335_sffb010_chk01",
    method: "post",
    data,
  });

  return res?.data === "OK";
}

export const VALIDATIONS = {
  isEmpty: (p) => ({
    required: true,
    message: "此欄位為必填",
    trigger: "blur",
    ...p,
  }),
  checkMachine: (props = {}) => ({
    validator: async (rule, value, callback) => {
      const { validator } = props;
      const result = await validator(value);
      if (!value) {
        callback();
        return;
      }
      if (!result) {
        callback(new Error("機台輸入錯誤"));
      } else {
        callback();
      }
    },
    trigger: ["blur"],
  }),
  SFFB017_1: (props = {}) => ({
    validator: async (rule, value, callback) => {
      const form = props.form();
      if (value > form.SFFB017) {
        callback(new Error("良品數量 不可大於 待處理量"));
      } else {
        callback();
      }
      return;
    },
    trigger: ["blur"],
  }),
  custom: (fn, trigger = ["blur"]) => ({
    validator: async (rule, value, callback) => {
      await fn(rule, value, callback);
      return;
    },
    trigger,
  }),
  checkNumber: (props = {}) => ({
    validator: async (rule, value, callback) => {
      const regex = /^-?\d*\.{0,1}\d+$/;
      const res = regex.test(value);

      if (res) {
        callback();
      } else {
        callback(new Error("輸入格式錯誤"));
      }
    },
    trigger: ["blur", "change"],
  }),
};

export function useState(initialState) {
  const state = ref(initialState);
  const setState = (newState) => {
    state.value = newState;
  };

  return [state, setState];
}

export const AREA_OPTIONS = [
  { label: "台灣", value: "20" },
  { label: "大陸", value: "30" },
];

export function axiosWithCancel(config = {}) {
  let cancel;
  const cancelToken = new CancelToken(function executor(c) {
    cancel = c;
  });
  return [
    () =>
      axios({
        ...config,
        cancelToken,
      }),
    cancel,
  ];
}

export function axiosExcel(config = {}) {
  return axiosWithCancel({
    ...config,
    responseType: "blob",
    headers: {
      Accept: "application/vnd.openxmlformats;charset=utf-8",
      "Access-Control-Expose-Headers": "Content-Disposition",
      // "Content-Type": "application/json",
    },
    timeout: 9999999,
  });
}

export function saveExcel(res, filename = "download.xlsx") {
  let newFilename = filename;
  const disposition = res?.headers?.["content-disposition"];
  if (disposition) {
    newFilename = /attachment; filename="(.*)"$/g.exec(disposition);
  }
  if (res?.data) {
    FileSaver.saveAs(new Blob([res.data]), newFilename);
  }
}

/**
 * 報工作業/搜尋BAR的下拉選單列表
 */
export const SEARCHBAR_AUTOCOMPLETE_LIST = [
  { value: "K-ACRA-2207210001", link: "4 Plating/1500" },
  { value: "K-ACRA-2207140001", link: "4 Plating/1600" },
  { value: "K-AASB-2205040001", link: "5 PACKAGE" },
  { value: "K-CMAG-2206020002", link: "5M PACKAGE" },
];
