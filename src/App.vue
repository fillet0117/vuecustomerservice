<template>
  <div id="app">
    <!-- <router-link to="/record">record</router-link> -->
    <!-- <router-link to="/">login</router-link> -->
    <!-- <router-link to="/about">chat</router-link> -->
    <router-view></router-view>
    <notifications group="foo" />
  </div>
</template>

<script>
export default {
  name: "app",
  components: {},
};
</script>

<style></style>
