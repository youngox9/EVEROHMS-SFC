import { v4 as uuidv4 } from "uuid";
import { SEARCHBAR_AUTOCOMPLETE_LIST } from "@/utils";

function getProfile() {
  try {
    return JSON.parse(localStorage.getItem("auth"));
  } catch (e) {}
  return { accessToken: "", email: "", id: "", roles: [], username: "" };
}

const INITIAL_STATE = () => ({
  isLoading: false,
  profile: getProfile(),
  lang: "zh_tw",
  langList: [],
  searchForm: {
    // SFFB005: "",
    SFFB005: SEARCHBAR_AUTOCOMPLETE_LIST?.[0]?.value || "K-ACRA-2207140001",
    // SFFB005: "K-AASB-2205040001",
    // SFFB005: "K-CMAG-2206020002",
  },
  ENT: localStorage.getItem("ENT") || "20",
  isSearch: false,
  downloadList: [],
});

export default {
  namespaced: true,
  state: INITIAL_STATE(),
  actions: {},
  mutations: {
    logout(state) {
      window.localStorage.setItem("auth", "");
      state.profile = {};
      state.searchForm = {};
    },
    setProfile(state, profile) {
      state.profile = profile;
      const jsonStr = JSON.stringify(profile);
      window.localStorage.setItem("auth", jsonStr);
    },
    setIsLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
    setENT(state, ENT) {
      state.ENT = ENT;
      window.localStorage.setItem("ENT", ENT);
    },
    setLang(state, lang) {
      state.lang = lang;
    },
    setLangList(state, langList) {
      state.langList = langList;
    },
    setSearchForm(state, searchForm) {
      state.searchForm = searchForm;
    },
    setIsSearch(state, isSearch) {
      state.isSearch = isSearch;
    },
    setDownloadList(state, downloadList) {
      state.downloadList = downloadList;
    },
    addDownloadListFile(state, fileData = {}) {
      const {
        func = () => {},
        type = "download",
        fileType = "xlsx",
      } = fileData;

      const index = state.downloadList.filter((o) => o.type === type).length;
      const temp = {
        ...fileData,
        id: uuidv4(),
        func,
        filename: `${type}-download-${index}.${fileType}`,
      };

      state.downloadList = [...state.downloadList, temp];
    },
  },
};
