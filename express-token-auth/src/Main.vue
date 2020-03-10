<template>
  <div>
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
  methods: {
    login() {
      this.id = "";
      this.pw = "";
    }
  }
};
</script>

<style></style>
