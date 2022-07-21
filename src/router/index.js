import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";

const routes = [
  {
    path: "/site/",
    name: "index",
    alias: ["/", "/index", "/site"],
    component: function () {
      return import(/* webpackChunkName: "index" */ "../views/index.vue");
    },
  },
  {
    path: "/site/5PACKAGE",
    name: "5PACKAGE",
    component: function () {
      return import(
        /* webpackChunkName: "5PACKAGE" */ "../views/site/5PACKAGE.vue"
      );
    },
  },
  {
    path: "/site/5MPACKAGE",
    name: "5MPACKAGE",
    component: function () {
      return import(
        /* webpackChunkName: "5MPACKAGE" */ "../views/site/5MPACKAGE.vue"
      );
    },
  },
  // {
  //   path: "/site/4PLATING",
  //   name: "4PLATING",
  //   component: function () {
  //     return import(
  //       /* webpackChunkName: "4PLATING" */ "../views/site/4PLATING.vue"
  //     );
  //   },
  // },
  {
    path: "/site/4PLATING/1500",
    name: "1500",
    component: function () {
      return import(
        /* webpackChunkName: "1500" */ "../views/site/4PLATING/1500.vue"
      );
    },
  },
  {
    path: "/site/4PLATING/1600",
    name: "1600",
    component: function () {
      return import(
        /* webpackChunkName: "1600" */ "../views/site/4PLATING/1600.vue"
      );
    },
  },
  {
    path: "/login",
    name: "login",
    component: function () {
      return import(/* webpackChunkName: "login" */ "../views/Login.vue");
    },
  },

  {
    path: "/reportedList",
    name: "ReportedList",
    component: function () {
      return import(
        /* webpackChunkName: "ReportedList" */ "../views/ReportedList.vue"
      );
    },
  },
  {
    path: "/cantShipping",
    name: "CantShipping",
    component: function () {
      return import(
        /* webpackChunkName: "CantShipping" */ "../views/CantShipping.vue"
      );
    },
  },
  {
    path: "/ASFR925",
    name: "ASFR925",
    component: function () {
      return import(/* webpackChunkName: "ASFR925" */ "../views/ASFR925.vue");
    },
  },
  {
    path: "/ASFR338",
    name: "ASFR338",
    component: function () {
      return import(/* webpackChunkName: "ASFR338" */ "../views/ASFR338.vue");
    },
  },
  {
    path: "/PQC",
    name: "PQC",
    component: function () {
      return import(/* webpackChunkName: "PQC" */ "../views/PQC.vue");
    },
  },
  {
    path: "/404",
    name: "404",
    hidden: true,
    component: function () {
      return import(/* webpackChunkName: "404" */ "../views/404.vue");
    },
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/404",
    hidden: true,
  },
];

const router = createRouter({
  history: createWebHashHistory("router"),

  routes,
});

export default router;
