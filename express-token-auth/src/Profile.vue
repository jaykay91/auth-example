<template>
  <div>
    <div>
      <button @click="request('getUsers')">Get Users</button>
      <button @click="request('getMessage')">Get Message</button>
      <button @click="request('getProfile')">Get Profile</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  methods: {
    async request(methodName) {
      const method = this[methodName];

      let res = await method.call(this);

      if (res.code !== 200) {
        console.log(res.message);

        // 토큰 발급 요청을해서 새로운 토큰을 받는다
        const ret = await this.$store.dispatch("requestToken");

        if (ret.code !== 200) {
          return console.error(ret.message);
        }

        // 요청을 다시 시도한다
        res = await method.call(this);
      }

      console.log(res);
    },
    async getUsers() {
      const { data } = await axios.get("/api/users", {
        headers: {
          Authorization: this.$store.state.tokens.access
        }
      });

      return data;
    },
    async getMessage() {
      const { data } = await axios.get("/api/message", {
        headers: {
          Authorization: this.$store.state.tokens.access
        }
      });

      return data;
    },
    async getProfile() {
      const { data } = await axios.get("/api/profile", {
        headers: {
          Authorization: this.$store.state.tokens.access
        }
      });

      return data;
    }
  }
};
</script>

<style></style>
