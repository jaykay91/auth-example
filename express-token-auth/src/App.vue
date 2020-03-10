<template>
  <div>
    <div>
      <nav>
        <router-link to="/">홈</router-link>
        <router-link to="/join">회원가입</router-link>
        <router-link to="/profile">사용자 정보</router-link>
      </nav>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import router from "./routes";

export default {
  router
};
</script>

<style></style>
