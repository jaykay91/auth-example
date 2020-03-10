import Vue from "vue";
import VueRouter from "vue-router";

import Main from "./Main";
import Join from "./Join";
import Profile from "./Profile";

Vue.use(VueRouter);

export default new VueRouter({
  mode: "history",
  routes: [
    { path: "/", component: Main },
    { path: "/join", component: Join },
    { path: "/profile", component: Profile }
  ]
});
