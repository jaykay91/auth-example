<template>
  <div>
    <div>
      <nav>
        <router-link to="/">홈</router-link>
        <template v-if="user">
          <router-link to="/profile">사용자 정보</router-link>
        </template>
        <template v-else>
          <router-link to="/join">회원가입</router-link>
        </template>
      </nav>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import store from "./store";
import router from "./routes";

export default {
  router,
  store,
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  created() {
    const userDataStr = sessionStorage.getItem("userData");

    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      this.$store.commit("login", userData);
    }
  }
};
</script>

<style></style>
