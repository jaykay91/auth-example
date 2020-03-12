<template>
  <div>
    <div v-if="!user">
      <div>
        <h3>Login</h3>
      </div>
      <div>
        <div>
          <span>ID: </span>
          <span><input type="text" v-model="id"/></span>
        </div>
        <div>
          <span>PW: </span>
          <span><input type="password" v-model="pw"/></span>
        </div>
        <div>
          <button @click="login">Login</button>
        </div>
      </div>
    </div>
    <div v-else>
      <div><h3>로그인에 성공했습니다</h3></div>
      <div><button @click="logout">Logout</button></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      id: "",
      pw: ""
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    async login() {
      const payload = {
        id: this.id,
        pw: this.pw
      };

      const result = await this.$store.dispatch("login", payload);

      alert(result.message);

      this.id = "";
      this.pw = "";
    },
    logout() {
      this.$store.dispatch("logout");
    }
  }
};
</script>

<style></style>
