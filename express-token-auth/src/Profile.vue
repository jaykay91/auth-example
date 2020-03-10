<template>
  <div>
    <input type="text" v-model="message" />
    <button @click="send">Send</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: ""
    };
  },
  methods: {
    send() {
      this.$store.commit("say", { message: this.message });
      this.message = "";
    }
  }
};
</script>

<style></style>
