<template>
  <div>
    <h1 style="font-size: 1.5rem; margin-left: 13px; margin-top: 5px">
      Your Subscriptions
    </h1>
    <v-list v-if="categories.length > 0">
      <v-list-item v-for="cat in categories" :key="cat.ID">
        <v-list-item-avatar>
          <v-icon class="warning" dark>
            mdi-format-list-bulleted-square
          </v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title
            v-text="cat.CAT_NAME + ' - ' + cat.CAT_HOURS + ' hour(s)'"
          ></v-list-item-title>

          <v-list-item-subtitle v-text="cat.CAT_DESC"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <p v-else style="text-align: center; margin-top: 10px">
      No Categories Subscribed. Subscribe to categories listed...
    </p>
    <v-overlay :value="showSubLoading" absolute>
      <v-progress-circular indeterminate size="34"></v-progress-circular>
    </v-overlay>
  </div>
</template>
<script>
import * as common from "../../../utils/Common";
export default {
  name: "ShowCategories",
  props: ["showSubLoading", "categories"],
  beforeCreate() {
    common.cLog(this.$options.name, "beforeCreate");
  },
  created() {
    common.cLog(this.$options.name, "created");
  },
  beforeMount() {
    common.cLog(this.$options.name, "beforeMount");
  },
  mounted() {
    this.$emit("getSubscriptions");
    common.cLog(this.$options.name, "mounted");
  },
  beforeUpdate() {
    common.cLog(this.$options.name, "beforeUpdate");
  },
  updated() {
    common.cLog(this.$options.name, "updated");
  },
  beforeDestroy() {
    common.cLog(this.$options.name, "beforeDestroy");
  },
  destroyed() {
    common.cLog(this.$options.name, "destroyed");
  },
};
</script>
