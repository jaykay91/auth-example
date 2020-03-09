<template>
  <div>
    <h1>{{ message }}</h1>
    <button @click="getAuth">Get Index</button>
    <button @click="getApi">Get API</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      message: "Bye, Vue!"
    };
  },
  methods: {
    async getApi() {
      const { data } = await axios.get("/api/users");

      console.log(data.payload);
    },
    async getAuth() {
      const { data } = await axios.get("/auth");
      console.log(data);
    }
  }
};
</script>

<style>
h1 {
  color: green;
}
</style>
