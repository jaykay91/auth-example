<template>
  <div>
    <h1>{{ message }}</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: "Bye, Vue!"
    };
  }
};
</script>

<style>
h1 {
  color: green;
}
</style>
