<template>
  <div>
    <div>
      <h2>{{ message }}</h2>
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
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      id: "",
      pw: "",
      message: this.$store.state.message
    };
  },
  methods: {
    async login() {
      const { data } = await axios.post("/auth/login", {
        id: this.id,
        pw: this.pw
      });

      console.log(data);

      this.id = "";
      this.pw = "";
    }
  }
};
</script>

<style></style>
