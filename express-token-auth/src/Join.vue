<template>
  <div>
    <div>
      <h3>Join</h3>
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
        <span>Message: </span>
        <span><input type="text" v-model="message"/></span>
      </div>
      <div>
        <button @click="join">Join</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: "",
      pw: "",
      message: ""
    };
  },
  methods: {
    async join() {
      const result = await this.$store.dispatch("join", {
        id: this.id,
        pw: this.pw,
        message: this.message
      });

      alert(result.message);

      this.$router.push("/");
    }
  }
};
</script>

<style></style>
