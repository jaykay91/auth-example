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
          <button @click="loginKakao">카카오 로그인</button>
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
  methods: {
    loginKakao() {
      window.open(
        "/auth/kakao",
        "KAKAO LOGIN",
        "top=10, left=10, width=500, height=600, status=no, menubar=no, toolbar=no, resizable=no"
      );
    }
  },
  created() {
    window.addEventListener("message", e => {
      if (e.data && e.data.source === "kakaoLogin") {
        const response = e.data.response;

        if (response.code === 200) {
          this.$store.dispatch("kakaoLogin", response.payload);
          alert(response.message);
        }
      }
    });

    const userDataStr = sessionStorage.getItem("userData");

    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      this.$store.commit("login", userData);
    }
  }
};
</script>

<style></style>
